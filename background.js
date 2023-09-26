
console.log('Loaded');
chrome.tabs.onUpdated.addListener(tabUpdated);

function modifyMyTabs(tab) {
	var a = tab.url.split('-');
	if (a.length == 2 && document.title.startsWith('['))
		document.title = `${a[1]} ${document.title}`;	
}

function groupCallback(groupId) {
	console.log('grouped id:' + groupId);
}

function tabUpdated(tabId, changeInfo, tab) {
	if (changeInfo.url != tab.url) {
		var domain = '';
		if ( tab.url.startsWith("http"))
			domain = (new URL(tab.url)).hostname.replace('www.', '');
		chrome.scripting.executeScript({
			target: { tabId: tabId },
			func: modifyMyTabs,
			args: [tab],
		});
		if (tab.groupId <= 0 && tab.url != "chrome://newtab/") {
			chrome.tabs.query({}, function(tabs) { 
				var groupId = -1;
				for(var i=0; i<tabs.length; i++){
					var tmpDomain = '';
					if ( tabs[i].url.startsWith("http"))
						tmpDomain = (new URL(tabs[i].url)).hostname.replace('www.', '');
					console.log(`tab-${i} , ${tmpDomain} , ${tabs[i].groupId}`);
					if (domain == tmpDomain && tabs[i].groupId > 0)
					{
						groupId = tabs[i].groupId;
						break;
					}					
				}
				if (groupId == -1)
					chrome.tabs.group({ tabIds: [tab.id] }, groupCallback);
				else
					chrome.tabs.group({ groupId: groupId, tabIds: [tab.id] }, groupCallback);
			});									
		}
		console.log('tab changed');
	}		
}
