import { useEffect, useState } from "react"
import { requestNotificationPermission, getFcmToken, onForegroundMessage } from "@/lib/firebase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell } from "lucide-react"

export function PushNotificationSetup() {
  const [enabled, setEnabled] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    async function setup() {
      const granted = await requestNotificationPermission()
      setEnabled(granted)
      if (granted) {
        const t = await getFcmToken()
        setToken(t)
      }
    }
    setup()
    onForegroundMessage((payload) => {
      setMessage(payload.notification?.body || "Flood warning received!")
    })
  }, [])

  if (!enabled) return null

  return (
    <Alert className="border-primary bg-primary/10 mt-4">
      <Bell className="h-4 w-4 text-primary" />
      <AlertDescription>
        Push notifications enabled for flood warnings.<br />
        {token && (
          <span className="text-xs break-all">Device Token: {token}</span>
        )}
        {message && (
          <div className="mt-2 text-primary font-bold">{message}</div>
        )}
      </AlertDescription>
    </Alert>
  )
}
