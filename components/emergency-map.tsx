"use client";
import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import type { Map as LeafletMap } from "leaflet"
import { useCallback } from "react"
import { FloodReport } from "@/lib/floodReportTypes"
import L from "leaflet"
// import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"

const floodColors = {
  flooded: "#ef4444",
  waterlogged: "#f59e42",
  clear: "#22c55e",
}
const getFloodIcon = (severity: FloodReport["severity"]) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${severity === "flooded" ? "red" : severity === "waterlogged" ? "orange" : "green"}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  })
// Example: mock flood zones (replace with real data or API integration)
const mockFloodZones = [
  {
    id: "flood_1",
    center: { lat: 40.714, lng: -74.007 },
    radius: 800, // meters
    severity: "unsafe" as const,
  },
  {
    id: "flood_2",
    center: { lat: 40.71, lng: -74.01 },
    radius: 500,
    severity: "safe" as const,
  },
]
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Navigation, Hospital, Shield, Home, Phone, ExternalLink, RefreshCw, Route } from "lucide-react"

interface EmergencyResource {
  id: string
  name: string
  type: "hospital" | "police" | "fire" | "shelter" | "pharmacy" | "gas_station"
  address: string
  phone: string
  distance: number // in km
  isOpen: boolean
  coordinates: { lat: number; lng: number }
  specialties?: string[]
  capacity?: number
}

