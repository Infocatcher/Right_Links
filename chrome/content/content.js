{
	let {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
	if(Services.appinfo.processType == Services.appinfo.PROCESS_TYPE_CONTENT)
		new (Components.utils.import("chrome://rightlinks/content/content.jsm", {}).RightLinksContent)(this);
}