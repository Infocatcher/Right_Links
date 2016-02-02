Components.utils.import("resource://gre/modules/Services.jsm");
this.__defineGetter__("detect", function() {
	delete this.detect;
	Components.utils.import("chrome://rightlinks/content/detect.jsm");
	return detect;
});

var remoteFrameHandler = {
	init: function(force) {
		addEventListener("mousedown", this, true);
		addEventListener("mouseup", this, true);
		addEventListener("click", this, true);
		addEventListener("unload", this, true);
		force && addMessageListener("RightLinks:Action", this);
	},
	destroy: function(force) {
		removeEventListener("mousedown", this, true);
		removeEventListener("mouseup", this, true);
		removeEventListener("click", this, true);
		removeEventListener("unload", this, true);
		force && removeMessageListener("RightLinks:Action", this);
	},
	handleEvent: function(e) {
		switch(e.type) {
			case "mousedown":
			case "mouseup":
			case "click":
				this.handleMouseEvent(e);
			break;
			case "unload":
				if(content && content.location != "about:blank")
					this.destroy(true);
		}
	},
	receiveMessage: function(msg) {
		switch(msg.data.action) {
			case "SetState":
				if(msg.data.enabled)
					this.init();
				else
					this.destroy();
			break;
			case "DispatchMouseEvents":
				this.dispatchMouseEvents(msg.data.types, msg.data.options);
		}
	},
	handleMouseEvent: function(e) {
		var it = detect.getItem(e);
		var h = it && detect.getHref(it, e);
		if(!h)
			return;
		var trg = e.originalTarget;
		var clonedEvent = {
			originalTarget: {
				localName: trg.localName,
				ownerDocument: {
					documentURI: trg.ownerDocument.documentURI
				}
			},
			view: {
				top: null
			},
			_rightLinksItem: {
				localName: it.localName,
				ownerDocument: {
					documentURI: it.ownerDocument.documentURI,
					location: { href: it.ownerDocument.documentURI },
					nodePrincipal: it.ownerDocument.nodePrincipal //~ todo: test
				},
				_rightLinksURL: h
			},
			_rightLinksStop: false,
			_rightLinksURL: h,
			_rightLinksType: detect.itemType
		};
		for(var p in e) {
			var v = e[p];
			if(detect.isPrimitive(v))
				clonedEvent[p] = v;
		}
		var ret = sendSyncMessage("RightLinks:Event", clonedEvent);
		if(ret && ret[0]) {
			e.preventDefault();
			e.stopPropagation();
			"stopImmediatePropagation" in e && e.stopImmediatePropagation();
		}
	},
	dispatchMouseEvents: function(evtTypes, opts) {
		var item = detect.origItem;
		var origEvt = detect.event;
		var doc = item.ownerDocument || item.document || item;
		var win = doc.defaultView;
		evtTypes.forEach(function(evtType) {
			var evt = new win.MouseEvent(evtType, {
				bubbles: true,
				cancelable: true,
				view: win,
				detail: 1,
				screenX: origEvt.screenX,
				screenY: origEvt.screenY,
				clientX: origEvt.clientX,
				clientY: origEvt.clientY,
				ctrlKey:  opts.ctrlKey  || false,
				altKey:   opts.altKey   || false,
				shiftKey: opts.shiftKey || false,
				metaKey:  opts.metaKey  || false,
				button:   opts.button   || 0,
				relatedTarget: null
			});
			item.dispatchEvent(evt);
		});
	}
};
remoteFrameHandler.init(true);