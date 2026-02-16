"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Shield, MapPin, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserData {
  name: string
  email: string
  phone: string
  emergencyContact: string
  bloodGroup: string
  medicalConditions: string
}

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userType, setUserType] = useState<"user" | "authority">("user")
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
    bloodGroup: "",
    medicalConditions: "",
  })

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const requestLocationPermission = async () => {
    try {
      const permission = await navigator.geolocation.getCurrentPosition(
        () => console.log("[v0] Location permission granted"),
        () => console.log("[v0] Location permission denied"),
      )
      return true
    } catch (error) {
      console.log("[v0] Location permission error:", error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        if (userType === "authority") {
          if (formData.email === "lohithravi69@gmail.com") {
            localStorage.setItem("safenet-authority-auth", "true")
            localStorage.setItem(
              "safenet-authority-user",
              JSON.stringify({
                email: formData.email,
                name: "Authority User",
                role: "authority",
              }),
            )
            router.push("/authorities")
            return
          } else {
            setError("Unauthorized: Only authorized personnel can access the authority dashboard")
            return
          }
        } else {
          // User login via API
          const res = await fetch("/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.phone, // Use phone as password for demo (replace with real password field in production)
            }),
          })
          const result = await res.json()
          if (res.ok && result.user) {
            localStorage.setItem("safenet-user", JSON.stringify(result.user))
            localStorage.setItem("safenet-auth", "true")
            await requestLocationPermission()
            router.push("/")
            return
          } else {
            setError(result.error || "Login failed. Please check your credentials.")
            return
          }
        }
      } else {
        // Sign up logic
        if (userType === "authority") {
          setError("Authorities cannot sign up. Please contact your administrator.")
          return
        }

        if (!formData.name || !formData.email || !formData.phone) {
          setError("Please fill in all required fields")
          return
        }

        // User registration via API
        const res = await fetch("/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email.toLowerCase(),
            password: formData.phone, // Use phone as password for demo (replace with real password field in production)
            age: null,
            bloodGroup: formData.bloodGroup,
            medicalConditions: formData.medicalConditions ? [formData.medicalConditions] : [],
            emergencyContacts: formData.emergencyContact ? [formData.emergencyContact] : [],
          }),
        })
        const result = await res.json()
        if (res.ok) {
          // Auto-login after signup
          const loginRes = await fetch("/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email.toLowerCase(),
              password: formData.phone,
            }),
          })
          const loginResult = await loginRes.json()
          if (loginRes.ok && loginResult.user) {
            localStorage.setItem("safenet-user", JSON.stringify(loginResult.user))
            localStorage.setItem("safenet-auth", "true")
            await requestLocationPermission()
            router.push("/")
            return
          } else {
            setError("Signup succeeded but auto-login failed. Please try logging in.")
            return
          }
        } else {
          setError(result.error || "Signup failed. Please try again.")
          return
        }
      }
    } catch (error) {
      console.log("[v0] Auth error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center px-4 sm:px-6">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mr-2" />
            <h1 className="text-xl sm:text-2xl font-bold text-red-600">SafeNet</h1>
          </div>
          <CardTitle className="text-lg sm:text-xl">{isLogin ? "Welcome Back" : "Join SafeNet"}</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {isLogin ? "Sign in to access emergency services" : "Create your emergency profile for instant help"}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-4 space-y-3">
            <Label className="text-sm font-medium">I am a:</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUserType("user")}
                className={`p-3 rounded-lg border-2 transition-all ${
                  userType === "user"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <Shield className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm font-medium">User</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType("authority")}
                className={`p-3 rounded-lg border-2 transition-all ${
                  userType === "authority"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <Users className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Authority</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {!isLogin && userType === "user" && (
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="name" className="text-sm">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required={!isLogin}
                  className="text-sm sm:text-base"
                />
              </div>
            )}

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email" className="text-sm">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder={userType === "authority" ? "Enter authority email" : "Enter your email"}
                required
                className="text-sm sm:text-base"
              />

            </div>

            {userType === "user" && (
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="phone" className="text-sm">
                  {isLogin ? "Phone Number (Password)" : "Phone Number *"}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder={isLogin ? "Enter your phone number (password)" : "Enter your phone number"}
                  required
                  className="text-sm sm:text-base"
                />
              </div>
            )}

            {!isLogin && userType === "user" && (
              <>
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="emergencyContact" className="text-sm">
                    Emergency Contact
                  </Label>
                  <Input
                    id="emergencyContact"
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Emergency contact number"
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="bloodGroup" className="text-sm">
                    Blood Group
                  </Label>
                  <select
                    id="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="medicalConditions" className="text-sm">
                    Medical Conditions
                  </Label>
                  <Input
                    id="medicalConditions"
                    type="text"
                    value={formData.medicalConditions}
                    onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                    placeholder="Any medical conditions or allergies"
                    className="text-sm sm:text-base"
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className={`w-full text-sm sm:text-base py-2 sm:py-3 ${
                userType === "authority" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {userType === "user" && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-600 hover:text-red-700 text-xs sm:text-sm underline"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          )}

          {userType === "authority" && (
            <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center text-blue-700 mb-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="text-xs sm:text-sm font-medium">Authority Access</span>
              </div>
              <p className="text-xs text-blue-600">
                Use your official authority credentials to access the emergency response dashboard.
              </p>
            </div>
          )}

          {!isLogin && userType === "user" && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center text-blue-700 mb-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="text-xs sm:text-sm font-medium">Location Services</span>
              </div>
              <p className="text-xs text-blue-600">
                SafeNet requires location access to provide accurate emergency services. You'll be prompted to enable
                location after creating your account.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
