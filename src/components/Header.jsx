import '../assets/styles/header.css'

const Header = ({ onViewChange, darkMode, toggleDarkMode }) => {
  return (
    <header className="app-header clean-header">
      <div className="header-title">Website Tracker</div>
      <div className="header-actions">
        <button className="nav-button" onClick={() => onViewChange('dashboard')}>
          Dashboard
        </button>
        <button className="nav-button" onClick={() => onViewChange('settings')}>
          Settings
        </button>
        <button onClick={toggleDarkMode} className="theme-toggle">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}

export default Header
