import React, { useContext } from 'react'
import { WeatherContext } from '../contexts/WeatherContext'
import { FiHeart, FiMapPin, FiTrash2 } from 'react-icons/fi'

export default function Favorites() {
  const { favorites, fetchWeather, removeFavorite } = useContext(WeatherContext)
  
  if (!favorites.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <FiHeart className="text-5xl text-pink-400 mb-4 drop-shadow-sm" />
        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          No favorites yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
          Add locations to your favorites to see them here
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Your Favorite Locations
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {favorites.map(f => (
          <div 
            key={f.id} 
            className="bg-gradient-to-br from-white/50 via-white/30 to-white/10 dark:from-gray-800/50 dark:via-gray-800/30 dark:to-gray-800/10 backdrop-blur-lg p-5 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => fetchWeather(f.name)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <FiMapPin className="text-teal-500 mr-2 text-lg" />
                <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
                  {f.name}, {f.country}
                </h3>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeFavorite(f.id) }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove from favorites"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
