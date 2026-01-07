import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useSettings } from '../contexts/SettingsContext'
import Settings from './Settings'

export default function Layout() {
  const { isSettingsOpen } = useSettings()

  return (
    <div className="flex flex-col min-h-screen">
      {!isSettingsOpen && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isSettingsOpen && <Footer />}
      <Settings />
    </div>
  )
}
