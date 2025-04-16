// Background script to track website activity
let activeTab = null;
let startTime = null;
let currentDomain = null;
let popupWindowId = null;
let intervalId = null; // Heartbeat timer

// Listen for tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    updateActiveTab(tab);
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    updateActiveTab(tab);
  }
});

// Listen for focus changes to ensure popup stays focused
chrome.windows?.onFocusChanged?.addListener((windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE && popupWindowId === windowId) {
    chrome.windows.update(windowId, { focused: true });
  } else if (windowId === chrome.windows.WINDOW_ID_NONE) {
    clearInterval(intervalId); // Stop tracking if window is unfocused
  }
});

// Listen for popup connections
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    port.onDisconnect.addListener(() => {
      popupWindowId = null;
    });

    chrome.windows.getCurrent((window) => {
      popupWindowId = window.id;
    });
  }
});

// Update the active tab and track time
function updateActiveTab(tab) {
  const now = Date.now();

  if (activeTab && startTime && currentDomain) {
    const timeSpent = Math.floor((now - startTime) / 1000);

    if (timeSpent > 0) {
      chrome.storage.local.get(['websiteActivity'], result => {
        const activity = result.websiteActivity || {};
        activity[currentDomain] = (activity[currentDomain] || 0) + timeSpent;

        chrome.storage.local.set({ websiteActivity: activity });
      });
    }
  }

  activeTab = tab.id;
  startTime = now;
  currentDomain = getDomain(tab.url);

  startTracking(); // Start the heartbeat timer
}

// Extract domain from URL
function getDomain(url) {
  if (!url) return 'unknown';
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain || 'unknown';
  } catch {
    return 'unknown';
  }
}

// Start continuous tracking (heartbeat every 5 seconds)
function startTracking() {
  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(() => {
    if (!activeTab || !currentDomain || !startTime) return;

    const now = Date.now();
    const timeSpent = Math.floor((now - startTime) / 1000);

    if (timeSpent > 0) {
      chrome.storage.local.get(['websiteActivity'], result => {
        const activity = result.websiteActivity || {};
        activity[currentDomain] = (activity[currentDomain] || 0) + timeSpent;
        chrome.storage.local.set({ websiteActivity: activity });
        startTime = now; // reset
      });
    }
  }, 5000); // Every 5 seconds
}

// Backup interval via chrome.alarms every 1 minute
chrome.alarms.create('saveActivity', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'saveActivity' && activeTab && startTime && currentDomain) {
    const now = Date.now();
    const timeSpent = Math.floor((now - startTime) / 1000);

    if (timeSpent > 0) {
      chrome.storage.local.get(['websiteActivity'], result => {
        const activity = result.websiteActivity || {};
        activity[currentDomain] = (activity[currentDomain] || 0) + timeSpent;
        chrome.storage.local.set({ websiteActivity: activity });
        startTime = now;
      });
    }
  }
});
