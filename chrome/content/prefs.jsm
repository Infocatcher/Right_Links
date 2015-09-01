var EXPORTED_SYMBOLS = ["prefs"];

Components.utils.import("resource://gre/modules/Services.jsm");

var prefs = {
	ns: "extensions.rightlinks.",
	version: 3,

	init: function() {
		var v = this.get("prefsVersion") || 0;
		if(v < this.version)
			this.prefsMigration(v);
		Services.prefs.addObserver(this.ns, this, false);
	},
	destroy: function() {
		Services.prefs.removeObserver(this.ns, this);
	},
	prefsMigration: function(v) {
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
	},

	// Preferences observer:
	observe: function(subject, topic, pName) {
		if(topic != "nsPref:changed")
			return;
		var shortName = pName.substr(this.ns.length);
		var val = this.getPref(pName);
		this._cache[shortName] = val;
		//~ todo: notify all windows
	},

	_cache: { __proto__: null },
	get: function(pName, defaultVal) {
		var cache = this._cache;
		return pName in cache
			? cache[pName]
			: (cache[pName] = this.getPref(this.ns + pName, defaultVal));
	},
	set: function(pName, val) {
		return this.setPref(this.ns + pName, val);
	},
	getPref: function(pName, defaultVal, prefBranch) {
		var ps = prefBranch || Services.prefs;
		switch(ps.getPrefType(pName)) {
			case ps.PREF_BOOL:   return ps.getBoolPref(pName);
			case ps.PREF_INT:    return ps.getIntPref(pName);
			case ps.PREF_STRING: return ps.getComplexValue(pName, Components.interfaces.nsISupportsString).data;
		}
		return defaultVal;
	},
	setPref: function(pName, val, prefBranch) {
		var ps = prefBranch || Services.prefs;
		var pType = ps.getPrefType(pName);
		if(pType == ps.PREF_INVALID)
			pType = this.getValueType(val);
		switch(pType) {
			case ps.PREF_BOOL:   ps.setBoolPref(pName, val); break;
			case ps.PREF_INT:    ps.setIntPref(pName, val);  break;
			case ps.PREF_STRING:
				var ss = Components.interfaces.nsISupportsString;
				var str = Components.classes["@mozilla.org/supports-string;1"]
					.createInstance(ss);
				str.data = val;
				ps.setComplexValue(pName, ss, str);
		}
		return this;
	},
	getValueType: function(val) {
		switch(typeof val) {
			case "boolean": return Services.prefs.PREF_BOOL;
			case "number":  return Services.prefs.PREF_INT;
		}
		return Services.prefs.PREF_STRING;
	},

	savePrefFile: function() {
		Services.prefs.savePrefFile(null);
	}
};