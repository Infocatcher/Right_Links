var EXPORTED_SYMBOLS = ["contentUtils"];

this.__defineGetter__("detect", function() {
	delete this.detect;
	return Components.utils.import("chrome://rightlinks/content/detect.jsm").detect;
});
this.__defineGetter__("prefs", function() {
	delete this.prefs;
	return Components.utils.import("chrome://rightlinks/content/prefs.jsm").prefs;
});

var contentUtils = {
	handleMouseEvent: function(sendSyncMessage, e) {
		if(!this.enabledFor(e.button))
			return;
		var it = detect.getItem(e);
		var h = it && detect.getHref(it, e);
		if(!h)
			return;
		var trg = e.originalTarget;
		var isDummy = detect.isDummyURI(it, h, e);
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
				_rightLinksURL: h,
				_rightLinksIsDummy: isDummy
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
	enabledFor: function(btn) {
		return btn == 0 && prefs.get("enabled.left")
			|| btn == 2 && prefs.get("enabled.right");
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
	},
	loadURI: function(uri) {
		var item = detect.origItem;
		item.ownerDocument.location.href = uri;
	}
};