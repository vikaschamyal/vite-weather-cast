import React, { memo, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiBell, FiGlobe, FiThermometer, FiWind } from 'react-icons/fi'
import { useContext } from 'react'
import { WeatherContext } from '../contexts/WeatherContext'
import { useSettings } from '../contexts/SettingsContext'
import notificationService from '../services/notifications'

const Settings = memo(() => {
  const { settings, updateSettings, toggleUnit, unit, darkMode, toggleDarkMode, apiKeys } = useContext(WeatherContext)
  const { isSettingsOpen, closeSettings } = useSettings()
  const [tempThreshold, setTempThreshold] = useState(settings.temperatureThreshold || '')
  const [aqiThreshold, setAqiThreshold] = useState(settings.aqiThreshold || 100)

  // Update local state when settings change
  useEffect(() => {
    setTempThreshold(settings.temperatureThreshold || '')
    setAqiThreshold(settings.aqiThreshold || 100)
  }, [settings])

  const handleNotificationsToggle = useCallback(async () => {
    const newValue = !settings.notificationsEnabled
    updateSettings({ notificationsEnabled: newValue })
    
    if (newValue) {
      const granted = await notificationService.requestPermission()
      if (!granted) {
        updateSettings({ notificationsEnabled: false })
        alert('Notification permission denied. Please enable it in your browser settings.')
      }
    }
  }, [settings.notificationsEnabled, updateSettings])

  const handleSaveThresholds = useCallback(() => {
    updateSettings({
      temperatureThreshold: tempThreshold ? Number(tempThreshold) : null,
      aqiThreshold: Number(aqiThreshold)
    })
    closeSettings()
  }, [tempThreshold, aqiThreshold, updateSettings, closeSettings])

  const handleProviderChange = useCallback((provider) => {
    const apiKey = apiKeys[provider]
    if (!apiKey) {
      alert(`API key for ${provider} is not configured. Please add it to your .env file.`)
      return
    }
    updateSettings({ apiProvider: provider })
  }, [apiKeys, updateSettings])

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiGlobe />
                  Settings
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeSettings}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <FiX className="text-gray-600 dark:text-gray-400 text-xl" />
                </motion.button>
              </div>

              <div className="space-y-6">
                {/* API Provider */}
                <SettingSection title="Weather API Provider" icon={<FiGlobe />}>
                  <div className="space-y-2">
                    {['openweather', 'accuweather', 'google'].map((provider) => {
                      const hasKey = !!apiKeys[provider]
                      return (
                        <label
                          key={provider}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            settings.apiProvider === provider
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          } ${!hasKey ? 'opacity-50' : ''}`}
                        >
                          <input
                            type="radio"
                            name="provider"
                            value={provider}
                            checked={settings.apiProvider === provider}
                            onChange={() => handleProviderChange(provider)}
                            disabled={!hasKey}
                            className="text-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white capitalize">
                              {provider === 'openweather' ? 'OpenWeatherMap' : provider}
                            </div>
                            {!hasKey && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                API key not configured
                              </div>
                            )}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </SettingSection>

                {/* Temperature Unit */}
                <SettingSection title="Temperature Unit" icon={<FiThermometer />}>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleUnit}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        unit === 'metric'
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      °C
                    </button>
                    <button
                      onClick={toggleUnit}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        unit === 'imperial'
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      °F
                    </button>
                  </div>
                </SettingSection>

                {/* Dark Mode */}
                <SettingSection title="Theme">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Dark Mode</span>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        darkMode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <motion.div
                        animate={{ x: darkMode ? 28 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                      />
                    </button>
                  </label>
                </SettingSection>

                {/* Notifications */}
                <SettingSection title="Notifications" icon={<FiBell />}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Enable Notifications</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Get alerts for severe weather and high AQI
                      </div>
                    </div>
                    <button
                      onClick={handleNotificationsToggle}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        settings.notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <motion.div
                        animate={{ x: settings.notificationsEnabled ? 28 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                      />
                    </button>
                  </label>
                </SettingSection>

                {/* Temperature Threshold */}
                <SettingSection title="Temperature Alert" icon={<FiThermometer />}>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={tempThreshold}
                      onChange={(e) => setTempThreshold(e.target.value)}
                      placeholder="Set temperature threshold"
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Get notified when temperature exceeds this value
                    </div>
                  </div>
                </SettingSection>

                {/* AQI Threshold */}
                <SettingSection title="Air Quality Alert" icon={<FiWind />}>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={aqiThreshold}
                      onChange={(e) => setAqiThreshold(e.target.value)}
                      min="1"
                      max="5"
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Get notified when AQI reaches this level (1-5)
                    </div>
                  </div>
                </SettingSection>

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveThresholds}
                  className="w-full py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg"
                >
                  Save Settings
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
})

Settings.displayName = 'Settings'

const SettingSection = memo(({ title, icon, children }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        {icon}
        {title}
      </div>
      {children}
    </div>
  )
})

SettingSection.displayName = 'SettingSection'

export default Settings
