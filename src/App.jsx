import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
import Layout from './components/Layout'

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'))
const Favorites = lazy(() => import('./pages/Favorites'))
const About = lazy(() => import('./pages/About'))

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center 
                        bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 
                        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                        text-white transition-colors duration-300">
          <div className="flex flex-col items-center gap-4 px-4 text-center">
            <LoadingSpinner />
            <p className="text-lg sm:text-xl font-medium tracking-wide">
              Loading WeatherCast...
            </p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 
                      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                      transition-colors duration-300">
        <Routes>
          {/* All pages use the Layout */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </div>
    </Suspense>
  )
}
