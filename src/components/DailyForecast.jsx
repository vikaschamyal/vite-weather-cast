import React, { useContext, memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { WeatherContext } from '../contexts/WeatherContext'
import { 
  WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm, WiFog, WiDayCloudy
} from 'react-icons/wi'

const getIcon = (id) => {
  const iconClass = "text-5xl"
  if (!id) return <WiDaySunny className={`${iconClass} text-yellow-400`} />
  if (id >= 200 && id < 300) return <WiThunderstorm className={`${iconClass} text-purple-500`} />
  if (id >= 300 && id < 600) return <WiRain className={`${iconClass} text-blue-400`} />
  if (id >= 600 && id < 700) return <WiSnow className={`${iconClass} text-cyan-200`} />
  if (id >= 700 && id < 800) return <WiFog className={`${iconClass} text-gray-400`} />
  if (id === 800) return <WiDaySunny className={`${iconClass} text-yellow-400`} />
  if (id === 801 || id === 802) return <WiDayCloudy className={`${iconClass} text-gray-300`} />
  return <WiCloudy className={`${iconClass} text-gray-300`} />
}

const DailyForecast = memo(() => {
  const { forecastData, unit } = useContext(WeatherContext)
  
  const days = useMemo(() => {
    if (!forecastData || !forecastData.list) return []

    const grouped = {}
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0]
      if (!grouped[date]) grouped[date] = { temps: [], ids: [], dt: item.dt }
      grouped[date].temps.push(item.main.temp)
      grouped[date].ids.push(item.weather[0].id)
    })

    const processed = Object.entries(grouped).map(([date, data]) => {
      const avg = data.temps.reduce((a, b) => a + b, 0) / data.temps.length
      const counts = {}
      let most = data.ids[0]
      data.ids.forEach(id => { 
        counts[id] = (counts[id] || 0) + 1
        if (counts[id] > counts[most]) most = id 
      })
      return { 
        date, 
        day: new Date(data.dt * 1000).toLocaleDateString(undefined, { weekday: 'long' }), 
        dayShort: new Date(data.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' }),
        avg, 
        id: most 
      }
    })

    return processed.slice(1, 8)
  }, [forecastData])

  if (!forecastData || days.length === 0) return null

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
          7-Day Forecast
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Extended forecast for the week ahead
        </p>
      </motion.div>

      {/* Card */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="space-y-3">
          {days.map((day, index) => (
            <ForecastDayCard key={day.date} day={day} unit={unit} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  )
})

DailyForecast.displayName = 'DailyForecast'

const ForecastDayCard = memo(({ day, unit, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, x: 4 }}
      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="w-20">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {day.dayShort}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">
            {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="flex-shrink-0">
          {getIcon(day.id)}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize hidden sm:block">
            {day.day}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {Math.round(day.avg)}°{unit === 'metric' ? 'C' : 'F'}
        </p>
      </div>
    </motion.div>
  )
})

ForecastDayCard.displayName = 'ForecastDayCard'

export default DailyForecast
