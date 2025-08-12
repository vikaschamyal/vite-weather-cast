import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { WeatherContext } from '../contexts/WeatherContext'
import { FiMapPin } from 'react-icons/fi'

export default function Navbar() {
  const { unit, toggleUnit, fetchWeatherByCoords } = useContext(WeatherContext)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          fetchWeatherByCoords(latitude, longitude)
        },
        (err) => {
          console.error("Error getting location:", err)
        }
      )
    }
  }

  return (
    <header className="w-full sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
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
          <div className="flex items-center space-x-2">
            {/* Unit toggle */}
            <button
              onClick={toggleUnit}
              className="hidden xs:inline-flex px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              °{unit === 'metric' ? 'C' : 'F'}
            </button>

            {/* Current location button */}
            {/* <button
              onClick={handleCurrentLocation}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Use Current Location"
            >
              <FiMapPin className="text-teal-600 dark:text-teal-400" />
            </button> */}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-8 mt-3">
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
