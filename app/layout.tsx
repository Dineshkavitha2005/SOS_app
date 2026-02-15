import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "../styles/globals.css"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"

export const metadata: Metadata = {
  title: "SafeNet - AI Powered Global Disaster SOS",
  description: "AI-powered SOS network that listens, verifies, and saves lives in 30 seconds",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SafeNet SOS",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/icon-512x512.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: [{ url: "/icon-192x192.jpg", sizes: "192x192", type: "image/jpeg" }],
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
  themeColor: "#dc2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="SafeNet SOS" />
        <meta name="msapplication-TileColor" content="#dc2626" />
        <meta name="msapplication-tap-highlight" content="no" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('[PWA] SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('[PWA] SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>{children}</Suspense>
        <PWAInstallPrompt />
      </body>
    </html>
  )
}
