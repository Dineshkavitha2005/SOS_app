"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Phone, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface SOSButtonProps {
  isActive: boolean
  onActivate: () => void
  onDeactivate: () => void
  userLocation: { lat: number; lng: number } | null
  connectionStatus: "online" | "offline"
}

export function SOSButton({ isActive, onActivate, onDeactivate, userLocation, connectionStatus }: SOSButtonProps) {
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isPressed, setIsPressed] = useState(false)
  const [pressProgress, setPressProgress] = useState(0)
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev ? prev - 1 : 0))
      }, 1000)
    } else if (countdown === 0) {
      handleSOSActivation()
      setCountdown(null)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [countdown])

  const handleSOSPressStart = () => {
    if (isActive) {
      onDeactivate()
      setCountdown(null)
      setPressProgress(0)
      clearTimers()
      return
    }

    setIsPressed(true)
    setPressProgress(0)
    setCountdown(5) // Show countdown immediately on press start

    progressTimerRef.current = setInterval(() => {
      setPressProgress((prev) => {
        if (prev >= 100) {
          clearTimers()
          // setCountdown(5) // Removed redundant countdown set here
          return 100
        }
        return prev + 2
      })
    }, 100)

    pressTimerRef.current = setTimeout(() => {
      clearTimers()
      // setCountdown(5) // Removed redundant countdown set here
    }, 5000)
  }

  const handleSOSPressEnd = () => {
    if (pressProgress < 100) {
      setIsPressed(false)
      setPressProgress(0)
      clearTimers()
    }
  }

  const clearTimers = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
  }

  const handleSOSActivation = async () => {
    onActivate()
    setIsPressed(false)
    setPressProgress(0)

    const profile = JSON.parse(localStorage.getItem("safenet-user") || "{}")

    const locationData = userLocation
      ? {
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          accuracy: 10, // Default accuracy
        }
      : null

    const alertData = {
      timestamp: new Date().toISOString(),
      location: locationData, // Use properly formatted location
      connectionStatus,
      urgency: "high",
      userId: profile.id || "user-123", // Use actual user ID from profile
      profile: {
        name: profile.name || "Unknown User",
        age: profile.age || "Unknown",
        bloodGroup: profile.bloodGroup || "Unknown",
        medicalConditions: Array.isArray(profile.medicalConditions)
          ? profile.medicalConditions
          : [profile.medicalConditions].filter(Boolean),
        emergencyContacts: Array.isArray(profile.emergencyContact)
          ? profile.emergencyContact
          : [profile.emergencyContact].filter(Boolean),
      },
    }

    const storeForAuthorities = (sosId: string) => {
      const authoritiesAlert = {
        id: sosId,
        userId: alertData.userId,
        userName: alertData.profile.name,
        age: alertData.profile.age,
        bloodGroup: alertData.profile.bloodGroup,
        medicalConditions: alertData.profile.medicalConditions,
        emergencyContacts: alertData.profile.emergencyContacts,
        location: locationData,
        emergencyType: "General Emergency",
        urgency: "high" as const,
        status: "active" as const,
        timestamp: alertData.timestamp,
        estimatedResponseTime: 8,
        assignedUnits: ["Emergency Response Unit", "Paramedic Team"],
        additionalInfo: "SOS button activated by user",
      }

      // Store in localStorage for authorities dashboard to read
      const existingAlerts = JSON.parse(localStorage.getItem("authorities-sos-alerts") || "[]")
      existingAlerts.push(authoritiesAlert)
      localStorage.setItem("authorities-sos-alerts", JSON.stringify(existingAlerts))

      console.log("🚨 Alert stored for authorities dashboard:", authoritiesAlert)
    }

    const sendNativeSMS = () => {
      const sosId = `SOS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      storeForAuthorities(sosId)

      const locationText = userLocation
        ? `Location: ${userLocation.lat}, ${userLocation.lng}\nGoogle Maps: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`
        : "Location: Not available"

      const smsMessage = `🚨 SAFENET SOS ALERT 🚨\nID: ${sosId}\nName: ${profile.name || "Unknown User"}\nAge: ${profile.age || "Unknown"}\nBlood Group: ${profile.bloodGroup || "Unknown"}\n${locationText}\nEmergency: General Emergency\nTime: ${new Date().toLocaleString()}\nUrgency: HIGH\n\nRESCUE NEEDED - User requires immediate assistance!`

      const phoneNumber = "+918825516088" // Your Indian number
      const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(smsMessage)}`

      try {
        // Create a temporary link element and click it
        const link = document.createElement("a")
        link.href = smsUrl
        link.target = "_blank"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        console.log("[v0] Native SMS app opened with emergency message")
      } catch (error) {
        console.error("[v0] Failed to open native SMS app:", error)
        try {
          window.open(smsUrl, "_blank")
        } catch (fallbackError) {
          console.error("[v0] Fallback method also failed:", fallbackError)
          alert(`Please manually send SMS to ${phoneNumber} with message: ${smsMessage}`)
        }
      }
    }

    try {
      // Send SOS alert via API (Twilio)
      const response = await fetch("/api/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...alertData,
          emergencyType: "General Emergency",
          adminNotificationNumber: "+918825516088", // Your Indian number for notifications (E.164 format)
        }),
      })

      if (response.ok) {
        const result = await response.json()
        storeForAuthorities(result.id)
        console.log("SOS alert sent successfully via Twilio")
        sendNativeSMS()
      } else {
        console.error("Failed to send SOS alert via Twilio")
        sendNativeSMS()
      }
    } catch (error) {
      console.error("Error sending SOS alert:", error)
      sendNativeSMS()

      if (connectionStatus === "offline") {
        console.log("Offline mode: SOS will be sent when connection is restored")
      }
    }
  }

  const cancelCountdown = () => {
    setCountdown(null)
    setIsPressed(false)
    setPressProgress(0)
    clearTimers()
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      {countdown !== null && (
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-destructive mb-2">{countdown}</div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">SOS will activate in {countdown} seconds</p>
          <Button variant="outline" size="sm" onClick={cancelCountdown} className="mb-4 bg-transparent">
            Cancel
          </Button>
        </div>
      )}

      <Button
        size="lg"
        variant="destructive"
        className={cn(
          "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full text-sm sm:text-base md:text-lg font-bold transition-all duration-200",
          "hover:scale-105 active:scale-95 touch-manipulation", // Added touch-manipulation for better mobile interaction
          isPressed && "animate-pulse",
          isActive && "bg-red-700 hover:bg-red-800",
        )}
        onMouseDown={handleSOSPressStart}
        onTouchStart={handleSOSPressStart}
        onMouseUp={handleSOSPressEnd}
        onMouseLeave={handleSOSPressEnd}
        onTouchEnd={handleSOSPressEnd}
        onTouchCancel={handleSOSPressEnd}
      >
        <div className="flex flex-col items-center gap-1 sm:gap-2 relative w-full">
          <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
          {isActive ? "STOP SOS" : "SOS"}
          {isPressed && (
            <div
              className="absolute bottom-0 left-0 h-1 bg-red-600 rounded-full transition-all"
              style={{ width: `${pressProgress}%` }}
            />
          )}
        </div>
      </Button>

      <div className="text-center max-w-sm px-4">
        {/* Removed the "Press and hold to send" text below the round button as requested */}
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isActive
            ? "Emergency services notified. Tap to cancel if safe."
            : "Tap SOS button to activate emergency"}
        </p>

        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {connectionStatus === "online" ? (
              <Phone className="w-3 h-3 text-primary" />
            ) : (
              <MessageSquare className="w-3 h-3 text-secondary" />
            )}
            <span className="hidden sm:inline">{connectionStatus === "online" ? "Voice + Data" : "SMS Only"}</span>
            <span className="sm:hidden">{connectionStatus === "online" ? "Online" : "SMS"}</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="hidden sm:inline">GPS Ready</span>
              <span className="sm:hidden">GPS</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
