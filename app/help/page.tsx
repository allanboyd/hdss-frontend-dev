"use client"

import { HelpCircle } from "lucide-react"
import { ComingSoon } from "@/components/ui/coming-soon"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function HelpPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        title="Help & Support"
        description="Comprehensive help documentation, tutorials, and support resources for all platform features"
        icon={HelpCircle}
        targetDate={new Date('2024-12-05T23:59:59')}
        features={[
          "Interactive tutorials and walkthroughs",
          "Comprehensive knowledge base and FAQs",
          "Video tutorials and training materials",
          "Live chat support and assistance",
          "Community forums and discussions",
          "Bug reporting and feature requests",
          "Training and onboarding resources",
          "API documentation and developer guides"
        ]}
      />
    </ProtectedRoute>
  )
} 