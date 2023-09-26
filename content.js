function applyBolding() {
    console.log("Applying bolding effect.");

    if (!window.originalContent) {
        window.originalContent = document.body.innerHTML;
    }

    function makePartialBold(text) {
        return text.replace(/\b(\w{1,2})(\w*)\b/g, '<span style="font-weight: bold;">$1</span>$2');
    }

    function processNode(node, fragment) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.nodeValue.trim() !== "") {
                let newNode = document.createElement("span");
                newNode.innerHTML = makePartialBold(node.nodeValue);
                fragment.appendChild(newNode);
            } else {
                fragment.appendChild(document.createTextNode(node.nodeValue));
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE' && node.nodeName !== 'NOSCRIPT') {
            let newEl = node.cloneNode(false);  // shallow clone
            fragment.appendChild(newEl);
            for (let i = 0; i < node.childNodes.length; i++) {
                processNode(node.childNodes[i], newEl);
            }
        }
    }

    let fragment = document.createDocumentFragment();
    processNode(document.body, fragment);

    // Replace the body's content with the fragment
    document.body.innerHTML = '';
    document.body.appendChild(fragment);
}

function revertBolding() {
    console.log("Reverting bolding effect.");

    if (window.originalContent) {
        document.body.innerHTML = window.originalContent;
    }
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Received message:", request.action);

    if (request.action === 'revertBold') {
        revertBolding();
    } else {
        applyBolding();
    }
});

// Apply bolding immediately upon script injection
applyBolding();
