(()=>{"use strict";for(const e of["js/vendor.js","js/injected_script.js"]){const t=document.createElement("script");t.src=chrome.runtime.getURL(e),document.documentElement.appendChild(t)}const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href",chrome.runtime.getURL("styles.css")),document.documentElement.appendChild(e)})();