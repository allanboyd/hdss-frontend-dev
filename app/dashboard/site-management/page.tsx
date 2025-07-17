"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { 
  Building2, 
  Users, 
  MapPin,
  UserPlus,
  Plus, 
  Search,
  MoreHorizontal
} from "lucide-react"

// Mock data - in a real app, this would come from your database
const sites = [
  {
    id: 1,
    name: "Korogacho",
    country: "Kenya",
    description: "Nairobi slum area research site",
    villages: 3,
    users: 12,
    status: "active"
  },
  {
    id: 2,
    name: "Kibera",
    country: "Kenya", 
    description: "Largest slum in Nairobi",
    villages: 2,
    users: 8,
    status: "active"
  },
  {
    id: 3,
    name: "Kampala Urban",
    country: "Uganda",
    description: "Urban research site in Kampala",
    villages: 2,
    users: 15,
    status: "active"
  }
]

const villages = [
  {
    id: 1,
    name: "Village A",
    site: "Korogacho",
    country: "Kenya",
    households: 150,
    population: 750,
    status: "active"
  },
  {
    id: 2,
    name: "Village B",
    site: "Korogacho",
    country: "Kenya",
    households: 120,
    population: 600,
    status: "active"
  },
  {
    id: 3,
    name: "Central Village",
    site: "Kampala Urban",
    country: "Uganda",
    households: 200,
    population: 1000,
    status: "active"
  }
]

const siteUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Field Agent",
    site: "Korogacho",
    status: "active"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com", 
    role: "Researcher",
    site: "Kibera",
    status: "active"
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Site Manager",
    site: "Kampala Urban",
    status: "inactive"
  }
]

const accountRequests = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Field Agent",
    site: "Korogacho",
    status: "pending",
    requestedAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Mike Wilson",
    email: "mike@example.com",
    role: "Researcher",
    site: "Kibera",
    status: "approved",
    requestedAt: "2024-01-10"
  },
  {
    id: 3,
    name: "Sarah Brown",
    email: "sarah@example.com",
    role: "Data Analyst",
    site: "Kampala Urban",
    status: "rejected",
    requestedAt: "2024-01-08"
  }
]

export default function SiteManagementPage() {
  const [activeTab, setActiveTab] = useState("sites")
  const [searchTerm, setSearchTerm] = useState("")

  const tabs = [
    { id: "sites", name: "Sites", icon: Building2, count: sites.length },
    { id: "villages", name: "Villages", icon: MapPin, count: villages.length },
    { id: "site-users", name: "Site Users", icon: Users, count: siteUsers.length },
    { id: "account-requests", name: "Account Requests", icon: UserPlus, count: accountRequests.length },
  ]

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredVillages = villages.filter(village => 
    village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    village.site.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredUsers = siteUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.site.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredRequests = accountRequests.filter(request => 
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.site.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />

          <div className="flex-1 flex overflow-hidden">
            {/* Page Menu Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Site Management</h2>
                
                {/* Page Menu */}
                <div>
                  <h3 className="px-3 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    PAGES
                  </h3>
                  <div className="space-y-0">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                            activeTab === tab.id
                              ? "bg-gradient-to-r from-gray-50 to-orange-50 text-gray-900"
                              : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-orange-50 hover:text-gray-900"
                          }`}
                        >
                          <Icon className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                            activeTab === tab.id ? "text-orange-600" : "text-gray-400 group-hover:text-orange-500"
                          }`} />
                          <span className="flex-1 text-left">{tab.name}</span>
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                            {tab.count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Breadcrumb */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Site Management &gt; {tabs.find(tab => tab.id === activeTab)?.name}</h1>
              </div>

              {/* Search and Actions */}
              <div className="flex items-center justify-between mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </div>

              {/* Content Area */}
              <div className="max-w-4xl">
                {activeTab === "sites" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSites.map((site) => (
                      <Card key={site.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{site.name}</CardTitle>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600">{site.description}</p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Country:</span>
                              <span className="font-medium">{site.country}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Villages:</span>
                              <span className="font-medium">{site.villages}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Users:</span>
                              <span className="font-medium">{site.users}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 text-sm">Status:</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                site.status === 'active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {site.status}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === "villages" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVillages.map((village) => (
                      <Card key={village.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{village.name}</CardTitle>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600">{village.site}, {village.country}</p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Households:</span>
                              <span className="font-medium">{village.households}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Population:</span>
                              <span className="font-medium">{village.population}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 text-sm">Status:</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                village.status === 'active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {village.status}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === "site-users" && (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <Card key={user.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{user.name}</h3>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <p className="text-sm text-gray-500">{user.role} • {user.site}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.status === 'active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {user.status}
                              </span>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === "account-requests" && (
                  <div className="space-y-4">
                    {filteredRequests.map((request) => (
                      <Card key={request.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserPlus className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{request.name}</h3>
                                <p className="text-sm text-gray-500">{request.email}</p>
                                <p className="text-sm text-gray-500">{request.role} • {request.site}</p>
                                <p className="text-xs text-gray-400">Requested: {request.requestedAt}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                request.status === 'approved' 
                                  ? 'bg-green-100 text-green-700'
                                  : request.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {request.status}
                              </span>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 