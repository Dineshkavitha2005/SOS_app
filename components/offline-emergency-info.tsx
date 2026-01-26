import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Phone, MapPin } from "lucide-react"

const EMERGENCY_NUMBERS = [
  { label: "Police", number: "100" },
  { label: "Fire", number: "101" },
  { label: "Ambulance", number: "102" },
  { label: "Disaster Helpline", number: "108" },
  { label: "Flood Control", number: "1070" },
]

export function OfflineEmergencyInfo() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Emergency Numbers (Offline)</CardTitle>
        <CardDescription>These numbers are always available, even without internet.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {EMERGENCY_NUMBERS.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span className="font-medium">{item.label}:</span>
              <a href={`tel:${item.number}`} className="text-primary hover:underline">{item.number}</a>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>Basic map and numbers are available offline.</span>
        </div>
      </CardContent>
    </Card>
  )
}
