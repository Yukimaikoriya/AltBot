chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log("background.js start");
    if (tab.url && tab.url.includes("mastodon.social/home")) {
        console.log("In Home Tab");
        
        console.log("Sending NEW to content Script");
        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
        });
    }
});