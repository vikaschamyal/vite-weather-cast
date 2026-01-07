// Notification service for weather alerts
class NotificationService {
  constructor() {
    this.permission = null
    this.checkPermission()
  }

  async checkPermission() {
    if (!('Notification' in window)) {
      this.permission = 'unsupported'
      return
    }

    this.permission = Notification.permission
    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission()
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      return false
    }

    if (Notification.permission === 'default') {
      this.permission = await Notification.requestPermission()
    } else {
      this.permission = Notification.permission
    }

    return this.permission === 'granted'
  }

  showNotification(title, options = {}) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return null
    }

    const notification = new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    return notification
  }

  notifySevereWeather(alert) {
    return this.showNotification('Severe Weather Alert', {
      body: `${alert.event}: ${alert.description}`,
      tag: `alert-${alert.start}`,
      requireInteraction: true,
      icon: '/vite.svg'
    })
  }

  notifyHighAQI(aqi, level) {
    return this.showNotification('High Air Quality Alert', {
      body: `Air Quality Index is ${aqi} (${level}). Consider limiting outdoor activities.`,
      tag: 'aqi-alert',
      requireInteraction: false
    })
  }

  notifyTemperatureThreshold(temp, threshold, isHigh) {
    const direction = isHigh ? 'above' : 'below'
    return this.showNotification('Temperature Alert', {
      body: `Temperature is ${direction} ${threshold}°`,
      tag: `temp-${threshold}`,
      requireInteraction: false
    })
  }
}

export const notificationService = new NotificationService()
export default notificationService

