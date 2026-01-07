import React, { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

const WeatherBackground = memo(({ weatherData }) => {
  const backgroundStyle = useMemo(() => {
    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
      return {
        gradient: 'from-sky-300 via-blue-200 to-indigo-100',
        darkGradient: 'dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'
      }
    }

    const weatherId = weatherData.weather[0].id
    const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20

    // Weather-based backgrounds with soft gradients
    if (weatherId >= 200 && weatherId < 300) {
      // Thunderstorm
      return {
        gradient: 'from-gray-700 via-gray-800 to-gray-900',
        darkGradient: 'dark:from-gray-950 dark:via-black dark:to-gray-950',
        animation: 'animate-pulse'
      }
    } else if (weatherId >= 300 && weatherId < 600) {
      // Rain
      return {
        gradient: isDay 
          ? 'from-blue-300 via-blue-200 to-gray-300' 
          : 'from-blue-600 via-blue-700 to-gray-700',
        darkGradient: isDay
          ? 'dark:from-blue-400 dark:via-blue-300 dark:to-gray-400'
          : 'dark:from-blue-800 dark:via-blue-900 dark:to-gray-800'
      }
    } else if (weatherId >= 600 && weatherId < 700) {
      // Snow
      return {
        gradient: 'from-blue-100 via-cyan-100 to-blue-200',
        darkGradient: 'dark:from-blue-800 dark:via-cyan-800 dark:to-blue-900'
      }
    } else if (weatherId >= 700 && weatherId < 800) {
      // Fog/Mist
      return {
        gradient: 'from-gray-300 via-gray-200 to-gray-300',
        darkGradient: 'dark:from-gray-700 dark:via-gray-800 dark:to-gray-700'
      }
    } else if (weatherId === 800) {
      // Clear
      return {
        gradient: isDay 
          ? 'from-sky-300 via-blue-200 to-cyan-100' 
          : 'from-indigo-800 via-purple-800 to-blue-900',
        darkGradient: isDay
          ? 'dark:from-sky-400 dark:via-blue-300 dark:to-cyan-200'
          : 'dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950'
      }
    } else {
      // Clouds
      return {
        gradient: isDay 
          ? 'from-gray-300 via-gray-200 to-gray-300' 
          : 'from-gray-600 via-gray-700 to-gray-800',
        darkGradient: isDay
          ? 'dark:from-gray-400 dark:via-gray-300 dark:to-gray-400'
          : 'dark:from-gray-800 dark:via-gray-900 dark:to-gray-800'
      }
    }
  }, [weatherData])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className={`fixed inset-0 bg-gradient-to-br ${backgroundStyle.gradient} ${backgroundStyle.darkGradient} transition-all duration-1000 -z-10 ${backgroundStyle.animation || ''}`}
    >
      {/* Animated particles for rain */}
      {weatherData?.weather[0].id >= 300 && weatherData?.weather[0].id < 600 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-8 bg-white/40 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                opacity: Math.random() * 0.5 + 0.3
              }}
              animate={{
                y: window.innerHeight + 20,
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: Math.random() * 1.5 + 0.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
})

WeatherBackground.displayName = 'WeatherBackground'

export default WeatherBackground
