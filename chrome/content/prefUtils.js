var rightLinksPrefUtils = {
	get rl() { return rightLinks; },

	prefNS: "extensions.rightlinks.",
	prefVer: 3,

	get prefSvc() {
		delete this.prefSvc;
		return this.prefSvc = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.QueryInterface(Components.interfaces.nsIPrefBranch2 || Components.interfaces.nsIPrefBranch);
	},

	init: function() {
		const v = this.pref("prefsVersion") || 0;
		if(v < this.prefVer)
			this.prefsMigration(v);
		this.prefSvc.addObserver(this.prefNS, this, false);
	},
	destroy: function() {
		this.prefSvc.removeObserver(this.prefNS, this);
	},
	prefsMigration: function(v) {
		var ps = this.prefSvc;
		var _this = this;
		var _pref = function(pName, defaultVal) {
			var ret = _this.getPref(pName, defaultVal);
			ps.deleteBranch(pName);
			return ret;
		};

		if(v < 1) { // Added: 2009-08-16, released: after 2009-12-12
			// Rename some prefs:
			var him = _pref("rightlinks.hideItemsMode", 0);
			this.pref("ui.showInToolsMenu", !(him == 1 || him == 2));
			this.pref("ui.showInStatusbar", !(him == 1 || him == 3));

			var modifiers = _pref("rightlinks.keyModifiers", "").replace(/[, ]+/g, " ");
			this.pref(
				"key.toggleStatus",
				(modifiers ? modifiers + " " : "") + _pref("rightlinks.keyValue", "VK_F2")
			);

			this.pref("ui.toolbarbuttonCheckedStyle", _pref("rightlinks.toolbarbuttonCheckedStyle", true));

			// Move prefs to "extensions." branch:
			ps.getBranch("rightlinks.")
				.getChildList("", {})
				.forEach(
					function(pName) {
						this.pref(pName, this.getPref("rightlinks." + pName));
					},
					this
				);

			// Delete old branch:
			ps.deleteBranch("rightlinks.");
		}
		if(v < 2) // Added: 2009-12-12
			this.pref("closePopups", _pref(this.prefNS + "hideBookmarksPopup", true));
		if(v < 3) { // Added: 2015-08-27
			this.pref("loadBookmarksInBackground",      this.pref("loadInBackground"));
			this.pref("loadBookmarksInBackground.left", this.pref("loadInBackground.left"));

			if(_pref(this.prefNS + "loadInWindow.left"))
				this.pref("loadIn.left", 1);
			if(_pref(this.prefNS + "loadInWindow"))
				this.pref("loadIn", 1);
		}

		this.pref("prefsVersion", this.prefVer);
		setTimeout(function(_this) {
			_this.savePrefFile();
		}, 0, this);
	},

	// Preferences observer:
	observe: function(subject, topic, pName) {
		if(topic != "nsPref:changed")
			return;
		pName = pName.substr(this.prefNS.length);
		this.rl.prefsChanged(pName, this.readPref(pName));
	},

	_prefs: { __proto__: null }, // Prefs cache
	pref: function(pName, pVal) {
		if(arguments.length == 2)
			return this.setPref(this.prefNS + pName, pVal);
		if(pName in this._prefs)
			return this._prefs[pName];
		return this.readPref(pName);
	},
	readPref: function(pName) {
		return this._prefs[pName] = this.getPref(this.prefNS + pName);
	},
	getPref: function(pName, defaultVal) {
		var ps = this.prefSvc;
		switch(ps.getPrefType(pName)) {
			case ps.PREF_STRING: return ps.getComplexValue(pName, Components.interfaces.nsISupportsString).data;
			case ps.PREF_INT:    return ps.getIntPref(pName);
			case ps.PREF_BOOL:   return ps.getBoolPref(pName);
			default:             return defaultVal;
		}
	},
	setPref: function(pName, pVal) {
		var ps = this.prefSvc;
		var pType = ps.getPrefType(pName);
		var isNew = pType == ps.PREF_INVALID;
		var vType = typeof pVal;
		if(pType == ps.PREF_BOOL || isNew && vType == "boolean")
			ps.setBoolPref(pName, pVal);
		else if(pType == ps.PREF_INT || isNew && vType == "number")
			ps.setIntPref(pName, pVal);
		else if(pType == ps.PREF_STRING || isNew) {
			var ss = Components.interfaces.nsISupportsString;
			var str = Components.classes["@mozilla.org/supports-string;1"]
				.createInstance(ss);
			str.data = pVal;
			ps.setComplexValue(pName, ss, str);
		}
		return this;
	},
	savePrefFile: function() {
		this.prefSvc.savePrefFile(null);
	}
};