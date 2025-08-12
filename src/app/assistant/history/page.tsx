'use client';

import { useState } from 'react';
import { ArrowLeft, Search, Calendar, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import Link from 'next/link';

interface HistoryEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'research' | 'analysis' | 'report' | 'general';
}

const mockHistoryData: HistoryEntry[] = [
  {
    id: '1',
    date: 'March 8, 2025',
    title: 'Sample Research Study done',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    type: 'research'
  },
  {
    id: '2',
    date: 'March 7, 2025',
    title: 'Data Analysis for Population Study',
    description: 'Comprehensive analysis of demographic data including age distribution, gender ratios, and geographic patterns. Statistical analysis revealed significant correlations between population density and economic indicators.',
    type: 'analysis'
  },
  {
    id: '3',
    date: 'March 6, 2025',
    title: 'Research Methodology Design',
    description: 'Designed a mixed-methods research approach combining quantitative surveys with qualitative interviews. Included sampling strategies, data collection protocols, and analysis frameworks.',
    type: 'research'
  },
  {
    id: '4',
    date: 'March 5, 2025',
    title: 'Statistical Report Generation',
    description: 'Generated comprehensive statistical report analyzing survey responses from 500 participants. Included descriptive statistics, correlation analysis, and regression models.',
    type: 'report'
  },
  {
    id: '5',
    date: 'March 4, 2025',
    title: 'Qualitative Data Analysis',
    description: 'Conducted thematic analysis of interview transcripts from field researchers. Identified key themes related to community engagement and research participation.',
    type: 'analysis'
  },
  {
    id: '6',
    date: 'March 3, 2025',
    title: 'Research Ethics Review',
    description: 'Comprehensive review of research protocols ensuring compliance with ethical guidelines. Addressed informed consent, data privacy, and participant protection measures.',
    type: 'research'
  }
];

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState(mockHistoryData);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredHistory(mockHistoryData);
    } else {
      const filtered = mockHistoryData.filter(entry =>
        entry.title.toLowerCase().includes(query.toLowerCase()) ||
        entry.description.toLowerCase().includes(query.toLowerCase()) ||
        entry.type.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('history-search') as HTMLInputElement;
      searchInput?.focus();
    }
  };

  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50'>
        <Sidebar />

        <div className='flex-1 flex flex-col overflow-hidden'>
          <TopBar />

          {/* History Page Content */}
          <div className='flex-1 overflow-y-auto'>
            <div className='max-w-4xl mx-auto px-6 py-8'>
              {/* Header Section */}
              <div className='flex items-start justify-between mb-8'>
                <div className='flex items-center space-x-4'>
                  {/* Back Arrow */}
                  <Link href='/assistant'>
                    <Button
                      variant='ghost'
                      className='p-2 hover:bg-gray-100 rounded-lg'
                    >
                      <ArrowLeft className='w-5 h-5 text-gray-600' />
                    </Button>
                  </Link>

                  {/* Page Title */}
                  <h1 className='text-2xl font-bold text-gray-800'>
                    My History
                  </h1>
                </div>

                {/* Search Bar */}
                <div className='relative'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <Input
                      id='history-search'
                      type='text'
                      placeholder='Search for chats'
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className='pl-10 pr-20 w-80 border-gray-200 focus:border-orange-500 focus:ring-orange-500'
                    />
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border'>
                      ⌘K
                    </div>
                  </div>
                </div>
              </div>

              {/* History Entries */}
              <div className='space-y-4'>
                {filteredHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className='bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        {/* Date */}
                        <div className='flex items-center text-sm text-gray-500 mb-2'>
                          <Calendar className='w-4 h-4 mr-2' />
                          {entry.date}
                        </div>

                        {/* Title */}
                        <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                          {entry.title}
                        </h3>

                        {/* Description */}
                        <p className='text-gray-600 text-sm leading-relaxed'>
                          {entry.description.length > 200
                            ? `${entry.description.substring(0, 200)}...`
                            : entry.description
                          }
                        </p>
                      </div>

                      {/* Options Menu */}
                      <Button
                        variant='ghost'
                        className='p-2 hover:bg-gray-100 rounded-lg ml-4'
                      >
                        <MoreVertical className='w-4 h-4 text-gray-400' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredHistory.length === 0 && (
                <div className='text-center py-12'>
                  <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Search className='w-8 h-8 text-gray-400' />
                  </div>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    No history found
                  </h3>
                  <p className='text-gray-500'>
                    Try adjusting your search terms or browse all history.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
