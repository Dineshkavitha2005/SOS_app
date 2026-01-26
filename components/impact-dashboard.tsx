"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ImpactData {
  social: {
    peopleRescued: number
    familiesSheltered: number
  }
  economic: {
    propertyDamageUSD: number
    reliefFundsDistributedUSD: number
  }
  environmental: {
    areaFloodedSqKm: number
    livestockLost: number
  }
}

export function ImpactDashboard() {
  const [impact, setImpact] = useState<ImpactData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchImpact() {
      try {
        const res = await fetch("/api/impact")
        if (res.ok) {
          const data = await res.json()
          setImpact(data)
        }
      } catch (error) {
        console.error("Failed to fetch impact data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchImpact()
  }, [])

  if (loading) {
    return <div>Loading impact data...</div>
  }

  if (!impact) {
    return <div>No impact data available.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h3 className="font-semibold text-lg">Social Impact</h3>
          <ul className="list-disc list-inside">
            <li>People Rescued: <Badge>{impact.social.peopleRescued}</Badge></li>
            <li>Families Sheltered: <Badge>{impact.social.familiesSheltered}</Badge></li>
          </ul>
        </section>
        <section>
          <h3 className="font-semibold text-lg">Economic Impact</h3>
          <ul className="list-disc list-inside">
            <li>Property Damage (₹): <Badge>₹{impact.economic.propertyDamageUSD.toLocaleString()}</Badge></li>
            <li>Relief Funds Distributed (₹): <Badge>₹{impact.economic.reliefFundsDistributedUSD.toLocaleString()}</Badge></li>
          </ul>
        </section>
        <section>
          <h3 className="font-semibold text-lg">Environmental Impact</h3>
          <ul className="list-disc list-inside">
            <li>Area Flooded (sq km): <Badge>{impact.environmental.areaFloodedSqKm}</Badge></li>
            <li>Livestock Lost: <Badge>{impact.environmental.livestockLost}</Badge></li>
          </ul>
        </section>
      </CardContent>
    </Card>
  )
}