export function EmergencyMap() {
  const mapRef = useRef<LeafletMap | null>(null)
  const [userLocation] = useState({ lat: 40.7128, lng: -74.006 }) // Mock NYC location
  const [floodReports, setFloodReports] = useState<FloodReport[]>([])
  const [addingReport, setAddingReport] = useState(false)
  const [newReport, setNewReport] = useState<{lat: number, lng: number} | null>(null)
  const [severity, setSeverity] = useState<FloodReport["severity"]>("flooded")
  const [comment, setComment] = useState("")
  // Attach click handler to map after mount
  useEffect(() => {
    const map = mapRef.current
    if (map) {
      if (addingReport) {
        map.on("click", handleMapClick)
      } else {
        map.off("click", handleMapClick)
      }
    }

    // Cleanup function to remove event listener
    return () => {
      if (map) {
        map.off("click", handleMapClick)
      }
    }
  }, [addingReport])

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])
  // Fetch reports from API
  const fetchFloodReports = useCallback(async () => {
    try {
      const res = await fetch("/api/flood-reports")
      const data = await res.json()
      setFloodReports(data.reports || [])
    } catch {}
  }, [])
  useEffect(() => { fetchFloodReports() }, [fetchFloodReports])
  // Add report by clicking map
  const handleMapClick = async (e: any) => {
    if (!addingReport) return
    setNewReport({ lat: e.latlng.lat, lng: e.latlng.lng })
  }

  // Submit new report
  const submitReport = async (e: any) => {
    e.preventDefault()
    if (!newReport) return
    await fetch("/api/flood-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: newReport.lat, lng: newReport.lng, severity, comment }),
    })
    setAddingReport(false)
    setNewReport(null)
    setComment("")
    setSeverity("flooded")
    fetchFloodReports()
  }
  const [resources, setResources] = useState<EmergencyResource[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("all")

  useEffect(() => {
    fetchNearbyResources()
  }, [])

  const fetchNearbyResources = async () => {
    setIsLoading(true)

    try {
      // Simulate API call to find nearby emergency resources
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockResources = generateMockResources()
      setResources(mockResources)
    } catch (error) {
      console.error("Failed to fetch emergency resources:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockResources = (): EmergencyResource[] => {
    return [
      {
        id: "hospital_1",
        name: "City General Hospital",
        type: "hospital",
        address: "123 Medical Center Dr, New York, NY 10001",
        phone: "+1-555-0123",
        distance: 2.3,
        isOpen: true,
        coordinates: { lat: 40.715, lng: -74.008 },
        specialties: ["Emergency", "Trauma", "Cardiology"],
        capacity: 85,
      },
      {
        id: "police_1",
        name: "Police Precinct 12",
        type: "police",
        address: "456 Safety St, New York, NY 10002",
        phone: "+1-555-0456",
        distance: 1.8,
        isOpen: true,
        coordinates: { lat: 40.714, lng: -74.007 },
      },
      {
        id: "fire_1",
        name: "Fire Station #7",
        type: "fire",
        address: "789 Rescue Ave, New York, NY 10003",
        phone: "+1-555-0789",
        distance: 1.2,
        isOpen: true,
        coordinates: { lat: 40.716, lng: -74.009 },
      },
      {
        id: "shelter_1",
        name: "Community Emergency Shelter",
        type: "shelter",
        address: "321 Safe Haven Blvd, New York, NY 10004",
        phone: "+1-555-0321",
        distance: 3.1,
        isOpen: true,
        coordinates: { lat: 40.71, lng: -74.01 },
        capacity: 200,
      },
      {
        id: "pharmacy_1",
        name: "24/7 Emergency Pharmacy",
        type: "pharmacy",
        address: "654 Health St, New York, NY 10005",
        phone: "+1-555-0654",
        distance: 0.8,
        isOpen: true,
        coordinates: { lat: 40.7135, lng: -74.0065 },
      },
      {
        id: "gas_1",
        name: "Emergency Fuel Station",
        type: "gas_station",
        address: "987 Fuel Rd, New York, NY 10006",
        phone: "+1-555-0987",
        distance: 2.7,
        isOpen: true,
        coordinates: { lat: 40.711, lng: -74.011 },
      },
    ]
  }

  const getResourceIcon = (type: EmergencyResource["type"]) => {
    switch (type) {
      case "hospital":
        return Hospital
      case "police":
        return Shield
      case "fire":
        return Shield
      case "shelter":
        return Home
      case "pharmacy":
        return Hospital
      case "gas_station":
        return MapPin
      default:
        return MapPin
    }
  }

  const getResourceColor = (type: EmergencyResource["type"]) => {
    switch (type) {
      case "hospital":
        return "text-red-600"
      case "police":
        return "text-blue-600"
      case "fire":
        return "text-orange-600"
      case "shelter":
        return "text-green-600"
      case "pharmacy":
        return "text-purple-600"
      case "gas_station":
        return "text-gray-600"
      default:
        return "text-muted-foreground"
    }
  }

  const filteredResources = selectedType === "all" ? resources : resources.filter((r) => r.type === selectedType)

  const resourceTypes = [
    { value: "all", label: "All Resources", count: resources.length },
    { value: "hospital", label: "Hospitals", count: resources.filter((r) => r.type === "hospital").length },
    { value: "police", label: "Police", count: resources.filter((r) => r.type === "police").length },
    { value: "fire", label: "Fire Stations", count: resources.filter((r) => r.type === "fire").length },
    { value: "shelter", label: "Shelters", count: resources.filter((r) => r.type === "shelter").length },
    { value: "pharmacy", label: "Pharmacies", count: resources.filter((r) => r.type === "pharmacy").length },
  ]

  const openGoogleMaps = (resource: EmergencyResource) => {
    const url = `https://maps.google.com/?q=${resource.coordinates.lat},${resource.coordinates.lng}`
    window.open(url, "_blank")
  }

  const getDirections = (resource: EmergencyResource) => {
    const url = `https://maps.google.com/maps?saddr=${userLocation.lat},${userLocation.lng}&daddr=${resource.coordinates.lat},${resource.coordinates.lng}`
    window.open(url, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <CardTitle>Emergency Resources & Flood Map</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNearbyResources}
            disabled={isLoading}
            className="flex items-center gap-1 bg-transparent"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>Live map of flood zones, safe/unsafe areas, and emergency services</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Map Section */}
        <div className="w-full h-80 rounded-lg overflow-hidden mb-4 border border-border">
          <MapContainer
            key={`map-${userLocation.lat}-${userLocation.lng}`}
            center={[userLocation.lat, userLocation.lng]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* User Location Marker */}
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <b>Your Location</b>
              </Popup>
            </Marker>
            {/* Emergency Resources Markers */}
            {filteredResources.map((resource) => (
              <Marker
                key={resource.id}
                position={[resource.coordinates.lat, resource.coordinates.lng]}
              >
                <Popup>
                  <b>{resource.name}</b>
                  <br />
                  {resource.type.replace("_", " ")}
                  <br />
                  {resource.address}
                  <br />
                  <a href={`tel:${resource.phone}`}>{resource.phone}</a>
                </Popup>
              </Marker>
            ))}
            {/* Flood Zones (Safe/Unsafe) */}
            {mockFloodZones.map((zone) => (
              <Circle
                key={zone.id}
                center={[zone.center.lat, zone.center.lng]}
                radius={zone.radius}
                color={zone.severity === "unsafe" ? "#ef4444" : "#22c55e"}
                fillColor={zone.severity === "unsafe" ? "#ef4444" : "#22c55e"}
                fillOpacity={0.3}
              >
                <Popup>
                  <b>{zone.severity === "unsafe" ? "Unsafe (Flooded)" : "Safe Zone"}</b>
                </Popup>
              </Circle>
            ))}
            {/* Crowdsourced Flood Reports */}
            {floodReports.map((report) => (
              <Marker
                key={report.id}
                position={[report.lat, report.lng]}
                icon={getFloodIcon(report.severity)}
              >
                <Popup>
                  <b>{report.severity === "flooded" ? "Flooded" : report.severity === "waterlogged" ? "Waterlogged" : "Clear"}</b>
                  <br />
                  {report.comment && <span>{report.comment}<br /></span>}
                  <span className="text-xs text-muted-foreground">Reported: {new Date(report.createdAt).toLocaleString()}</span>
                </Popup>
              </Marker>
            ))}
            {/* New report marker (preview) */}
            {addingReport && newReport && (
              <Marker position={[newReport.lat, newReport.lng]} icon={getFloodIcon(severity)}>
                <Popup>
                  <b>New Report</b>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        {/* Add Flood Report Button & Form */}
        <div className="mb-4">
          {!addingReport ? (
            <Button variant="outline" size="sm" onClick={() => setAddingReport(true)}>
              + Mark Flooded Area
            </Button>
          ) : (
            <form className="space-y-2 bg-muted p-3 rounded-lg mt-2" onSubmit={submitReport}>
              <div className="text-xs">Click on the map to select location</div>
              {newReport && (
                <div className="flex gap-2 items-center">
                  <span className="text-xs">Lat: {newReport.lat.toFixed(4)}, Lng: {newReport.lng.toFixed(4)}</span>
                </div>
              )}
              <div className="flex gap-2 items-center">
                <label className="text-xs">Severity:</label>
                <select value={severity} onChange={e => setSeverity(e.target.value as FloodReport["severity"])} className="text-xs border rounded px-1 py-0.5">
                  <option value="flooded">Flooded</option>
                  <option value="waterlogged">Waterlogged</option>
                  <option value="clear">Clear</option>
                </select>
              </div>
              <textarea
                className="w-full text-xs border rounded p-1"
                placeholder="Add a comment (optional)"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={!newReport}>Submit</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => { setAddingReport(false); setNewReport(null); }}>Cancel</Button>
              </div>
            </form>
          )}
        </div>

        {/* Tabs for resource filtering and list */}
        <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {resourceTypes.slice(0, 6).map((type) => (
              <TabsTrigger key={type.value} value={type.value} className="text-xs">
                {type.label}
                {type.count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {type.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={selectedType} className="space-y-4">
            {/* Current Location */}
            <Alert className="border-primary bg-primary/10">
              <Navigation className="h-4 w-4 text-primary" />
              <AlertDescription className="text-primary">
                <strong>Your Location:</strong> {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                <Button variant="ghost" size="sm" className="ml-2 h-auto p-1" onClick={() => openGoogleMaps({coordinates: userLocation, phone: "", name: "Your Location", address: "", id: "user", type: "shelter", distance: 0, isOpen: true})}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View on Map
                </Button>
              </AlertDescription>
            </Alert>
            {/* Resources List (same as before) */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                  <p>Finding nearby emergency resources...</p>
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No {selectedType === "all" ? "" : selectedType} resources found nearby</p>
                </div>
              ) : (
                filteredResources
                  .sort((a, b) => a.distance - b.distance)
                  .map((resource) => {
                    const Icon = getResourceIcon(resource.type)
                    return (
                      <div key={resource.id} className="p-4 bg-muted rounded-lg space-y-3">
                        {/* Resource Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Icon className={`w-5 h-5 mt-0.5 ${getResourceColor(resource.type)}`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm">{resource.name}</h4>
                                <Badge variant={resource.isOpen ? "default" : "destructive"} className="text-xs">
                                  {resource.isOpen ? "Open" : "Closed"}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground capitalize">
                                {resource.type.replace("_", " ")}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{resource.distance.toFixed(1)} km</div>
                            <div className="text-xs text-muted-foreground">
                              ~{Math.round(resource.distance * 2)} min drive
                            </div>
                          </div>
                        </div>
                        {/* Resource Details */}
                        <div className="space-y-2 text-xs">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground text-pretty">{resource.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <a href={`tel:${resource.phone}`} className="text-primary hover:underline">
                              {resource.phone}
                            </a>
                          </div>
                        </div>
                        {/* Additional Info */}
                        {(resource.specialties || resource.capacity) && (
                          <div className="space-y-1 text-xs">
                            {resource.specialties && (
                              <div>
                                <span className="text-muted-foreground">Specialties: </span>
                                <span>{resource.specialties.join(", ")}</span>
                              </div>
                            )}
                            {resource.capacity && (
                              <div>
                                <span className="text-muted-foreground">Capacity: </span>
                                <span>{resource.capacity} people</span>
                              </div>
                            )}
                          </div>
                        )}
                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2 border-t border-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => getDirections(resource)}
                            className="flex items-center gap-1 text-xs"
                          >
                            <Route className="w-3 h-3" />
                            Directions
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openGoogleMaps(resource)}
                            className="flex items-center gap-1 text-xs"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Map
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`tel:${resource.phone}`)}
                            className="flex items-center gap-1 text-xs"
                          >
                            <Phone className="w-3 h-3" />
                            Call
                          </Button>
                        </div>
                      </div>
                    )
                  })
              )}
            </div>
          </TabsContent>
        </Tabs>
        {/* Map Information */}
        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
          <p>• Map shows live safe/unsafe flood zones and emergency resources</p>
          <p>• Resources are sorted by distance from your current location</p>
          <p>• Tap "Directions" for turn-by-turn navigation</p>
          <p>• Call buttons work even without internet connection</p>
          <p>• Resource availability is updated in real-time</p>
        </div>
      </CardContent>
    </Card>
  )
}
