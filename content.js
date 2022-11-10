const redScript = document.createElement('script');

redScript.src = chrome.runtime.getURL('src/intercept.js');

document.body.appendChild(redScript);
