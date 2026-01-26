"use client"

import { useState, useEffect } from "react"

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt")
        } else {
          console.log("User dismissed the install prompt")
        }
        setDeferredPrompt(null)
        setShowPrompt(false)
      })
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
      <p className="mb-2">Install SafeNet for a better experience!</p>
      <button
        onClick={handleInstallClick}
        className="bg-white text-blue-600 px-4 py-2 rounded mr-2"
      >
        Install
      </button>
      <button
        onClick={() => setShowPrompt(false)}
        className="text-white underline"
      >
        Not now
      </button>
    </div>
  )
}
