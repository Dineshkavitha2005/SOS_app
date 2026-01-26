import { useEffect, useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BarChart2, CloudRain, AlertTriangle, Users, AlertCircle } from "lucide-react"

export function RainfallFloodDashboard() {
  const [rainfall, setRainfall] = useState<number | null>(null)
  const [floodSeverity, setFloodSeverity] = useState<number | null>(null)
  const [reportStats, setReportStats] = useState<{ flooded: number; waterlogged: number; clear: number }>({ flooded: 0, waterlogged: 0, clear: 0 })

  // SOS button state
  const [isPressingSOS, setIsPressingSOS] = useState(false)
  const [sosProgress, setSosProgress] = useState(0)
  const sosTimerRef = useRef<NodeJS.Timeout | null>(null)
  const sosStartTimeRef = useRef<number>(0)

  useEffect(() => {
    // Fetch rainfall data
    fetch("/api/weather")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then((data) => setRainfall(data.rainfall || null))
      .catch((error) => {
        console.error("Error fetching weather data:", error)
        setRainfall(null)
      })

    // Fetch flood severity (mock: use rainfall for now)
    fetch("/api/disaster-alerts")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then((data) => setFloodSeverity(data.severity || null))
      .catch((error) => {
        console.error("Error fetching disaster alerts:", error)
        setFloodSeverity(null)
      })

    // Fetch crowdsourced report stats
    fetch("/api/flood-reports")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const stats = { flooded: 0, waterlogged: 0, clear: 0 }
        for (const r of data.reports || []) {
          if (r.severity === "flooded") stats.flooded++
          else if (r.severity === "waterlogged") stats.waterlogged++
          else if (r.severity === "clear") stats.clear++
        }
        setReportStats(stats)
      })
      .catch((error) => {
        console.error("Error fetching flood reports:", error)
        setReportStats({ flooded: 0, waterlogged: 0, clear: 0 })
      })
  }, [])

  return (
    <>
      <Button
        variant="destructive"
        className="w-full mb-4 text-lg font-bold"
        onMouseDown={() => {
          setIsPressingSOS(true)
          sosStartTimeRef.current = Date.now()
          sosTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - sosStartTimeRef.current
            setSosProgress(Math.min(elapsed / 5000, 1))
            if (elapsed >= 5000) {
              clearInterval(sosTimerRef.current!)
              setIsPressingSOS(false)
              setSosProgress(0)
              alert("SOS triggered!")
              // TODO: Implement actual SOS action here
            }
          }, 100)
        }}
        onMouseUp={() => {
          setIsPressingSOS(false)
          setSosProgress(0)
          if (sosTimerRef.current) clearInterval(sosTimerRef.current)
        }}
        onMouseLeave={() => {
          setIsPressingSOS(false)
          setSosProgress(0)
          if (sosTimerRef.current) clearInterval(sosTimerRef.current)
        }}
      >
        {isPressingSOS ? `Hold to send SOS... ${Math.round(sosProgress * 100)}%` : "Press and Hold to Send SOS"}
      </Button>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-primary" />
            Dashboard: Rainfall & Flood Stats
          </CardTitle>
          <CardDescription>Live rainfall, flood severity, and crowdsourced reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <CloudRain className="w-6 h-6 text-blue-500 mb-1" />
              <div className="font-bold text-lg">{rainfall !== null ? rainfall + " mm" : "-"}</div>
              <div className="text-xs text-muted-foreground">Rainfall (24h)</div>
            </div>
            <div className="flex flex-col items-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mb-1" />
              <div className="font-bold text-lg">{floodSeverity !== null ? floodSeverity + "/10" : "-"}</div>
              <div className="text-xs text-muted-foreground">Flood Severity</div>
              <Progress value={floodSeverity !== null ? floodSeverity * 10 : 0} className="w-24 mt-1" />
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-6 h-6 text-green-500 mb-1" />
              <div className="font-bold text-lg">{reportStats.flooded} / {reportStats.waterlogged} / {reportStats.clear}</div>
              <div className="text-xs text-muted-foreground">Reports: Flooded / Waterlogged / Clear</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
