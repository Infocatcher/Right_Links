this.__defineGetter__("contentUtils", function() {
	delete this.contentUtils;
	Components.utils.import("chrome://rightlinks/content/contentUtils.jsm");
	return contentUtils;
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
				contentUtils.handleMouseEvent(sendSyncMessage, e);
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
				contentUtils.dispatchMouseEvents(msg.data.types, msg.data.options);
			break;
			case "LoadURI":
				contentUtils.loadURI(msg.data.URI);
		}
	}
};
remoteFrameHandler.init(true);