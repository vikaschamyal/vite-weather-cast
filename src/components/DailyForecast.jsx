import React, { useContext } from 'react'
import { WeatherContext } from '../contexts/WeatherContext'
import { 
  WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm, WiFog 
} from 'react-icons/wi'

const getIcon = (id) => {
  if (!id) return <WiDaySunny className="text-yellow-400" />
  if (id >= 200 && id < 300) return <WiThunderstorm className="text-purple-500" />
  if (id >= 300 && id < 600) return <WiRain className="text-sky-400" />
  if (id >= 600 && id < 700) return <WiSnow className="text-cyan-200" />
  if (id >= 700 && id < 800) return <WiFog className="text-gray-400" />
  if (id === 800) return <WiDaySunny className="text-yellow-400" />
  return <WiCloudy className="text-gray-300" />
}

export default function DailyForecast() {
  const { forecastData, unit } = useContext(WeatherContext)
  if (!forecastData) return null

  // Group by date
  const grouped = {}
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0]
    if (!grouped[date]) grouped[date] = { temps: [], ids: [], dt: item.dt }
    grouped[date].temps.push(item.main.temp)
    grouped[date].ids.push(item.weather[0].id)
  })

  // Process grouped data
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
      day: new Date(data.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' }), 
      avg, 
      id: most 
    }
  })

  const days = processed.slice(1, 8)

  return (
    <div className="bg-gradient-to-br from-white/40 via-white/20 to-white/10 dark:from-gray-800/40 dark:via-gray-800/20 dark:to-gray-800/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/40">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 tracking-tight">
        7-Day Forecast
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {days.map((d, i) => (
          <div 
            key={i} 
            className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/20 dark:border-gray-600/30 hover:shadow-xl hover:scale-105 transform transition-all duration-300 cursor-pointer"
          >
            <div className="font-semibold text-gray-700 dark:text-gray-300 text-center mb-3">
              {d.day}
            </div>
            <div className="flex justify-center text-5xl my-3 drop-shadow-md">
              {getIcon(d.id)}
            </div>
            <div className="text-center font-bold text-gray-900 dark:text-white text-lg">
              {Math.round(d.avg)}°{unit === 'metric' ? 'C' : 'F'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
