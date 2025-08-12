import React, { useContext } from 'react'
import { WeatherContext } from '../contexts/WeatherContext'
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi'
import { FiHeart, FiShare2, FiRefreshCw } from 'react-icons/fi'

const getIcon = (id) => {
  if (!id) return <WiDaySunny className="text-yellow-400 drop-shadow-md" />
  if (id >= 200 && id < 300) return <WiThunderstorm className="text-purple-500 drop-shadow-md" />
  if (id >= 300 && id < 600) return <WiRain className="text-cyan-400 drop-shadow-md" />
  if (id >= 600 && id < 700) return <WiSnow className="text-blue-200 drop-shadow-md" />
  if (id >= 700 && id < 800) return <WiFog className="text-gray-300 drop-shadow-md" />
  if (id === 800) return <WiDaySunny className="text-yellow-400 drop-shadow-md" />
  return <WiCloudy className="text-slate-300 drop-shadow-md" />
}

export default function CurrentWeather() {
  const { weatherData, unit, addFavorite, removeFavorite, favorites, location, fetchWeather } = useContext(WeatherContext)
  if (!weatherData) return null
  const isFav = favorites.some(f => f.id === weatherData.id)

  return (
    <div className="relative overflow-hidden p-6 rounded-2xl shadow-xl border border-white/20 
                    bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl">
      {/* Light gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

      {/* Top section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow-sm">{location}</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 capitalize tracking-wide">
            {weatherData.weather[0].description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <IconButton 
            onClick={() => fetchWeather(location.split(',')[0])}
            icon={<FiRefreshCw />}
            label="Refresh"
          />
          <IconButton 
            onClick={() => navigator.share ? navigator.share({
              title: `Weather in ${location}`,
              text: `${Math.round(weatherData.main.temp)}°${unit === 'metric' ? 'C' : 'F'}`
            }).catch(() => {}) : alert('Share not supported')}
            icon={<FiShare2 />}
            label="Share"
          />
          <IconButton 
            onClick={() => isFav 
              ? removeFavorite(weatherData.id) 
              : addFavorite({ id: weatherData.id, name: weatherData.name, country: weatherData.sys.country })}
            icon={<FiHeart className={isFav ? "fill-current text-red-500" : ""} />}
            label={isFav ? "Remove from favorites" : "Add to favorites"}
            active={isFav}
          />
        </div>
      </div>

      {/* Main weather display */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-6 relative z-10">
        <div className="text-8xl drop-shadow-lg">
          {getIcon(weatherData.weather[0].id)}
        </div>
        <div className="flex-1">
          <div className="text-6xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
            {Math.round(weatherData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <WeatherDetail label="Feels like" value={`${Math.round(weatherData.main.feels_like)}°`} />
            <WeatherDetail label="Humidity" value={`${weatherData.main.humidity}%`} />
            <WeatherDetail label="Wind" value={unit === 'metric' 
              ? `${Math.round(weatherData.wind.speed * 3.6)} km/h` 
              : `${Math.round(weatherData.wind.speed)} mph`} />
            <WeatherDetail label="Pressure" value={`${weatherData.main.pressure} hPa`} />
          </div>
        </div>
      </div>
    </div>
  )
}

function IconButton({ onClick, icon, label, active }) {
  return (
    <button 
      onClick={onClick}
      className={`p-2 rounded-full transition-colors border border-white/20 
                  backdrop-blur-md bg-white/40 dark:bg-gray-700/40 
                  hover:bg-white/60 dark:hover:bg-gray-600/60
                  ${active ? "bg-red-200/50 hover:bg-red-300/50" : ""}`}
      aria-label={label}
    >
      <span className="text-gray-800 dark:text-gray-200">{icon}</span>
    </button>
  )
}

function WeatherDetail({ label, value }) {
  return (
    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
      <span className="font-medium text-gray-600 dark:text-gray-400">{label}:</span>
      <span>{value}</span>
    </div>
  )
}
