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

const contentWidthSlider = document.getElementById("contentWidth");
const contentWidthValue = document.getElementById("contentWidthValue");

// Load the saved content width value and set the slider's position
chrome.storage.sync.get("contentWidth", function(data) {
    contentWidthSlider.value = data.contentWidth || 50; // default to 50 if not set
    contentWidthValue.textContent = contentWidthSlider.value;
});

// Update the displayed value and save to storage when slider is moved
contentWidthSlider.addEventListener("input", function() {
    contentWidthValue.textContent = contentWidthSlider.value;
    chrome.storage.sync.set({"contentWidth": parseInt(contentWidthSlider.value)});
});
