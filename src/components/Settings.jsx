import { useState } from 'react'
import '../assets/styles/settings.css'

const Settings = () => {
  const [resetConfirm, setResetConfirm] = useState(false)

  const handleReset = () => {
    if (resetConfirm) {
      chrome.storage.local.set({ websiteActivity: {} })
      setResetConfirm(false)
    } else {
      setResetConfirm(true)
      setTimeout(() => setResetConfirm(false), 3000)
    }
  }

  return (
    <div className="settings">
      <h2>Settings</h2>
      <div className="setting-item">
        <h3>Reset Tracking Data</h3>
        <p>This will delete all your tracked website data.</p>
        <button 
          onClick={handleReset}
          className={resetConfirm ? 'confirm' : ''}
        >
          {resetConfirm ? 'Click again to confirm' : 'Reset Data'}
        </button>
      </div>
    </div>
  )
}

export default Settings