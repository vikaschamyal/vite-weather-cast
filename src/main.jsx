import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { WeatherProvider } from './contexts/WeatherContext'
import { SettingsProvider } from './contexts/SettingsContext'
import './index.css' // Tailwind entry

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <WeatherProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WeatherProvider>
    </SettingsProvider>
  </React.StrictMode>
)
