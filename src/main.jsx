import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { WeatherProvider } from './contexts/WeatherContext'
import './index.css' // Tailwind entry

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WeatherProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WeatherProvider>
  </React.StrictMode>
)
