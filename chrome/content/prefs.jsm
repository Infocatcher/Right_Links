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
		var tmp = {};
		Services.scriptloader.loadSubScript("chrome://rightlinks/content/prefsMigration.js", tmp, "UTF-8");
		return tmp.prefsMigration.call(this, v);
	},

	// Preferences observer:
	observe: function(subject, topic, pName) {
		if(topic != "nsPref:changed")
			return;
		var shortName = pName.substr(this.ns.length);
		var val = this.getPref(pName);
		this._cache[shortName] = val;

		var observers = this._observers;
		for(var id in observers) {
			var observer = observers[id];
			observer.fn.call(observer.context, shortName, val);
		}
	},

	_observers: { __proto__: null },
	_observerId: -1,
	addObserver: function(fn, context) {
		var id = ++this._observerId;
		this._observers[id] = {
			fn: fn,
			context: context
		};
		return id;
	},
	removeObserver: function(id) {
		delete this._observers[id];
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

prefs.init();