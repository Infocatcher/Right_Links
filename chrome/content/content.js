this.__defineGetter__("contentUtils", function() {
	delete this.contentUtils;
	return Components.utils.import("chrome://rightlinks/content/contentUtils.jsm").contentUtils;
});

var global = this;
var remoteFrameHandler = {
	init: function(force) {
		if(!this.isRemote(content))
			return;
		addEventListener("mousedown", this, true);
		addEventListener("mouseup", this, true);
		addEventListener("click", this, true);
		addEventListener("unload", this, false);
		force && addMessageListener("RightLinks:Action", this);
	},
	destroy: function(force) {
		removeEventListener("mousedown", this, true);
		removeEventListener("mouseup", this, true);
		removeEventListener("click", this, true);
		removeEventListener("unload", this, false);
		force && removeMessageListener("RightLinks:Action", this);
	},
	isRemote: function(content) {
		try {
			var window = content.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
				.getInterface(Components.interfaces.nsIWebNavigation)
				.QueryInterface(Components.interfaces.nsIDocShellTreeItem)
				.rootTreeItem
				.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
				.getInterface(Components.interfaces.nsIDOMWindow);
			if(window instanceof Components.interfaces.nsIDOMChromeWindow && "rightLinks" in window)
				return false;
		}
		catch(e) {
			Components.utils.reportError(e);
		}
		return true;
	},
	handleEvent: function(e) {
		switch(e.type) {
			case "mousedown":
			case "mouseup":
			case "click":
				contentUtils.handleMouseEvent(sendSyncMessage, e);
			break;
			case "unload":
				if(e.target == global)
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
				contentUtils.getCanvasURL(content, sendAsyncMessage);
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