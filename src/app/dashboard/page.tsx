'use client';

import { Home, Users, FileText, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select/Select';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { StatsCard } from '@/components/dashboard/stats-card';
import { NotificationsPanel } from '@/components/dashboard/notifications-panel';
import { InteractiveMap } from '@/components/dashboard/interactive-map';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50'>
        <Sidebar />

        <div className='flex-1 flex flex-col overflow-hidden lg:ml-0'>
          {/* Top Bar */}
          <TopBar />

          <div className='flex-1 p-2 sm:p-4 overflow-y-auto'>
            {/* Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4'>
              <StatsCard
                title='Total Households Mapped'
                value='5,034'
                change={{ value: '+25', type: 'increase' }}
                icon={<Home className='w-4 h-4' />}
                description='Across all research sites'
              />
              <StatsCard
                title='Total Population'
                value='30,000'
                change={{ value: '2.4%', type: 'decrease' }}
                icon={<Users className='w-4 h-4' />}
                description='Registered individuals'
              />
              <StatsCard
                title='Active Research Projects'
                value='24'
                change={{ value: '+3', type: 'increase' }}
                icon={<FileText className='w-4 h-4' />}
                description='Ongoing studies'
              />
              <StatsCard
                title='Total Datasets'
                value='167'
                change={{ value: '+2', type: 'increase' }}
                icon={<Database className='w-4 h-4' />}
                description='Available for analysis'
              />
            </div>

            {/* Main Content Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4'>
              {/* Left Column - Household Mapping and Analytics */}
              <div className='lg:col-span-3 flex flex-col'>
                <Card className='mb-4 card-border'>
                  <CardHeader className='pb-3'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                      <CardTitle className='text-base font-semibold text-gray-900'>
                        Household Mapping
                      </CardTitle>
                      <div className='flex flex-wrap gap-2'>
                        <Select defaultValue='country'>
                          <SelectTrigger className='w-24 h-6 text-xs'>
                            <SelectValue placeholder='Country' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='country'>Country</SelectItem>
                            <SelectItem value='kenya'>Kenya</SelectItem>
                            <SelectItem value='uganda'>Uganda</SelectItem>
                            <SelectItem value='tanzania'>Tanzania</SelectItem>
                            <SelectItem value='burkina-faso'>
                              Burkina Faso
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue='admin'>
                          <SelectTrigger className='w-32 h-6 text-xs'>
                            <SelectValue placeholder='Administrative unit' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='admin'>
                              Administrative unit
                            </SelectItem>
                            <SelectItem value='nairobi'>
                              Nairobi County
                            </SelectItem>
                            <SelectItem value='mombasa'>
                              Mombasa County
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue='town'>
                          <SelectTrigger className='w-24 h-6 text-xs'>
                            <SelectValue placeholder='Town/Area' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='town'>Town/Area</SelectItem>
                            <SelectItem value='korogacho'>Korogocho</SelectItem>
                            <SelectItem value='kibera'>Kibera</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='p-0'>
                    <div className='h-60 sm:h-80 rounded-b-lg overflow-hidden'>
                      <InteractiveMap />
                    </div>
                  </CardContent>
                </Card>

                {/* Analytics Charts and Dataset Overview */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4'>
                  {/* Migration Chart */}
                  <Card className='card-border'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-base font-semibold text-gray-900'>
                        Migration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='p-0'>
                      <div className='h-32 sm:h-36 bg-gray-50 rounded-b-lg flex items-center justify-center relative'>
                        {/* Chart Container */}
                        <div className='w-full h-full p-3'>
                          {/* Y-axis */}
                          <div className='absolute left-3 top-3 bottom-3 flex flex-col justify-between text-xs text-gray-600'>
                            <span>100</span>
                            <span>75</span>
                            <span>50</span>
                            <span>25</span>
                            <span>10</span>
                          </div>

                          {/* Chart Lines */}
                          <div className='absolute left-8 right-3 top-3 bottom-3'>
                            {/* Grid Lines */}
                            <div className='absolute top-0 left-0 right-0 h-px bg-gray-200'></div>
                            <div className='absolute top-1/4 left-0 right-0 h-px bg-gray-200'></div>
                            <div className='absolute top-1/2 left-0 right-0 h-px bg-gray-200'></div>
                            <div className='absolute top-3/4 left-0 right-0 h-px bg-gray-200'></div>
                            <div className='absolute bottom-0 left-0 right-0 h-px bg-gray-200'></div>

                            {/* Entries Line (Yellow) */}
                            <svg
                              className='w-full h-full'
                              viewBox='0 0 100 100'
                              preserveAspectRatio='none'
                            >
                              <polyline
                                points='0,80 10,70 20,60 30,65 40,55 50,45 60,50 70,40 80,35 90,30 100,25'
                                fill='none'
                                stroke='#f59e0b'
                                strokeWidth='1.5'
                              />
                            </svg>

                            {/* Exits Line (Red) */}
                            <svg
                              className='w-full h-full absolute top-0 left-0'
                              viewBox='0 0 100 100'
                              preserveAspectRatio='none'
                            >
                              <polyline
                                points='0,85 10,75 20,70 30,60 40,65 50,55 60,45 70,50 80,40 90,35 100,30'
                                fill='none'
                                stroke='#ef4444'
                                strokeWidth='1.5'
                              />
                            </svg>
                          </div>

                          {/* X-axis Labels */}
                          <div className='absolute bottom-0 left-8 right-3 flex justify-between text-xs text-gray-600'>
                            <span>JAN</span>
                            <span>FEB</span>
                            <span>MAR</span>
                            <span>APR</span>
                            <span>MAY</span>
                            <span>JUN</span>
                            <span>JUL</span>
                            <span>AUG</span>
                            <span>SEP</span>
                            <span>OCT</span>
                            <span>NOV</span>
                            <span>DEC</span>
                          </div>

                          {/* Legend */}
                          <div className='absolute top-2 right-2 bg-white bg-opacity-90 rounded p-1 text-xs'>
                            <div className='flex items-center gap-1 mb-1'>
                              <div className='w-2 h-1 bg-yellow-500'></div>
                              <span>Entries</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <div className='w-2 h-1 bg-red-500'></div>
                              <span>Exits</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Population Analytics */}
                  <Card className='card-border'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-base font-semibold text-gray-900'>
                        Population Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='p-0'>
                      <div className='h-32 sm:h-36 bg-gray-50 rounded-b-lg flex items-center justify-center relative'>
                        {/* Donut Chart */}
                        <div className='relative w-20 h-20 sm:w-24 sm:h-24'>
                          {/* Donut Chart SVG */}
                          <svg
                            className='w-full h-full transform -rotate-90'
                            viewBox='0 0 100 100'
                          >
                            {/* Background Circle */}
                            <circle
                              cx='50'
                              cy='50'
                              r='40'
                              fill='none'
                              stroke='#e5e7eb'
                              strokeWidth='8'
                            />
                            {/* Data Segments */}
                            <circle
                              cx='50'
                              cy='50'
                              r='40'
                              fill='none'
                              stroke='#f59e0b'
                              strokeWidth='8'
                              strokeDasharray='125.6'
                              strokeDashoffset='62.8'
                              strokeLinecap='round'
                            />
                            <circle
                              cx='50'
                              cy='50'
                              r='40'
                              fill='none'
                              stroke='#3b82f6'
                              strokeWidth='8'
                              strokeDasharray='125.6'
                              strokeDashoffset='94.2'
                              strokeLinecap='round'
                            />
                            <circle
                              cx='50'
                              cy='50'
                              r='40'
                              fill='none'
                              stroke='#10b981'
                              strokeWidth='8'
                              strokeDasharray='125.6'
                              strokeDashoffset='125.6'
                              strokeLinecap='round'
                            />
                          </svg>

                          {/* Center Text */}
                          <div className='absolute inset-0 flex flex-col items-center justify-center text-xs'>
                            <span className='font-semibold text-gray-900'>
                              30K
                            </span>
                            <span className='text-gray-500'>Total</span>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className='absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 rounded p-2 text-xs'>
                          <div className='grid grid-cols-3 gap-1'>
                            <div className='flex items-center gap-1'>
                              <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                              <span>Male</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                              <span>Female</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                              <span>Other</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dataset Overview */}
                  <Card className='card-border'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-base font-semibold text-gray-900'>
                        Dataset Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='p-0'>
                      <div className='h-32 sm:h-36 bg-gray-50 rounded-b-lg p-4'>
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>
                              Total Datasets
                            </span>
                            <span className='text-sm font-semibold text-gray-900'>
                              167
                            </span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>
                              Active Projects
                            </span>
                            <span className='text-sm font-semibold text-gray-900'>
                              24
                            </span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>
                              Last Updated
                            </span>
                            <span className='text-sm font-semibold text-gray-900'>
                              2h ago
                            </span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>
                              Data Quality
                            </span>
                            <span className='text-sm font-semibold text-green-600'>
                              98%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right Column - Notifications Panel */}
              <div className='lg:col-span-1'>
                <NotificationsPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
