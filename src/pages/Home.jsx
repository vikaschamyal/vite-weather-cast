import React, { useContext, useState } from 'react'
import { WeatherContext } from '../contexts/WeatherContext'
import CurrentWeather from '../components/CurrentWeather'
import DailyForecast from '../components/DailyForecast'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiMapPin } from 'react-icons/fi'

export default function Home() {
  const { loading, error, weatherData, fetchWeather, fetchWeatherByCoords } = useContext(WeatherContext)
  const [query, setQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      fetchWeather(query.trim())
      setHasSearched(true)
    }
  }

  const handleCurrentLocation = () => {
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
  }

  return (
    <div className="space-y-10 px-4 sm:px-6 lg:px-8 py-6">

      {/* Always show search bar */}
      <div className="flex flex-col items-center text-center">
        <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleCurrentLocation}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Use Current Location"
          >
            <FiMapPin className="text-teal-600 dark:text-teal-400 text-xl" />
          </button>
        </form>
      </div>

      {/* Show Home/About before search */}
      {!hasSearched && !weatherData && !loading && !error && (
        <div className="flex flex-col items-center text-center min-h-[50vh] justify-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Welcome to WeatherCast
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            Get real-time weather updates and a 7-day forecast for any city in the world.
          </p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-5 rounded-xl max-w-2xl mx-auto">
          <h3 className="font-semibold text-lg">Error loading weather data</h3>
          <p className="text-sm mt-2">{error}</p>
        </div>
      )}

      {/* Show Weather after search */}
      {weatherData && hasSearched && !loading && !error && (
        <>
          {/* Current Weather Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Current Weather
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated:{" "}
              <span className="font-medium">
                {new Date(weatherData.dt * 1000).toLocaleTimeString()}
              </span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <CurrentWeather />
          </div>

          {/* Daily Forecast Section */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Daily Forecast
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <DailyForecast />
          </div>
        </>
      )}
    </div>
  )
}
