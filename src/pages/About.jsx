import React from 'react'

export default function About() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-gradient-to-br from-white/60 via-white/40 to-white/20 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-gray-800/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 max-w-4xl w-full">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
          About WeatherCast
        </h1>
        
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-center mb-8">
          WeatherCast is a modern weather application built with cutting-edge web technologies to provide 
          you with accurate and beautiful weather forecasts — anytime, anywhere.
        </p>
        
        {/* Technologies */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Technologies Used
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TechItem name="React" description="Frontend library for building user interfaces" />
            <TechItem name="Vite" description="Next generation frontend tooling" />
            <TechItem name="Tailwind CSS" description="Utility-first CSS framework" />
            <TechItem name="OpenWeather API" description="Weather data provider" />
          </ul>
        </section>
        
        {/* Features */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureItem 
              title="Real-time Weather" 
              description="Get current weather conditions for any location" 
              icon="🌦️"
            />
            <FeatureItem 
              title="7-Day Forecast" 
              description="Plan ahead with detailed daily forecasts" 
              icon="📅"
            />
            <FeatureItem 
              title="Favorite Locations" 
              description="Save your frequently visited places" 
              icon="❤️"
            />
            
          </div>
        </section>
      </div>
    </div>
  )
}

function TechItem({ name, description }) {
  return (
    <li className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md p-4 rounded-lg shadow hover:shadow-md hover:scale-[1.02] transition-all duration-300 border border-white/20 dark:border-gray-700/30">
      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
    </li>
  )
}

function FeatureItem({ title, description, icon }) {
  return (
    <div className="flex items-start space-x-4 bg-white/70 dark:bg-gray-800/60 backdrop-blur-md p-4 rounded-lg shadow hover:shadow-md hover:scale-[1.02] transition-all duration-300 border border-white/20 dark:border-gray-700/30">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  )
}
