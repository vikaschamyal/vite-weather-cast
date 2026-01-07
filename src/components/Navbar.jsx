import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { WeatherContext } from '../contexts/WeatherContext'
import { useSettings } from '../contexts/SettingsContext'
import { FiSettings } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { unit, toggleUnit } = useContext(WeatherContext)
  const { openSettings } = useSettings()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent"
          >
            WeatherCast
          </Link>

          {/* Right controls */}
          <div className="flex items-center space-x-3">
            {/* Unit toggle */}
            <button
              onClick={toggleUnit}
              className="hidden xs:inline-flex px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              °{unit === 'metric' ? 'C' : 'F'}
            </button>

            {/* Settings button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openSettings}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Settings"
            >
              <FiSettings className="text-gray-700 dark:text-gray-300 text-xl" />
            </motion.button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-8 pb-3">
          <Link
            to="/"
            className={`px-1 py-2 text-sm font-medium transition-colors ${
              isActive('/')
                ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Home
          </Link>
          <Link
            to="/favorites"
            className={`px-1 py-2 text-sm font-medium transition-colors ${
              isActive('/favorites')
                ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Favorites
          </Link>
          <Link
            to="/about"
            className={`px-1 py-2 text-sm font-medium transition-colors ${
              isActive('/about')
                ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            About Us
          </Link>
        </nav>
      </div>
    </header>
  )
}
