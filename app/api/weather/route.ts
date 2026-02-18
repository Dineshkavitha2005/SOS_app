import { type NextRequest, NextResponse } from "next/server"

interface LocationData {
  lat: number
  lon: number
}

interface WeatherResponse {
  location: string
  condition: string
  temperature: number
  rainfall: "heavy" | "moderate" | "low" | "none"
  alert: string
  weatherLink: string
  severity: "red" | "blue" | "green" | "normal"
}

export async function GET(request: NextRequest) {
  try {
    // For GET requests, use default location or get from query params
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '28.6139') // Default to Delhi
    const lon = parseFloat(searchParams.get('lon') || '77.2090')

    console.log("[v0] Weather API GET called for location:", { lat, lon })

    // Determine if location is in India (rough bounds)
    const isIndia = lat >= 6 && lat <= 37 && lon >= 68 && lon <= 97

    // Simulate weather data based on location
    const weatherConditions = ["Clear", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain", "Thunderstorm"]
    const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

    // Determine rainfall level in mm (numeric value for dashboard)
    let rainfall: number = 0

    if (condition.includes("Heavy Rain") || condition.includes("Thunderstorm")) {
      rainfall = Math.floor(Math.random() * 20) + 30 // 30-50mm
    } else if (condition.includes("Light Rain") || condition.includes("Rain")) {
      rainfall = Math.floor(Math.random() * 10) + 5 // 5-15mm
    } else if (condition.includes("Cloudy")) {
      rainfall = Math.floor(Math.random() * 5) + 1 // 1-5mm
    }

    const weatherData = {
      location: isIndia ? "India" : "Global Location",
      condition,
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C range
      rainfall, // Now returns numeric value in mm
      alert: rainfall > 20 ? "⚠️ Heavy Rainfall Alert - Stay indoors, avoid flooded areas." : "",
      severity: rainfall > 20 ? "red" : rainfall > 5 ? "blue" : "green",
    }

    console.log("[v0] Weather data generated:", weatherData)

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("[v0] Weather API GET error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { lat, lon }: LocationData = await request.json()

    console.log("[v0] Weather API called for location:", { lat, lon })

    // Determine if location is in India (rough bounds)
    const isIndia = lat >= 6 && lat <= 37 && lon >= 68 && lon <= 97

    // Get location name (simplified - in production, use reverse geocoding)
    const locationName = isIndia ? "India" : "Global Location"

    // Simulate weather data based on location
    // In production, integrate with actual weather APIs
    const weatherConditions = ["Clear", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain", "Thunderstorm"]
    const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

    // Determine rainfall level and severity
    let rainfall: "heavy" | "moderate" | "low" | "none" = "none"
    let severity: "red" | "blue" | "green" | "normal" = "normal"
    let alert = ""

    if (condition.includes("Heavy Rain") || condition.includes("Thunderstorm")) {
      rainfall = "heavy"
      severity = "red"
      alert = "⚠️ Heavy Rainfall Alert (RED) - Stay indoors, avoid flooded areas."
    } else if (condition.includes("Light Rain") || condition.includes("Rain")) {
      rainfall = "moderate"
      severity = "blue"
      alert = "Moderate rainfall expected. Exercise caution when traveling."
    } else if (condition.includes("Cloudy")) {
      rainfall = "low"
      severity = "green"
      alert = "Light rainfall possible. Weather conditions are generally safe."
    }

    // Generate appropriate weather link
    let weatherLink: string

    if (isIndia) {
      // Use IMD for India
      weatherLink = "https://mausam.imd.gov.in/"
    } else {
      // Use OpenWeatherMap for global locations
      weatherLink = `https://openweathermap.org/weathermap?basemap=map&cities=false&layer=precipitation&lat=${lat}&lon=${lon}&zoom=10`
    }

    const weatherData: WeatherResponse = {
      location: locationName,
      condition,
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C range
      rainfall,
      alert,
      weatherLink,
      severity,
    }

    console.log("[v0] Weather data generated:", weatherData)

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("[v0] Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
