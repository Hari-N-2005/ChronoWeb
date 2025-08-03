// A more robust background script for tracking website activity accurately.

// Tracking state
let activeTabId = null;
let activeDomain = null;
let startTime = null;
let trackingInterval = null; // The ID of our setInterval timer

// Constants
const HEARTBEAT_INTERVAL_SECONDS = 5;

// --- Core Tracking Logic ---

/**
 * Starts the time tracking interval.
 * Checks if tracking is already running to avoid multiple intervals.
 */
function startTracking() {
  if (trackingInterval) {
    // Already tracking, do nothing.
    return;
  }
  console.log("Starting tracking...");

  // Set start time immediately
  startTime = Date.now();

  trackingInterval = setInterval(() => {
    // This function will be called every few seconds to save the time.
    saveTime();
  }, HEARTBEAT_INTERVAL_SECONDS * 1000);
}

/**
 * Stops the time tracking interval and saves any remaining time.
 */
function stopTracking() {
  if (!trackingInterval) {
    // Already stopped, do nothing.
    return;
  }
  console.log("Stopping tracking...");

  // Save any remaining time since the last heartbeat
  saveTime();

  clearInterval(trackingInterval);
  trackingInterval = null;
  startTime = null;
}

/**
 * Calculates time spent since startTime and saves it to storage.
 * Resets the startTime for the next interval.
 */
function saveTime() {
  if (!startTime || !activeDomain) {
    return;
  }

  const now = Date.now();
  const timeSpentSeconds = Math.floor((now - startTime) / 1000);

  if (timeSpentSeconds > 0) {
    console.log(`Saving ${timeSpentSeconds}s for ${activeDomain}`);
    chrome.storage.local.get(['websiteActivity'], (result) => {
      const activity = result.websiteActivity || {};
      activity[activeDomain] = (activity[activeDomain] || 0) + timeSpentSeconds;
      chrome.storage.local.set({ websiteActivity: activity });
    });
  }

  // Reset start time for the next interval
  startTime = now;
}

// --- Event Handlers ---

/**
 * Handles a change in the active tab.
 * Stops previous tracking and starts new tracking if the tab is valid.
 * @param {chrome.tabs.Tab} tab The new active tab.
 */
function handleTabChange(tab) {
  // Always stop the previous timer before starting a new one
  stopTracking();

  if (tab && tab.id && tab.url) {
    activeTabId = tab.id;
    activeDomain = getDomain(tab.url);

    // If the new domain is valid, start tracking immediately,
    // but only if the window is focused and the user is active.
    // We'll check the state to decide whether to start.
    checkSystemState();
  } else {
    activeTabId = null;
    activeDomain = null;
  }
}

/**
 * Checks the window focus and idle state to determine if tracking should be active.
 */
function checkSystemState() {
    // Set the detection interval to 120 seconds.
    chrome.idle.setDetectionInterval(120);
  chrome.idle.queryState(120, (idleState) => {
    chrome.windows.getCurrent((currentWindow) => {
      // Start tracking only if the user is active and the window is focused.
      if (idleState === 'active' && currentWindow.focused) {
        startTracking();
      } else {
        stopTracking();
      }
    });
  });
}

// --- Utility Functions ---

/**
 * Extracts a clean domain name from a URL.
 * @param {string} url The URL to parse.
 * @returns {string} The extracted domain name.
 */
function getDomain(url) {
  if (!url || !url.startsWith('http')) {
    return 'unknown';
  }
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (e) {
    console.error(`Could not parse URL: ${url}`, e);
    return 'unknown';
  }
}

// --- Chrome API Event Listeners ---

// Fired when the active tab in a window changes.
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
    } else {
        handleTabChange(tab);
    }
  });
});

// Fired when a tab is updated.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // We only care about the active tab, and only when it's finished loading.
    if (tab.active && changeInfo.status === 'complete') {
        handleTabChange(tab);
    }
});

// Fired when the focused window changes.
chrome.windows.onFocusChanged.addListener((windowId) => {
  checkSystemState();
});

// Fired when the user's idle state changes.
chrome.idle.onStateChanged.addListener((newState) => {
  console.log(`Idle state changed to: ${newState}`);
  if (newState === 'active') {
    // User is active again, resume tracking if a window is focused.
    checkSystemState();
  } else {
    // User is idle or screen is locked, pause tracking.
    stopTracking();
  }
});

// --- Initialization ---

// Perform an initial check when the extension starts up.
console.log("Background script loaded.");
// Get the currently active tab to initialize the state.
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
        handleTabChange(tabs[0]);
    }
});
