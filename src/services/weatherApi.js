import axios from 'axios'

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const CACHE_KEY_PREFIX = 'weather_cache_'

// Cache helper functions
const getCacheKey = (provider, type, params) => {
  const paramStr = typeof params === 'string' ? params : JSON.stringify(params)
  return `${CACHE_KEY_PREFIX}${provider}_${type}_${paramStr}`
}

const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null
    
    const { data, timestamp } = JSON.parse(cached)
    const now = Date.now()
    
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Cache read error:', error)
    return null
  }
}

const setCachedData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch (error) {
    console.error('Cache write error:', error)
  }
}

// API Providers
const API_PROVIDERS = {
  OPENWEATHER: 'openweather',
  ACCUWEATHER: 'accuweather',
  GOOGLE: 'google'
}

// OpenWeatherMap API
const openWeatherApi = {
  async getCurrentWeather(city, unit = 'metric', apiKey) {
    const cacheKey = getCacheKey(API_PROVIDERS.OPENWEATHER, 'current', city)
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${apiKey}`
    )
    setCachedData(cacheKey, response.data)
    return response.data
  },

  async getCurrentWeatherByCoords(lat, lon, unit = 'metric', apiKey) {
    const cacheKey = getCacheKey(API_PROVIDERS.OPENWEATHER, 'current', `${lat},${lon}`)
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`
    )
    setCachedData(cacheKey, response.data)
    return response.data
  },

  async getForecast(city, unit = 'metric', apiKey) {
    const cacheKey = getCacheKey(API_PROVIDERS.OPENWEATHER, 'forecast', city)
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${unit}&appid=${apiKey}`
    )
    setCachedData(cacheKey, response.data)
    return response.data
  },

  async getForecastByCoords(lat, lon, unit = 'metric', apiKey) {
    const cacheKey = getCacheKey(API_PROVIDERS.OPENWEATHER, 'forecast', `${lat},${lon}`)
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`
    )
    setCachedData(cacheKey, response.data)
    return response.data
  },

  async getAirQuality(lat, lon, apiKey) {
    const cacheKey = getCacheKey(API_PROVIDERS.OPENWEATHER, 'airquality', `${lat},${lon}`)
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      )
      setCachedData(cacheKey, response.data)
      return response.data
    } catch (error) {
      console.error('Air quality API error:', error)
      return null
    }
  },

  async getAlerts(lat, lon, apiKey) {
    const cacheKey = getCacheKey(API_PROVIDERS.OPENWEATHER, 'alerts', `${lat},${lon}`)
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
      )
      const alerts = response.data?.alerts || []
      setCachedData(cacheKey, alerts)
      return alerts
    } catch (error) {
      console.error('Alerts API error:', error)
      return []
    }
  }
}

// AccuWeather API (placeholder - requires API key)
const accuWeatherApi = {
  async getCurrentWeather(city, unit = 'metric', apiKey) {
    if (!apiKey) throw new Error('AccuWeather API key required')
    // Implementation would go here
    throw new Error('AccuWeather API not implemented - requires premium subscription')
  }
}

// Google Weather API (placeholder)
const googleWeatherApi = {
  async getCurrentWeather(city, unit = 'metric', apiKey) {
    if (!apiKey) throw new Error('Google Weather API key required')
    // Implementation would go here
    throw new Error('Google Weather API not implemented - requires API key setup')
  }
}

// Main API service
export const weatherApiService = {
  providers: API_PROVIDERS,

  async getWeather(provider, params, unit = 'metric', apiKeys) {
    const { city, lat, lon } = params
    const apiKey = apiKeys[provider]

    if (!apiKey) {
      throw new Error(`API key for ${provider} is missing`)
    }

    let currentWeather, forecast

    switch (provider) {
      case API_PROVIDERS.OPENWEATHER:
        if (city) {
          [currentWeather, forecast] = await Promise.all([
            openWeatherApi.getCurrentWeather(city, unit, apiKey),
            openWeatherApi.getForecast(city, unit, apiKey)
          ])
        } else if (lat && lon) {
          [currentWeather, forecast] = await Promise.all([
            openWeatherApi.getCurrentWeatherByCoords(lat, lon, unit, apiKey),
            openWeatherApi.getForecastByCoords(lat, lon, unit, apiKey)
          ])
        }
        break

      case API_PROVIDERS.ACCUWEATHER:
        currentWeather = await accuWeatherApi.getCurrentWeather(city, unit, apiKey)
        break

      case API_PROVIDERS.GOOGLE:
        currentWeather = await googleWeatherApi.getCurrentWeather(city, unit, apiKey)
        break

      default:
        throw new Error(`Unknown provider: ${provider}`)
    }

    return { currentWeather, forecast }
  },

  async getAirQuality(lat, lon, provider, apiKeys) {
    if (provider === API_PROVIDERS.OPENWEATHER) {
      return await openWeatherApi.getAirQuality(lat, lon, apiKeys[API_PROVIDERS.OPENWEATHER])
    }
    return null
  },

  async getAlerts(lat, lon, provider, apiKeys) {
    if (provider === API_PROVIDERS.OPENWEATHER) {
      return await openWeatherApi.getAlerts(lat, lon, apiKeys[API_PROVIDERS.OPENWEATHER])
    }
    return []
  },

  async searchLocations(query, apiKey) {
    if (!query || query.length < 2) return []
    
    const cacheKey = getCacheKey('search', 'locations', query)
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`
      )
      setCachedData(cacheKey, response.data)
      return response.data
    } catch (error) {
      console.error('Location search error:', error)
      return []
    }
  }
}

export default weatherApiService

