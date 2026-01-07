import { createContext, useState, useContext } from 'react'

const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const openSettings = () => setIsSettingsOpen(true)
  const closeSettings = () => setIsSettingsOpen(false)

  return (
    <SettingsContext.Provider value={{ isSettingsOpen, openSettings, closeSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}

