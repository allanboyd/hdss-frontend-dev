"use client"

import { BarChart3 } from "lucide-react"
import { ComingSoon } from "@/components/ui/coming-soon"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        title="Research & Analytics"
        description="Advanced research analytics and statistical analysis tools for comprehensive data insights"
        icon={BarChart3}
        targetDate={new Date('2024-11-20T23:59:59')}
        features={[
          "Advanced statistical analysis and modeling",
          "Machine learning and predictive analytics",
          "Custom dashboard creation and sharing",
          "Real-time data visualization",
          "Multi-variable correlation analysis",
          "Research methodology templates",
          "Collaborative analysis workspaces",
          "Publication-ready chart generation"
        ]}
      />
    </ProtectedRoute>
  )
} 