if(!("RightLinksContent" in this)) {
	let {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
	if(Services.appinfo.processType == Services.appinfo.PROCESS_TYPE_CONTENT) {
		Components.utils.import("chrome://rightlinks/content/content.jsm", this);
		new RightLinksContent(this);
	}
}