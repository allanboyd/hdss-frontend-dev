"use client"

import { useState } from "react"
import { 
  Search, 
  Plus, 
  Users, 
  Clock, 
  TrendingUp, 
  Shield, 
  Smartphone, 
  Monitor, 
  Mail, 
  Bell
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const helpCategories = [
    { 
      name: "Getting Started", 
      icon: "🚀", 
      color: "bg-gradient-to-r from-blue-500 to-cyan-600",
      description: "Learn the basics and get up to speed quickly",
      articles: 12
    },
    { 
      name: "Research & Analytics", 
      icon: "📊", 
      color: "bg-gradient-to-r from-orange-500 to-amber-600",
      description: "Master research workflows and data analysis",
      articles: 18
    },
    { 
      name: "Household Mapping", 
      icon: "🗺️", 
      color: "bg-gradient-to-r from-green-500 to-emerald-600",
      description: "Navigate household and population mapping tools",
      articles: 15
    },
    { 
      name: "Data Hub", 
      icon: "💾", 
      color: "bg-gradient-to-r from-purple-500 to-pink-600",
      description: "Access and manage datasets effectively",
      articles: 22
    },
    { 
      name: "A-Search Assistant", 
      icon: "🤖", 
      color: "bg-gradient-to-r from-indigo-500 to-purple-600",
      description: "Get help with AI-powered research assistance",
      articles: 8
    },
    { 
      name: "Alerts & Notifications", 
      icon: "🔔", 
      color: "bg-gradient-to-r from-red-500 to-pink-600",
      description: "Configure and manage system alerts",
      articles: 10
    }
  ]

  const quickActions = [
    {
      title: "Contact Support",
      icon: Smartphone,
      color: "bg-gradient-to-r from-blue-500 to-cyan-600",
      description: "Get direct help from our support team",
      action: "Contact Now"
    },
    {
      title: "Video Tutorials",
      icon: Monitor,
      color: "bg-gradient-to-r from-green-500 to-emerald-600",
      description: "Watch step-by-step video guides",
      action: "Watch Videos"
    },
    {
      title: "Documentation",
      icon: Shield,
      color: "bg-gradient-to-r from-purple-500 to-pink-600",
      description: "Browse comprehensive documentation",
      action: "Read Docs"
    },
    {
      title: "Community Forum",
      icon: Users,
      color: "bg-gradient-to-r from-orange-500 to-amber-600",
      description: "Connect with other researchers",
      action: "Join Forum"
    }
  ]

  const announcements = [
    {
      title: "Product Updates",
      icon: TrendingUp,
      color: "text-blue-600",
      badge: "New",
      items: [
        "A-Search Platform v2.1 Release",
        "Enhanced Population Analysis Features",
        "Improved Data Visualization Tools"
      ]
    },
    {
      title: "Security Updates",
      icon: Shield,
      color: "text-red-600",
      badge: "Important",
      items: [
        "Authentication System Updates",
        "Data Privacy Compliance Updates",
        "Security Protocol Enhancements"
      ]
    },
    {
      title: "Training Events",
      icon: Clock,
      color: "text-green-600",
      badge: "Upcoming",
      items: [
        "Research Methodology Workshop",
        "Data Analysis Webinar Series",
        "Platform Training Sessions"
      ]
    },
    {
      title: "Community Highlights",
      icon: TrendingUp,
      color: "text-purple-600",
      badge: "Featured",
      items: [
        "Research Success Stories",
        "Community Best Practices",
        "User Spotlight Features"
      ]
    }
  ]

  const supportChannels = [
    {
      title: "Email Support",
      icon: Mail,
      description: "Get help via email within 24 hours",
      contact: "support@a-search.com",
      availability: "24/7"
    },
    {
      title: "Phone Support",
      icon: Smartphone,
      description: "Speak directly with our support team",
      contact: "+1 (555) 123-4567",
      availability: "Mon-Fri, 9AM-6PM"
    },
    {
      title: "Live Chat",
      icon: Bell,
      description: "Real-time chat with support agents",
      contact: "Available in app",
      availability: "Mon-Fri, 9AM-6PM"
    }
  ]

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
                  <p className="text-gray-600 mt-2">Find answers, get help, and learn how to use A-Search effectively</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="border-gray-300">
                    <Shield className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white">
                    <Bell className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>

              {/* Search Section */}
              <div className="mb-8">
                <div className="relative max-w-2xl">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search help articles, tutorials, and documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Card key={index} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-0 shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 ${action.color} rounded-lg`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <Plus className="w-4 h-4 text-gray-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                          <Button variant="outline" size="sm" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50">
                            {action.action}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Help Categories */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {helpCategories.map((category, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-0 shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 ${category.color} rounded-lg text-white text-xl`}>
                              {category.icon}
                            </div>
                            <Badge className="bg-gray-100 text-gray-600">{category.articles} articles</Badge>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                          <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                          <Button variant="outline" size="sm" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50">
                            Browse Articles
                          </Button>
                        </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Support Channels */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Get Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {supportChannels.map((channel, index) => {
                    const Icon = channel.icon
                    return (
                      <Card key={index} className="border-0 shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{channel.title}</h3>
                              <p className="text-sm text-gray-500">{channel.description}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-500">Contact:</span>
                              <span className="font-medium text-gray-900">{channel.contact}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-500">Available:</span>
                              <span className="font-medium text-gray-900">{channel.availability}</span>
                            </div>
                          </div>
                          <Button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white">
                            Contact Now
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Announcements */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Updates</h2>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {announcements.map((section, index) => {
                    const Icon = section.icon
                    return (
                      <Card key={index} className="border-0 shadow-md">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Icon className={`w-5 h-5 ${section.color}`} />
                              {section.title}
                            </CardTitle>
                            <Badge className="bg-orange-100 text-orange-800">{section.badge}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {section.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer flex items-center gap-2">
                                <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                                {item}
                              </div>
                            ))}
                          </div>
                          <Button variant="link" className="text-orange-600 p-0 h-auto font-medium mt-4">
                            View All →
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">How do I start a new research study?</h3>
                      <p className="text-sm text-gray-600 mb-4">Navigate to the Research & Analytics section and click &quot;Initiate Research&quot; to begin a new study following our 11-step workflow.</p>
                      <Button variant="link" className="text-orange-600 p-0 h-auto text-sm">
                        Read More →
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">How can I access population data?</h3>
                      <p className="text-sm text-gray-600 mb-4">Visit the Data Hub to browse available datasets, request access, and download approved data for your research.</p>
                      <Button variant="link" className="text-orange-600 p-0 h-auto text-sm">
                        Read More →
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">What is the A-Search Assistant?</h3>
                      <p className="text-sm text-gray-600 mb-4">Our AI-powered assistant helps with research design, data analysis, and report generation. Upload files and ask questions for instant help.</p>
                      <Button variant="link" className="text-orange-600 p-0 h-auto text-sm">
                        Read More →
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">How do I manage household data?</h3>
                      <p className="text-sm text-gray-600 mb-4">Use the Household Mapping section to manage sites, households, individuals, and dwelling units with our comprehensive tools.</p>
                      <Button variant="link" className="text-orange-600 p-0 h-auto text-sm">
                        Read More →
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
} 