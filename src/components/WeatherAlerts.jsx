import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { FiAlertTriangle, FiClock, FiCalendar } from 'react-icons/fi'

const WeatherAlerts = memo(({ alerts }) => {
  if (!alerts || alerts.length === 0) return null

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
          Weather Alerts
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Stay safe with weather warnings
        </p>
      </motion.div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <AlertCard key={index} alert={alert} index={index} />
        ))}
      </div>
    </motion.section>
  )
})

WeatherAlerts.displayName = 'WeatherAlerts'

const AlertCard = memo(({ alert, index }) => {
  const getSeverityConfig = (severity) => {
    const configs = {
      minor: {
        bgGradient: 'from-yellow-400 to-yellow-600',
        bgLight: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20',
        textColor: 'text-yellow-800 dark:text-yellow-200',
        borderColor: 'border-yellow-300 dark:border-yellow-700'
      },
      moderate: {
        bgGradient: 'from-orange-400 to-orange-600',
        bgLight: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
        textColor: 'text-orange-800 dark:text-orange-200',
        borderColor: 'border-orange-300 dark:border-orange-700'
      },
      severe: {
        bgGradient: 'from-red-400 to-red-600',
        bgLight: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
        textColor: 'text-red-800 dark:text-red-200',
        borderColor: 'border-red-300 dark:border-red-700'
      },
      extreme: {
        bgGradient: 'from-purple-400 to-purple-600',
        bgLight: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
        textColor: 'text-purple-800 dark:text-purple-200',
        borderColor: 'border-purple-300 dark:border-purple-700'
      }
    }
    return configs[severity] || configs.moderate
  }

  const severity = alert.severity || 'moderate'
  const config = getSeverityConfig(severity)
  const startDate = new Date(alert.start * 1000)
  const endDate = new Date(alert.end * 1000)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${config.bgLight} border-2 ${config.borderColor} shadow-xl`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3,
              ease: "easeInOut"
            }}
            className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r ${config.bgGradient} flex items-center justify-center shadow-lg`}
          >
            <FiAlertTriangle className="text-white text-xl" />
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                {alert.event || 'Weather Alert'}
              </h4>
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${config.bgGradient} shadow-md`}>
                {severity.toUpperCase()}
              </span>
            </div>
            
            <p className={`${config.textColor} mb-4 leading-relaxed`}>
              {alert.description || alert.tags?.[0] || 'No description available'}
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FiCalendar className="text-gray-500" />
                <span>
                  <strong>Start:</strong> {startDate.toLocaleDateString()} {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FiClock className="text-gray-500" />
                <span>
                  <strong>End:</strong> {endDate.toLocaleDateString()} {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            
            {alert.sender_name && (
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                Source: {alert.sender_name}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
})

AlertCard.displayName = 'AlertCard'

export default WeatherAlerts
