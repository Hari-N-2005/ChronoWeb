import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import Settings from './components/Settings'
import './App.css'

function App() {
  const [view, setView] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode'
  }, [darkMode])

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Header 
        onViewChange={setView} 
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />
      <main>
        {view === 'dashboard' ? <Dashboard /> : <Settings />}
      </main>
    </div>
  )
}

export default App