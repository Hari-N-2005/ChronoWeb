// This script detects active media playback and informs the background script.

let lastPlaybackState = null;

function checkMediaPlayback() {
  const mediaElements = document.querySelectorAll('video, audio');
  let isMediaPlaying = false;

  for (const media of mediaElements) {
    // Check if the media is actually playing and has not ended.
    if (!media.paused && !media.ended && media.currentTime > 0) {
      isMediaPlaying = true;
      break; // Found one, no need to check others.
    }
  }

  const currentPlaybackState = isMediaPlaying ? 'PLAYING' : 'PAUSED';

  // Only send a message if the state has changed to avoid spamming the background script.
  if (currentPlaybackState !== lastPlaybackState) {
    console.log('Media playback state changed:', currentPlaybackState);
    chrome.runtime.sendMessage({ type: 'MEDIA_PLAYBACK_STATE', state: currentPlaybackState });
    lastPlaybackState = currentPlaybackState;
  }
}

// Check for media playback every 2 seconds.
setInterval(checkMediaPlayback, 2000);

console.log('Content script for media detection loaded.');
