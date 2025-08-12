import React, { useState, useEffect, useContext, useRef } from 'react'
import { WeatherContext } from '../contexts/WeatherContext'
import axios from 'axios'
import { FiSearch, FiNavigation, FiX } from 'react-icons/fi'

export default function SearchBar() {
  const { fetchWeather, fetchWeatherByCoords } = useContext(WeatherContext)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [geoError, setGeoError] = useState(null)
  const searchRef = useRef(null)

  const API_KEY = import.meta?.env?.VITE_OPENWEATHER_API_KEY || process.env.REACT_APP_API_KEY

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions with debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const debounceTimer = setTimeout(() => {
      setLoading(true)
      axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`)
        .then(response => {
          setSuggestions(response.data)
          setShowSuggestions(true)
          setGeoError(null)
        })
        .catch(error => {
          console.error('Error fetching locations:', error)
          setSuggestions([])
          setGeoError('Failed to fetch locations. Please try again.')
        })
        .finally(() => setLoading(false))
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, API_KEY])

  const handlePick = (city) => {
    setQuery(`${city.name}, ${city.country}`)
    fetchWeather(city.name)
    setShowSuggestions(false)
  }

  const handleGeo = () => {
    setGeoError(null)
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude)
        setGeoError(null)
      },
      error => {
        console.error('Geolocation error:', error)
        setGeoError('Unable to access your location. Please check permissions.')
      }
    )
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    setGeoError(null)
  }

  const handleInputFocus = () => {
    if (query.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto" ref={searchRef}>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-gray-500 dark:text-gray-400">
          <FiSearch size={18} />
        </div>
        
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="w-full pl-10 pr-10 py-2 md:py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
          onFocus={handleInputFocus}
          aria-label="Search for a city"
          aria-haspopup="listbox"
          aria-expanded={showSuggestions}
        />
        
        {query && (
          <button 
            onClick={clearSearch}
            className="absolute right-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <FiX size={18} />
          </button>
        )}
        
        <button 
          onClick={handleGeo}
          className="absolute right-2 p-1.5 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Use current location"
        >
          <FiNavigation size={18} />
        </button>
      </div>

      {/* Error messages */}
      {geoError && (
        <div className="mt-2 text-sm text-red-500 dark:text-red-400 px-2">
          {geoError}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
          <div className="flex justify-center py-2">
            <div className="flex space-x-2">
              <div className="h-2 w-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul 
          className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li 
              key={`${suggestion.name}-${index}`}
              onClick={() => handlePick(suggestion)}
              className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors flex items-center justify-between"
              role="option"
              aria-selected={false}
            >
              <span className="truncate">
                {suggestion.name}, {suggestion.country}
              </span>
              {suggestion.state && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                  {suggestion.state}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* No results found */}
      {showSuggestions && !loading && suggestions.length === 0 && query.length >= 2 && (
        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 text-gray-500 dark:text-gray-400 text-sm">
          No locations found
        </div>
      )}
    </div>
  )
}