"use client"

import { Users } from "lucide-react"
import { ComingSoon } from "@/components/ui/coming-soon"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function PopulationPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        title="Population Analysis"
        description="Advanced population analytics and demographic insights for comprehensive research data analysis"
        icon={Users}
        targetDate={new Date('2024-11-15T23:59:59')}
        features={[
          "Demographic breakdowns by age, gender, and location",
          "Population growth trends and projections",
          "Migration patterns and mobility analysis",
          "Household composition and family structures",
          "Interactive charts and visualizations",
          "Export capabilities for research reports",
          "Real-time data updates and synchronization",
          "Comparative analysis across research sites"
        ]}
      />
    </ProtectedRoute>
  )
} 