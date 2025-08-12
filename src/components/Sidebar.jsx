import React from 'react'
import SearchBar from './SearchBar'

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-80 pr-8">
      <div className="sticky top-24 space-y-6">
        {/* SearchBar is now moved to layout for mobile */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">Weather Insights</h4>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <h5 className="font-medium text-gray-800 dark:text-gray-200">UV Index</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">Protection needed</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <h5 className="font-medium text-gray-800 dark:text-gray-200">Air Quality</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">Good conditions</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <h5 className="font-medium text-gray-800 dark:text-gray-200">Sunrise & Sunset</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">Daylight hours</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}