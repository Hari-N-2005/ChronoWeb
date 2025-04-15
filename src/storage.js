// Background script to track website activity
let activeTab = null
let startTime = null
let currentDomain = null

// Listen for tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    updateActiveTab(tab)
  })
})

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    updateActiveTab(tab)
  }
})

// Update the active tab and track time
function updateActiveTab(tab) {
  const now = Date.now()
  
  if (activeTab && startTime && currentDomain) {
    const timeSpent = Math.floor((now - startTime) / 1000) // in seconds
    
    if (timeSpent > 0) {
      chrome.storage.local.get(['websiteActivity'], result => {
        const activity = result.websiteActivity || {}
        activity[currentDomain] = (activity[currentDomain] || 0) + timeSpent
        
        chrome.storage.local.set({ websiteActivity: activity })
      })
    }
  }
  
  // Update to new tab
  activeTab = tab.id
  startTime = now
  currentDomain = getDomain(tab.url)
}

// Extract domain from URL
function getDomain(url) {
  if (!url) return 'unknown'
  try {
    const domain = new URL(url).hostname.replace('www.', '')
    return domain || 'unknown'
  } catch {
    return 'unknown'
  }
}

// Set up periodic save in case extension is closed
chrome.alarms.create('saveActivity', { periodInMinutes: 1 })
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'saveActivity' && activeTab && startTime && currentDomain) {
    const now = Date.now()
    const timeSpent = Math.floor((now - startTime) / 1000)
    
    if (timeSpent > 0) {
      chrome.storage.local.get(['websiteActivity'], result => {
        const activity = result.websiteActivity || {}
        activity[currentDomain] = (activity[currentDomain] || 0) + timeSpent
        
        chrome.storage.local.set({ websiteActivity: activity })
        startTime = now // Reset the timer
      })
    }
  }
})