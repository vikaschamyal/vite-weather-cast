import React, { useContext, useState, Suspense, lazy, useCallback } from 'react'
import { WeatherContext } from '../contexts/WeatherContext'
import CurrentWeather from '../components/CurrentWeather'
import DailyForecast from '../components/DailyForecast'
import HourlyForecast from '../components/HourlyForecast'
import AirQuality from '../components/AirQuality'
import WeatherAlerts from '../components/WeatherAlerts'
import WeatherBackground from '../components/WeatherBackground'
import SkeletonLoader from '../components/SkeletonLoader'
import SearchBar from '../components/SearchBar'
import { motion } from 'framer-motion'
import { FiMap } from 'react-icons/fi'

// Lazy load heavy components
const MapView = lazy(() => import('../components/MapView'))

export default function Home() {
  const { 
    loading, 
    error, 
    weatherData, 
    forecastData,
    airQuality,
    alerts,
    fetchWeather, 
    fetchWeatherByCoords 
  } = useContext(WeatherContext)
  const [hasSearched, setHasSearched] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const handleSearch = useCallback((city) => {
    if (city) {
      fetchWeather(city)
      setHasSearched(true)
    }
  }, [fetchWeather])

  const handleCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          fetchWeatherByCoords(latitude, longitude)
          setHasSearched(true)
        },
        (err) => {
          console.error("Error getting location:", err)
        }
      )
    }
  }, [fetchWeatherByCoords])

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Background */}
      <WeatherBackground weatherData={weatherData} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header with Search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 mb-8"
        >
          <div className="flex-1 w-full max-w-2xl">
            <SearchBar onSearch={handleSearch} onLocationClick={handleCurrentLocation} />
          </div>
        </motion.div>

        {/* Welcome Message */}
        {!hasSearched && !weatherData && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center min-h-[60vh] justify-center"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white dark:text-white mb-6 drop-shadow-2xl"
            >
              Welcome to WeatherCast
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 dark:text-gray-200 max-w-3xl drop-shadow-lg"
            >
              Get real-time weather updates, air quality data, and detailed forecasts for any city in the world.
            </motion.p>
          </motion.div>
        )}

        {/* Loading State with Skeleton */}
        {loading && (
          <div className="space-y-8">
            <SkeletonLoader type="current" />
            <SkeletonLoader type="hourly" count={1} />
            <SkeletonLoader type="card" count={2} />
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-red-200 dark:border-red-800 max-w-2xl mx-auto"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Error loading weather data
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
                >
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Weather Content */}
        {weatherData && hasSearched && !loading && !error && (
          <div className="space-y-8 md:space-y-10">
            {/* Current Weather */}
            <CurrentWeather />

            {/* Weather Alerts */}
            {alerts && alerts.length > 0 && (
              <WeatherAlerts alerts={alerts} />
            )}

            {/* Hourly Forecast */}
            {forecastData && (
              <HourlyForecast forecastData={forecastData} />
            )}

            {/* Daily Forecast */}
            {forecastData && (
              <DailyForecast />
            )}

            {/* Air Quality */}
            {airQuality && (
              <AirQuality airQuality={airQuality} />
            )}

            {/* Map View Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    Interactive Map
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View weather on an interactive map
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-gray-900 dark:text-white rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 font-semibold shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <FiMap className="text-lg" />
                  {showMap ? 'Hide Map' : 'Show Map'}
                </motion.button>
              </div>

              {/* Lazy Loaded Map */}
              {showMap && (
                <Suspense
                  fallback={
                    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                          <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <MapView weatherData={weatherData} forecastData={forecastData} />
                </Suspense>
              )}
            </motion.section>
          </div>
        )}
      </div>
    </div>
  )
}
