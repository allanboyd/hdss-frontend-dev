"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  padding?: "none" | "small" | "medium" | "large"
  maxWidth?: "none" | "sm" | "md" | "lg" | "xl" | "2xl"
}

export function ResponsiveContainer({ 
  children, 
  className,
  padding = "medium",
  maxWidth = "none"
}: ResponsiveContainerProps) {
  const paddingClasses = {
    none: "",
    small: "p-2 sm:p-4",
    medium: "p-4 sm:p-6 lg:p-8",
    large: "p-6 sm:p-8 lg:p-12"
  }

  const maxWidthClasses = {
    none: "",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl"
  }

  return (
    <div className={cn(
      "w-full",
      paddingClasses[padding],
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  )
} 