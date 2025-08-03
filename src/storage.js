// A more robust background script for tracking website activity accurately.

// Tracking state
let activeTabId = null;
let activeDomain = null;
let startTime = null;
let trackingInterval = null; // The ID of our setInterval timer
let isMediaPlaying = false;   // New state for media playback

// Constants
const HEARTBEAT_INTERVAL_SECONDS = 5;

// --- Core Tracking Logic ---

/**
 * Starts the time tracking interval.
 * Checks if tracking is already running to avoid multiple intervals.
 */
function startTracking() {
  if (trackingInterval) {
    return;
  }
  console.log("Starting tracking...");
  startTime = Date.now();
  trackingInterval = setInterval(saveTime, HEARTBEAT_INTERVAL_SECONDS * 1000);
}

/**
 * Stops the time tracking interval and saves any remaining time.
 */
function stopTracking() {
  if (!trackingInterval) {
    return;
  }
  console.log("Stopping tracking...");
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
  startTime = now;
}

// --- Event Handlers ---

/**
 * Handles a change in the active tab.
 * Stops previous tracking and starts new tracking if the tab is valid.
 * @param {chrome.tabs.Tab} tab The new active tab.
 */
function handleTabChange(tab) {
  stopTracking();
  if (tab && tab.id && tab.url) {
    activeTabId = tab.id;
    activeDomain = getDomain(tab.url);
    checkSystemState();
  } else {
    activeTabId = null;
    activeDomain = null;
  }
}

/**
 * Checks window focus, idle state, and media playback to determine if tracking should be active.
 */
function checkSystemState() {
  chrome.idle.queryState(120, (idleState) => {
    chrome.windows.getCurrent((currentWindow) => {
      // Track if (user is active AND window is focused) OR (media is playing).
      const shouldBeTracking = (idleState === 'active' && currentWindow.focused) || isMediaPlaying;

      if (shouldBeTracking) {
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

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (!chrome.runtime.lastError) {
      handleTabChange(tab);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    handleTabChange(tab);
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  checkSystemState();
});

chrome.idle.onStateChanged.addListener((newState) => {
  console.log(`Idle state changed to: ${newState}`);
  checkSystemState(); // Re-evaluate tracking state whenever idle state changes
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'MEDIA_PLAYBACK_STATE') {
    console.log('Received media state:', message.state);
    const wasMediaPlaying = isMediaPlaying;
    isMediaPlaying = message.state === 'PLAYING';

    // If the media state changed, we need to re-evaluate our tracking state.
    if (wasMediaPlaying !== isMediaPlaying) {
      checkSystemState();
    }
  }
});


// --- Initialization ---

// Set the detection interval once when the script starts.
chrome.idle.setDetectionInterval(60);

console.log("Background script loaded.");
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length > 0) {
    handleTabChange(tabs[0]);
  }
});
