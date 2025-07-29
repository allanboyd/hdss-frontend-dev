"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Clock, CheckCircle, AlertCircle, Play, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"

// Research status types
type ResearchStatus = 'active' | 'pending' | 'completed' | 'draft'

// Research step types
type ResearchStep = 
  | 'define-topic'
  | 'define-questions' 
  | 'map-questions'
  | 'identify-data'
  | 'collect-data'
  | 'attach-documents'
  | 'define-methodology'
  | 'analyze-data'
  | 'draft-report'
  | 'peer-review'
  | 'finalize'

interface ResearchProject {
  id: string
  title: string
  description: string
  status: ResearchStatus
  currentStep: ResearchStep
  progress: number
  department: string
  type: string
  location: string
  createdAt: string
  updatedAt: string
  deadline?: string
}

const mockResearchData: ResearchProject[] = [
  {
    id: "1",
    title: "Maternal Mortality Trends in Rural Kenya",
    description: "Comprehensive analysis of maternal health outcomes and contributing factors in rural communities",
    status: "active",
    currentStep: "analyze-data",
    progress: 75,
    department: "Health",
    type: "Population Study",
    location: "Rural Kenya",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-28"
  },
  {
    id: "2", 
    title: "Youth Access to Reproductive Health Services",
    description: "Assessment of barriers and facilitators to reproductive health service access among youth",
    status: "pending",
    currentStep: "define-questions",
    progress: 20,
    department: "Population",
    type: "Service Assessment",
    location: "Sub-Saharan Africa",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-25"
  },
  {
    id: "3",
    title: "Impact of Population Density on COVID-19 Spread",
    description: "Analysis of urban density patterns and their correlation with disease transmission rates",
    status: "completed",
    currentStep: "finalize",
    progress: 100,
    department: "Health",
    type: "Epidemiological Study",
    location: "Urban Slums",
    createdAt: "2023-12-01",
    updatedAt: "2024-01-15"
  },
  {
    id: "4",
    title: "Healthcare Infrastructure Mapping",
    description: "Comprehensive mapping of healthcare facilities and their service coverage areas",
    status: "active",
    currentStep: "collect-data",
    progress: 45,
    department: "Health",
    type: "Infrastructure Study",
    location: "National",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-27"
  },
  {
    id: "5",
    title: "Population Migration Patterns Analysis",
    description: "Study of internal migration trends and their impact on healthcare access",
    status: "draft",
    currentStep: "define-topic",
    progress: 5,
    department: "Population",
    type: "Migration Study",
    location: "Cross-Regional",
    createdAt: "2024-01-30",
    updatedAt: "2024-01-30"
  },
  {
    id: "6",
    title: "Nutritional Status Assessment",
    description: "Evaluation of nutritional indicators and food security in vulnerable populations",
    status: "pending",
    currentStep: "identify-data",
    progress: 30,
    department: "Health",
    type: "Nutritional Study",
    location: "Rural Communities",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-26"
  }
]

const stepLabels: Record<ResearchStep, string> = {
  'define-topic': 'Define Research Topic',
  'define-questions': 'Define Research Questions',
  'map-questions': 'Map Sub-Questions',
  'identify-data': 'Identify Missing Data',
  'collect-data': 'Initiate Data Collection',
  'attach-documents': 'Attach Supporting Documents',
  'define-methodology': 'Define Research Methodology',
  'analyze-data': 'Perform Data Analysis',
  'draft-report': 'Draft Initial Report',
  'peer-review': 'Peer Review & Feedback',
  'finalize': 'Finalize Documentation'
}

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: Play },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
}

const departmentColors = {
  'Health': 'bg-green-500',
  'Population': 'bg-blue-500',
  'Infrastructure': 'bg-purple-500',
  'Nutrition': 'bg-orange-500'
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<ResearchStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResearch = mockResearchData.filter(project => {
    const matchesFilter = activeFilter === 'all' || project.status === activeFilter
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusCount = (status: ResearchStatus) => {
    return mockResearchData.filter(project => project.status === status).length
  }

  const handleInitiateResearch = () => {
    // Navigate to research initiation page
    router.push('/analytics/initiate')
  }

  const handleContinueResearch = (projectId: string, currentStep: ResearchStep) => {
    // Navigate to specific step of the research
    router.push(`/analytics/initiate?project=${projectId}&step=${currentStep}`)
  }

  const handleViewReport = (projectId: string) => {
    // Navigate to research report page
    router.push(`/analytics/report/${projectId}`)
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-0">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Research</h1>
                    <p className="text-gray-600">Manage research projects and analytics</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search research..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button onClick={handleInitiateResearch} className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Initiate Research
                  </Button>
                </div>
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={activeFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                  className={activeFilter === 'all' ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white' : ''}
                >
                  All ({mockResearchData.length})
                </Button>
                <Button
                  variant={activeFilter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('active')}
                  className={`flex items-center gap-1 ${activeFilter === 'active' ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white' : ''}`}
                >
                  <Play className="w-3 h-3" />
                  Active ({getStatusCount('active')})
                </Button>
                <Button
                  variant={activeFilter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('pending')}
                  className={`flex items-center gap-1 ${activeFilter === 'pending' ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white' : ''}`}
                >
                  <Clock className="w-3 h-3" />
                  Pending ({getStatusCount('pending')})
                </Button>
                <Button
                  variant={activeFilter === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('completed')}
                  className={`flex items-center gap-1 ${activeFilter === 'completed' ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white' : ''}`}
                >
                  <CheckCircle className="w-3 h-3" />
                  Completed ({getStatusCount('completed')})
                </Button>
                <Button
                  variant={activeFilter === 'draft' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('draft')}
                  className={`flex items-center gap-1 ${activeFilter === 'draft' ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white' : ''}`}
                >
                  <AlertCircle className="w-3 h-3" />
                  Draft ({getStatusCount('draft')})
                </Button>
              </div>

              {/* Research Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResearch.map((project) => {
                  const statusInfo = statusConfig[project.status]
                  const StatusIcon = statusInfo.icon
                  const departmentColor = departmentColors[project.department as keyof typeof departmentColors] || 'bg-gray-500'

                  return (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4" />
                            <Badge className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {project.description}
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-amber-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500">
                            Current: {stepLabels[project.currentStep]}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <div className={`w-2 h-2 rounded-full ${departmentColor} mr-1`}></div>
                            {project.department}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {project.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {project.location}
                          </Badge>
                        </div>

                        {/* Action Button */}
                                                 <Button 
                           onClick={() => project.status === 'completed' ? handleViewReport(project.id) : handleContinueResearch(project.id, project.currentStep)}
                           className={`w-full ${project.status !== 'completed' ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white' : ''}`}
                           variant={project.status === 'completed' ? 'outline' : 'default'}
                         >
                           {project.status === 'completed' ? 'View Report' : 'Continue Research'}
                         </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {filteredResearch.length === 0 && (
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No research found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery ? 'Try adjusting your search terms' : 'Get started by initiating your first research project'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleInitiateResearch} className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Initiate Research
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 