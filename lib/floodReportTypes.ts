export type FloodReport = {
  id: string
  lat: number
  lng: number
  severity: "flooded" | "waterlogged" | "clear"
  comment?: string
  createdAt: string
}