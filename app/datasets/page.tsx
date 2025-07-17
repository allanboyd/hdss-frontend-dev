"use client"

import { Database } from "lucide-react"
import { ComingSoon } from "@/components/ui/coming-soon"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DatasetsPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        title="Data Hub"
        description="Centralized data management and repository for all research datasets and resources"
        icon={Database}
        targetDate={new Date('2024-12-15T23:59:59')}
        features={[
          "Centralized dataset repository and management",
          "Advanced search and filtering capabilities",
          "Data versioning and change tracking",
          "Secure data sharing and collaboration",
          "Automated data quality checks",
          "API access for external integrations",
          "Data backup and recovery systems",
          "Compliance and governance tools"
        ]}
      />
    </ProtectedRoute>
  )
} 