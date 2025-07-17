"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"   
import { Checkbox } from "@/components/ui/checkbox"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { 
  User,
  Home,
  Settings as SettingsIcon,
  Users,
  RefreshCw,
  Lock,
  FileText,
  CreditCard,
  GitBranch,
  Bell,
  Smartphone,
  Monitor,
  Mail,
  HelpCircle,
  Info
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [notifications, setNotifications] = useState({
    dailyUpdate: true,
    newEvent: true,
    teamAdded: true,
    mobilePush: true,
    desktopNotification: true,
    emailNotification: false
  })

  const tabs = [
    { 
      id: "general", 
      name: "General", 
      icon: Home,
      category: "ACCOUNT"
    },
    { 
      id: "profile", 
      name: "My Profile", 
      icon: User,
      category: "ACCOUNT"
    },
    { 
      id: "preferences", 
      name: "Preferences", 
      icon: SettingsIcon,
      category: "ACCOUNT"
    },
    { 
      id: "applications", 
      name: "Applications", 
      icon: FileText,
      category: "ACCOUNT"
    },
    { 
      id: "workspace-settings", 
      name: "Settings", 
      icon: SettingsIcon,
      category: "WORKSPACE"
    },
    { 
      id: "members", 
      name: "Members", 
      icon: Users,
      category: "WORKSPACE"
    },
    { 
      id: "security", 
      name: "Security", 
      icon: Lock,
      category: "WORKSPACE"
    }
  ]

  const accountTabs = tabs.filter(tab => tab.category === "ACCOUNT")
  const workspaceTabs = tabs.filter(tab => tab.category === "WORKSPACE")

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />

          <div className="flex-1 flex overflow-hidden">
            {/* Settings Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
                
                {/* Account Section */}
                <div className="mb-8">
                  <h3 className="px-3 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ACCOUNT
                  </h3>
                  <div className="space-y-0">
                    {accountTabs.map((tab) => {
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
                          {tab.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Workspace Section */}
                <div>
                  <h3 className="px-3 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    WORKSPACE
                  </h3>
                  <div className="space-y-0">
                    {workspaceTabs.map((tab) => {
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
                          {tab.name}
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
                <h1 className="text-2xl font-bold text-gray-900">Settings &gt; General</h1>
              </div>

              {/* Settings Content */}
              <div className="max-w-4xl space-y-6">
                {/* My Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-orange-600" />
                      My Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Notify me when...</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            id="daily-update"
                            checked={notifications.dailyUpdate}
                            onChange={(e) => 
                              setNotifications(prev => ({ ...prev, dailyUpdate: e.target.checked }))
                            }
                          />
                          <Label htmlFor="daily-update" className="text-sm text-gray-700">
                            Daily productivity update
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            id="new-event"
                            checked={notifications.newEvent}
                            onChange={(e) => 
                              setNotifications(prev => ({ ...prev, newEvent: e.target.checked }))
                            }
                          />
                          <Label htmlFor="new-event" className="text-sm text-gray-700">
                            New event created
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            id="team-added"
                            checked={notifications.teamAdded}
                            onChange={(e) => 
                              setNotifications(prev => ({ ...prev, teamAdded: e.target.checked }))
                            }
                          />
                          <Label htmlFor="team-added" className="text-sm text-gray-700">
                            When added on new team
                          </Label>
                        </div>
                      </div>
                      <div className="mt-3 text-right">
                        <Button variant="link" className="text-blue-600 p-0 h-auto">
                          About notifications?
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Mobile push notifications</h4>
                          <p className="text-sm text-gray-500">Receive push notification whenever your organisation requires your attentions</p>
                        </div>
                        <Switch 
                          checked={notifications.mobilePush}
                          onChange={(e) => 
                            setNotifications(prev => ({ ...prev, mobilePush: e.target.checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Desktop Notification</h4>
                          <p className="text-sm text-gray-500">Receive desktop notification whenever your organisation requires your attentions</p>
                        </div>
                        <Switch 
                          checked={notifications.desktopNotification}
                          onChange={(e) => 
                            setNotifications(prev => ({ ...prev, desktopNotification: e.target.checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Email Notification</h4>
                          <p className="text-sm text-gray-500">Receive email whenever your organisation requires your attentions</p>
                        </div>
                        <Switch 
                          checked={notifications.emailNotification}
                          onChange={(e) => 
                            setNotifications(prev => ({ ...prev, emailNotification: e.target.checked }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* My Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="w-5 h-5 text-orange-600" />
                      My Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Appearance</h4>
                        <p className="text-sm text-gray-500">Customize how you theams looks on your device.</p>
                      </div>
                      <Select defaultValue="light">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Two-factor authentication</h4>
                        <p className="text-sm text-gray-500">Keep your account secure by enabling 2FA via SMS or using a temporary one-time passcode (TOTP).</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Language</h4>
                      </div>
                      <Select defaultValue="english">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 