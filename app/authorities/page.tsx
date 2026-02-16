
"use client"

import { useState, useEffect } from "react"

interface EmergencyUserInfo {
  id: number
  name: string
  email: string
  age: number | null
  blood_group: string | null
  medical_conditions: string[]
  emergency_contacts: string[]
}

const AlertTriangleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
)

const ShieldIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const HeartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
)

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const NavigationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
)

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
)

interface SOSAlert {
  id: string
  userId: string
  userName: string
  age: number | string
  bloodGroup: string
  medicalConditions: string[]
  emergencyContacts: string[]
  location: {
    latitude: number
    longitude: number
    accuracy?: number
  } | null
  emergencyType: string
  urgency: "critical" | "high" | "medium" | "low"
  status: "active" | "responding" | "resolved"
  timestamp: string
  estimatedResponseTime: number
  assignedUnits: string[]
  additionalInfo?: string
}

export default function AuthoritiesDashboard() {
  const [alerts, setAlerts] = useState<SOSAlert[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(null)
  const [emergencyUsers, setEmergencyUsers] = useState<EmergencyUserInfo[]>([])

  const handleLogout = () => {
    localStorage.removeItem("safenet-auth")
    localStorage.removeItem("safenet-user")
    localStorage.removeItem("authority-user")
    localStorage.clear() // Clear all localStorage to ensure clean logout

    window.location.replace("/login")
  }

  useEffect(() => {
    fetchActiveAlerts()
    fetchEmergencyUsers()
    const interval = setInterval(fetchActiveAlerts, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchEmergencyUsers = async () => {
    try {
      const res = await fetch("/api/users/all")
      if (res.ok) {
        const data = await res.json()
        setEmergencyUsers(data.users || [])
      }
    } catch (e) {
      // Optionally handle error
    }
  }

  const fetchActiveAlerts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/authorities-alerts")
      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts || [])
      } else {
        const storedAlerts = localStorage.getItem("authorities-sos-alerts")
        if (storedAlerts) {
          const parsedAlerts = JSON.parse(storedAlerts)
          setAlerts(parsedAlerts.filter((alert: SOSAlert) => alert.status !== "resolved"))
        }
      }
      setLastUpdated(Date.now())
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
      const storedAlerts = localStorage.getItem("authorities-sos-alerts")
      if (storedAlerts) {
        const parsedAlerts = JSON.parse(storedAlerts)
        setAlerts(parsedAlerts.filter((alert: SOSAlert) => alert.status !== "resolved"))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ...existing code...

  // Place the user info panel after the main dashboard rendering
  // (This is a simplified fix; you may want to further style or move as needed)

  // ...existing code for header and main...

  // After the main dashboard grid, render the emergency user info list
  // (You can move this to a sidebar or modal as needed)

  return (
    <div>
      {/* ...existing header and main dashboard code... */}
      {/* Emergency User Info List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
            <UserIcon />
            Registered Users
          </h2>
          <div className="max-h-96 overflow-y-auto">
            {emergencyUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No registered users found</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {emergencyUsers.map((user) => (
                  <li key={user.id} className="py-3">
                    <div className="font-medium text-gray-900">{user.name} <span className="text-xs text-gray-500">({user.email})</span></div>
                    <div className="text-xs text-gray-600">Age: {user.age || "-"} | Blood: {user.blood_group || "-"}</div>
                    <div className="text-xs text-gray-600">Medical: {user.medical_conditions.join(", ") || "None"}</div>
                    <div className="text-xs text-gray-600">Contacts: {user.emergency_contacts.join(", ") || "None"}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
