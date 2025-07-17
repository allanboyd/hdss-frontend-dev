"use client"

import { AlertTriangle } from "lucide-react"
import { ComingSoon } from "@/components/ui/coming-soon"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AlertsPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        title="Alerts & Notifications"
        description="Comprehensive alert management and notification system for research activities and data updates"
        icon={AlertTriangle}
        targetDate={new Date('2024-11-25T23:59:59')}
        features={[
          "Real-time alert monitoring and management",
          "Custom notification rules and triggers",
          "Multi-channel notification delivery",
          "Alert history and analytics",
          "Team collaboration alerts",
          "Data quality and validation alerts",
          "System health and performance monitoring",
          "Escalation and priority management"
        ]}
      />
    </ProtectedRoute>
  )
} 