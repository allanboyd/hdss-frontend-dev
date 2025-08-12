'use client';

import { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Search,
  Filter,
  Eye,
  Edit,
  Clock,
  User,
  Settings,
  Plus,
  Archive,
  Tag,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { TopBar } from '@/components/dashboard/top-bar';
import { Sidebar } from '@/components/dashboard/sidebar';

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'system' | 'data' | 'research' | 'user' | 'security';
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
  readAt?: string;
  source: string;
  actionRequired: boolean;
  tags: string[];
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Data Processing Complete',
    description:
      'Population census data processing has been completed successfully. 1.2M records processed.',
    type: 'success',
    priority: 'medium',
    category: 'data',
    status: 'unread',
    createdAt: '2 hours ago',
    source: 'Data Processing System',
    actionRequired: false,
    tags: ['census', 'processing', 'complete'],
  },
  {
    id: '2',
    title: 'Research Study Deadline Approaching',
    description:
      'Maternal Health Survey deadline is approaching. Please complete data collection by Friday.',
    type: 'warning',
    priority: 'high',
    category: 'research',
    status: 'unread',
    createdAt: '4 hours ago',
    source: 'Research Management',
    actionRequired: true,
    tags: ['deadline', 'survey', 'health'],
  },
  {
    id: '3',
    title: 'System Maintenance Scheduled',
    description:
      'Scheduled maintenance will occur on Sunday 2:00 AM - 4:00 AM. System will be unavailable.',
    type: 'info',
    priority: 'medium',
    category: 'system',
    status: 'read',
    createdAt: '1 day ago',
    readAt: '1 day ago',
    source: 'System Administration',
    actionRequired: false,
    tags: ['maintenance', 'scheduled'],
  },
  {
    id: '4',
    title: 'Data Quality Issue Detected',
    description:
      'Inconsistent data format detected in Housing Quality Assessment dataset. Please review records 1,245-1,280.',
    type: 'error',
    priority: 'critical',
    category: 'data',
    status: 'unread',
    createdAt: '6 hours ago',
    source: 'Data Quality Monitor',
    actionRequired: true,
    tags: ['quality', 'format', 'housing'],
  },
  {
    id: '5',
    title: 'New User Registration',
    description:
      'Dr. Sarah Kimani has registered for data access. Pending approval for Population Census dataset.',
    type: 'info',
    priority: 'low',
    category: 'user',
    status: 'unread',
    createdAt: '8 hours ago',
    source: 'User Management',
    actionRequired: true,
    tags: ['registration', 'approval', 'access'],
  },
  {
    id: '6',
    title: 'Report Generation Complete',
    description:
      'Urban Migration Analysis report has been generated and is ready for download.',
    type: 'success',
    priority: 'medium',
    category: 'research',
    status: 'read',
    createdAt: '1 day ago',
    readAt: '1 day ago',
    source: 'Report Generator',
    actionRequired: false,
    tags: ['report', 'migration', 'analysis'],
  },
  {
    id: '7',
    title: 'Security Alert',
    description:
      'Multiple failed login attempts detected from IP 192.168.1.45. Account temporarily locked.',
    type: 'error',
    priority: 'high',
    category: 'security',
    status: 'unread',
    createdAt: '12 hours ago',
    source: 'Security System',
    actionRequired: true,
    tags: ['security', 'login', 'locked'],
  },
  {
    id: '8',
    title: 'Dataset Backup Complete',
    description:
      'Daily backup of all datasets completed successfully. 2.3GB of data backed up.',
    type: 'success',
    priority: 'low',
    category: 'system',
    status: 'read',
    createdAt: '2 days ago',
    readAt: '2 days ago',
    source: 'Backup System',
    actionRequired: false,
    tags: ['backup', 'complete', 'daily'],
  },
];

