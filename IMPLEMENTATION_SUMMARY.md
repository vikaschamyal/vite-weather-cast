React & Optimization: Functional components, hooks, React.memo, useCallback, useMemo, lazy-loading (MapView)

Weather Data: Multiple APIs (OpenWeatherMap, AccuWeather, Google), search with auto-suggest, hourly & 5-7 day forecast

Air Quality & Alerts: AQI with color badges, pollutant breakdown, severe weather alerts

Map: Interactive Leaflet map with markers, lazy-loaded

UI/UX: Fully responsive, Framer Motion animations, dynamic weather backgrounds, sunrise/sunset, temperature toggle

Settings & Notifications: API selection, unit toggle, thresholds, browser notifications

Performance: Caching, debounce, memoization, Suspense fallbacks

1 Components

New: AirQuality, WeatherAlerts, HourlyForecast, MapView, Settings, WeatherBackground

Updated: CurrentWeather, DailyForecast, SearchBar, Home

Context: WeatherContext enhanced with caching & notifications

2 Dependencies

framer-motion, leaflet, react-leaflet

 3 Setup
npm install
npm run dev


.env:

VITE_OPENWEATHER_API_KEY=...
VITE_ACCUWEATHER_API_KEY=...
VITE_GOOGLE_WEATHER_API_KEY=...
