"use client"

import { FileText } from "lucide-react"
import { ComingSoon } from "@/components/ui/coming-soon"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function HealthPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        title="Health Analysis"
        description="Comprehensive health data analysis and medical research insights for population health studies"
        icon={FileText}
        targetDate={new Date('2024-12-01T23:59:59')}
        features={[
          "Health indicators and vital statistics tracking",
          "Disease prevalence and incidence analysis",
          "Healthcare access and utilization patterns",
          "Maternal and child health metrics",
          "Nutrition and dietary assessment tools",
          "Mental health and wellness indicators",
          "Environmental health impact analysis",
          "Health outcome predictions and modeling"
        ]}
      />
    </ProtectedRoute>
  )
} 