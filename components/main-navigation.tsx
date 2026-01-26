import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Bell, BarChart2, Newspaper, Phone } from "lucide-react"

const NAV_LINKS = [
  { href: "/", label: "Dashboard", icon: BarChart2 },
  { href: "/maps", label: "Flood Map", icon: MapPin },
  { href: "/offline-emergency-info", label: "Emergency Info", icon: Phone },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/alerts", label: "Alerts", icon: Bell },
]

export function MainNavigation() {
  const pathname = usePathname()
  return (
    <nav className="w-full flex justify-center py-2 bg-card border-b border-border mb-4">
      <ul className="flex gap-4">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href
          return (
            <li key={link.href}>
              <Link href={link.href} className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
