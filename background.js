
console.log('Loaded');
chrome.tabs.onUpdated.addListener(tabUpdated);
const groupsArray = [];

function modifyMyTabs(tab) {
	var a = tab.url.split('-');
	if (a.length == 2 && document.title.startsWith('['))
		document.title = `${a[1]} ${document.title}`;	
}
var domain = '';
function groupCallback(groupId) {
	console.log('group:' + groupId);
	groupsArray[domain] = groupId;
}

function tabUpdated(tabId, changeInfo, tab) {
	if (changeInfo.url != tab.url) {
		domain = (new URL(tab.url)).hostname.replace('www.', '');
		chrome.scripting.executeScript({
			target: { tabId: tabId },
			func: modifyMyTabs,
			args: [tab],
		});
		if (tab.groupId <= 0 && tab.url != "chrome://newtab/") {
			if (groupsArray[domain] == undefined)
				chrome.tabs.group({ tabIds: [tab.id] }, groupCallback);
			else
				chrome.tabs.group({ groupId: groupsArray[domain], tabIds: [tab.id] }, groupCallback);
			
			
		}
		console.log('changed');
		console.log(tab);
	}		
}
