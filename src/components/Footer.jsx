import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 mt-12 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} WeatherCast • Built by Vikas Chamyal
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
