"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Map,
  AlertTriangle,
  Database,
  Settings,
  LogOut,
  Building2,
  User,
  ChevronRight,
  HelpCircle,
  MessageCircle,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useResponsive } from "@/hooks/use-responsive"


const navigationSections = [
  {
    title: "HOME",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: "Live" },
      { name: "Population Analysis", href: "/population", icon: Users, badge: "30K+" },
      { name: "Health Analysis", href: "/health", icon: FileText, badge: "Active" },
    ]
  },
  {
    title: "APP",
    items: [
      { name: "Household Mapping", href: "/mapping", icon: Map, badge: "Interactive" },
      { name: "Research & Analytics", href: "/analytics", icon: BarChart3, badge: "New" },
      { name: "Data Hub", href: "/datasets", icon: Database, badge: "2.1K+" },
      { name: "A-Search Assistant", href: "/assistant", icon: MessageCircle },
    ]
  },
  {
    title: "SETTINGS",
    items: [
      { name: "Site Management", href: "/dashboard/site-management", icon: Building2, badge: "12 Sites" },
      { name: "Settings", href: "/settings", icon: Settings },
      { name: "Alerts & Notifications", href: "/alerts", icon: AlertTriangle, badge: "3 New" },
      { name: "Help & Support", href: "/help", icon: HelpCircle },
    ]
  }
]

export function Sidebar() {
  const { signOut, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isMobile } = useResponsive()

  const handleLogout = async () => {
    const { error } = await signOut()
    if (!error) {
      router.push('/login')
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }, [isMobile, isMobileMenuOpen])

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "flex flex-col bg-gradient-to-b from-white to-gray-50 h-full transition-transform duration-300 ease-in-out",
        "lg:w-64 w-80",
        "lg:relative fixed lg:translate-x-0 z-50",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo/Brand Section */}
        <div className="flex items-center h-16 px-4 bg-white">
          <Image 
            src="/images/aphrc_mainlogo.png" 
            alt="APHRC Logo" 
            width={48}
            height={48}
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto gap-6 pt-6">
          <nav className="flex-1 px-3 space-y-6">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {section.title}
                </h3>
                <div className="space-y-0">
                  {section.items.map((item) => {
                    const isCurrent = pathname === item.href || 
                      (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          isCurrent
                            ? "bg-gradient-to-r from-gray-50 to-orange-50 text-gray-900 rounded-lg"
                            : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-orange-50 hover:text-gray-900",
                          "group flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200",
                        )}
                      >
                        <item.icon
                          className={cn(
                            isCurrent ? "text-orange-600" : "text-gray-400 group-hover:text-orange-500",
                            "mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200",
                          )}
                        />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Section */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-white">
          {user && (
            <div className="flex items-center space-x-3 mb-3 p-3 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
