"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

// Mock data - in a real app, this would come from your database
const countries = [
  { code: "+254", name: "Kenya" },
  { code: "+256", name: "Uganda" },
  { code: "+255", name: "Tanzania" },
  { code: "+27", name: "South Africa" },
  { code: "+234", name: "Nigeria" },
  { code: "+233", name: "Ghana" },
  { code: "+251", name: "Ethiopia" },
  { code: "+1", name: "United States" },
  { code: "+44", name: "United Kingdom" },
  { code: "+33", name: "France" },
  { code: "+49", name: "Germany" },
]

const roles = [
  { id: 1, name: "Field Agent", description: "Collect data in the field" },
  { id: 2, name: "Researcher", description: "Conduct research and analysis" },
  { id: 3, name: "Data Analyst", description: "Analyze and interpret data" },
  { id: 4, name: "Policy Maker", description: "Use data for policy decisions" },
  { id: 5, name: "Site Manager", description: "Manage research sites" },
  { id: 6, name: "Administrator", description: "System administration" },
]

const sites = [
  { id: 1, name: "Korogacho", country: "Kenya", description: "Nairobi slum area" },
  { id: 2, name: "Kibera", country: "Kenya", description: "Largest slum in Nairobi" },
  { id: 3, name: "Mathare", country: "Kenya", description: "Nairobi informal settlement" },
  { id: 4, name: "Kampala Urban", country: "Uganda", description: "Urban research site" },
  { id: 5, name: "Dar es Salaam", country: "Tanzania", description: "Coastal research site" },
]

export default function AccountRequestPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    countryCode: "+254",
    requestedRoleId: "",
    requestedSiteId: "",
    reason: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { error } = await supabase
        .from('user_account_request')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone_number: `${formData.countryCode}${formData.phoneNumber}`,
            requested_role_id: parseInt(formData.requestedRoleId),
            requested_site_id: parseInt(formData.requestedSiteId),
            reason: formData.reason,
            status: 'pending'
          }
        ])

      if (error) {
        setError(error.message)
      } else {
        setIsSuccess(true)
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          countryCode: "+254",
          requestedRoleId: "",
          requestedSiteId: "",
          reason: "",
        })
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-12 pb-12 px-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-8 shadow-lg">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Request Submitted Successfully!
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Your account request has been submitted and is under review. We&apos;ll contact you via email once your account is approved.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-green-700">
                      You will receive a confirmation email shortly with your request details.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push('/login')}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-4 h-14 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Return to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Image
                src="/images/aphrc_mainlogo.png"
                alt="APHRC Logo"
                width={200}
                height={60}
                className="h-10 w-auto"
              />
            </div>
            <Link 
              href="/login"
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Request Account Access
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join the A-SEARCH platform to collect, access, and analyze population and health data across African research sites
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="w-full max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Complete Your Application
              </h2>
              <p className="text-gray-600">
                Please provide the following information to help us process your account request
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="mt-2 h-14 border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-lg"
                    required
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <Label htmlFor="email" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. johndoe@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-2 h-14 border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-lg"
                    required
                  />
                </div>

                {/* Phone Number with Country Code */}
                <div className="md:col-span-2">
                  <Label htmlFor="phoneNumber" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Phone Number *
                  </Label>
                  <div className="mt-2 flex gap-3">
                    <Select 
                      value={formData.countryCode} 
                      onValueChange={(value) => handleInputChange("countryCode", value)}
                    >
                      <SelectTrigger className="w-36 h-14 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{country.code}</span>
                              <span className="text-gray-500 text-sm">({country.name})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Phone number"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="flex-1 h-14 border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-lg"
                      required
                    />
                  </div>
                </div>

                {/* Requested Role */}
                <div>
                  <Label htmlFor="role" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Requested Role *
                  </Label>
                  <Select 
                    value={formData.requestedRoleId} 
                    onValueChange={(value) => handleInputChange("requestedRoleId", value)}
                  >
                    <SelectTrigger className="mt-2 h-14 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          <div className="py-1">
                            <div className="font-semibold text-gray-900">{role.name}</div>
                            <div className="text-sm text-gray-600">{role.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Requested Site */}
                <div>
                  <Label htmlFor="site" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Requested Site *
                  </Label>
                  <Select 
                    value={formData.requestedSiteId} 
                    onValueChange={(value) => handleInputChange("requestedSiteId", value)}
                  >
                    <SelectTrigger className="mt-2 h-14 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id.toString()}>
                          <div className="py-1">
                            <div className="font-semibold text-gray-900">{site.name}</div>
                            <div className="text-sm text-gray-600">{site.country} - {site.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reason */}
                <div className="md:col-span-2">
                  <Label htmlFor="reason" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Reason for Access Request *
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Please explain why you need access to the platform and how you plan to use it..."
                    value={formData.reason}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                    className="mt-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500 text-lg min-h-[120px]"
                    rows={5}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-4 h-16 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Submitting Request...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Submit Request</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 