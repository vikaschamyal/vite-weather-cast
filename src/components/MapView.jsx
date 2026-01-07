import React, { memo, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Lazy load Leaflet only when component is mounted
let L, LeafletMap, TileLayer, Marker, Popup

const MapView = memo(({ weatherData, forecastData }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    // Dynamically import Leaflet
    const loadLeaflet = async () => {
      try {
        // Import Leaflet CSS
        await import('leaflet/dist/leaflet.css')
        
        // Import Leaflet and react-leaflet
        const leafletModule = await import('leaflet')
        const reactLeafletModule = await import('react-leaflet')
        
        L = leafletModule.default
        LeafletMap = reactLeafletModule.MapContainer
        TileLayer = reactLeafletModule.TileLayer
        Marker = reactLeafletModule.Marker
        Popup = reactLeafletModule.Popup

        // Fix default marker icon issue
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })

        setIsLoaded(true)
      } catch (error) {
        console.error('Error loading Leaflet:', error)
        setLoadError('Failed to load map. Please refresh the page.')
      }
    }

    loadLeaflet()
  }, [])

  if (loadError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-5 rounded-xl">
        {loadError}
      </div>
    )
  }

  if (!isLoaded || !L || !weatherData || !weatherData.coord) {
    return (
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading map...</p>
          </div>
        </div>
      </div>
    )
  }

  const { lat, lon } = weatherData.coord
  const position = [lat, lon]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 dark:border-gray-800"
    >
      <div className="h-96 md:h-[500px] rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <LeafletMap
          center={position}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="text-center">
                <div className="font-bold text-lg">{weatherData.name}</div>
                <div className="text-sm text-gray-600">
                  {Math.round(weatherData.main.temp)}°{weatherData.sys.country}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {weatherData.weather[0].description}
                </div>
              </div>
            </Popup>
          </Marker>
        </LeafletMap>
      </div>

      {/* Map Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex flex-wrap gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView(position, 10)
            }
          }}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg"
        >
          Center on Location
        </motion.button>
      </motion.div>
    </motion.div>
  )
})

MapView.displayName = 'MapView'

export default MapView

