import React, { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm, WiFog,
  WiDayCloudy, WiNightClear, WiNightCloudy
} from 'react-icons/wi'
import { FiDroplet } from 'react-icons/fi'

const HourlyForecast = memo(({ forecastData, unit }) => {
  const hourlyData = useMemo(() => {
    if (!forecastData || !forecastData.list) return []

    return forecastData.list.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000),
      temp: item.main.temp,
      icon: item.weather[0].id,
      description: item.weather[0].description,
      pop: item.pop * 100
    }))
  }, [forecastData])

  if (hourlyData.length === 0) return null

  const getIcon = (id, hour) => {
    const isNight = hour < 6 || hour > 20
    const iconClass = "text-5xl"
    if (!id) return isNight ? <WiNightClear className={`${iconClass} text-blue-300`} /> : <WiDaySunny className={`${iconClass} text-yellow-400`} />
    if (id >= 200 && id < 300) return <WiThunderstorm className={`${iconClass} text-purple-500`} />
    if (id >= 300 && id < 600) return <WiRain className={`${iconClass} text-blue-400`} />
    if (id >= 600 && id < 700) return <WiSnow className={`${iconClass} text-cyan-200`} />
    if (id >= 700 && id < 800) return <WiFog className={`${iconClass} text-gray-400`} />
    if (id === 800) return isNight ? <WiNightClear className={`${iconClass} text-blue-300`} /> : <WiDaySunny className={`${iconClass} text-yellow-400`} />
    if (id === 801 || id === 802) return isNight ? <WiNightCloudy className={`${iconClass} text-gray-400`} /> : <WiDayCloudy className={`${iconClass} text-gray-300`} />
    return <WiCloudy className={`${iconClass} text-gray-300`} />
  }

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
          Hourly Forecast
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Plan your day with hourly forecasts
        </p>
      </motion.div>

      {/* Card */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800">
        {/* Horizontal Scroll Container */}
        <div className="overflow-x-auto pb-4 -mx-2 px-2">
          <div className="flex gap-4 min-w-max">
            {hourlyData.map((hour, index) => {
              const hourNum = hour.time.getHours()
              const timeLabel = hourNum === 0 ? 'Now' : hourNum < 12 ? `${hourNum}AM` : hourNum === 12 ? '12PM' : `${hourNum - 12}PM`
              
              return (
                <HourlyCard
                  key={index}
                  timeLabel={timeLabel}
                  temp={hour.temp}
                  icon={getIcon(hour.icon, hourNum)}
                  pop={hour.pop}
                  description={hour.description}
                  unit={unit}
                  index={index}
                />
              )
            })}
          </div>
        </div>
      </div>
    </motion.section>
  )
})

HourlyForecast.displayName = 'HourlyForecast'

const HourlyCard = memo(({ timeLabel, temp, icon, pop, description, unit, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08, y: -8 }}
      className="flex flex-col items-center gap-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 min-w-[120px] cursor-pointer transition-all duration-300"
    >
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {timeLabel}
      </div>
      <motion.div
        animate={{ 
          rotate: [0, 5, -5, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
        className="flex items-center justify-center"
      >
        {icon}
      </motion.div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {Math.round(temp)}°{unit === 'metric' ? 'C' : 'F'}
      </div>
      {pop > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.08 + 0.2 }}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full"
        >
          <FiDroplet className="text-xs" />
          <span>{Math.round(pop)}%</span>
        </motion.div>
      )}
      <div className="text-xs text-gray-600 dark:text-gray-400 text-center capitalize leading-tight">
        {description}
      </div>
    </motion.div>
  )
})

HourlyCard.displayName = 'HourlyCard'

export default HourlyForecast
