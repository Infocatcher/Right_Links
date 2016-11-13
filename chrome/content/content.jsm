var EXPORTED_SYMBOLS = ["RightLinksContent"];

this.__defineGetter__("contentUtils", function() {
	delete this.contentUtils;
	return Components.utils.import("chrome://rightlinks/content/contentUtils.jsm").contentUtils;
});

function RightLinksContent(frameGlobal) {
	this.fg = frameGlobal;
	this.init(true);
}
RightLinksContent.prototype = {
	init: function(force) {
		this.fg.addEventListener("mousedown", this, true);
		this.fg.addEventListener("mouseup", this, true);
		this.fg.addEventListener("click", this, true);
		this.fg.addEventListener("contextmenu", this, true);
		this.fg.addEventListener("unload", this, false);
		force && this.fg.addMessageListener("RightLinks:Action", this);
	},
	destroy: function(force) {
		this.fg.removeEventListener("mousedown", this, true);
		this.fg.removeEventListener("mouseup", this, true);
		this.fg.removeEventListener("click", this, true);
		this.fg.removeEventListener("contextmenu", this, true);
		this.fg.removeEventListener("unload", this, false);
		force && this.fg.removeMessageListener("RightLinks:Action", this);
	},
	handleEvent: function(e) {
		switch(e.type) {
			case "mousedown":
			case "mouseup":
			case "click":
				contentUtils.handleMouseEvent(this.fg.sendSyncMessage, e);
			break;
			case "contextmenu":
				contentUtils.handleContextEvent(e);
			break;
			case "unload":
				if(e.target == this.fg)
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
			case "GetCanvasURL":
				contentUtils.getCanvasURL(this.fg.content, this.fg.sendAsyncMessage);
			break;
			case "DispatchMouseEvents":
				contentUtils.dispatchMouseEvents(msg.data.types, msg.data.options);
			break;
			case "LoadURI":
				contentUtils.loadURI(msg.data.URI);
			break;
			case "SaveHandledItem":
				contentUtils.saveHandledItem();
		}
	}
};