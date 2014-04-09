#### Right Links: Changelog

`+` – added<br>
`-` – deleted<br>
`x` – fixed<br>
`*` – improved<br>

##### master/HEAD
`x` Fixed: long left-click opens not actual link, if it was changed (<a href="https://github.com/Infocatcher/Right_Links/issues/9">#9</a>).<br>
`+` Added support for <a href="https://addons.mozilla.org/addon/feed-sidebar/">Feed Sidebar</a> extension (<a href="https://github.com/Infocatcher/Right_Links/issues/12">#12</a>).<br>
`+` Added support for App button from <a href="https://addons.mozilla.org/addon/classicthemerestorer/">Classic Theme Restorer</a> extension in Firefox 29+ (Australis).<br>

##### 0.3.8.3 (2014-02-09)
`x` Fixed conflict with <a href="https://addons.mozilla.org/addon/informenter/">InFormEnter</a> extension: icons after text fields isn't clickable (<a href="https://github.com/Infocatcher/Right_Links/issues/4">#4</a>).<br>
`*` Slightly improved startup performance.<br>
`x` Fixed detection of XUL links in Firefox 26+ (<a href="https://github.com/Infocatcher/Right_Links/issues/5">#5</a>).<br>
`x` Fixed detection of links from CSS Inspector in Firefox 22+ (<a href="https://github.com/Infocatcher/Right_Links/issues/6">#6</a>).<br>
`x` Correctly select first menu item, if options menu was opened from keyboard (Alt+F2 by default) in Firefox 25+.<br>
`+` Added support for any tree with bookmarks/history items (<a href="https://github.com/Infocatcher/Right_Links/issues/7">#7</a>).<br>
`+` Added support for history menu inside Australis menu-button.<br>
`x` Fixed detection of “Open …” menu items in RSS bookmarks in Firefox 4+.<br>

##### 0.3.8.2 (2013-08-22)
`*` No longer use <a href="https://developer.mozilla.org/en-US/docs/Extensions/Updating_extensions_for_Firefox_4#XPI_unpacking">internal JAR archive</a>.<br>
`x` Fixed: real links, that looks like dummy, may be opened in current tab (<a href="https://github.com/Infocatcher/Right_Links/issues/1">#1</a>).<br>
`x` Fixed: tabs isn't clickable after opening of any link with click handlers (<em>extensions.rightlinks.workaroundForMousedownImitation</em> preference) (<a href="https://github.com/Infocatcher/Right_Links/issues/2">#2</a>).<br>

##### 0.3.8.1 (2013-04-14)
`*` Improved: don't use tabs in popup windows (as Firefox itself) (<em>extensions.rightlinks.dontUseTabsInPopupWindows</em> preference).<br>
`*` Use "dragstart" event instead of deprecated "draggesture" (if available).<br>
`*` Improved: stop "dragstart" event after long left-click.<br>
`*` Correct position of item in Tools menu in latest Firefox Nightly.<br>
`+` Now you can use <em>extensions.rightlinks.filesLinksPolicy</em> = 3 to copy link location.<br>
`x` Workaround for fake "mousedown" event in <a href="https://addons.mozilla.org/firefox/addon/budaneki/">budaneki</a> extension.<br>

##### 0.3.8 (2013-01-04)
`*` Improved mechanism of temporary disabling: now disabled extension handles only necessary minimum of the events.<br>
`x` Fixed opening links using "long" left-click when used extensions for mouse gestures.<br>
`*` Click handling now stops after mouse wheel (for compatibility with mouse gestures).<br>
`+` Added calling of browser API for security checks before load of any link.<br>
`*` Small internal improvements and optimizations.<br>

##### 0.3.7.2 (2012-09-10)
`x` Fixed incompatibility of "long" left-click feature with <a href="https://addons.mozilla.org/firefox/addon/budaneki/">budaneki</a> extension.<br>

##### 0.3.7.1 (2012-09-03)
`x` Fixed: preference <em>extensions.rightlinks.ui.toolbarbuttonCheckedStyle</em> doesn't work for recently added toolbar button.<br>

##### 0.3.7 (2012-09-03)
`+` Added possibility to open links using "long" left-click.<br>
`+` Added hidden preferences to open links in new windows (<em>extensions.rightlinks.loadInWindow</em> and <em>extensions.rightlinks.loadInWindow.left</em>).<br>
`*` Improved compatibility with mouse gestures when switching tabs.<br>
`x` Fixed preference <em>extensions.rightlinks.ui.closeMenuRightClick</em> in Firefox 16.0a1 (in addition to closing the menu, checkboxes is also switched).<br>
`+` Added Alt+F2 hotkey to open options menu (preference <em>extensions.rightlinks.key.showSettingsPopup</em>).<br>
`+` Added detection links in CSS-rules inspector (Tools – Web Developer – Inspect – Style) and hidden preference <em>extensions.rightlinks.enabledOnCSSEditorLinks</em>.<br>
`+` Added detection links in Web Console (Tools – Web Developer – Web Console).<br>
`x` Fixed toolbar button appearance with enabled <em>extensions.rightlinks.ui.toolbarbuttonCheckedStyle</em> preference.<br>

##### 0.3.6.3 (2012-04-09)
`x` Fixed opening JavaScript-links with unchecked "Load JavaScript-links (javascript: …)" (regression of version 0.3.6.1pre2).<br>

##### 0.3.6.2 (2012-04-09)
`x` Fixed opening JavaScript-links (javascript:...) in background.<br>

##### 0.3.6.1 (2012-04-03)
`x` Fixed handling of links like site.com/#!... on JavaScript-based sites (e.g. http://twitter.com/).<br>

##### 0.3.6.1pre3 (2012-01-27)
`*` Slightly optimized code for reading and writing preferences.<br>
`*` Checkbox "Enabled" are displayed only when you open options menu from Add-ons Manager (in any other case just click on the menu item or button to enable/disable).<br>
`*` Small code improvements.<br>

##### 0.3.6 (2012-01-07)
`+` Added "standard" settings (available in Add-ons Manager).<br>
`+` Added "Enabled" checkbox to options menu.<br>

##### 0.3.5.4pre11 (2011-08-09)
`+` Added XUL-links support (e.g., in Error console, if it will be opened in sidebar).<br>
`+` Added test support for <a href="https://addons.mozilla.org/firefox/addon/firebug/">Firebug</a> links.<br>
`+` Added option to disable closing options menu via Right-click (by default menu aren't close anymore).<br>
`x` Removed white spot in 16x16 icon (for dark themes).<br>
`+` Detection images in <a href="https://addons.mozilla.org/firefox/addon/speed-dial/">Speed Dial</a> page will be disabled (preference <em>extensions.rightlinks.enabledOnSpeedDialImages</em>).<br>
`+` Added menu item Firefox – Options (only Firefox 4 and heighter).<br>
`x` Fixed context menu suppression with installed <a href="https://addons.mozilla.org/firefox/addon/righttoclick/">RightToClick</a> extension.<br>

##### 0.3.5.4pre2 (2010-07-23)
`+` Added hidden preference <em>extensions.rightlinks.enabledOnSingleImages</em> to disable click handling on separately opened images.<br>

##### 0.3.5.4pre1 (2010-07-17)
`+` If installed <a href="https://addons.mozilla.org/firefox/addon/5447/">Tab Kit</a> extension, links (but not bookmarks) will be opened in child tabs.<br>

##### 0.3.5.3 (2010-07-13)
`x` Fixed bookmarks and history items detection in Firefox 3.7a5pre+.<br>
`+` Added possibility to completely disable stopping click handling after mouse moving (<em>extensions.rightlinks.disallowMousemoveDist</em> must be -1).<br>
`*` Small code improvements.<br>
`+` Added support for handling clicks on images.<br>

##### 0.3.5.2 (2010-02-12)
`*` Context menu showing prevention method is improved.<br>

##### 0.3.5.1 (2010-02-08)
`+` Added possibility to disable closing of settings menu after click (preference <em>extensions.rightlinks.ui.closeMenu</em>), by default menu are not closing. Firefox 3.0+ only.<br>
`x` Fixed wrong context menu (it's was showing for link, not for clicked item).<br>

##### 0.3.5.0 (2010-01-25)
`*` Pop-up message after status changing appears only if all controls are hidden.<br>
`+` Added updating of button state in toolbarpalette.<br>
`*` Preference <em>extensions.rightlinks.hideBookmarksPopup</em> are renamed to <em>extensions.rightlinks.closePopups</em>.<br>
`+` Fixed detection of links like `<area href="http://..." />`.<br>
`x` Fixed removing of event handlers (regression of version 0.3.5.0b2).<br>
`+` Added context menu item for customize button appearance (preference <em>extensions.rightlinks.ui.toolbarbuttonCheckedStyle</em>).<br>

##### 0.3.5.0b3 (2009-11-12)
`*` Own service for preferences reading/writing is used instead of chrome://global/content/nsUserSettings.js.<br>
`*` Added preferences caching for performance improving.<br>
`*` Names of preferences are renamed from rightlinks.* to extensions.rightlinks.*.<br>
`*` Preference <em>rightlinks.hideItemsMode</em> is replaced with two separated – <em>extensions.rightlinks.ui.showInStatusbar</em> and <em>extensions.rightlinks.ui.showInToolsMenu</em>.<br>
`*` Preference <em>rightlinks.keyModifiers</em> and <em>rightlinks.keyValue</em> are replaced with one – <em>extensions.rightlinks.key.toggleStatus</em>, using syntax like <a href="http://adblockplus.org/en/preferences#sidebar_key">Adblock Plus</a> extension.<br>
`*` Preference <em>rightlinks.toolbarbuttonCheckedStyle</em> are renamed to <em>extensions.rightlinks.ui.toolbarbuttonCheckedStyle</em>.<br>
`*` Improved default value of preference <em>extensions.rightlinks.filesLinksMask</em>.<br>
`*` Small code optimization.<br>
`+` Added support for SeaMonkey 2.0.<br>
`x` Corrected opening of JavaScript-links (javascript: ...) in Firefox 3.7a1pre.<br>

##### 0.3.5.0b2 (2009-08-13)
`**` Method for prevention of context menu opening is improved.<br>
`**` Emulation of mouse clicks is used for context menu showing (sequence of events "mousedown", "mouseup", "contextmenu").<br>
`x` Fixed showing context menu after delay in Linux.<br>
`+` Added preference <em>rightlinks.loadVoidLinksWithHandlers</em> for allowing opening links with click handlers.<br>
`+` Added preference <em>rightlinks.disallowMousemoveDist</em> – maximum distance of moving mouse with held right button.<br>
`*` Context menu always shown at mouse pointer.<br>
`*` Pop-up message is shown over Status Bar.<br>
`+` Added test support for handling clicks on links like `<a href="">`, `<a href="#">`, `<a href="#nonexistentAnchor">`.<br>

##### 0.3.5.0b1 (2009-08-09)
`+` Added support for <a href="http://en.wikipedia.org/wiki/XLink">XLink</a>.<br>
`+` Experimental support for links from bookmarks and history sidebar, based on code of <a href="https://addons.mozilla.org/firefox/addon/7314">Places' Tooltips</a> extension, only Firefox 3.0+.<br>
`+` Option for disabling handling clicks on history items.<br>
`+` Preference <em>rightlinks.toolbarbuttonCheckedStyle</em> for disabling "checked" style of toolbar button.<br>
`*` Better click emulation on JavaScript-links.<br>

##### 0.3.1.1 (2008-11-22)
`x` Fixed strange bug with dragging links to bookmarks.<br>

##### 0.3.1.0 (2008-09-14)
`+` Added GUI for some settings (see context menu of any item from Right Links).<br>
`+` The <em>rightlinks.enabledOnBookmarks</em> preference for toggle handling of bookmarks.<br>

##### 0.3.0.0 (2008-08-17)
`+` Showing of the context menu through 500 ms if the mouse button has been not released (it is configurable with <em>rightlinks.showContextMenuTimeout</em>, -1 disable showing).<br>
In Firefox 3.0+ context menu will be shown and in previous versions link will blink once.<br>
`x` Fixed opening links like javascript: window.open( ... );<br>
`*` Icon of pop-up message is changed and depends now on an extension status (it will be visible if icon in status bar and button on toolbar are not used).<br>
`+` Added <em>rightlinks.loadJavaScriptLinksInBackground</em> setting for opening JavaScript-links in background tab.<br>
`x` Fixed sending of referer for documents with frames.<br>

##### 0.2.0.2 (2008-07-13)
`x` Fixed small bug in en-US locale.<br>
`x` Fixed opening of JavaScript-bookmarks (bookmarklets).<br>

##### 0.2.0.1 (2008-07-06)
`*` The <em>rightlinks.checkForFilesLinks</em> preference was changed on <em>rightlinks.filesLinksPolicy</em>:<br>
0 – not check links (corresponds to the old <em>rightlinks.checkForFilesLinks</em> = false)<br>
1 – open links to files in current tab (corresponds to the old <em>rightlinks.checkForFilesLinks</em> = true)<br>
2 – disable Right Links on these links (show context menu)<br>
`*` Improved detection of the "void" links.<br>

##### 0.2.0.0 (2008-06-25)
`+` Added intercepting of right-clicks on bookmarks (like links).<br>
`x` The <em>rightlinks.sendReferrer</em> preference has been renamed on <em>rightlinks.sendReferer</em> (see http://en.wikipedia.org/wiki/HTTP_referer) – be careful!<br>
`+` The <em>rightlinks.hideBookmarksPopup</em> preference (not hide pop-up menu after bookmark opening, if false).<br>
`+` If <a href="https://addons.mozilla.org/ru/firefox/addon/5890">Tree Style Tab</a> extension is available, then links (but not bookmarks) will be open in child tabs.<br>
`+` Added compatibility with <a href="https://addons.mozilla.org/ru/firefox/addon/4086">Highlander</a> extension.<br>
`+` Left-click is imitated for the "void" links with onClick, onMouseDown or onMouseUp-handlers.<br>
`+` The <em>rightlinks.notifyVoidLinksWithHandlers</em> preference – show pop-up message after click on "void" links with handlers.<br>
`+` The <em>rightlinks.checkForFilesLinks</em> preference – for opening links to files (the <em>rightlinks.filesLinksMask</em> preference) in current tab.<br>
`*` Default hotkey changed to F2 (in Firefox 3.0 works Ctrl+Shift+? [Shift+/ = ?], and Ctrl+Shift+/ in previous versions) – be careful!<br>

##### 0.1.3.1 (2008-04-28)
`+` Added toolbar button.<br>

##### 0.1.3.0 (2008-04-28)
`*` Now only hotkey change require restart (added preferences observer).<br>

##### 0.1.2.3 beta (2008-04-25)
`+` Added icon in status bar to switch on/off.<br>
`+` Added <em>rightlinks.toggleItemsMode</em> preference: 0 – show all, 1 – hide all, 2 – hide item in menu, 3 – hide item in status bar.<br>

##### 0.1.2.2 (2008-04-05)
`*` Code testing and checking.<br>

##### 0.1.2.1 (2008-03-31)
`*` Improved work with context menu in Linux (with <em>rightlinks.debug</em> = true).<br>

##### 0.1.1.0 (2008-03-22)
`*` Own code for pop-up message (works in Linux).<br>
`*` Changed default keyboard shortcut from Ctrl+Shift+L to Ctrl+Shift+/ (<em>rightlinks.keyValue</em> and <em>rightlinks.keyModifiers</em> preferences).<br>

##### 0.1.0.0 (2008-03-22)
`*` Extension now works for all links in main browser window (including sidebar, panels of Split Browser or Split Pannel extensions).<br>
`*` Improved getting link method.<br>
`x` JavaScript-links now works in frames.<br>

##### 0.0.2.4 (2008-02-16)
`*` Slightly improved way to detect `<a>` tag.<br>

##### 0.0.2.3 (2008-02-03)
`*` Repackaging (4,4 kb instead of 5,2 kb).<br>
`x` Created .jar file structure to prevent security issues created by Firefox bug <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=413250">#413250</a>.<br>

##### 0.0.2.2 (2007-11-13)
`+` Added localisation possibility (include two locales – en-US and ru).<br>
`+` <em>rightlinks.sendReferrer</em> – send referrer, if true.<br>

##### 0.0.2.1 (2007-11-10)
`*` Small correction of code<br>
`+` Added new <em>rightlinks.loadInBackground</em> preference:<br>
true – open new tabs in background<br>
false – switch to new tabs<br>