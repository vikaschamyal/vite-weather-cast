import React, { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiWind, FiDroplet, FiActivity } from 'react-icons/fi'

const AirQuality = memo(({ airQuality }) => {
  const aqiData = useMemo(() => {
    if (!airQuality || !airQuality.list || !airQuality.list[0]) return null

    const data = airQuality.list[0]
    const aqi = data.main.aqi
    const components = data.components

    const getAQILevel = (aqiValue) => {
      const levels = {
        1: { 
          label: 'Good', 
          color: 'green', 
          bgGradient: 'from-green-400 to-green-600',
          textColor: 'text-green-700 dark:text-green-300',
          bgLight: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800'
        },
        2: { 
          label: 'Fair', 
          color: 'yellow', 
          bgGradient: 'from-yellow-400 to-yellow-600',
          textColor: 'text-yellow-700 dark:text-yellow-300',
          bgLight: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800'
        },
        3: { 
          label: 'Moderate', 
          color: 'orange', 
          bgGradient: 'from-orange-400 to-orange-600',
          textColor: 'text-orange-700 dark:text-orange-300',
          bgLight: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800'
        },
        4: { 
          label: 'Poor', 
          color: 'red', 
          bgGradient: 'from-red-400 to-red-600',
          textColor: 'text-red-700 dark:text-red-300',
          bgLight: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800'
        },
        5: { 
          label: 'Very Poor', 
          color: 'purple', 
          bgGradient: 'from-purple-400 to-purple-600',
          textColor: 'text-purple-700 dark:text-purple-300',
          bgLight: 'bg-purple-50 dark:bg-purple-900/20',
          borderColor: 'border-purple-200 dark:border-purple-800'
        }
      }
      return levels[aqiValue] || levels[1]
    }

    const level = getAQILevel(aqi)

    return {
      aqi,
      level,
      components: {
        co: components.co || 0,
        no2: components.no2 || 0,
        o3: components.o3 || 0,
        pm2_5: components.pm2_5 || 0,
        pm10: components.pm10 || 0,
        so2: components.so2 || 0
      }
    }
  }, [airQuality])

  if (!aqiData) return null

  const { aqi, level, components } = aqiData

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
          Air Quality
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          See pollution and AQI levels for your area
        </p>
      </motion.div>

      {/* Card */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 dark:border-gray-800">
        {/* AQI Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className={`inline-flex items-center gap-4 px-8 py-6 rounded-2xl bg-gradient-to-r ${level.bgGradient} text-white mb-8 shadow-xl`}
        >
          <div className="text-5xl font-bold">{aqi}</div>
          <div>
            <div className="text-2xl font-semibold">{level.label}</div>
            <div className="text-sm opacity-90">Air Quality Index</div>
          </div>
        </motion.div>

        {/* Pollutants Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <PollutantCard
            label="PM2.5"
            value={components.pm2_5}
            unit="μg/m³"
            icon={<FiDroplet />}
            color="blue"
            index={0}
          />
          <PollutantCard
            label="PM10"
            value={components.pm10}
            unit="μg/m³"
            icon={<FiDroplet />}
            color="cyan"
            index={1}
          />
          <PollutantCard
            label="O₃"
            value={components.o3}
            unit="μg/m³"
            icon={<FiActivity />}
            color="green"
            index={2}
          />
          <PollutantCard
            label="NO₂"
            value={components.no2}
            unit="μg/m³"
            icon={<FiWind />}
            color="orange"
            index={3}
          />
          <PollutantCard
            label="CO"
            value={components.co}
            unit="μg/m³"
            icon={<FiWind />}
            color="red"
            index={4}
          />
          <PollutantCard
            label="SO₂"
            value={components.so2}
            unit="μg/m³"
            icon={<FiWind />}
            color="purple"
            index={5}
          />
        </div>
      </div>
    </motion.section>
  )
})

AirQuality.displayName = 'AirQuality'

const PollutantCard = memo(({ label, value, unit, icon, color, index }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 + index * 0.05 }}
      whileHover={{ scale: 1.05, y: -4 }}
      className={`p-5 rounded-2xl border-2 ${colorClasses[color]} transition-all duration-300`}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="font-semibold text-sm">{label}</span>
      </div>
      <div className="text-3xl font-bold mb-1">{Math.round(value)}</div>
      <div className="text-xs opacity-75">{unit}</div>
    </motion.div>
  )
})

PollutantCard.displayName = 'PollutantCard'

export default AirQuality
