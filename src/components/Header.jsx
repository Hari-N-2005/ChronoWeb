import '../assets/styles/header.css'
import icon from '/icons/icon48.png'

const Header = ({ onViewChange, darkMode, toggleDarkMode }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <img src={icon} alt="ChronoWeb Icon" className="header-icon" />
        <h1 className="header-title">ChronoWeb</h1>
        <div className="header-actions">
          <button className="nav-button" onClick={() => onViewChange('dashboard')}>
            Dashboard
          </button>
          <button className="nav-button" onClick={() => onViewChange('settings')}>
            Settings
          </button>
          <button onClick={toggleDarkMode} className="theme-toggle" title="Toggle theme">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
