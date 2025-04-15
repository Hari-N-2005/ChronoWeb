import '../assets/styles/header.css'

const Header = ({ onViewChange, darkMode, toggleDarkMode }) => {
  return (
    <header className="app-header">
      <h1>Website Tracker</h1>
      <nav>
        <button onClick={() => onViewChange('dashboard')}>Dashboard</button>
        <button onClick={() => onViewChange('settings')}>Settings</button>
        <button onClick={toggleDarkMode} className="theme-toggle">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  )
}

export default Header