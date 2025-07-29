"use client"

import { useState, useEffect } from "react"
import React from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  Search,
  Map,
  Database,
  TrendingUp,
  ChevronRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"

type ResearchStep = 
  | 'define-topic'
  | 'define-questions' 
  | 'map-questions'
  | 'identify-data'
  | 'collect-data'

interface ResearchData {
  topic: string
  description: string
  mainQuestion: string
  subQuestions: string[]
  mappedQuestions: { main: string; sub: string }[]
  missingData: string[]
  dataCollectionMethods: string[]
}

const steps: { id: ResearchStep; title: string; shortTitle: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    id: 'define-topic',
    title: 'Define Research Study Topic',
    shortTitle: 'Define Topic',
    description: 'Clearly specify the health or population issue you\'re investigating',
    icon: FileText
  },
  {
    id: 'define-questions',
    title: 'Define Research Questions',
    shortTitle: 'Research Questions',
    description: 'Frame the central and sub-questions guiding the study',
    icon: Search
  },
  {
    id: 'map-questions',
    title: 'Map Sub-Questions to Main Questions',
    shortTitle: 'Map Questions',
    description: 'Break down and structure questions for analysis and data collection',
    icon: Map
  },
  {
    id: 'identify-data',
    title: 'Identify Missing Data',
    shortTitle: 'Identify Data',
    description: 'Audit what data exists and what\'s needed',
    icon: Database
  },
  {
    id: 'collect-data',
    title: 'Initiate Data Collection',
    shortTitle: 'Collect Data',
    description: 'Choose methods and tools for data collection',
    icon: TrendingUp
  }
]

