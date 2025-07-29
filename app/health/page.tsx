"use client"

import { useState } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Filter, 
  Download,
  Activity,
  Heart,
  Users,
  CheckCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { TopBar } from "@/components/dashboard/top-bar"
import { Sidebar } from "@/components/dashboard/sidebar"

interface HealthMetric {
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
  patientId: string
  timeAgo: string
  value: string
  avatar: string
}

const healthMetrics: HealthMetric[] = [
  {
    id: "1",
    title: "Total Patients",
    value: "12,832",
    change: "↑ +20.1% +2,123 today",
    changeType: "positive",
    icon: Users,
    color: "bg-gradient-to-r from-blue-500 to-cyan-600"
  },
  {
    id: "2",
    title: "Health Score",
    value: "87.5%",
    change: "↑ +10.6% +8.2 today",
    changeType: "positive",
    icon: Heart,
    color: "bg-gradient-to-r from-green-500 to-emerald-600"
  },
  {
    id: "3",
    title: "Disease Cases",
    value: "1,062",
    change: "↓ -10% -426 today",
    changeType: "negative",
    icon: Activity,
    color: "bg-gradient-to-r from-red-500 to-pink-600"
  },
  {
    id: "4",
    title: "Recovery Rate",
    value: "94.2%",
    change: "↑ +12% +42 today",
    changeType: "positive",
    icon: CheckCircle,
    color: "bg-gradient-to-r from-purple-500 to-pink-600"
  }
]

const recentActivities: RecentActivity[] = [
  {
    id: "1",
    name: "Dr. Sarah Kimani",
    email: "sarah.kimani@healthcare.com",
    status: "Consultation",
    patientId: "#74568320",
    timeAgo: "5 min ago",
    value: "Patient Assessment",
    avatar: "SK"
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    email: "michael.chen@healthcare.com",
    status: "Treatment",
    patientId: "#15648399",
    timeAgo: "10 min ago",
    value: "Vaccination",
    avatar: "MC"
  },
  {
    id: "3",
    name: "Dr. Aisha Patel",
    email: "aisha.patel@healthcare.com",
    status: "Follow-up",
    patientId: "#15697913",
    timeAgo: "15 min ago",
    value: "Health Check",
    avatar: "AP"
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    email: "james.wilson@healthcare.com",
    status: "Emergency",
    patientId: "#15697914",
    timeAgo: "20 min ago",
    value: "Critical Care",
    avatar: "JW"
  }
]

const healthCategories = [
  { name: "Cardiovascular", percentage: 35, color: "bg-red-500" },
  { name: "Respiratory", percentage: 25, color: "bg-blue-500" },
  { name: "Mental Health", percentage: 20, color: "bg-purple-500" },
  { name: "Other", percentage: 20, color: "bg-gray-400" }
]



export default function HealthPage() {
  const [timeRange, setTimeRange] = useState("month")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Consultation":
        return "bg-blue-100 text-blue-800"
      case "Treatment":
        return "bg-green-100 text-green-800"
      case "Follow-up":
        return "bg-yellow-100 text-yellow-800"
      case "Emergency":
        return "bg-red-100 text-red-800"
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
                  <h1 className="text-3xl font-bold text-gray-900">Hello, Dr. Rishi!</h1>
                  <p className="text-gray-600 mt-2">Here&apos;s your health analytics detail</p>
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

              {/* Health Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {healthMetrics.map((metric) => {
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
                {/* Health Score Trend */}
                <div className="lg:col-span-1">
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900">Health Score Trend</CardTitle>
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
                          <span className="text-2xl font-bold text-gray-900">87.5%</span>
                          <span className="text-green-600 text-sm">↑ +10%</span>
                        </div>
                        <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-400">📈</div>
                            <p className="text-sm text-gray-500">Health Score Chart</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Disease Cases Trend */}
                <div className="lg:col-span-1">
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900">Disease Cases</CardTitle>
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
                          <span className="text-2xl font-bold text-gray-900">1,062</span>
                          <span className="text-red-600 text-sm">↓ -10%</span>
                        </div>
                        <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-400">📊</div>
                            <p className="text-sm text-gray-500">Cases Chart</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Revenue Chart */}
                <div className="lg:col-span-1">
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900">Healthcare Revenue</CardTitle>
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
                          <span className="text-2xl font-bold text-gray-900">$86,400.12</span>
                          <span className="text-green-600 text-sm">↑ +10%</span>
                        </div>
                        <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-400">💰</div>
                            <p className="text-sm text-gray-500">Revenue Chart</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            <span>Revenue</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                            <span>Expenses</span>
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
                            <p className="text-sm text-gray-500 mt-1">{activity.patientId}</p>
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

                {/* Health Categories */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900">Health Categories</CardTitle>
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
                          <p className="text-sm text-gray-500">Health Categories Chart</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {healthCategories.map((category, index) => (
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