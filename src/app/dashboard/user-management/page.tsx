'use client';

import { useState, useEffect } from 'react';
import { Search, Shield, Users, UserPlus, Clock, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import { Input } from '@/components/ui/Input/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs/Tabs';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { TopBar } from '@/components/dashboard/top-bar';
import { Sidebar } from '@/components/dashboard/sidebar';
import { RolesTab } from '@/components/user-management/roles-tab';
import { SystemUsersTab } from '@/components/user-management/system-users-tab';
import { AllAccountRequestsTab } from '@/components/user-management/all-account-requests-tab';
import { PendingRequestsTab } from '@/components/user-management/pending-requests-tab';
import { userManagementCountsService } from '@/lib/user-management';
import { UserManagementCounts } from '@/types/user-management';

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState('roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState<UserManagementCounts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const countsData = await userManagementCountsService.getCounts();
        setCounts(countsData);
      } catch (error) {
        console.error('Error loading counts:', error);
        // Set default counts on error
        setCounts({
          roles_count: 0,
          users_count: 0,
          pending_requests_count: 0,
          total_requests_count: 0,
          last_updated: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
  }, []);

  const stats = [
    {
      title: 'Roles',
      value: counts?.roles_count || 0,
      icon: Shield,
      description: 'System roles',
      color: 'text-blue-600',
    },
    {
      title: 'System Users',
      value: counts?.users_count || 0,
      icon: Users,
      description: 'Active users',
      color: 'text-green-600',
    },
    {
      title: 'Pending Requests',
      value: counts?.pending_requests_count || 0,
      icon: Clock,
      description: 'Awaiting approval',
      color: 'text-orange-600',
    },
    {
      title: 'Total Requests',
      value: counts?.total_requests_count || 0,
      icon: UserPlus,
      description: 'All time requests',
      color: 'text-purple-600',
    },
  ];

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
                    User Management
                  </h1>
                  <p className='text-gray-600 mt-2'>
                    Manage users, roles, and account requests
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <Input
                      placeholder='Search records...'
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className='pl-10 w-64'
                    />
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                {stats.map(stat => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={stat.title}
                      className='card-border hover:shadow-md transition-shadow'
                    >
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium text-gray-600'>
                          {stat.title}
                        </CardTitle>
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className='text-2xl font-bold text-gray-900'>
                          {loading ? (
                            <div className='h-8 bg-gray-200 animate-pulse rounded'></div>
                          ) : (
                            stat.value.toLocaleString()
                          )}
                        </div>
                        <p className='text-xs text-gray-500 mt-1'>
                          {stat.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Last Updated Info */}
              {counts?.last_updated && (
                <div className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
                  <Activity className='w-4 h-4' />
                  <span>
                    Last updated:{' '}
                    {new Date(counts.last_updated).toLocaleString()}
                  </span>
                </div>
              )}

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className='w-full'
              >
                <TabsList className='grid w-full grid-cols-4'>
                  <TabsTrigger
                    value='roles'
                    className='flex items-center gap-2'
                  >
                    <Shield className='w-4 h-4' />
                    Roles
                  </TabsTrigger>
                  <TabsTrigger
                    value='system-users'
                    className='flex items-center gap-2'
                  >
                    <Users className='w-4 h-4' />
                    System Users
                  </TabsTrigger>
                  <TabsTrigger
                    value='all-requests'
                    className='flex items-center gap-2'
                  >
                    <UserPlus className='w-4 h-4' />
                    All Account Requests
                  </TabsTrigger>
                  <TabsTrigger
                    value='pending-requests'
                    className='flex items-center gap-2'
                  >
                    <Clock className='w-4 h-4' />
                    Pending Requests
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='roles' className='mt-6'>
                  <RolesTab searchQuery={searchQuery} />
                </TabsContent>
                <TabsContent value='system-users' className='mt-6'>
                  <SystemUsersTab searchQuery={searchQuery} />
                </TabsContent>
                <TabsContent value='all-requests' className='mt-6'>
                  <AllAccountRequestsTab searchQuery={searchQuery} />
                </TabsContent>
                <TabsContent value='pending-requests' className='mt-6'>
                  <PendingRequestsTab searchQuery={searchQuery} />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
