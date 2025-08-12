'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Label } from '@/components/ui/Label/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select/Select';
import { Switch } from '@/components/ui/Switch/Switch';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import {
  User,
  Home,
  Settings as SettingsIcon,
  Users,
  Lock,
  FileText,
  Bell,
  Shield,
  Globe,
  Palette,
  Smartphone,
  Monitor,
  Mail,
  Save,
  Key,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    dailyUpdate: true,
    newEvent: true,
    teamAdded: true,
    mobilePush: true,
    desktopNotification: true,
    emailNotification: false,
    researchUpdates: true,
    dataAlerts: true,
    securityAlerts: true,
  });

  const tabs = [
    {
      id: 'general',
      name: 'General',
      icon: Home,
      category: 'ACCOUNT',
      description: 'Basic account settings and preferences',
    },
    {
      id: 'profile',
      name: 'My Profile',
      icon: User,
      category: 'ACCOUNT',
      description: 'Personal information and profile settings',
    },
    {
      id: 'preferences',
      name: 'Preferences',
      icon: SettingsIcon,
      category: 'ACCOUNT',
      description: 'Customize your experience',
    },
    {
      id: 'applications',
      name: 'Applications',
      icon: FileText,
      category: 'ACCOUNT',
      description: 'Manage connected applications',
    },
    {
      id: 'workspace-settings',
      name: 'Workspace',
      icon: SettingsIcon,
      category: 'WORKSPACE',
      description: 'Workspace configuration',
    },
    {
      id: 'members',
      name: 'Members',
      icon: Users,
      category: 'WORKSPACE',
      description: 'Manage team members',
    },
    {
      id: 'security',
      name: 'Security',
      icon: Lock,
      category: 'WORKSPACE',
      description: 'Security and privacy settings',
    },
  ];

  const accountTabs = tabs.filter(tab => tab.category === 'ACCOUNT');
  const workspaceTabs = tabs.filter(tab => tab.category === 'WORKSPACE');

  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50'>
        <Sidebar />

        <div className='flex-1 flex flex-col overflow-hidden lg:ml-0'>
          <TopBar />

          <div className='flex-1 flex overflow-hidden'>
            {/* Settings Sidebar */}
            <div className='hidden lg:block w-80 bg-white border-r border-gray-200 overflow-y-auto'>
              <div className='p-6'>
                <div className='mb-8'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                    Settings
                  </h2>
                  <p className='text-gray-600'>
                    Manage your account and workspace preferences
                  </p>
                </div>

                {/* Account Section */}
                <div className='mb-8'>
                  <h3 className='px-3 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider'>
                    ACCOUNT
                  </h3>
                  <div className='space-y-1'>
                    {accountTabs.map(tab => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                              : 'text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon
                            className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                              activeTab === tab.id
                                ? 'text-white'
                                : 'text-gray-400 group-hover:text-orange-500'
                            }`}
                          />
                          <div className='text-left'>
                            <div className='font-medium'>{tab.name}</div>
                            <div className='text-xs opacity-75'>
                              {tab.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Workspace Section */}
                <div>
                  <h3 className='px-3 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider'>
                    WORKSPACE
                  </h3>
                  <div className='space-y-1'>
                    {workspaceTabs.map(tab => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                              : 'text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon
                            className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                              activeTab === tab.id
                                ? 'text-white'
                                : 'text-gray-400 group-hover:text-orange-500'
                            }`}
                          />
                          <div className='text-left'>
                            <div className='font-medium'>{tab.name}</div>
                            <div className='text-xs opacity-75'>
                              {tab.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Tab Navigation */}
            <div className='lg:hidden w-full bg-white border-b border-gray-200'>
              <div className='flex overflow-x-auto'>
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className='w-4 h-4 mr-2' />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className='flex-1 overflow-y-auto p-6'>
              <div className='max-w-4xl mx-auto'>
                {/* Header */}
                <div className='mb-8'>
                  <h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
                  <p className='text-gray-600 mt-2'>
                    Manage your account preferences and workspace settings
                  </p>
                </div>

                {/* Settings Content */}
                <div className='space-y-6'>
                  {/* Notifications Settings */}
                  <Card className='border-0 shadow-md'>
                    <CardHeader className='pb-4'>
                      <CardTitle className='flex items-center gap-3 text-xl'>
                        <div className='p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg'>
                          <Bell className='w-6 h-6 text-white' />
                        </div>
                        <div>
                          <div className='font-semibold text-gray-900'>
                            Notifications
                          </div>
                          <div className='text-sm text-gray-500'>
                            Manage your notification preferences
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      <div>
                        <h4 className='text-lg font-medium text-gray-900 mb-4'>
                          Research & Data Alerts
                        </h4>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                            <Checkbox
                              id='research-updates'
                              checked={notifications.researchUpdates}
                              onChange={e =>
                                setNotifications(prev => ({
                                  ...prev,
                                  researchUpdates: e.target.checked,
                                }))
                              }
                            />
                            <Label
                              htmlFor='research-updates'
                              className='text-sm text-gray-700'
                            >
                              Research study updates
                            </Label>
                          </div>
                          <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                            <Checkbox
                              id='data-alerts'
                              checked={notifications.dataAlerts}
                              onChange={e =>
                                setNotifications(prev => ({
                                  ...prev,
                                  dataAlerts: e.target.checked,
                                }))
                              }
                            />
                            <Label
                              htmlFor='data-alerts'
                              className='text-sm text-gray-700'
                            >
                              Data processing alerts
                            </Label>
                          </div>
                          <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                            <Checkbox
                              id='security-alerts'
                              checked={notifications.securityAlerts}
                              onChange={e =>
                                setNotifications(prev => ({
                                  ...prev,
                                  securityAlerts: e.target.checked,
                                }))
                              }
                            />
                            <Label
                              htmlFor='security-alerts'
                              className='text-sm text-gray-700'
                            >
                              Security notifications
                            </Label>
                          </div>
                          <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                            <Checkbox
                              id='daily-update'
                              checked={notifications.dailyUpdate}
                              onChange={e =>
                                setNotifications(prev => ({
                                  ...prev,
                                  dailyUpdate: e.target.checked,
                                }))
                              }
                            />
                            <Label
                              htmlFor='daily-update'
                              className='text-sm text-gray-700'
                            >
                              Daily summary reports
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className='space-y-4'>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg'>
                          <div className='flex items-center gap-3'>
                            <div className='p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg'>
                              <Smartphone className='w-5 h-5 text-white' />
                            </div>
                            <div>
                              <h4 className='text-sm font-medium text-gray-900'>
                                Mobile push notifications
                              </h4>
                              <p className='text-sm text-gray-500'>
                                Receive alerts on your mobile device
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.mobilePush}
                            onChange={e =>
                              setNotifications(prev => ({
                                ...prev,
                                mobilePush: e.target.checked,
                              }))
                            }
                          />
                        </div>

                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg'>
                          <div className='flex items-center gap-3'>
                            <div className='p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg'>
                              <Monitor className='w-5 h-5 text-white' />
                            </div>
                            <div>
                              <h4 className='text-sm font-medium text-gray-900'>
                                Desktop notifications
                              </h4>
                              <p className='text-sm text-gray-500'>
                                Show notifications on your desktop
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.desktopNotification}
                            onChange={e =>
                              setNotifications(prev => ({
                                ...prev,
                                desktopNotification: e.target.checked,
                              }))
                            }
                          />
                        </div>

                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg'>
                          <div className='flex items-center gap-3'>
                            <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg'>
                              <Mail className='w-5 h-5 text-white' />
                            </div>
                            <div>
                              <h4 className='text-sm font-medium text-gray-900'>
                                Email notifications
                              </h4>
                              <p className='text-sm text-gray-500'>
                                Receive notifications via email
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.emailNotification}
                            onChange={e =>
                              setNotifications(prev => ({
                                ...prev,
                                emailNotification: e.target.checked,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Appearance & Security Settings */}
                  <Card className='border-0 shadow-md'>
                    <CardHeader className='pb-4'>
                      <CardTitle className='flex items-center gap-3 text-xl'>
                        <div className='p-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg'>
                          <SettingsIcon className='w-6 h-6 text-white' />
                        </div>
                        <div>
                          <div className='font-semibold text-gray-900'>
                            Preferences
                          </div>
                          <div className='text-sm text-gray-500'>
                            Customize your experience and security
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-4'>
                          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg'>
                            <div className='flex items-center gap-3'>
                              <div className='p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg'>
                                <Palette className='w-5 h-5 text-white' />
                              </div>
                              <div>
                                <h4 className='text-sm font-medium text-gray-900'>
                                  Theme
                                </h4>
                                <p className='text-sm text-gray-500'>
                                  Choose your preferred theme
                                </p>
                              </div>
                            </div>
                            <Select defaultValue='light'>
                              <SelectTrigger className='w-32'>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='light'>Light</SelectItem>
                                <SelectItem value='dark'>Dark</SelectItem>
                                <SelectItem value='auto'>Auto</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg'>
                            <div className='flex items-center gap-3'>
                              <div className='p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg'>
                                <Globe className='w-5 h-5 text-white' />
                              </div>
                              <div>
                                <h4 className='text-sm font-medium text-gray-900'>
                                  Language
                                </h4>
                                <p className='text-sm text-gray-500'>
                                  Select your preferred language
                                </p>
                              </div>
                            </div>
                            <Select defaultValue='english'>
                              <SelectTrigger className='w-32'>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='english'>English</SelectItem>
                                <SelectItem value='french'>French</SelectItem>
                                <SelectItem value='spanish'>Spanish</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className='space-y-4'>
                          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg'>
                            <div className='flex items-center gap-3'>
                              <div className='p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg'>
                                <Shield className='w-5 h-5 text-white' />
                              </div>
                              <div>
                                <h4 className='text-sm font-medium text-gray-900'>
                                  Two-factor authentication
                                </h4>
                                <p className='text-sm text-gray-500'>
                                  Enhanced account security
                                </p>
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </div>

                          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg'>
                            <div className='flex items-center gap-3'>
                              <div className='p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg'>
                                <Key className='w-5 h-5 text-white' />
                              </div>
                              <div>
                                <h4 className='text-sm font-medium text-gray-900'>
                                  Session timeout
                                </h4>
                                <p className='text-sm text-gray-500'>
                                  Auto-logout after inactivity
                                </p>
                              </div>
                            </div>
                            <Select defaultValue='30'>
                              <SelectTrigger className='w-32'>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='15'>15 min</SelectItem>
                                <SelectItem value='30'>30 min</SelectItem>
                                <SelectItem value='60'>1 hour</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Save Button */}
                  <div className='flex justify-end'>
                    <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
                      <Save className='w-4 h-4 mr-2' />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
