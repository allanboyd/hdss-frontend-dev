"use client"

import { useState, useEffect } from "react"

interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
  screenWidth: number
  screenHeight: number
}

export function useResponsive(): ResponsiveState {
  const [responsiveState, setResponsiveState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    screenWidth: 0,
    screenHeight: 0,
  })

  useEffect(() => {
    const updateResponsiveState = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setResponsiveState({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024 && width < 1280,
        isLargeDesktop: width >= 1280,
        screenWidth: width,
        screenHeight: height,
      })
    }

    // Set initial state
    updateResponsiveState()

    // Add event listener
    window.addEventListener("resize", updateResponsiveState)

    // Cleanup
    return () => window.removeEventListener("resize", updateResponsiveState)
  }, [])

  return responsiveState
} 