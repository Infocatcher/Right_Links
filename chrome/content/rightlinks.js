var rightLinks = {
	pu: rightLinksPrefUtils,

	enabled: false,
	runned: false,
	cancelled: false,
	stopContextMenu: false,
	stopClick: false,

	item: null,
	origItem: null,
	itemType: null,
	event: null,
	delayedActionTimer: 0,
	_hasMoveHandlers: false,
	_cleanupTimer: 0,

	XULNS: "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",

	init: function() {
		window.removeEventListener("load", this, false);
		window.addEventListener("unload", this, false);

		this.pu.init();
		this.setStatus();
		this.setUIVisibility();
		this.registerHotkeys();
	},
	destroy: function() {
		window.removeEventListener("unload", this, false);
		if(this.enabled)
			this.setClickHandlers(false);
		this.pu.destroy();
	},
	setClickHandlers: function(enabled) {
		this.setListeners(["mousedown", "mouseup", "click", "contextmenu", "popupshowing"], enabled);
		if(!enabled) {
			this.cancelDelayedAction();
			this.setMoveHandlers(false);
		}
	},
	handleEvent: function(e) {
		switch(e.type) {
			case "load":         this.init(e);                break;
			case "unload":       this.destroy(e);             break;
			case "mousedown":    this.mousedownHandler(e);    break;
			case "mouseup":      this.mouseupHandler(e);      break;
			case "click":        this.clickHandler(e);        break;
			case "contextmenu":  this.contextmenuHandler(e);  break;
			case "popupshowing": this.popupshowingHandler(e); break;
			case "mousemove":    this.mousemoveHandler(e);    break;
			case "draggesture": // Legacy
			case "dragstart":    this.dragHandler(e);         break;
			case "TabSelect":    this.cancel();               break;
			case "DOMMouseScroll": // Legacy
			case "wheel":        this.cancel();
		}
	},
	setListeners: function(evtTypes, add) {
		var act = add ? addEventListener : removeEventListener;
		evtTypes.forEach(function(evtType) {
			act.call(window, evtType, this, true);
		}, this);
	},
	get wheelEvent() {
		delete this.wheelEvent;
		return this.wheelEvent = "WheelEvent" in window
			? "wheel"
			: "DOMMouseScroll";
	},
	get dragStartEvent() {
		delete this.dragStartEvent;
		return this.dragStartEvent = "ondragstart" in window
			? "dragstart"
			: "draggesture";
	},

	isVoidURI: function(uri) {
		uri = (uri || "").replace(/(?:\s|%20)+/g, " ");
		return /^javascript: *(?:|\/\/|void *(?: +0|\( *0 *\))) *;? *$/i.test(uri);
	},
	isJSURI: function(uri) {
		return typeof uri == "string" && /^javascript:/i.test(uri);
	},
	isDummyURI: function(item, uri, evt) {
		//if(this.itemType != "link")
		//	return false;
		item = item || this.item;
		uri = uri || this.getHref(item, evt || this.event);
		var doc = item.ownerDocument;
		var loc = doc.location.href.replace(/#.*$/, "");
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
	uri: function(uri) {
		return /^[\w-]+:\S*$/.test(uri) && uri;
	},
	get mi() {
		return document.getElementById("rightLinks-toggleStatus-mi");
	},
	get miApp() {
		return document.getElementById("rightLinks-toggleStatus-mi-app");
	},
	get miAppSep() {
		return document.getElementById("rightLinks-toggleStatus-mi-app-separator");
	},
	get status() {
		return document.getElementById("rightLinks-toggleStatus-status");
	},
	get tbb() {
		return document.getElementById("rightLinks-toggleStatus-tbutton");
	},
	get paletteButton() {
		var tb = "gNavToolbox" in window && gNavToolbox
			|| "getNavToolbox" in window && getNavToolbox() // Firefox 3.0
			|| document.getElementById("navigator-toolbox"); // Firefox <= 2.0
		if(!tb || !("palette" in tb))
			return null;
		var elt = tb.palette.getElementsByAttribute("id", "rightLinks-toggleStatus-tbutton");
		return elt.length ? elt[0] : null;
	},
	get appInfo() {
		delete this.appInfo;
		return this.appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
			.getService(Components.interfaces.nsIXULAppInfo);
	},
	get isSeaMonkey() {
		delete this.isSeaMonkey;
		return this.isSeaMonkey = this.appInfo.name == "SeaMonkey";
	},
	get fxVersion() {
		var ver = parseFloat(this.appInfo.version); // 3.0 for "3.0.10"
		// https://developer.mozilla.org/en-US/docs/Mozilla/Gecko/Versions
		if(this.isSeaMonkey) switch(ver) {
			case 2:   ver = 3.5; break;
			case 2.1: ver = 4;   break;
			default:  ver = parseFloat(this.appInfo.platformVersion);
		}
		delete this.fxVersion;
		return this.fxVersion = ver;
	},
	getItem: function(e) {
		var it = e.originalTarget;
		if(!it.localName) // it === document
			return null;
		var _it;

		_it = this.getLink(it);
		if(_it) {
			this.itemType = "link";
			return _it;
		}

		if(this.pu.pref("enabledOnHistoryItems")) {
			_it = this.getHistoryItem(it, e);
			if(_it) {
				this.itemType = "historyItem";
				return _it;
			}
		}
		if(this.pu.pref("enabledOnBookmarks")) {
			_it = this.getBookmarkItem(it, e);
			if(_it) {
				this.itemType = "bookmark";
				return _it;
			}
		}
		if(this.pu.pref("enabledOnImages")) {
			_it = this.getImg(it);
			if(
				_it
				&& (
					this.pu.pref("enabledOnSingleImages")
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

		const docNode = Node.DOCUMENT_NODE; // 9
		const eltNode = Node.ELEMENT_NODE; // 1
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
					it instanceof HTMLAnchorElement
					|| it instanceof HTMLAreaElement
					|| it instanceof HTMLLinkElement
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
				|| itln == "menuitem" && it.hasAttribute("siteURI")
				|| itln == "treechildren" && this.isBookmarkTree(it.parentNode)
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
		var itln = it.localName.toLowerCase();
		if(itln == "_moz_generated_content_before") { // Alt-text
			it = it.parentNode;
			itln = it.localName.toLowerCase();
		}
		if(
			(
				(itln == "img" || itln == "image") && it.hasAttribute("src")
				|| it instanceof HTMLCanvasElement
			)
			&& !this.isChromeWin(it.ownerDocument.defaultView) // Not for interface...
			&& ( // Speed Dial has own settings for right clicks
				it.ownerDocument.documentURI != "chrome://speeddial/content/speeddial.xul"
				|| !/(?:^|\s)speeddial-container(?:\s|$)/.test(it.parentNode.className)
				|| this.pu.pref("enabledOnSpeedDialImages")
			)
			// InFormEnter https://addons.mozilla.org/addon/informenter/
			&& (it.src || "").substr(0, 32) != "chrome://informenter/skin/marker"
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
				|| "";
		return !getPlacesURIs && /^place:/.test(uri) ? "" : uri;
	},
	getTreeInfo: function(treechildren, e, prop) { // "uri" or "title"
		if(!("PlacesUtils" in window)) // For Firefox 3.0+
			return "";
		var tree = (treechildren || this.item).parentNode
		e = e || this.event;

		// Based on code of Places' Tooltips ( https://addons.mozilla.org/firefox/addon/7314 )
		var row = {}, column = {}, part = {};
		tree = tree.wrappedJSObject || tree; // For page in tab, Firefox <= 3.6
		var tbo = tree.treeBoxObject;
		tbo.getCellAt(e.clientX, e.clientY, row, column, part);
		if(row.value == -1)
			return "";
		try {
			var node = tree.view.nodeForTreeIndex(row.value);
		}
		catch(e) {
		}
		if(!node || !PlacesUtils.nodeIsURI(node))
			return "";
		return node[prop];
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
		if(!this.pu.pref("enabledOnCSSEditorLinks"))
			return null;
		var docURI = it.ownerDocument.documentURI;
		// Rules tab
		if(
			docURI == "chrome://browser/content/devtools/cssruleview.xul"
			|| docURI == "chrome://browser/content/devtools/cssruleview.xhtml" // Firefox 22+
		) {
			if(it.localName == "label")
				it = it.parentNode;
			return it.classList
				&& it.classList.contains("ruleview-rule-source")
				&& this.getProperty(it, "parentNode", "_ruleEditor", "rule", "sheet", "href");
		}
		// Computed tab
		if(
			docURI == "chrome://browser/content/devtools/csshtmltree.xul"
			|| docURI == "chrome://browser/content/devtools/computedview.xhtml" // Firefox 22+
		) {
			return it instanceof HTMLAnchorElement
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
			&& (it.parentNode.id || "").substr(0, 12) == "console-msg-"
			&& this.uri(it.getAttribute("title"));
	},
	getHref: function(a, e) {
		a = a || this.item;
		e = e || this.event;
		return this.getLinkURI(a)
			|| a.src || a.getAttribute("src")
			|| a instanceof HTMLCanvasElement && a.toDataURL()
			|| a.getAttribute("targetURI")
			|| this.getBookmarkURI(a, e, "uri");
	},
	closeMenus: function(node) {
		node = node || this.item;
		if(!node || typeof node != "object")
			return;
		// Based on function closeMenus from chrome://browser/content/utilityOverlay.js
		for(; node && "localName" in node; node = node.parentNode) {
			var ln = node.localName;
			if(
				node.namespaceURI == this.XULNS
				&& (ln == "menupopup" || ln == "popup" || ln == "panel")
			)
				node.hidePopup();
		}
	},
	stopEvent: function(e) {
		e.preventDefault();
		e.stopPropagation();
	},
	stopSingleEvent: function(e) {
		// Prevent page handlers, but don't stop Mouse Gestures
		var top = e.view.top;
		var root = top === content ? gBrowser.selectedBrowser : top;
		var _this = this;
		root.addEventListener(
			e.type,
			function stopEvent(e) {
				root.removeEventListener(e.type, stopEvent, true);
				if(_this.isEnabled(e))
					_this.stopEvent(e);
			},
			true
		);
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
		return str.substr(0, prefix.length) == prefix;
	},
	setTimeout: function(func, delay, context) {
		return setTimeout(function(func, context) {
			func.call(context);
		}, delay || 0, func, context || this);
	},

	isEnabled: function(e) {
		if(!this.enabled)
			return false;
		var b = e.button;
		if(b == 0 && !this.enabledLeft || b == 2 && !this.enabledRight)
			return false;
		if(b == 1 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)
			return false;
		return true;
	},

	mousedownHandler: function(e) {
		if(!this.isEnabled(e))
			return;

		if(this._cleanupTimer) {
			clearTimeout(this._cleanupTimer);
			this._cleanupTimer = 0;
		}

		this.isLeft = e.button == 0;
		this.leftPref = this.isLeft ? ".left" : "";

		var a = this.item = this.getItem(e);
		if( // Workaround for https://addons.mozilla.org/addon/budaneki/
			a
			&& e.button == 0
			&& a.parentNode
			&& a.parentNode.id == "budaneki-icon-menu-clonned"
			&& a.ownerDocument == document
		)
			return;
		this.origItem = e.originalTarget;
		this.runned = false;
		this.cancelled = false;
		this.stopContextMenu = a && !this.isLeft;
		this.stopClick = false;
		if(!a)
			return;
		if(this.isLeft) {
			var href = this.getHref(a, e);
			if(!href)
				return;
		}

		this._stopMousedown = !this.isLeft && !this.isChromeWin(e.view.top)
			&& this.pu.pref("stopMousedownEvent");
		if(this._stopMousedown) {
			this.stopSingleEvent(e);
			setTimeout(function() {
				if(document.commandDispatcher.focusedElement != a)
					a.focus();
			}, 0);
		}

		this.event = e;
		this.saveXY(e);

		var cmt = this.pu.pref(this.isLeft ? "longLeftClickTimeout" : "showContextMenuTimeout");
		if(cmt > 0) {
			this.cancelDelayedAction();
			this.delayedActionTimer = this.setTimeout(function() {
				this.runned = true;
				if(!a.ownerDocument || !a.ownerDocument.location) // Page already unloaded
					return;
				if(this.isLeft) {
					this.loadLink(e, a, href);
					this.stopClick = true;
				}
				else {
					this.showContextMenu(this._stopMousedown);
				}
			}, cmt);
		}

		this.setMoveHandlers(e);
	},
	mouseupHandler: function(e) {
		if(!this.enabled)
			return;
		// Case: mousedown -> schedule delayed action -> press Shift -> mouseup
		// We should perform cleanup in this case!
		this.setMoveHandlers(false);
		this.cancelDelayedAction();
		if(!this.isEnabled(e))
			this.stopContextMenu = this.stopClick = false;
		else {
			this.setTimeout(function() {
				this.stopContextMenu = this.stopClick = false;
			}, 5);
			this.saveXY(e);
			if(this.isLeft && this.stopClick && this.pu.pref("stopMouseupEvent")) {
				if(this.pu.pref("fakeMouseup"))
					this.createMouseEvents(e, gBrowser.selectedBrowser.parentNode, ["mouseup"], 0)();
				if(this.isChromeWin(e.view.top))
					this.stopEvent(e);
				else
					this.stopSingleEvent(e);
			}
		}

		this._cleanupTimer = this.setTimeout(function() {
			this._cleanupTimer = 0;
			this.item = this.origItem = this.event = null;
		}, 500);
	},
	clickHandler: function(e) {
		if(!this.isEnabled(e))
			return;
		if(this.isLeft) {
			this.cancelDelayedAction();
			var view = e.view.top;
			if( // Looks like (already fixed) Firefox bug
				view != content
				&& this.fxVersion < 4
				&& !this.isChromeWin(view)
				&& gBrowser.browsers.some(function(browser) {
					return browser.contentWindow == view; // D'oh, click on inactive browser...
				})
			)
				this.stopClick = true;
			if(this.stopClick) {
				this.stopClick = false;
				this.stopEvent(e);
			}
			return;
		}
		if(this.runned || this.cancelled)
			return;

		var a = this.getItem(e);
		if(!a || a != this.item)
			return;
		var href = this.getHref(a, e);
		if(!href)
			return;
		this.stopEvent(e);
		this.cancelDelayedAction();
		this.item = a;
		this.origItem = e.originalTarget;
		this.loadLink(e, a, href);
	},
	contextmenuHandler: function(e) {
		if(this.enabled && this.stopContextMenu)
			this.stopEvent(e);
	},
	popupshowingHandler: function(e) {
		// Force prevent any popup
		// This is for RightToClick extension https://addons.mozilla.org/firefox/addon/righttoclick/
		if(this.enabled && this.stopContextMenu) {
			var ln = e.target.localName.toLowerCase();
			if(ln == "menupopup" || ln == "popup")
				this.stopEvent(e);
		}
	},
	cancelDelayedAction: function() {
		clearTimeout(this.delayedActionTimer);
	},
	mousemoveHandler: function(e) {
		this.saveXY(e);
		if(!this.disallowMousemove)
			return;
		var mp = this.mousemoveParams;
		var x = e.screenX;
		var y = e.screenY;
		mp.dist += Math.sqrt(
			Math.pow(mp.screenX - x, 2) +
			Math.pow(mp.screenY - y, 2)
		);
		if(mp.dist >= this.disallowMousemoveDist) {
			this.cancel();
			return;
		}
		mp.screenX = x;
		mp.screenY = y;
	},
	dragHandler: function(e) {
		if(this.disallowMousemove)
			this.cancel();
	},
	cancel: function() {
		this.cancelled = true;
		this.stopContextMenu = false;
		this.stopClick = false;
		this.cancelDelayedAction();
		this.setMoveHandlers(false);
	},
	setMoveHandlers: function(add) {
		if(!add ^ this._hasMoveHandlers)
			return;
		this._hasMoveHandlers = !!add;
		if(add) {
			var dist = this.disallowMousemoveDist = this.pu.pref("disallowMousemoveDist");
			this.disallowMousemove = dist >= 0;
			this.mousemoveParams = {
				dist: 0,
				screenX: add.screenX,
				screenY: add.screenY,
				__proto__: null
			};
		}
		else {
			this.mousemoveParams = null;
		}
		this.setListeners(["mousemove", this.dragStartEvent, "TabSelect", this.wheelEvent], add);
	},
	_xy: {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		__proto__: null
	},
	saveXY: function(e) {
		var o = this._xy;
		for(var p in o)
			o[p] = e[p];
	},

	loadLink: function(e, a, href) {
		if(
			(this.itemType == "bookmark" || this.itemType == "historyItem")
			&& this.pu.pref("closePopups" + this.leftPref)
		)
			this.closeMenus(a);

		if(this.isLeft) {
			var _ignoreMouseup = false;
			var dragStartEvent = this.dragStartEvent;
			var evtHandler = function(e) {
				if(e.type == "mouseup" && _ignoreMouseup) {
					_ignoreMouseup = false;
					return;
				}
				window.removeEventListener("mouseup", evtHandler, true);
				window.removeEventListener(dragStartEvent, evtHandler, true);
				window.removeEventListener("popuphiding", evtHandler, true);
				if(e.type == dragStartEvent)
					e.preventDefault();
			}
			window.addEventListener("mouseup", evtHandler, true);
			window.addEventListener(dragStartEvent, evtHandler, true);
			window.addEventListener("popuphiding", evtHandler, true);
		}

		var voidURI = this.isVoidURI(href);
		if(!voidURI && this.isJSURI(href)) {
			var _this = this;
			var loadJSFunc = function() {
				_this.loadJSLink(a);
			};
			var loadJS = this.pu.pref("loadJavaScriptLinks");
			if(this.pu.pref("notifyJavaScriptLinks"))
				this.notify(
					this.getLocalized("title"),
					this.getLocalized("javaScriptLink" + (loadJS ? "" : "Click")),
					true,
					loadJS ? null : loadJSFunc
				);
			loadJS && loadJSFunc();
			return;
		}
		var dummyURI = !voidURI && this.isDummyURI(a, href, e);
		if(voidURI || dummyURI) {
			var evts = this.createMouseEvents(e, a, ["mousedown", "mouseup", "click"], {
				button: 0,
				ctrlKey: dummyURI == 2 // Link may be real
			});

			var _this = this;
			var loadVoidFunc = function() {
				_this.setLoadJSLinksPolicy();

				if(_this.pu.pref("workaroundForMousedownImitation")) {
					// https://github.com/Infocatcher/Right_Links/issues/2
					// Tabs becomes not clickable after "mousedown" imitation,
					// so we try to catch "mousedown" before browser's listeners
					var doc = a.ownerDocument;
					var root = _this.dwu.getParentForNode(doc, true) || doc.defaultView;
					root.addEventListener("mousedown", function fix(e) {
						root.removeEventListener(e.type, fix, false);
						e.preventDefault();
						//e.stopPropagation();
					}, false);
				}
				evts();

				_this.restoreLoadJSLinksPolicy();
			};

			var loadVoid = this.pu.pref("loadVoidLinksWithHandlers");
			if(this.pu.pref("notifyVoidLinksWithHandlers"))
				this.notify(
					this.getLocalized("title"),
					this.getLocalized("clickHandler" + (loadVoid ? "" : "Click")),
					true,
					loadVoid ? null : loadVoidFunc
				);
			loadVoid && loadVoidFunc();
			return;
		}

		var flp = this.pu.pref("filesLinksPolicy");
		if(flp > 0) {
			var rePref = "filesLinksMask";
			var re = this.pu.pref(rePref);
			if(re) try {
				var _re = new RegExp(re, "i");
				if(_re.test(href)) {
					if(flp == 1)
						gBrowser.loadURI(href, this.getReferer());
					else if(flp == 2) {
						// Bug? We stop "dragstart", but menu doesn't work
						if(this.isLeft)
							_ignoreMouseup = true;
						this.showContextMenu(this.isLeft || this._stopMousedown);
					}
					else if(flp == 3) {
						href = href.replace(/^mailto:/i, "");
						Components.classes["@mozilla.org/widget/clipboardhelper;1"]
							.getService(Components.interfaces.nsIClipboardHelper)
							.copyString(href, a.ownerDocument);

						var hasStyle = a.hasAttribute("style");
						a.style.setProperty("opacity", "0.3", "important");
						setTimeout(function() {
							a.style.opacity = "";
							if(!hasStyle)
								a.removeAttribute("style");
						}, 150);
					}
					return;
				}
			}
			catch(e) {
				Components.utils.reportError(e);
				Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
					.getService(Components.interfaces.nsIPromptService)
					.alert(
						window,
						this.getLocalized("errorTitle"),
						this.getLocalized("regExpError")
							.replace("%r", re)
							.replace("%p", this.pu.prefNS + rePref)
							.replace("%e", e)
					);
			}
		}

		// https://addons.mozilla.org/firefox/addon/redirect-remover/
		if("rdrb" in window && this.getProperty(rdrb, "cleanLink"))
			href = rdrb.cleanLink(href);
		if("Highlander" in window) { // https://addons.mozilla.org/firefox/addon/4086
			var tab = Highlander.findTabForURI(makeURI(href));
			if(tab) {
				Highlander.selectTab(tab);
				return;
			}
		}
		this.urlSecurityCheck(a.ownerDocument, href);
		if(this.pu.pref("loadInWindow" + this.leftPref))
			this.openURIInWindow(href);
		else
			this.openURIInTab(href);
	},
	get dwu() {
		delete this.dwu;
		return this.dwu = Components.classes["@mozilla.org/inspector/dom-utils;1"]
			.getService(Components.interfaces.inIDOMUtils);
	},
	get isOldAddTab() {
		delete this.isOldAddTab;
		return this.isOldAddTab = this.isSeaMonkey
			? this.fxVersion < 4
			: this.fxVersion < 3.6;
	},
	openURIInTab: function(href) {
		var win = window;
		var openAsChild = this.itemType == "link" || this.itemType == "img";
		var relatedToCurrent = openAsChild;
		if(
			"getTopWin" in win
			&& getTopWin.length > 0 // Only in Firefox for now
			&& !win.toolbar.visible // Popup window
			&& this.pu.pref("dontUseTabsInPopupWindows")
		) {
			win = getTopWin(true);
			relatedToCurrent = openAsChild = false;
			win.setTimeout(win.focus, 0);
		}
		if(openAsChild) {
			// Open a new tab as a child of the current tab (Tree Style Tab)
			// http://piro.sakura.ne.jp/xul/_treestyletab.html.en#api
			if("TreeStyleTabService" in win)
				win.TreeStyleTabService.readyToOpenChildTab(win.gBrowser.selectedTab);
			// Tab Kit https://addons.mozilla.org/firefox/addon/tab-kit/
			// TabKit 2nd Edition https://addons.mozilla.org/firefox/addon/tabkit-2nd-edition/
			if("tabkit" in win)
				win.tabkit.addingTab("related");
		}

		if(this.isOldAddTab)
			var tab = win.gBrowser.addTab(href, this.getReferer());
		else {
			var tab = win.gBrowser.addTab(href, {
				referrerURI: this.getReferer(),
				relatedToCurrent: relatedToCurrent
			});
		}
		if(!this.pu.pref("loadInBackground" + this.leftPref))
			win.gBrowser.selectedTab = tab;

		if(openAsChild && "tabkit" in win)
			win.tabkit.addingTabOver();
	},
	openURIInWindow: function(href) {
		window.openDialog(
			getBrowserURL(),
			"_blank",
			"chrome,all,dialog=no",
			href,
			null,
			this.getReferer(),
			null,
			false
		);
	},
	get secMan() {
		delete this.secMan;
		return this.secMan = Components.classes["@mozilla.org/scriptsecuritymanager;1"]
			.getService(Components.interfaces.nsIScriptSecurityManager);
	},
	urlSecurityCheck: function(doc, url) {
		var secMan = this.secMan;
		try {
			if("checkLoadURIStrWithPrincipal" in secMan) // Firefox 3.0+
				secMan.checkLoadURIStrWithPrincipal(doc.nodePrincipal, url, secMan.STANDARD);
			else
				secMan.checkLoadURIStr(doc.documentURI, url, secMan.STANDARD);
		}
		catch(e) {
			this.notify(
				this.getLocalized("warningTitle"),
				this.getLocalized("securityError")
					.replace("%u", url)
					.replace("%s", this.item.ownerDocument.documentURI),
				false
			);
			Components.utils.reportError(e);
			throw new Error("Load of " + url + " from " + doc.documentURI + " denied.");
		}
	},
	loadJSLink: function(a) {
		var disId = "dom.disable_open_during_load";
		var dis = this.pu.getPref(disId, true);
		this.pu.setPref(disId, false); // allow window.open( ... )
		this.setLoadJSLinksPolicy();

		var href = this.getHref(a);
		if(this.itemType == "bookmark" || this.itemType == "historyItem")
			gBrowser.loadURI(href); // bookmarklets
		else
			a.ownerDocument.location.href = href; // frames?

		this.restoreLoadJSLinksPolicy();
		this.setTimeout(function() { // Timeout for Firefox 3.0+
			this.pu.setPref(disId, dis);
		}, 5);
	},
	_restorePrefsTimer: 0,
	setLoadJSLinksPolicy: function() {
		if("_origPrefs" in this) {
			clearTimeout(this._restorePrefsTimer);
			return;
		}
		var origs = this._origPrefs = { __proto__: null };
		var inWin = this.pu.pref("loadInWindow" + this.leftPref);
		var prefs = {
			"browser.tabs.loadDivertedInBackground": inWin
				? null
				: this.pu.pref("loadJavaScriptLinksInBackground" + this.leftPref),
			"browser.link.open_newwindow": inWin ? 2 : 3,
			// http://kb.mozillazine.org/Network.http.sendRefererHeader
			// 0 - none
			// 1 - for docs
			// 2 - for images and docs
			"network.http.sendRefererHeader": this.sendReferer
				? this.pu.getPref("network.http.sendRefererHeader") || 2
				: 0,
			__proto__: null
		};
		for(var p in prefs) {
			var val = prefs[p];
			if(val === null)
				continue;
			var orig = this.pu.getPref(p);
			if(orig != undefined && val != orig) {
				origs[p] = orig;
				this.pu.setPref(p, val);
			}
		}
	},
	restoreLoadJSLinksPolicy: function() {
		if(!("_origPrefs" in this))
			return;
		var prefs = this._origPrefs;
		clearTimeout(this._restorePrefsTimer);
		this._restorePrefsTimer = this.setTimeout(function() {
			// For Firefox 3.0+, timeout should be > 0 for Firefox 11.0+
			for(var p in prefs)
				this.pu.setPref(p, prefs[p]);
			delete this._origPrefs;
		}, 25);
	},
	get sendReferer() {
		return (this.itemType == "link" || this.itemType == "img") && this.pu.pref("sendReferer");
	},
	getReferer: function() {
		// Should be undefined for Firefox 3.6+
		// - see addTab() method in chrome://browser/content/tabbrowser.xml
		return this.sendReferer
			? makeURI(this.item.ownerDocument.location.href) // see chrome://global/content/contentAreaUtils.js
			: undefined;
	},
	showContextMenu: function(simulateMousedown) {
		var events = ["mouseup", "contextmenu"];
		if(simulateMousedown)
			events.unshift("mousedown");
		this.stopContextMenu = false;
		this.createMouseEvents(
			this._xy,
			this.origItem || this.item,
			events,
			2
		)();
	},
	createMouseEvents: function(origEvt, item, evtTypes, opts) {
		if(typeof opts == "number")
			opts = { button: opts };
		var evts = evtTypes.map(function(evtType) {
			return this.createMouseEvent(origEvt, item, evtType, opts);
		}, this);
		var _this = this;
		return function() {
			_this.enabled = false;
			evts.forEach(function(evt) {
				item.dispatchEvent(evt);
			});
			_this.enabled = true;
		};
	},
	createMouseEvent: function(origEvt, item, evtType, opts) {
		item = item || origEvt.originalTarget;
		var doc = item.ownerDocument;
		var win = doc.defaultView;
		if(
			typeof win.MouseEvent == "function" // Firefox 11+
			&& ("" + win.MouseEvent).charAt(0) != "[" // Trick for Firefox <= 2.0
		) {
			var evt = new win.MouseEvent(evtType, {
				bubbles: true,
				cancelable: true,
				view: win,
				detail: 1,
				screenX: origEvt.screenX,
				screenY: origEvt.screenY,
				clientX: origEvt.clientX,
				clientY: origEvt.clientY,
				ctrlKey:  opts.ctrlKey  || false,
				altKey:   opts.altKey   || false,
				shiftKey: opts.shiftKey || false,
				metaKey:  opts.metaKey  || false,
				button:   opts.button   || 0,
				relatedTarget: null
			});
		}
		else {
			var evt = doc.createEvent("MouseEvents");
			evt.initMouseEvent( // https://developer.mozilla.org/en/DOM/event.initMouseEvent
				evtType, true /* canBubble */, true /* cancelable */, win, 1,
				origEvt.screenX, origEvt.screenY, origEvt.clientX, origEvt.clientY,
				opts.ctrlKey || false, opts.altKey || false, opts.shiftKey || false, opts.metaKey || false,
				opts.button || 0, null
			);
		}
		return evt;
	},

	get strings() {
		delete this.strings;
		return this.strings = document.getElementById("rightLinks-strings");
	},
	getLocalized: function(id) {
		return this.strings.getString(id);
	},

	// GUI:
	toggleStatus: function(notify) {
		var enabled = !this.enabled;
		this.pu.pref("enabled", enabled);
		if(enabled && !this.enabledRight && !this.enabledLeft)
			this.pu.pref("enabled.right", true);
		// => prefsChanged() => setStatus()
		if(
			!notify
			|| this.isElementVisible(this.status)
			|| this.isElementVisible(this.tbb)
		)
			return;
		this.notify(
			this.getLocalized("title"),
			this.getLocalized(enabled ? "enabled" : "disabled"),
			enabled
		);
	},
	showSettingsPopup: function() {
		var popup = this.popup;
		var anchor = gBrowser.selectedBrowser;
		document.popupNode = anchor;
		popup.__rlShowEnabledItem = true;
		if("openPopup" in popup) // Firefox 3.0+
			popup.openPopup(anchor, "overlap", false);
		else
			popup.showPopup(anchor, -1, -1, "popup", "topleft", "topleft");
		// Select first menuitem
		// Unfortunately ordinal popup doesn't have nsIMenuBoxObject interface with activeChild field
		var keyCode = KeyboardEvent.DOM_VK_DOWN;
		key("keydown",  keyCode);
		key("keypress", keyCode);
		key("keyup",    keyCode);
		function key(type, code) {
			var evt = document.createEvent("KeyboardEvent");
			evt.initKeyEvent(
				type, true /*bubbles*/, true /*cancelable*/, window,
				false /*ctrlKey*/, false /*altKey*/, false /*shiftKey*/, false /*metaKey*/,
				code /*keyCode*/, 0 /*charCode*/
			);
			popup.dispatchEvent(evt);
		}
	},
	isElementVisible: function(elt) {
		if(!elt)
			return false;
		var bo = elt.boxObject;
		return bo.height > 0 && bo.width > 0;
	},
	setStatus: function(enabled) {
		this.enabledRight = this.pu.pref("enabled.right");
		this.enabledLeft = this.pu.pref("enabled.left");
		if(!this.enabledRight && !this.enabledLeft)
			enabled = false;
		else if(enabled === undefined)
			enabled = this.pu.pref("enabled");

		if(enabled != this.enabled) {
			this.enabled = enabled;
			this.setClickHandlers(enabled);
		}

		var st = this.status;
		var stVal = enabled ? "enabled" : "disabled";
		if(st)
			st.setAttribute("rl_status", stVal);
		this.setTimeout(function() {
			this.check(this.mi, enabled);
			this.check(this.miApp, enabled);
			var tt = this.getLocalized("title") + " " + this.getLocalized(stVal);
			if(st)
				st.tooltipText = tt;
			if(tbb)
				tbb.tooltipText = tt;
		}, 50);
		var tbb = this.tbb || this.paletteButton;
		if(!tbb)
			return;
		tbb.setAttribute("rl_status", stVal);
		// tbb.checked = ...; breaks button in palette!
		this.check(tbb, enabled && this.pu.pref("ui.toolbarbuttonCheckedStyle"));
	},
	check: function(node, checked) {
		if(!node)
			return;
		if("checked" in node)
			node.checked = checked;
		else if(checked)
			node.setAttribute("checked", "true");
		else
			node.removeAttribute("checked");
	},
	setUIVisibility: function() {
		this.setTimeout(function() {
			this.mi.hidden = !this.pu.pref("ui.showInToolsMenu");
			var miApp = this.miApp;
			if(miApp) {
				var sepApp = this.miAppSep;
				var hide = !this.pu.pref("ui.showInAppMenu");
				miApp.hidden = hide;
				sepApp.hidden = hide || !this.pu.pref("ui.showAppMenuSeparator");
			}
		}, 50);
		var st = this.status;
		if(st)
			st.hidden = !this.pu.pref("ui.showInStatusbar");
	},
	notify: function(ttl, txt, enabledImg, fnc) {
		var dur = this.pu.pref("notifyOpenTime");
		if(dur < 0)
			 return;
		if(enabledImg === undefined)
			enabledImg = true;
		window.openDialog(
			 "chrome://rightlinks/content/notify.xul",
			 "_blank",
			 "chrome,dialog=1,titlebar=0,popup=1",
			 dur, ttl, txt, enabledImg, fnc
		);
	},

	// Options:
	get popup() {
		delete this.popup;
		return this.popup = document.getElementById("rightLinks-settingsPopup");
	},
	e: function(pref) {
		return this.popup.getElementsByAttribute("rl_pref", pref)[0];
	},
	readPrefs: function() {
		var popup = this.popup;

		// Read preferences
		var closeMenu = this.pu.pref("ui.closeMenu") ? "auto" : "none";
		Array.forEach(
			popup.getElementsByAttribute("rl_pref", "*"),
			function(mi) {
				mi.setAttribute("closemenu", closeMenu);
				this.setPref(mi, true);
			},
			this
		);

		// Disable unsupported for current config options
		var noClosePopups = this.e("enabledOnBookmarks").getAttribute("checked") != "true"
			&& this.e("enabledOnHistoryItems").getAttribute("checked") != "true";

		var noBg = !this.enabledRight || this.pu.pref("loadInWindow");
		this.e("loadInBackground").setAttribute("disabled", noBg);
		this.e("loadJavaScriptLinksInBackground").setAttribute("disabled", noBg);
		this.e("closePopups").setAttribute("disabled", !this.enabledRight || noClosePopups);

		var noBgLeft = !this.enabledLeft || this.pu.pref("loadInWindow.left");
		this.e("loadInBackground.left").setAttribute("disabled", noBgLeft);
		this.e("loadJavaScriptLinksInBackground.left").setAttribute("disabled", noBgLeft);
		this.e("closePopups.left").setAttribute("disabled", !this.enabledLeft || noClosePopups);
		document.getElementById("rightLinks-settings-longLeftClickMenu").setAttribute("disabled", !this.enabledLeft);

		if(!("_optionsCompatibilityChecked" in this)) { // Hide unsupported options
			this._optionsCompatibilityChecked = true;
			this.e("ui.closeMenu").hidden = this.fxVersion < 3; // Attribute "closemenu" doesn't work
			this.e("ui.showInAppMenu").hidden = !this.miApp; // Only in Firefox 4+
		}

		var miCheckedStyle = this.e("ui.toolbarbuttonCheckedStyle");
		miCheckedStyle.hidden = miCheckedStyle.nextSibling.hidden = !this.isElementVisible(this.tbb);

		var miEnabled = this.e("enabled");
		miEnabled.hidden = miEnabled.nextSibling.hidden = !("__rlShowEnabledItem" in popup); // see options.xul
	},
	setPref: function(mi, read) {
		var pName = mi.getAttribute("rl_pref");
		if(!pName)
			throw new Error("[Right Links]: Can't get pref name for \"" + mi.getAttribute("label") + "\"");
		if(read) {
			this.check(mi, this.pu.pref(pName));
			return;
		}
		var enabled = mi.getAttribute("checked") == "true";
		this.pu.pref(pName, enabled);
		if(!enabled) { // Use extensions.rightlinks.enabled to dasable all!
			if(pName == "enabled.right")
				this.pu.pref("enabled.left", true);
			if(pName == "enabled.left")
				this.pu.pref("enabled.right", true);
		}
		if(!this.pu.pref("ui.closeMenu") || pName == "ui.closeMenu")
			this.readPrefs();
	},
	prefsChanged: function(pName, pVal) {
		switch(pName) {
			case "ui.toolbarbuttonCheckedStyle":
			case "enabled":
			case "enabled.right":
			case "enabled.left":
				this.setStatus();
			break;
			case "ui.showInToolsMenu":
			case "ui.showInAppMenu":
			case "ui.showAppMenuSeparator":
			case "ui.showInStatusbar":
				this.setUIVisibility();
		}
	},
	closePrefsMenu: function(e, popup) {
		if(e.button != 2 || !this.pu.pref("ui.closeMenuRightClick"))
			return;
		var pn = popup.triggerNode || document.popupNode; // https://bugzilla.mozilla.org/show_bug.cgi?id=383930
		if(!pn)
			return;
		this.closeMenus(pn);
		popup.hidePopup();
	},

	// Hotkeys:
	registerHotkeys: function() {
		this.pu.prefSvc.getBranch(this.pu.prefNS + "key.")
			.getChildList("", {})
			.forEach(this.registerHotkey, this);
	},
	registerHotkey: function(kId) {
		var keyStr = this.pu.pref("key." + kId);
		if(!keyStr) // Key is disabled
			return;
		var tokens = keyStr.split(" ");
		var key = tokens.pop() || " ";
		var modifiers = tokens.join(",");
		var kElt = document.getElementById("rightLinks-key-" + kId);
		kElt.removeAttribute("disabled");
		kElt.setAttribute(this.hasPrefix(key, "VK_") ? "keycode" : "key", key);
		kElt.setAttribute("modifiers", modifiers);
	}
};
window.addEventListener("load", rightLinks, false);