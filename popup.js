document.getElementById("toggleBoldButton").addEventListener("click", function() {
    console.log("Toggle Bold button clicked.");

    chrome.storage.sync.get("isBoldEnabled", function(data) {
        let newState = !data.isBoldEnabled;
        console.log("Setting isBoldEnabled to:", newState);

        chrome.storage.sync.set({"isBoldEnabled": newState}, function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                let tabId = tabs[0].id;
                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    files: ['content.js']
                });
            });
        });
    });
});

document.getElementById("setContentWidthButton").addEventListener("click", function() {
    console.log("Set Content Width button clicked.");

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const widthPercentage = contentWidthSlider.value;
        chrome.tabs.sendMessage(tabs[0].id, {action: 'setContentWidth', width: widthPercentage});
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
