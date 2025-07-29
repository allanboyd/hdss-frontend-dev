"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  ChevronRight, 
  ThumbsUp, 
  Code, 
  Download, 
  MoreVertical,
  FileText,
  Calendar,
  Tag,
  Eye,
  Share2,
  BookOpen,
  Database,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"

interface ResearchReport {
  id: string
  title: string
  tagline: string
  author: string
  updatedAt: string
  upvotes: number
  status: 'completed' | 'active' | 'pending' | 'draft'
  progress: number
  currentStep: string
  department: string
  type: string
  location: string
  description: string
  keyFindings: string[]
  methodology: string
  dataSources: string[]
  tags: string[]
  usability: number
  license: string
  updateFrequency: string
  thumbnail: string
}

const mockReport: ResearchReport = {
  id: "1",
  title: "Maternal Mortality Trends in Rural Kenya",
  tagline: "Comprehensive analysis of maternal health outcomes and contributing factors in rural communities",
  author: "DR. SARAH KIMANI",
  updatedAt: "7 hours ago",
  upvotes: 24,
  status: 'completed',
  progress: 100,
  currentStep: "Finalized",
  department: "Health",
  type: "Population Study",
  location: "Rural Kenya",
  description: "This comprehensive research study analyzes maternal mortality trends in rural Kenya, examining the complex interplay of healthcare access, cultural practices, and socioeconomic factors. The study employed mixed-methods research including quantitative analysis of health facility records and qualitative interviews with healthcare workers and community members.",
  keyFindings: [
    "Distance to healthcare facilities significantly impacts maternal outcomes",
    "Cultural practices influence maternal health-seeking behavior",
    "Socioeconomic status correlates with maternal mortality rates",
    "Community health workers play crucial role in maternal care",
    "Mobile health interventions show promising results"
  ],
  methodology: "Mixed-methods research combining quantitative analysis of health facility records (2019-2024) and qualitative interviews with 150 healthcare workers and community members across 12 rural counties.",
  dataSources: [
    "Kenya Demographic and Health Survey (KDHS) 2022",
    "Ministry of Health facility records",
    "WHO Global Health Observatory",
    "Community health worker interviews",
    "Focus group discussions with rural communities"
  ],
  tags: ["Maternal Health", "Rural Healthcare", "Population Studies", "Healthcare Access", "Kenya"],
  usability: 9.8,
  license: "Creative Commons Attribution 4.0",
  updateFrequency: "Quarterly",
  thumbnail: "/api/placeholder/400/200"
}

export default function ResearchReportPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [upvoted, setUpvoted] = useState(false)

  const handleUpvote = () => {
    setUpvoted(!upvoted)
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle }
      case 'active':
        return { label: 'Active', color: 'bg-orange-100 text-orange-800', icon: TrendingUp }
      case 'pending':
        return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
      case 'draft':
        return { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
    }
  }

  const StatusIcon = getStatusConfig(mockReport.status).icon

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/analytics')}
                    className="p-0 h-auto text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Research
                  </Button>
                  <ChevronRight className="w-4 h-4" />
                  <span>Report</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-3">
                  {/* Header Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {mockReport.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{mockReport.author}</p>
                          <p className="text-xs text-gray-500">UPDATED {mockReport.updatedAt.toUpperCase()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleUpvote}
                          className={`flex items-center gap-1 ${upvoted ? 'bg-orange-50 border-orange-200 text-orange-700' : ''}`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${upvoted ? 'fill-current' : ''}`} />
                          {mockReport.upvotes + (upvoted ? 1 : 0)}
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Code className="w-4 h-4" />
                          Code
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {mockReport.title}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">
                      {mockReport.tagline}
                    </p>

                    {/* Status and Progress */}
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusConfig(mockReport.status).color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {getStatusConfig(mockReport.status).label}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Progress:</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-amber-600 h-2 rounded-full"
                            style={{ width: `${mockReport.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{mockReport.progress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="methodology">Methodology</TabsTrigger>
                      <TabsTrigger value="findings">Findings</TabsTrigger>
                      <TabsTrigger value="data">Data</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                      <Card className="border-0 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold">About Research</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Research Overview</h3>
                            <p className="text-gray-700 leading-relaxed">
                              {mockReport.description}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
                            <ul className="space-y-2">
                              {mockReport.keyFindings.map((finding, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-700">{finding}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-3">Research Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-sm font-medium text-gray-600">Department:</span>
                                <p className="text-gray-900">{mockReport.department}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">Type:</span>
                                <p className="text-gray-900">{mockReport.type}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">Location:</span>
                                <p className="text-gray-900">{mockReport.location}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-600">Status:</span>
                                <p className="text-gray-900">{getStatusConfig(mockReport.status).label}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="methodology" className="mt-6">
                      <Card className="border-0 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold">Research Methodology</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 leading-relaxed">
                            {mockReport.methodology}
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="findings" className="mt-6">
                      <Card className="border-0 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold">Detailed Findings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {mockReport.keyFindings.map((finding, index) => (
                              <div key={index} className="border-l-4 border-orange-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  Finding {index + 1}
                                </h4>
                                <p className="text-gray-700">{finding}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="data" className="mt-6">
                      <Card className="border-0 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold">Data Sources</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {mockReport.dataSources.map((source, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Database className="w-5 h-5 text-orange-600" />
                                <span className="text-gray-700">{source}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right Column - Sidebar */}
                <div className="lg:col-span-1">
                  <div className="space-y-6">
                    {/* Research Metadata */}
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-600">Usability</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{mockReport.usability}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-600">License</span>
                            </div>
                            <span className="text-sm text-gray-900">{mockReport.license}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-600">Update Frequency</span>
                            </div>
                            <span className="text-sm text-gray-900">{mockReport.updateFrequency}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <Tag className="w-5 h-5" />
                          Tags
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {mockReport.tags.map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white">
                          <Download className="w-4 h-4 mr-2" />
                          Download Report
                        </Button>
                        <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Research
                        </Button>
                        <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50">
                          <BookOpen className="w-4 h-4 mr-2" />
                          View Full Study
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 