'use client';

import { Filter, Download, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { TopBar } from '@/components/dashboard/top-bar';
import { Sidebar } from '@/components/dashboard/sidebar';

export default function PopulationPage() {
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
                    Population Report
                  </h1>
                  <p className='text-gray-600 mt-2'>
                    Population analytics and demographic data
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <Button variant='outline' className='border-gray-300'>
                    <Filter className='w-4 h-4 mr-2' />
                    Filter by
                  </Button>
                  <Button variant='outline' className='border-gray-300'>
                    <Download className='w-4 h-4 mr-2' />
                    Exports
                  </Button>
                </div>
              </div>

              {/* Empty State */}
              <div className='flex flex-col items-center justify-center py-20'>
                <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
                  <FileText className='w-12 h-12 text-gray-400' />
                </div>
                <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
                  No Population Data Available
                </h2>
                <p className='text-gray-600 text-center max-w-md mb-8'>
                  The population report is currently empty. No analytics or
                  demographic data has been loaded.
                </p>
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                  <AlertCircle className='w-4 h-4' />
                  <span>Report is empty</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