export default function InitiateResearchPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [researchData, setResearchData] = useState<ResearchData>({
    topic: '',
    description: '',
    mainQuestion: '',
    subQuestions: [''],
    mappedQuestions: [],
    missingData: [''],
    dataCollectionMethods: ['']
  })

  // Handle URL parameters for continuing existing research
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const projectId = urlParams.get('project')
    const stepParam = urlParams.get('step')
    
    if (projectId && stepParam) {
      // Find the step index based on the step parameter
      const stepIndex = steps.findIndex(step => step.id === stepParam)
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex)
      }
      
      // TODO: Load existing research data based on projectId
      console.log('Loading existing research:', projectId, 'at step:', stepParam)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    // Save research data and navigate back to research list
    console.log('Saving research data:', researchData)
    router.push('/analytics')
  }

  const updateResearchData = (field: keyof ResearchData, value: string | string[] | { main: string; sub: string }[]) => {
    setResearchData(prev => ({ ...prev, [field]: value }))
  }

  const addArrayItem = (field: keyof ResearchData, item: string) => {
    setResearchData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), item]
    }))
  }

  const removeArrayItem = (field: keyof ResearchData, index: number) => {
    setResearchData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }))
  }

  const updateArrayItem = (field: keyof ResearchData, index: number, value: string) => {
    setResearchData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }))
  }

  const renderStepContent = () => {
    const step = steps[currentStep]

    switch (step.id) {
      case 'define-topic':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="topic" className="text-base font-medium">Research Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Maternal Mortality Trends in Rural Kenya"
                value={researchData.topic}
                onChange={(e) => updateResearchData('topic', e.target.value)}
                className="mt-2 h-12 text-base"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-base font-medium">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a comprehensive description of your research topic..."
                value={researchData.description}
                onChange={(e) => updateResearchData('description', e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        )

      case 'define-questions':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="mainQuestion" className="text-base font-medium">Main Research Question</Label>
              <Input
                id="mainQuestion"
                placeholder="e.g., What factors contribute to maternal mortality in Turkana County?"
                value={researchData.mainQuestion}
                onChange={(e) => updateResearchData('mainQuestion', e.target.value)}
                className="mt-2 h-12 text-base"
              />
            </div>
            <div>
              <Label className="text-base font-medium">Sub-Questions</Label>
              <div className="space-y-3 mt-2">
                {researchData.subQuestions.map((question, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., What is the average distance to the nearest healthcare facility?"
                      value={question}
                      onChange={(e) => updateArrayItem('subQuestions', index, e.target.value)}
                      className="h-12 text-base"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('subQuestions', index)}
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('subQuestions', '')}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  Add Sub-Question
                </Button>
              </div>
            </div>
          </div>
        )

      case 'map-questions':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Map Sub-Questions to Main Questions</Label>
              <div className="space-y-4 mt-2">
                {researchData.subQuestions.map((subQuestion, index) => (
                  <Card key={index} className="border-orange-100">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Sub-Question {index + 1}</Label>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{subQuestion}</p>
                        <Input
                          placeholder="How does this sub-question relate to your main research question?"
                          value={researchData.mappedQuestions[index]?.sub || ''}
                          onChange={(e) => {
                            const newMapped = [...researchData.mappedQuestions]
                            newMapped[index] = { 
                              main: researchData.mainQuestion, 
                              sub: e.target.value 
                            }
                            updateResearchData('mappedQuestions', newMapped)
                          }}
                          className="h-12 text-base"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case 'identify-data':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Identify Missing Data</Label>
              <div className="space-y-3 mt-2">
                {researchData.missingData.map((data, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., Geo-location data of clinics is missing in remote counties"
                      value={data}
                      onChange={(e) => updateArrayItem('missingData', index, e.target.value)}
                      className="h-12 text-base"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('missingData', index)}
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('missingData', '')}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  Add Missing Data Item
                </Button>
              </div>
            </div>
          </div>
        )

      case 'collect-data':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Data Collection Methods</Label>
              <div className="space-y-3 mt-2">
                {researchData.dataCollectionMethods.map((method, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., Demographic and Health Survey + WHO APIs + Community Surveys"
                      value={method}
                      onChange={(e) => updateArrayItem('dataCollectionMethods', index, e.target.value)}
                      className="h-12 text-base"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('dataCollectionMethods', index)}
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('dataCollectionMethods', '')}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  Add Data Collection Method
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span>Research</span>
                  <ChevronRight className="w-4 h-4" />
                  <span>Create a new research</span>
                </div>
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">Create a New Research</h1>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      Save as Draft
                    </Button>
                    <Button 
                      onClick={handleNext}
                      className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const isActive = index === currentStep
                    const isCompleted = index < currentStep

                    return (
                      <div key={step.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-orange-500 to-amber-600 border-orange-500 text-white' 
                              : isActive 
                                ? 'bg-white border-orange-500 text-orange-500' 
                                : 'bg-white border-gray-300 text-gray-400'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-600 mt-2 text-center max-w-20">
                            {step.shortTitle}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-4 ${
                            isCompleted ? 'bg-gradient-to-r from-orange-500 to-amber-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Form */}
                <div className="lg:col-span-2">
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {steps[currentStep].title}
                      </CardTitle>
                      <p className="text-gray-600 mt-2">
                        {steps[currentStep].description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      {renderStepContent()}
                    </CardContent>
                  </Card>

                  {/* Navigation */}
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleSave}
                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                      >
                        Save Draft
                      </Button>
                      {currentStep < steps.length - 1 ? (
                        <Button 
                          onClick={handleNext}
                          className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
                        >
                          Next
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleSave}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                        >
                          Complete Research
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                                 {/* Right Column - Research Preview */}
                 <div className="lg:col-span-1">
                   <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
                     <div className="text-center mb-4">
                       <h3 className="text-sm font-medium text-gray-600">Research Preview</h3>
                     </div>
                     
                     {/* Mobile Frame */}
                     <div className="bg-gray-900 rounded-3xl p-2 mx-auto w-64">
                       <div className="bg-white rounded-2xl p-4 h-96 overflow-y-auto">
                         {/* Mobile Header */}
                         <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-2 text-xs">
                             <span>Research</span>
                             <ChevronRight className="w-3 h-3" />
                             <span>Create</span>
                           </div>
                         </div>
                         
                         {/* Research Card Preview */}
                         <div className="space-y-3">
                           {/* Research Card */}
                           <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                             {/* Status Badge */}
                             <div className="flex items-center justify-between mb-2">
                               <div className="flex items-center gap-1">
                                 <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                 <span className="text-xs font-medium text-orange-700">Active</span>
                               </div>
                               <span className="text-xs text-gray-500">Just now</span>
                             </div>
                             
                             {/* Research Title */}
                             <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                               {researchData.topic || "Your Research Title"}
                             </h3>
                             
                             {/* Research Description */}
                             <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                               {researchData.description || "Research description will appear here..."}
                             </p>
                             
                             {/* Progress Bar */}
                             <div className="space-y-1 mb-3">
                               <div className="flex justify-between text-xs text-gray-500">
                                 <span>Progress</span>
                                 <span>{Math.round((currentStep / (steps.length - 1)) * 100)}%</span>
                               </div>
                               <div className="w-full bg-gray-200 rounded-full h-1.5">
                                 <div 
                                   className="bg-gradient-to-r from-orange-500 to-amber-600 h-1.5 rounded-full transition-all duration-300"
                                   style={{ width: `${Math.round((currentStep / (steps.length - 1)) * 100)}%` }}
                                 ></div>
                               </div>
                               <p className="text-xs text-gray-500">
                                 Current: {steps[currentStep].shortTitle}
                               </p>
                             </div>
                             
                             {/* Tags */}
                             <div className="flex flex-wrap gap-1 mb-3">
                               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                                 Health
                               </span>
                               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                 Population Study
                               </span>
                               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                 Rural Kenya
                               </span>
                             </div>
                             
                             {/* Action Button */}
                             <button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs py-2 px-3 rounded-md transition-colors">
                               Continue Research
                             </button>
                           </div>
                           
                           {/* Additional Research Cards (if data exists) */}
                           {researchData.topic && (
                             <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                               <div className="flex items-center justify-between mb-2">
                                 <div className="flex items-center gap-1">
                                   <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                   <span className="text-xs font-medium text-yellow-700">Pending</span>
                                 </div>
                                 <span className="text-xs text-gray-500">2 min ago</span>
                               </div>
                               
                               <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                                 Youth Access to Reproductive Health Services
                               </h3>
                               
                               <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                 Assessment of barriers and facilitators to reproductive health service access among youth
                               </p>
                               
                               <div className="space-y-1 mb-3">
                                 <div className="flex justify-between text-xs text-gray-500">
                                   <span>Progress</span>
                                   <span>20%</span>
                                 </div>
                                 <div className="w-full bg-gray-200 rounded-full h-1.5">
                                   <div className="bg-gradient-to-r from-orange-500 to-amber-600 h-1.5 rounded-full" style={{ width: '20%' }}></div>
                                 </div>
                                 <p className="text-xs text-gray-500">
                                   Current: Research Questions
                                 </p>
                               </div>
                               
                               <div className="flex flex-wrap gap-1 mb-3">
                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></div>
                                   Population
                                 </span>
                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                   Service Assessment
                                 </span>
                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                   Sub-Saharan Africa
                                 </span>
                               </div>
                               
                               <button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs py-2 px-3 rounded-md transition-colors">
                                 Continue Research
                               </button>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
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