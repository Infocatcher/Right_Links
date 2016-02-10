// Will be loaded from prefs.jsm, see prefs.prefsMigration()
function prefsMigration(v) {
	var ps = Services.prefs;
	var _this = this;
	var _pref = function(pName, defaultVal) {
		var ret = _this.getPref(pName, defaultVal);
		ps.deleteBranch(pName);
		return ret;
	};

	if(v < 1) { // Added: 2009-08-16, released: after 2009-12-12
		// Rename some prefs:
		var him = _pref("rightlinks.hideItemsMode", 0);
		this.set("ui.showInToolsMenu", !(him == 1 || him == 2));
		this.set("ui.showInStatusbar", !(him == 1 || him == 3));

		var modifiers = _pref("rightlinks.keyModifiers", "").replace(/[, ]+/g, " ");
		this.set(
			"key.toggleStatus",
			(modifiers ? modifiers + " " : "") + _pref("rightlinks.keyValue", "VK_F2")
		);

		this.set("ui.toolbarbuttonCheckedStyle", _pref("rightlinks.toolbarbuttonCheckedStyle", true));

		// Move prefs to "extensions." branch:
		ps.getBranch("rightlinks.")
			.getChildList("", {})
			.forEach(function(pName) {
				this.set(pName, this.getPref("rightlinks." + pName));
			}, this);

		// Delete old branch:
		ps.deleteBranch("rightlinks.");
	}
	if(v < 2) // Added: 2009-12-12
		this.set("closePopups", _pref(this.ns + "hideBookmarksPopup", true));
	if(v < 3) { // Added: 2015-08-27
		this.set("loadBookmarksInBackground",      this.get("loadInBackground"));
		this.set("loadBookmarksInBackground.left", this.get("loadInBackground.left"));

		if(_pref(this.ns + "loadInWindow.left"))
			this.set("loadIn.left", 1);
		if(_pref(this.ns + "loadInWindow"))
			this.set("loadIn", 1);
	}

	this.set("prefsVersion", this.version);

	var timer = Components.classes["@mozilla.org/timer;1"]
		.createInstance(Components.interfaces.nsITimer);
	timer.init(function() {
		_this.savePrefFile();
	}, 0, timer.TYPE_ONE_SHOT);
}