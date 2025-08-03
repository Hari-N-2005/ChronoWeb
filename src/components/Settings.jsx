import { useState } from 'react'
import '../assets/styles/settings.css'

const Settings = () => {
  const [resetConfirm, setResetConfirm] = useState(false)

  const handleReset = () => {
    if (resetConfirm) {
      chrome.storage.local.set({ websiteActivity: {} }, () => {
        console.log('Website activity has been reset.');
        setResetConfirm(false);
      });
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000); // Reset after 3 seconds
    }
  }

  return (
    <main className="settings-content">
      <h2>Settings</h2>
      <div className="setting-item">
        <h3>Reset All Tracking Data</h3>
        <p>This action is irreversible and will permanently delete all of your tracked website activity.</p>
        <button 
          onClick={handleReset}
          className={`reset-button ${resetConfirm ? 'confirm' : ''}`}
        >
          {resetConfirm ? 'Click Again to Confirm' : 'Reset All Data'}
        </button>
      </div>
    </main>
  )
}

export default Settings