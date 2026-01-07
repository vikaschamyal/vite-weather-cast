import { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import weatherApiService from '../services/weatherApi'
import notificationService from '../services/notifications'

export const WeatherContext = createContext()

const DEFAULT_SETTINGS = {
  apiProvider: 'openweather',
  unit: 'metric',
  language: 'en',
  notificationsEnabled: false,
  temperatureThreshold: null,
  aqiThreshold: 100
}

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [airQuality, setAirQuality] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [location, setLocation] = useState('')
  const [cityName, setCityName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('weather_settings')
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS
  })
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites')
    return stored ? JSON.parse(stored) : []
  })
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode')
    return stored ? JSON.parse(stored) : false
  })

  // API Keys from environment
  const apiKeys = useMemo(() => ({
    openweather: import.meta.env.VITE_OPENWEATHER_API_KEY,
    accuweather: import.meta.env.VITE_ACCUWEATHER_API_KEY,
    google: import.meta.env.VITE_GOOGLE_WEATHER_API_KEY
  }), [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('weather_settings', JSON.stringify(settings))
  }, [settings])

  // Save dark mode to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Check for notifications permission on mount
  useEffect(() => {
    if (settings.notificationsEnabled) {
      notificationService.requestPermission()
    }
  }, [settings.notificationsEnabled])

  // Monitor weather data for notifications
  useEffect(() => {
    if (!settings.notificationsEnabled || !weatherData || !airQuality) return

    // Check temperature threshold
    if (settings.temperatureThreshold) {
      const temp = weatherData.main.temp
      const threshold = settings.temperatureThreshold
      if (temp > threshold || temp < threshold - 10) {
        notificationService.notifyTemperatureThreshold(
          temp,
          threshold,
          temp > threshold
        )
      }
    }

    // Check AQI threshold
    if (airQuality && airQuality.list && airQuality.list[0]) {
      const aqi = airQuality.list[0].main.aqi
      if (aqi >= settings.aqiThreshold) {
        const levels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']
        notificationService.notifyHighAQI(aqi, levels[aqi - 1] || 'High')
      }
    }
  }, [weatherData, airQuality, settings])

  // Monitor alerts for notifications
  useEffect(() => {
    if (!settings.notificationsEnabled || alerts.length === 0) return

    alerts.forEach(alert => {
      notificationService.notifySevereWeather(alert)
    })
  }, [alerts, settings.notificationsEnabled])

  const fetchWeather = useCallback(async (city) => {
    if (!city) return

    const apiKey = apiKeys[settings.apiProvider]
    if (!apiKey) {
      setError(`API key for ${settings.apiProvider} is missing`)
      return
    }

    setLoading(true)
    setError(null)
    try {
      setCityName(city)
      const { currentWeather, forecast } = await weatherApiService.getWeather(
        settings.apiProvider,
        { city },
        settings.unit,
        apiKeys
      )

      setWeatherData(currentWeather)
      setForecastData(forecast)
      setLocation(`${currentWeather.name}, ${currentWeather.sys.country}`)

      // Fetch air quality and alerts if coordinates available
      if (currentWeather.coord) {
        const [aqiData, alertsData] = await Promise.all([
          weatherApiService.getAirQuality(
            currentWeather.coord.lat,
            currentWeather.coord.lon,
            settings.apiProvider,
            apiKeys
          ),
          weatherApiService.getAlerts(
            currentWeather.coord.lat,
            currentWeather.coord.lon,
            settings.apiProvider,
            apiKeys
          )
        ])

        setAirQuality(aqiData)
        setAlerts(alertsData || [])
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch weather data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [settings.apiProvider, settings.unit, apiKeys])

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    if (!lat || !lon) return

    const apiKey = apiKeys[settings.apiProvider]
    if (!apiKey) {
      setError(`API key for ${settings.apiProvider} is missing`)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const { currentWeather, forecast } = await weatherApiService.getWeather(
        settings.apiProvider,
        { lat, lon },
        settings.unit,
        apiKeys
      )

      setWeatherData(currentWeather)
      setForecastData(forecast)
      setLocation(`${currentWeather.name}, ${currentWeather.sys.country}`)
      setCityName(currentWeather.name)

      // Fetch air quality and alerts
      const [aqiData, alertsData] = await Promise.all([
        weatherApiService.getAirQuality(lat, lon, settings.apiProvider, apiKeys),
        weatherApiService.getAlerts(lat, lon, settings.apiProvider, apiKeys)
      ])

      setAirQuality(aqiData)
      setAlerts(alertsData || [])
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to fetch weather data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [settings.apiProvider, settings.unit, apiKeys])

  // Refetch when unit or provider changes
  useEffect(() => {
    if (cityName) {
      fetchWeather(cityName)
    } else if (weatherData?.coord) {
      fetchWeatherByCoords(weatherData.coord.lat, weatherData.coord.lon)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.unit, settings.apiProvider])

  const toggleUnit = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      unit: prev.unit === 'metric' ? 'imperial' : 'metric'
    }))
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev)
  }, [])

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const addFavorite = useCallback((city) => {
    setFavorites(prev => {
      const updated = prev.some(f => f.id === city.id) ? prev : [...prev, city]
      localStorage.setItem('favorites', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeFavorite = useCallback((id) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.id !== id)
      localStorage.setItem('favorites', JSON.stringify(updated))
      return updated
    })
  }, [])

  const value = useMemo(() => ({
    weatherData,
    forecastData,
    airQuality,
    alerts,
    location,
    cityName,
    unit: settings.unit,
    loading,
    error,
    favorites,
    darkMode,
    settings,
    apiKeys,
    fetchWeather,
    fetchWeatherByCoords,
    toggleUnit,
    toggleDarkMode,
    updateSettings,
    addFavorite,
    removeFavorite,
    setLocation
  }), [
    weatherData,
    forecastData,
    airQuality,
    alerts,
    location,
    cityName,
    settings,
    loading,
    error,
    favorites,
    darkMode,
    apiKeys,
    fetchWeather,
    fetchWeatherByCoords,
    toggleUnit,
    toggleDarkMode,
    updateSettings,
    addFavorite,
    removeFavorite
  ])

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  )
}
