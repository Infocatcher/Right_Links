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
		if(!this.enabledFor(e))
			return;
		var prev = detect.item;
		var it = detect.getItem(e);
		var h = it && detect.getHref(it, e);
		if(!h)
			return;
		var changed = e.type == "mousedown" ? undefined : it != prev;
		var trg = e.originalTarget;
		var isDummy = detect.isDummyURI(it, h, e);
		var itDoc = it.ownerDocument;
		var clonedEvent = {
			originalTarget: {
				localName: trg.localName,
				id: trg.id,
				ownerDocument: {
					documentURI: trg.ownerDocument.documentURI
				},
				_rightLinksIsFake: true
			},
			view: {
				top: null
			},
			_rightLinksItem: {
				localName: it.localName,
				id: it.id,
				ownerDocument: {
					documentURI: itDoc.documentURI,
					location: {
						href: itDoc.documentURI
					},
					nodePrincipal: itDoc.nodePrincipal //~ todo: test
				},
				_rightLinksURL: h,
				_rightLinksIsDummy: isDummy,
				_rightLinksItemChanged: changed
			},
			_rightLinksType: detect.itemType,
			_rightLinksStop: false
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
			e.stopImmediatePropagation && e.stopImmediatePropagation();
		}
	},
	enabledFor: function(e) {
		if("_rightLinksIgnore" in e || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)
			return false;
		var btn = e.button;
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
			evt._rightLinksIgnore = true;
			item.dispatchEvent(evt);
		});
	},
	loadURI: function(uri) {
		var item = detect.origItem;
		item.ownerDocument.location.href = uri;
	}
};