"use client"

import { useState, useEffect } from "react"
import { 
  Search, 
  Globe, 
  MapPin, 
  Home, 
  Building, 
  Users,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { TopBar } from "@/components/dashboard/top-bar"
import { Sidebar } from "@/components/dashboard/sidebar"
import { CountriesTab } from "@/components/site-management/countries-tab"
import { SitesTab } from "@/components/site-management/sites-tab"
import { VillagesTab } from "@/components/site-management/villages-tab"
import { StructuresTab } from "@/components/site-management/structures-tab"
import { DwellingUnitsTab } from "@/components/site-management/dwelling-units-tab"
import { geographicCountsService } from "@/lib/site-management"
import { GeographicCounts } from "@/types/site-management"

export default function SiteManagementPage() {
  const [activeTab, setActiveTab] = useState("countries")
  const [searchQuery, setSearchQuery] = useState("")
  const [counts, setCounts] = useState<GeographicCounts | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const countsData = await geographicCountsService.getCounts()
        setCounts(countsData)
      } catch (error) {
        console.error('Error loading counts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCounts()
  }, [])

  const stats = [
    {
      title: "Countries",
      value: counts?.countries_count || 0,
      icon: Globe,
      description: "Total countries",
      color: "text-blue-600"
    },
    {
      title: "Sites",
      value: counts?.sites_count || 0,
      icon: MapPin,
      description: "Research sites",
      color: "text-green-600"
    },
    {
      title: "Villages",
      value: counts?.villages_count || 0,
      icon: Home,
      description: "Villages surveyed",
      color: "text-orange-600"
    },
    {
      title: "Structures",
      value: counts?.structures_count || 0,
      icon: Building,
      description: "Buildings recorded",
      color: "text-purple-600"
    },
    {
      title: "Dwelling Units",
      value: counts?.dwelling_units_count || 0,
      icon: Users,
      description: "Housing units",
      color: "text-red-600"
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
                  <h1 className="text-3xl font-bold text-gray-900">Site Management</h1>
                  <p className="text-gray-600 mt-2">Manage geographic data and research sites</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search records..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                </div>
              </div>
            </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <Card key={stat.title} className="hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </CardTitle>
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                          {loading ? (
                            <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                          ) : (
                            stat.value.toLocaleString()
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {stat.description}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>

              {/* Last Updated Info */}
              {counts?.last_updated && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Activity className="w-4 h-4" />
                  <span>Last updated: {new Date(counts.last_updated).toLocaleString()}</span>
                  </div>
                )}

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="countries" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Countries
                  </TabsTrigger>
                  <TabsTrigger value="sites" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Sites
                  </TabsTrigger>
                  <TabsTrigger value="villages" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Villages
                  </TabsTrigger>
                  <TabsTrigger value="structures" className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Structures
                  </TabsTrigger>
                  <TabsTrigger value="dwelling-units" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Dwelling Units
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="countries" className="mt-6">
                  <CountriesTab searchQuery={searchQuery} />
                </TabsContent>
                <TabsContent value="sites" className="mt-6">
                  <SitesTab searchQuery={searchQuery} />
                </TabsContent>
                <TabsContent value="villages" className="mt-6">
                  <VillagesTab searchQuery={searchQuery} />
                </TabsContent>
                <TabsContent value="structures" className="mt-6">
                  <StructuresTab searchQuery={searchQuery} />
                </TabsContent>
                <TabsContent value="dwelling-units" className="mt-6">
                  <DwellingUnitsTab searchQuery={searchQuery} />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
} 