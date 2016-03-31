var EXPORTED_SYMBOLS = ["detect"];

this.__defineGetter__("prefs", function() {
	delete this.prefs;
	return Components.utils.import("chrome://rightlinks/content/prefs.jsm").prefs;
});

var detect = {
	event: null,
	item: null,
	origItem: null,
	itemData: null,
	itemType: null,
	XULNS: "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",

	getItem: function(e) {
		var it = this._getItem(e);
		if(!it)
			return this.event = this.item = this.origItem = null;
		this.event = e;
		this.item = it;
		this.origItem = e.originalTarget;
		return it;
	},
	_getItem: function(e) {
		var it = e.originalTarget;
		if(!it.localName) // it === document
			return null;
		var _it;

		_it = this.getLink(it);
		if(_it) {
			this.itemType = "link";
			return _it;
		}

		if(prefs.get("enabledOnHistoryItems")) {
			_it = this.getHistoryItem(it, e);
			if(_it) {
				this.itemType = "historyItem";
				return _it;
			}
		}
		if(prefs.get("enabledOnBookmarks")) {
			_it = this.getBookmarkItem(it, e);
			if(_it) {
				this.itemType = "bookmark";
				return _it;
			}
		}
		if(prefs.get("enabledOnImages")) {
			_it = this.getImg(it);
			if(
				_it
				&& (
					prefs.get("enabledOnSingleImages")
					|| _it.ownerDocument.documentURI != _it.src
				)
			) {
				this.itemType = "img";
				return _it;
			}
		}
		return null;
	},
	getLink: function(it) {
		if(!it || !it.localName)
			return null;
		var window = it.ownerDocument.defaultView;
		if(
			it.namespaceURI == this.XULNS
			&& this.inObject(it, "href") && (it.href || it.hasAttribute("href"))
			//&& (it.accessibleType || it.wrappedJSObject.accessibleType) == Components.interfaces.nsIAccessibleProvider.XULLink
			&& (
				typeof it.open == "function" // Comes from chrome://global/content/bindings/text.xml#text-link binding
				|| it.wrappedJSObject && typeof it.wrappedJSObject.open == "function"
			)
		)
			return it;

		if(this.getCSSEditorURI(it) || this.getWebConsoleURI(it))
			return it;

		const docNode = window.Node.DOCUMENT_NODE; // 9
		const eltNode = window.Node.ELEMENT_NODE; // 1
		for(it = it; it && it.nodeType != docNode; it = it.parentNode) {
			// https://bugzilla.mozilla.org/show_bug.cgi?id=266932
			// https://bug266932.bugzilla.mozilla.org/attachment.cgi?id=206815
			// It's strange to see another link in Status Bar
			// and other browsers (Opera, Safari, Google Chrome) will open "top level" link.
			// And IE... IE won't open XML (it's important!) testcase. :D
			// Also this seems like bug of left-click handler.
			// So, let's open link, which user see in Status Bar.
			if(
				(
					it instanceof window.HTMLAnchorElement
					|| it instanceof window.HTMLAreaElement
					|| it instanceof window.HTMLLinkElement
				)
				&& (
					it.hasAttribute("href")
					|| this.getProperty(it, "repObject", "href") // Firebug
				)
				|| it.nodeType == eltNode && it.hasAttributeNS("http://www.w3.org/1999/xlink", "href")
			)
				return it;
		}
		return null;
	},
	getHistoryItem: function(it, e) {
		if(!it || !it.localName)
			return null;
		if(it.namespaceURI != this.XULNS)
			return null;
		var itln = it.localName.toLowerCase();
		if(
			(
				this.hasParent(it, "goPopup")
				|| itln == "treechildren" && this.isHistoryTree(it.parentNode)
			)
			&& this.getBookmarkURI(it, e)
		)
			return it;
		if(
			it.hasAttribute("targetURI")
			&& this.hasParent(it, "PanelUI-history")
		)
			return it;
		return null;
	},
	getBookmarkItem: function(it, e) {
		if(!it || !it.localName)
			return null;
		if(it.namespaceURI != this.XULNS)
			return null;
		var itln = it.localName.toLowerCase();
		if(
			!("type" in it && it.type == "menu")
			&& (
				(
					/(?:^|\s)bookmark-item(?:\s|$)/.test(it.className)
					&& (itln == "toolbarbutton" || itln == "menuitem")
				)
				|| itln == "menuitem" && (it.hasAttribute("siteURI") || it.hasAttribute("targetURI"))
				|| itln == "treechildren" && (
					this.isBookmarkTree(it.parentNode)
					|| this.isFeedSidebar(it)
				)
			)
			&& !this.hasParent(it, "goPopup")
			&& this.getBookmarkURI(it, e)
		)
			return it;
		return null;
	},
	getImg: function(it) {
		if(!it || !it.localName)
			return null;
		var window = it.ownerDocument.defaultView;
		var itln = it.localName.toLowerCase();
		if(itln == "_moz_generated_content_before") { // Alt-text
			it = it.parentNode;
			itln = it.localName.toLowerCase();
		}
		if(
			(
				(itln == "img" || itln == "image") && it.hasAttribute("src")
				|| (it instanceof window.HTMLCanvasElement && prefs.get("enabledOnCanvasImages"))
			)
			&& !this.isChromeWin(it.ownerDocument.defaultView) // Not for interface...
			&& ( // Speed Dial has own settings for right clicks
				it.ownerDocument.documentURI != "chrome://speeddial/content/speeddial.xul"
				|| !/(?:^|\s)speeddial-container(?:\s|$)/.test(it.parentNode.className)
				|| prefs.get("enabledOnSpeedDialImages")
			)
			// InFormEnter https://addons.mozilla.org/addon/informenter/
			&& !this.hasPrefix(it.src || "", "chrome://informenter/skin/marker")
		)
			return it;
		return null;
	},

	hasParent: function(it, pId) {
		for(it = it.parentNode; it && "id" in it; it = it.parentNode)
			if(it.id == pId)
				return true;
		return false;
	},
	isBookmarkTree: function(tree) {
		return this.isPlacesTree(tree)
			&& /[:&]folder=/.test(tree.getAttribute("place"));
	},
	isHistoryTree: function(tree) {
		if(!this.isPlacesTree(tree))
			return false;
		var place = tree.getAttribute("place");
		return !/[:&]folder=/.test(place) // Exclude bookmarks
			&& !/[:&]transition=7(?:&|$)/.test(place); // Exclude downloads
	},
	isPlacesTree: function(tree) {
		return tree.getAttribute("type") == "places";
	},
	getBookmarkURI:	function(it, e, getPlacesURIs) {
		var ln = it.localName;
		var uri = ln && ln.toLowerCase() == "treechildren"
			? this.getTreeInfo(it, e, "uri")
			: it.statusText
				|| it._placesNode && it._placesNode.uri // Firefox 3.7a5pre+
				|| it.node && it.node.uri
				|| it.getAttribute("siteURI")
				|| it.getAttribute("targetURI")
				|| "";
		return !getPlacesURIs && /^place:/.test(uri) ? "" : uri;
	},
	getTreeInfo: function(treechildren, e, prop) { // "uri" or "title"
		var window = treechildren.ownerDocument.defaultView.top;
		if(!("PlacesUtils" in window)) // For Firefox 3.0+
			return "";
		treechildren = treechildren || this.item;
		e = e || this.event;
		var tree = treechildren.parentNode;

		// Based on code of Places' Tooltips ( https://addons.mozilla.org/firefox/addon/7314 )
		var row = {}, column = {}, part = {};
		tree = tree.wrappedJSObject || tree; // For page in tab, Firefox <= 3.6
		var tbo = tree.treeBoxObject;
		tbo.getCellAt(e.clientX, e.clientY, row, column, part);
		if(row.value == -1)
			return "";
		if(this.isFeedSidebar(treechildren))
			return this.getFeedSidebarURI(tree, row.value);
		try {
			var node = tree.view.nodeForTreeIndex(row.value);
		}
		catch(e) {
		}
		if(!node || !window.PlacesUtils.nodeIsURI(node))
			return "";
		return node[prop];
	},
	isFeedSidebar: function(treechildren) {
		return treechildren.id == "feedbar_tree_container"; // Feed Sidebar
	},
	getFeedSidebarURI: function(tree, treeIndx) {
		var emulateClick = "javascript:void 0";
		try {
			// Based on code from resource://feedbar-modules/treeview.js, Feed Sidebar 8.0.3,
			// see FEEDBAR.onTreeClick()
			// Note: full_preview.html?idx=... link doesn't work without additional code
			if(tree.view.isContainer(treeIndx))
				return "";
			var window = tree.ownerDocument.defaultView.top;
			var FEEDBAR = window.FEEDBAR;
			this.itemData = {
				treeIndx: treeIndx,
				onBeforeLoad: function() {
					FEEDBAR.setCellRead(treeIndx, true);
				}
			};
			if(prefs.getPref("extensions.feedbar.showFullPreview") || !window.navigator.onLine)
				//return "chrome://feedbar/content/full_preview.html?idx=" + treeIndx;
				return emulateClick;
			return FEEDBAR.getCellLink(treeIndx);
		}
		catch(e) {
			Components.utils.reportError(e);
		}
		return emulateClick; // Better fallback?
	},
	getLinkURI: function(it) {
		const ns = "http://www.w3.org/1999/xlink";
		return it.hasAttributeNS(ns, "href")
			? makeURLAbsolute(it.baseURI, it.getAttributeNS(ns, "href")) // See chrome://browser/content/utilityOverlay.js
			// Looks like wrapper error with chrome://global/content/bindings/text.xml#text-link binding
			// on "content" pages (e.g. chrome://global/content/console.xul)
			: it.href || it.getAttribute("href")
				|| this.getProperty(it, "repObject", "href") // Firebug
				|| this.getCSSEditorURI(it)
				|| this.getWebConsoleURI(it);
	},
	getCSSEditorURI: function(it) {
		if(!prefs.get("enabledOnCSSEditorLinks"))
			return null;
		var window = it.ownerDocument.defaultView;
		var docURI = it.ownerDocument.documentURI;
		// Rules tab
		if(
			docURI == "chrome://browser/content/devtools/cssruleview.xul"
			|| docURI == "chrome://browser/content/devtools/cssruleview.xhtml" // Firefox 22+
			|| docURI == "chrome://devtools/content/inspector/inspector.xul" // Firefox 48+
		) {
			if(it.localName == "label")
				it = it.parentNode;
			var uri = it.classList
				&& it.classList.contains("ruleview-rule-source")
				&& this.getProperty(it, "parentNode", "_ruleEditor", "rule", "sheet", "href");
			if(uri)
				return uri;
		}
		// Computed tab
		if(
			docURI == "chrome://browser/content/devtools/csshtmltree.xul"
			|| docURI == "chrome://browser/content/devtools/computedview.xhtml" // Firefox 22+
			|| docURI == "chrome://devtools/content/inspector/inspector.xul" // Firefox 48+
		) {
			return it instanceof window.HTMLAnchorElement
				&& !it.href
				&& !it.getAttribute("href")
				&& it.classList
				&& it.classList.contains("link")
				&& it.parentNode.classList.contains("rule-link")
				&& this.uri(it.title);
		}
		return null;
	},
	getWebConsoleURI: function(it) {
		return it.namespaceURI == this.XULNS
			&& it.classList
			&& it.classList.contains("webconsole-location")
			&& it.classList.contains("text-link")
			&& this.hasPrefix(it.parentNode.id || "", "console-msg-")
			&& this.uri(it.getAttribute("title"));
	},
	getHref: function(a, e) {
		a = a || this.item;
		e = e || this.event;
		var window = a.ownerDocument.defaultView;
		return this.getLinkURI(a)
			|| a.src || a.getAttribute("src")
			|| a instanceof window.HTMLCanvasElement && a.toDataURL()
			|| a.getAttribute("targetURI")
			|| this.getBookmarkURI(a, e, "uri");
	},

	isDummyURI: function(item, uri, evt) {
		//if(this.itemType != "link")
		//	return false;
		item = item || this.item;
		uri = uri || this.getHref(item, evt || this.event);
		var doc = item.ownerDocument;
		var loc = doc.documentURI.replace(/#.*$/, "");
		if(!this.hasPrefix(uri, loc))
			return false;
		var _uri = uri.substr(loc.length);
		if(_uri == "" && item.getAttribute && item.hasAttribute("href") && !item.getAttribute("href")) // <a href="">
			return true;
		if(_uri.charAt(0) != "#")
			return false;
		var anchor = _uri.substr(1);
		if(!anchor) // <a href="#">
			return true;
		if(anchor.charAt(0) == "!") // site.com/#!... links on JavaScript-based sites like http://twitter.com/
			return false;
		return !doc.getElementById(anchor) && !doc.getElementsByName(anchor).length && 2;
	},

	isPrimitive: function(v) {
		if(v === null || v === undefined)
			return true;
		var t = typeof v;
		return t == "string" || t == "number" || t == "boolean";
	},
	getProperty: function(obj) {
		var u;
		if(this.isPrimitive(obj))
			return u;
		var a = arguments, p;
		for(var i = 1, len = a.length - 1; i <= len; ++i) {
			p = a[i];
			if(!(p in obj))
				return u;
			obj = obj[p];
			if(i == len)
				return obj;
			if(this.isPrimitive(obj))
				return u;
		}
		return u;
	},
	isChromeWin: function(win) {
		return win instanceof Components.interfaces.nsIDOMChromeWindow;
	},
	inObject: function(o, p) {
		// this._log("inObject", "wrappedJSObject" in o, o.wrappedJSObject);
		// Open chrome://global/content/console.xul in tab
		// and click on <xul:label class="text-link" />
		//   "wrappedJSObject" in o => false
		//   o.wrappedJSObject      => [object XULElement]

		//return p in o || "wrappedJSObject" in o && p in o.wrappedJSObject;
		return p in o || o.wrappedJSObject && p in o.wrappedJSObject;
	},
	hasPrefix: function(str, prefix) {
		var f = this.hasPrefix = "startsWith" in String
			? String.startsWith
			: function(str, prefix) {
				return str.substr(0, prefix.length) == prefix;
			};
		return f.apply(this, arguments);
	}
};