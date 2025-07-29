"use client"

import { useState } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Filter, 
  Download,
  Users,
  MapPin,
  Home
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { TopBar } from "@/components/dashboard/top-bar"
import { Sidebar } from "@/components/dashboard/sidebar"

interface PopulationMetric {
  id: string
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface RecentActivity {
  id: string
  name: string
  email: string
  status: string
  householdId: string
  timeAgo: string
  value: string
  avatar: string
}

const populationMetrics: PopulationMetric[] = [
  {
    id: "1",
    title: "Total Population",
    value: "2,847,392",
    change: "↑ +15.2% +374,521 this year",
    changeType: "positive",
    icon: Users,
    color: "bg-gradient-to-r from-blue-500 to-cyan-600"
  },
  {
    id: "2",
    title: "Growth Rate",
    value: "2.8%",
    change: "↑ +0.3% +0.2 this year",
    changeType: "positive",
    icon: TrendingUp,
    color: "bg-gradient-to-r from-green-500 to-emerald-600"
  },
  {
    id: "3",
    title: "Households",
    value: "684,293",
    change: "↑ +12.4% +75,432 this year",
    changeType: "positive",
    icon: Home,
    color: "bg-gradient-to-r from-orange-500 to-amber-600"
  },
  {
    id: "4",
    title: "Density (per km²)",
    value: "156",
    change: "↑ +8.7% +12.5 this year",
    changeType: "positive",
    icon: MapPin,
    color: "bg-gradient-to-r from-purple-500 to-pink-600"
  }
]

const recentActivities: RecentActivity[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@census.gov",
    status: "Survey Complete",
    householdId: "#74568320",
    timeAgo: "5 min ago",
    value: "Household Survey",
    avatar: "MR"
  },
  {
    id: "2",
    name: "David Thompson",
    email: "david.thompson@census.gov",
    status: "Data Entry",
    householdId: "#15648399",
    timeAgo: "10 min ago",
    value: "Population Count",
    avatar: "DT"
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah.johnson@census.gov",
    status: "Verification",
    householdId: "#15697913",
    timeAgo: "15 min ago",
    value: "Demographic Data",
    avatar: "SJ"
  },
  {
    id: "4",
    name: "Michael Chen",
    email: "michael.chen@census.gov",
    status: "Analysis",
    householdId: "#15697914",
    timeAgo: "20 min ago",
    value: "Migration Study",
    avatar: "MC"
  }
]

const demographicCategories = [
  { name: "Working Age (18-65)", percentage: 55, color: "bg-blue-500" },
  { name: "Children (0-17)", percentage: 25, color: "bg-green-500" },
  { name: "Elderly (65+)", percentage: 15, color: "bg-purple-500" },
  { name: "Other", percentage: 5, color: "bg-gray-400" }
]



export default function PopulationPage() {
  const [timeRange, setTimeRange] = useState("month")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Survey Complete":
        return "bg-green-100 text-green-800"
      case "Data Entry":
        return "bg-blue-100 text-blue-800"
      case "Verification":
        return "bg-yellow-100 text-yellow-800"
      case "Analysis":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
                  <h1 className="text-3xl font-bold text-gray-900">Hello, Dr. Sarah!</h1>
                  <p className="text-gray-600 mt-2">Here&apos;s your population analytics detail</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="border-gray-300">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter by
                  </Button>
                  <Button variant="outline" className="border-gray-300">
                    <Download className="w-4 h-4 mr-2" />
                    Exports
                  </Button>
                </div>
              </div>

              {/* Population Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {populationMetrics.map((metric) => {
                  const Icon = metric.icon
                  return (
                    <Card key={metric.id} className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 ${metric.color} rounded-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{metric.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-1 text-sm ${
                            metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {metric.changeType === 'positive' ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {metric.change}
                          </div>
                          <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                            View Report
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Population Growth Trend */}
                <div className="lg:col-span-1">
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900">Population Growth</CardTitle>
                        <Select value={timeRange} onValueChange={setTimeRange}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                            <SelectItem value="quarter">Quarter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">2.8%</span>
                          <span className="text-green-600 text-sm">↑ +0.3%</span>
                        </div>
                        <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-400">📈</div>
                            <p className="text-sm text-gray-500">Growth Chart</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Migration Trend */}
                <div className="lg:col-span-1">
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900">Migration Flow</CardTitle>
                        <Select value={timeRange} onValueChange={setTimeRange}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                            <SelectItem value="quarter">Quarter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">+1,100</span>
                          <span className="text-green-600 text-sm">↑ +12%</span>
                        </div>
                        <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-400">🔄</div>
                            <p className="text-sm text-gray-500">Migration Chart</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Research Budget */}
                <div className="lg:col-span-1">
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900">Research Budget</CardTitle>
                        <Select value={timeRange} onValueChange={setTimeRange}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                            <SelectItem value="quarter">Quarter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">$156,400.12</span>
                          <span className="text-green-600 text-sm">↑ +15%</span>
                        </div>
                        <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-400">💰</div>
                            <p className="text-sm text-gray-500">Budget Chart</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            <span>Allocated</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                            <span>Spent</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
                      <Select defaultValue="24h">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">Last 1h</SelectItem>
                          <SelectItem value="24h">Last 24h</SelectItem>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {activity.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{activity.name}</p>
                              <p className="text-sm text-gray-500">{activity.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                            <p className="text-sm text-gray-500 mt-1">{activity.householdId}</p>
                            <p className="text-sm text-gray-500">{activity.timeAgo}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{activity.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Demographic Distribution */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900">Demographic Distribution</CardTitle>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All time</SelectItem>
                          <SelectItem value="month">This month</SelectItem>
                          <SelectItem value="quarter">This quarter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-400">📊</div>
                          <p className="text-sm text-gray-500">Demographics Chart</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {demographicCategories.map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 ${category.color} rounded-full`}></div>
                              <span className="text-sm text-gray-700">{category.name}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{category.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
} 