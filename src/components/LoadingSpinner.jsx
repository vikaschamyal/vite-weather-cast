import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-t-teal-500 border-r-teal-500 border-b-transparent border-l-transparent"></div>
      </div>
    </div>
  )
}