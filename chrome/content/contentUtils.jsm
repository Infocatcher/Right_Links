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
	_lastMouseDown: 0,
	handleMouseEvent: function(sendSyncMessage, e) {
		if(!this.enabledFor(e))
			return;
		var prev = detect.item;
		var it = detect.getItem(e);
		var h = it && detect.getHref(it, e);
		if(!h)
			return;
		var isMD = e.type == "mousedown";
		var changed = isMD ? undefined : it != prev;
		if(isMD)
			this._lastMouseDown = Date.now();
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
				_rightLinksIsFake: true,
				_rightLinksURL: h,
				_rightLinksIsDummy: isDummy,
				_rightLinksIsCanvas: it instanceof itDoc.defaultView.HTMLCanvasElement,
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
		if(ret && ret[0])
			this.stopEvent(e);
	},
	handleContextEvent: function(e) {
		if(
			detect.item
			&& detect.origItem == e.originalTarget
			&& Date.now() - this._lastMouseDown < prefs.get("showContextMenuTimeout")
			&& prefs.get("enabled.right")
		)
			this.stopEvent(e);
	},
	enabledFor: function(e) {
		if("_rightLinksIgnore" in e || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)
			return false;
		var btn = e.button;
		return btn == 0 && prefs.get("enabled.left")
			|| btn == 2 && prefs.get("enabled.right");
	},
	stopEvent: function(e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation && e.stopImmediatePropagation();
	},
	getCanvasURL: function(content, sendAsyncMessage) {
		var canvas = detect.item;
		if(!(canvas instanceof content.HTMLCanvasElement)) {
			sendAsyncMessage("RightLinks:CanvasURL", { url: "" });
			return;
		}
		canvas.toBlob(function(blob) {
			var url = content.URL.createObjectURL(blob);
			sendAsyncMessage("RightLinks:CanvasURL", { url: url });
		});
	},
	dispatchMouseEvents: function(evtTypes, opts) {
		var item = detect.origItem;
		var origEvt = detect.event;
		var doc = item.ownerDocument || item.document || item;
		var win = doc.defaultView;
		var trg = opts.isFake ? win : item;
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
			trg.dispatchEvent(evt);
		});
	},
	loadURI: function(uri) {
		var item = detect.origItem;
		item.ownerDocument.location = uri;
	},
	saveHandledItem: function() {
		detect.handledItem = detect.origItem;
	}
};