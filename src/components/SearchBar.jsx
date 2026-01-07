import React, { useState, useEffect, useRef, memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiNavigation, FiX } from 'react-icons/fi'
import weatherApiService from '../services/weatherApi'

const SearchBar = memo(({ onSearch, onLocationClick }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [geoError, setGeoError] = useState(null)
  const searchRef = useRef(null)

  const API_KEY = import.meta?.env?.VITE_OPENWEATHER_API_KEY

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

    if (!API_KEY) {
      setSuggestions([])
      return
    }

    const debounceTimer = setTimeout(() => {
      setLoading(true)
      weatherApiService.searchLocations(query, API_KEY)
        .then(locations => {
          setSuggestions(locations)
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

  const handlePick = useCallback((city) => {
    setQuery(`${city.name}, ${city.country}`)
    if (onSearch) {
      onSearch(city.name)
    }
    setShowSuggestions(false)
  }, [onSearch])

  const handleGeo = useCallback(() => {
    setGeoError(null)
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser')
      return
    }

    if (onLocationClick) {
      onLocationClick()
    }
  }, [onLocationClick])

  const clearSearch = useCallback(() => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    setGeoError(null)
  }, [])

  const handleInputFocus = useCallback(() => {
    if (query.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }, [query, suggestions])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (query.trim() && onSearch) {
      onSearch(query.trim())
      setShowSuggestions(false)
    }
  }, [query, onSearch])

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <div className="absolute left-4 text-gray-400 dark:text-gray-500 z-10">
            <FiSearch size={20} />
          </div>
          
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="w-full pl-12 pr-24 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 text-lg"
            onFocus={handleInputFocus}
            aria-label="Search for a city"
            aria-haspopup="listbox"
            aria-expanded={showSuggestions}
          />
          
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                type="button"
                onClick={clearSearch}
                className="absolute right-14 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10 p-1"
                aria-label="Clear search"
              >
                <FiX size={20} />
              </motion.button>
            )}
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleGeo}
            className="absolute right-2 p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 z-10"
            aria-label="Use current location"
            title="Use current location"
          >
            <FiNavigation size={20} />
          </motion.button>
        </div>
      </form>

      {/* Error messages */}
      <AnimatePresence>
        {geoError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-red-500 dark:text-red-400 px-2"
          >
            {geoError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex justify-center py-2">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 max-h-60 overflow-auto"
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={`${suggestion.name}-${suggestion.country}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handlePick(suggestion)}
                className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors flex items-center justify-between border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                role="option"
                aria-selected={false}
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {suggestion.name}, {suggestion.country}
                </span>
                {suggestion.state && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                    {suggestion.state}
                  </span>
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* No results found */}
      <AnimatePresence>
        {showSuggestions && !loading && suggestions.length === 0 && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-4 text-gray-500 dark:text-gray-400 text-sm text-center"
          >
            No locations found
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar
