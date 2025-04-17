import '../assets/styles/header.css'
import icon from '/icons/icon48.png' // Adjust path if needed

const Header = ({ onViewChange, darkMode, toggleDarkMode }) => {
  return (
    <header className="app-header-stacked">
      <div className="header-top-row">
        <img src={icon} alt="Tracker Icon" className="header-icon" />
        <h1 className="header-title">Website Tracker</h1>
        <button onClick={toggleDarkMode} className="theme-toggle">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <div className="header-bottom-row">
        <button className="nav-button" onClick={() => onViewChange('dashboard')}>
          Dashboard
        </button>
        <button className="nav-button" onClick={() => onViewChange('settings')}>
          Settings
        </button>
      </div>
    </header>
  )
}

export default Header
