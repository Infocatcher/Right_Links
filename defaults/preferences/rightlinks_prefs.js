// Description:
pref("extensions.{B5F5E8D3-AE31-49A1-AC42-78B7B1CC5CDC}.description", "chrome://rightlinks/locale/rl.properties");

pref("extensions.rightlinks.enabled", true);
pref("extensions.rightlinks.enabled.right", true);
pref("extensions.rightlinks.enabled.left", true);
pref("extensions.rightlinks.enabledOnImages", true);
pref("extensions.rightlinks.enabledOnSingleImages", false);
pref("extensions.rightlinks.enabledOnCanvasImages", true);
pref("extensions.rightlinks.enabledOnSpeedDialImages", false);
pref("extensions.rightlinks.enabledOnBookmarks", true);
pref("extensions.rightlinks.enabledOnHistoryItems", true);
pref("extensions.rightlinks.enabledOnCSSEditorLinks", true);
pref("extensions.rightlinks.showContextMenuTimeout", 500);
pref("extensions.rightlinks.longLeftClickTimeout", 500);
pref("extensions.rightlinks.closePopups", true);
pref("extensions.rightlinks.closePopups.left", true);
pref("extensions.rightlinks.disallowMousemoveDist", 14);
pref("extensions.rightlinks.stopMousedownEvent", false); // Only for right-click now
pref("extensions.rightlinks.stopMouseupEvent", true); // Only for left-click now
pref("extensions.rightlinks.fakeMouseup", true); // Dispatch fake event to stop mouse gestures
pref("extensions.rightlinks.fakeMouseup.content", true); // Allow dispatch fake event in content document
pref("extensions.rightlinks.workaroundForMousedownImitation", true);
pref("extensions.rightlinks.dontUseTabsInPopupWindows", true);

pref("extensions.rightlinks.loadInBackground", true);
pref("extensions.rightlinks.loadInBackground.left", false);
pref("extensions.rightlinks.loadJavaScriptLinksInBackground", false);
pref("extensions.rightlinks.loadJavaScriptLinksInBackground.left", false);
pref("extensions.rightlinks.loadJavaScriptLinks", true);
pref("extensions.rightlinks.loadVoidLinksWithHandlers", true);

pref("extensions.rightlinks.loadInWindow", false);
pref("extensions.rightlinks.loadInWindow.left", false);

pref("extensions.rightlinks.notifyJavaScriptLinks", true);
pref("extensions.rightlinks.notifyVoidLinksWithHandlers", true);
pref("extensions.rightlinks.notifyOpenTime", 3000);

pref("extensions.rightlinks.sendReferer", true);
pref("extensions.rightlinks.filesLinksMask", "^[^?&=#]+\.(?:zip|rar|7z|gz|tar|bz2|iso|cab|exe|msi|msu|xpi|jar)$");
pref("extensions.rightlinks.filesLinksPolicy", 0);
// 0 - don't check
// 1 - open link in current tab
// 2 - show context menu
// 3 - copy link location

pref("extensions.rightlinks.key.toggleStatus", "VK_F2");
pref("extensions.rightlinks.key.showSettingsPopup", "alt VK_F2");

pref("extensions.rightlinks.ui.showInToolsMenu", true);
pref("extensions.rightlinks.ui.showInAppMenu", true);
pref("extensions.rightlinks.ui.showAppMenuSeparator", false);
pref("extensions.rightlinks.ui.showInStatusbar", true);
pref("extensions.rightlinks.ui.toolbarbuttonCheckedStyle", true);
pref("extensions.rightlinks.ui.closeMenu", false);
pref("extensions.rightlinks.ui.closeMenuRightClick", false);

pref("extensions.rightlinks.prefsVersion", 0);