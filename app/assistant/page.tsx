"use client"

import { MessageCircle } from "lucide-react"
import { ComingSoon } from "@/components/ui/coming-soon"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AssistantPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        title="A-Search Assistant"
        description="AI-powered research assistant for intelligent data search, analysis, and insights generation"
        icon={MessageCircle}
        targetDate={new Date('2025-01-15T23:59:59')}
        features={[
          "Natural language data queries and search",
          "AI-powered insights and recommendations",
          "Automated report generation",
          "Intelligent data pattern recognition",
          "Voice-activated research assistance",
          "Multi-language support and translation",
          "Predictive analytics suggestions",
          "Collaborative AI research workflows"
        ]}
      />
    </ProtectedRoute>
  )
} 