const statusConfig = {
  unread: { label: 'Unread', color: 'bg-blue-100 text-blue-800' },
  read: { label: 'Read', color: 'bg-gray-100 text-gray-800' },
  archived: { label: 'Archived', color: 'bg-gray-100 text-gray-600' },
  info: { label: 'Info', color: 'bg-blue-100 text-blue-800' },
  warning: { label: 'Warning', color: 'bg-yellow-100 text-yellow-800' },
  error: { label: 'Error', color: 'bg-red-100 text-red-800' },
  success: { label: 'Success', color: 'bg-green-100 text-green-800' },
  low: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-800' },
  critical: { label: 'Critical', color: 'bg-red-100 text-red-800' },
  system: { label: 'System', color: 'bg-purple-100 text-purple-800' },
  data: { label: 'Data', color: 'bg-blue-100 text-blue-800' },
  research: { label: 'Research', color: 'bg-green-100 text-green-800' },
  user: { label: 'User', color: 'bg-indigo-100 text-indigo-800' },
  security: { label: 'Security', color: 'bg-red-100 text-red-800' },
};

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'unread' | 'read' | 'archived'
  >('all');
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'info' | 'warning' | 'error' | 'success'
  >('all');
  const [priorityFilter] = useState<
    'all' | 'low' | 'medium' | 'high' | 'critical'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusConfig = (status: string) => {
    return (
      statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        color: 'bg-gray-100 text-gray-800',
      }
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className='w-5 h-5 text-green-600' />;
      case 'warning':
        return <AlertTriangle className='w-5 h-5 text-yellow-600' />;
      case 'error':
        return <AlertTriangle className='w-5 h-5 text-red-600' />;
      case 'info':
        return <Info className='w-5 h-5 text-blue-600' />;
      default:
        return <Info className='w-5 h-5 text-gray-600' />;
    }
  };

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesStatus =
      activeFilter === 'all' || alert.status === activeFilter;
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesPriority =
      priorityFilter === 'all' || alert.priority === priorityFilter;
    const matchesSearch =
      searchQuery === '' ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesPriority && matchesSearch;
  });

  const unreadCount = mockAlerts.filter(
    alert => alert.status === 'unread'
  ).length;
  const criticalCount = mockAlerts.filter(
    alert => alert.priority === 'critical'
  ).length;
  const actionRequiredCount = mockAlerts.filter(
    alert => alert.actionRequired
  ).length;

  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <TopBar />
          <main className='flex-1 overflow-y-auto p-6'>
            <div className='max-w-7xl mx-auto'>
              {/* Header */}
              <div className='flex items-center justify-between mb-8'>
                <div>
                  <h1 className='text-3xl font-bold text-gray-900'>
                    Alerts & Notifications
                  </h1>
                  <p className='text-gray-600 mt-2'>
                    Manage system alerts and notifications
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <Button variant='outline' className='border-gray-300'>
                    <Settings className='w-4 h-4 mr-2' />
                    Settings
                  </Button>
                  <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
                    <Plus className='w-4 h-4 mr-2' />
                    Create Alert
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                <Card className='border-0 shadow-md'>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-gray-600'>
                          Unread Alerts
                        </p>
                        <p className='text-2xl font-bold text-gray-900'>
                          {unreadCount}
                        </p>
                      </div>
                      <div className='p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg'>
                        <Bell className='w-6 h-6 text-white' />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='border-0 shadow-md'>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-gray-600'>
                          Critical Alerts
                        </p>
                        <p className='text-2xl font-bold text-gray-900'>
                          {criticalCount}
                        </p>
                      </div>
                      <div className='p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg'>
                        <AlertTriangle className='w-6 h-6 text-white' />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='border-0 shadow-md'>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-gray-600'>
                          Action Required
                        </p>
                        <p className='text-2xl font-bold text-gray-900'>
                          {actionRequiredCount}
                        </p>
                      </div>
                      <div className='p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg'>
                        <Clock className='w-6 h-6 text-white' />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Search */}
              <div className='bg-white rounded-lg border border-gray-200 mb-6'>
                <div className='p-6 border-b border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Alerts
                    </h3>
                    <div className='flex items-center gap-2'>
                      <div className='relative'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                        <input
                          type='text'
                          placeholder='Search alerts...'
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className='pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                        />
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        className='border-gray-300'
                      >
                        <Filter className='w-4 h-4 mr-2' />
                        Filter
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className='px-6 py-4 border-b border-gray-200'>
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-medium text-gray-700'>
                        Status:
                      </span>
                      <div className='flex gap-1'>
                        {['all', 'unread', 'read', 'archived'].map(filter => (
                          <Button
                            key={filter}
                            variant={
                              activeFilter === filter ? 'default' : 'outline'
                            }
                            size='sm'
                            onClick={() =>
                              setActiveFilter(
                                filter as 'all' | 'unread' | 'read' | 'archived'
                              )
                            }
                            className={
                              activeFilter === filter
                                ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
                                : ''
                            }
                          >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-medium text-gray-700'>
                        Type:
                      </span>
                      <div className='flex gap-1'>
                        {['all', 'info', 'warning', 'error', 'success'].map(
                          filter => (
                            <Button
                              key={filter}
                              variant={
                                typeFilter === filter ? 'default' : 'outline'
                              }
                              size='sm'
                              onClick={() =>
                                setTypeFilter(
                                  filter as
                                    | 'all'
                                    | 'info'
                                    | 'warning'
                                    | 'error'
                                    | 'success'
                                )
                              }
                              className={
                                typeFilter === filter
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
                                  : ''
                              }
                            >
                              {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts List */}
                <div className='divide-y divide-gray-200'>
                  {filteredAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-6 hover:bg-gray-50 transition-colors ${alert.status === 'unread' ? 'bg-blue-50' : ''}`}
                    >
                      <div className='flex items-start gap-4'>
                        <div className='flex-shrink-0 mt-1'>
                          {getAlertIcon(alert.type)}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <div className='flex items-center gap-2 mb-2'>
                                <h4 className='text-lg font-semibold text-gray-900'>
                                  {alert.title}
                                </h4>
                                {alert.actionRequired && (
                                  <Badge className='bg-red-100 text-red-800'>
                                    Action Required
                                  </Badge>
                                )}
                                <Badge
                                  className={
                                    getStatusConfig(alert.priority).color
                                  }
                                >
                                  {getStatusConfig(alert.priority).label}
                                </Badge>
                                <Badge
                                  className={
                                    getStatusConfig(alert.category).color
                                  }
                                >
                                  {getStatusConfig(alert.category).label}
                                </Badge>
                              </div>

                              <p className='text-gray-600 mb-3'>
                                {alert.description}
                              </p>

                              <div className='flex items-center gap-4 text-sm text-gray-500'>
                                <div className='flex items-center gap-1'>
                                  <Clock className='w-4 h-4' />
                                  {alert.createdAt}
                                </div>
                                <div className='flex items-center gap-1'>
                                  <User className='w-4 h-4' />
                                  {alert.source}
                                </div>
                                {alert.tags.length > 0 && (
                                  <div className='flex items-center gap-1'>
                                    <Tag className='w-4 h-4' />
                                    {alert.tags.slice(0, 2).join(', ')}
                                    {alert.tags.length > 2 &&
                                      ` +${alert.tags.length - 2}`}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className='flex items-center gap-2 ml-4'>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                              >
                                <Eye className='w-4 h-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                              >
                                <Edit className='w-4 h-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                              >
                                <Archive className='w-4 h-4' />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredAlerts.length === 0 && (
                    <div className='p-12 text-center'>
                      <Bell className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        No alerts found
                      </h3>
                      <p className='text-gray-500'>
                        Try adjusting your filters or search terms.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
