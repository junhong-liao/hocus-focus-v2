document.getElementById("toggleButton").addEventListener("click", function() {
    console.log("Toggle button clicked.");

    chrome.storage.sync.get("isBoldEnabled", function(data) {
        let newState = !data.isBoldEnabled;
        console.log("Setting isBoldEnabled to:", newState);

        chrome.storage.sync.set({"isBoldEnabled": newState}, function() {
            if (newState) {
                console.log("Injecting content.js into the active tab.");
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    let tabId = tabs[0].id;
                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        files: ['content.js']
                    });
                });
            } else {
                console.log("Sending revertBold message to content script.");
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {action: 'revertBold'});
                });
            }
        });
    });
});
