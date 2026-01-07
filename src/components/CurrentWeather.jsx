import React, { useContext, memo, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { WeatherContext } from '../contexts/WeatherContext'
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm, WiFog, WiDayCloudy } from 'react-icons/wi'
import { FiHeart, FiShare2, FiRefreshCw, FiDroplet, FiWind, FiThermometer, FiSunrise, FiSunset } from 'react-icons/fi'

const getWeatherIcon = (id, size = 'text-9xl') => {
  const iconClass = `${size} drop-shadow-lg`
  if (!id) return <WiDaySunny className={`${iconClass} text-yellow-400`} />
  if (id >= 200 && id < 300) return <WiThunderstorm className={`${iconClass} text-purple-500`} />
  if (id >= 300 && id < 600) return <WiRain className={`${iconClass} text-blue-400`} />
  if (id >= 600 && id < 700) return <WiSnow className={`${iconClass} text-cyan-200`} />
  if (id >= 700 && id < 800) return <WiFog className={`${iconClass} text-gray-400`} />
  if (id === 800) return <WiDaySunny className={`${iconClass} text-yellow-400`} />
  if (id === 801 || id === 802) return <WiDayCloudy className={`${iconClass} text-gray-400`} />
  return <WiCloudy className={`${iconClass} text-gray-400`} />
}

const AnimatedNumber = memo(({ value, unit, delay = 0 }) => {
  const [display, setDisplay] = React.useState(0)

  React.useEffect(() => {
    let start = 0
    const end = value
    const duration = 1000
    const increment = end / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplay(end)
        clearInterval(timer)
      } else {
        setDisplay(Math.round(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      className="text-7xl md:text-8xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent"
    >
      {display}
      <span className="text-5xl md:text-6xl text-gray-600 dark:text-gray-400">{unit}</span>
    </motion.span>
  )
})

AnimatedNumber.displayName = 'AnimatedNumber'

const CurrentWeather = memo(() => {
  const { weatherData, unit, addFavorite, removeFavorite, favorites, location, fetchWeather } = useContext(WeatherContext)
  
  const isFav = useMemo(() => {
    return weatherData ? favorites.some(f => f.id === weatherData.id) : false
  }, [favorites, weatherData])

  const handleRefresh = useCallback(() => {
    if (location) {
      fetchWeather(location.split(',')[0])
    }
  }, [location, fetchWeather])

  const handleShare = useCallback(() => {
    if (navigator.share && weatherData) {
      navigator.share({
        title: `Weather in ${location}`,
        text: `${Math.round(weatherData.main.temp)}°${unit === 'metric' ? 'C' : 'F'}`
      }).catch(() => {})
    }
  }, [weatherData, location, unit])

  const handleFavorite = useCallback(() => {
    if (!weatherData) return
    if (isFav) {
      removeFavorite(weatherData.id)
    } else {
      addFavorite({ id: weatherData.id, name: weatherData.name, country: weatherData.sys.country })
    }
  }, [weatherData, isFav, addFavorite, removeFavorite])

  const windSpeed = useMemo(() => {
    if (!weatherData) return ''
    return unit === 'metric' 
      ? `${Math.round(weatherData.wind.speed * 3.6)} km/h` 
      : `${Math.round(weatherData.wind.speed)} mph`
  }, [weatherData, unit])

  if (!weatherData) return null

  const weatherCondition = weatherData.weather[0].main.toLowerCase()

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Current Weather
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Real-time weather in your city
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 dark:border-gray-800"
      >
        {/* Header with Location and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div className="space-y-1">
            <motion.h3
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
            >
              {location}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg text-gray-600 dark:text-gray-400 capitalize"
            >
              {weatherData.weather[0].description}
            </motion.p>
          </div>
          
          <div className="flex items-center gap-2">
            <ActionButton 
              onClick={handleRefresh}
              icon={<FiRefreshCw />}
              label="Refresh"
            />
            <ActionButton 
              onClick={handleShare}
              icon={<FiShare2 />}
              label="Share"
            />
            <ActionButton 
              onClick={handleFavorite}
              icon={<FiHeart className={isFav ? "fill-current" : ""} />}
              label={isFav ? "Remove from favorites" : "Add to favorites"}
              active={isFav}
            />
          </div>
        </div>

        {/* Main Weather Display */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          {/* Weather Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
            className="flex-shrink-0"
          >
            {getWeatherIcon(weatherData.weather[0].id)}
          </motion.div>

          {/* Temperature and Details */}
          <div className="flex-1 w-full">
            <div className="mb-8">
              <AnimatedNumber 
                value={Math.round(weatherData.main.temp)} 
                unit={`°${unit === 'metric' ? 'C' : 'F'}`}
                delay={0.5}
              />
            </div>

            {/* Weather Details Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            >
              <DetailCard
                icon={<FiThermometer className="text-orange-500" />}
                label="Feels like"
                value={`${Math.round(weatherData.main.feels_like)}°`}
              />
              <DetailCard
                icon={<FiDroplet className="text-blue-500" />}
                label="Humidity"
                value={`${weatherData.main.humidity}%`}
              />
              <DetailCard
                icon={<FiWind className="text-gray-500" />}
                label="Wind"
                value={windSpeed}
              />
              <DetailCard
                icon={<div className="w-5 h-5 rounded-full bg-gray-400"></div>}
                label="Pressure"
                value={`${weatherData.main.pressure} hPa`}
              />
              {weatherData.sys.sunrise && (
                <DetailCard
                  icon={<FiSunrise className="text-yellow-500" />}
                  label="Sunrise"
                  value={new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
              )}
              {weatherData.sys.sunset && (
                <DetailCard
                  icon={<FiSunset className="text-orange-500" />}
                  label="Sunset"
                  value={new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
})

CurrentWeather.displayName = 'CurrentWeather'

const ActionButton = memo(({ onClick, icon, label, active = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
      aria-label={label}
    >
      {icon}
    </motion.button>
  )
})

ActionButton.displayName = 'ActionButton'

const DetailCard = memo(({ icon, label, value }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-lg font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </motion.div>
  )
})

DetailCard.displayName = 'DetailCard'

export default CurrentWeather
