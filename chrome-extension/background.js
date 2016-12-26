
const CONTEXT_MENU_ID_FIRE = "a";

function createContextMenus() {
	chrome.contextMenus.create({
		title: "ページ内のセレクトボックスを検索可能にする",
		id: CONTEXT_MENU_ID_FIRE
	});
}

chrome.runtime.onInstalled.addListener(createContextMenus);
chrome.runtime.onStartup.addListener(createContextMenus);

chrome.contextMenus.onClicked.addListener(info => {
	if (info.menuItemId === CONTEXT_MENU_ID_FIRE) {
		chrome.tabs.executeScript({
			frameId: info.frameId,
			file: "/select-box-search.js"
		});
	}
});
