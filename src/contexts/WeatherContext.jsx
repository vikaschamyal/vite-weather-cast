import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const WeatherContext = createContext()

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [location, setLocation] = useState('')
  const [cityName, setCityName] = useState('')
  const [unit, setUnit] = useState('metric')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    // ✅ Load favorites from localStorage on init
    const stored = localStorage.getItem('favorites')
    return stored ? JSON.parse(stored) : []
  })
  const [darkMode, setDarkMode] = useState(false)

  // ✅ Vite environment variable
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

  const guardKey = () => {
    if (!API_KEY) {
      setError('Missing API key. Please set VITE_OPENWEATHER_API_KEY in .env')
      return false
    }
    return true
  }

  const fetchWeather = async (city) => {
    if (!city || !guardKey()) return
    setLoading(true)
    setError(null)
    try {
      setCityName(city)
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${API_KEY}`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${unit}&appid=${API_KEY}`)
      ])
      setWeatherData(weatherRes.data)
      setForecastData(forecastRes.data)
      setLocation(`${weatherRes.data.name}, ${weatherRes.data.sys.country}`)
    } catch (err) {
      setError(err?.response?.data?.message || 'City not found. Please try another location.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherByCoords = async (lat, lon) => {
    if (!lat || !lon || !guardKey()) return
    setLoading(true)
    setError(null)
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`)
      ])
      setWeatherData(weatherRes.data)
      setForecastData(forecastRes.data)
      setLocation(`${weatherRes.data.name}, ${weatherRes.data.sys.country}`)
      setCityName(weatherRes.data.name)
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to fetch weather data for your location.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleUnit = () => setUnit(prev => prev === 'metric' ? 'imperial' : 'metric')
  const toggleDarkMode = () => setDarkMode(prev => !prev)

  const addFavorite = (city) => {
    setFavorites(prev => {
      const updated = prev.some(f => f.id === city.id) ? prev : [...prev, city]
      localStorage.setItem('favorites', JSON.stringify(updated)) // ✅ Save to localStorage
      return updated
    })
  }

  const removeFavorite = (id) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.id !== id)
      localStorage.setItem('favorites', JSON.stringify(updated)) // ✅ Save to localStorage
      return updated
    })
  }

  useEffect(() => {
    if (cityName) fetchWeather(cityName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit])

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <WeatherContext.Provider value={{
      weatherData,
      forecastData,
      location,
      unit,
      loading,
      error,
      favorites,
      darkMode,
      fetchWeather,
      fetchWeatherByCoords,
      toggleUnit,
      toggleDarkMode,
      addFavorite,
      removeFavorite,
      setLocation
    }}>
      {children}
    </WeatherContext.Provider>
  )
}
