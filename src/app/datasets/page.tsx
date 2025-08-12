'use client';

import { useState } from 'react';
import {
  Database,
  FileText,
  BarChart3,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Download,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { TopBar } from '@/components/dashboard/top-bar';
import { Sidebar } from '@/components/dashboard/sidebar';

interface Dataset {
  id: string;
  name: string;
  description: string;
  category: 'population' | 'health' | 'housing' | 'migration' | 'socioeconomic';
  format: 'csv' | 'json' | 'excel' | 'api';
  size: string;
  records: number;
  lastUpdated: string;
  status: 'available' | 'processing' | 'archived';
  tags: string[];
  owner: string;
}

interface DataRequest {
  id: string;
  title: string;
  description: string;
  requester: string;
  dataset: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestDate: string;
  responseDate?: string;
  priority: 'low' | 'medium' | 'high';
  dataType: 'dataset' | 'report' | 'analysis';
}

interface DataReport {
  id: string;
  title: string;
  description: string;
  type: 'analysis' | 'summary' | 'dashboard' | 'research';
  author: string;
  createdDate: string;
  lastModified: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  downloads: number;
  tags: string[];
  dataset: string;
}

const mockDatasets: Dataset[] = [
  {
    id: '1',
    name: 'Population Census 2023',
    description:
      'Complete population data from the 2023 census including demographics, household composition, and migration patterns',
    category: 'population',
    format: 'csv',
    size: '2.3 GB',
    records: 1250000,
    lastUpdated: '2024-01-15',
    status: 'available',
    tags: ['census', 'demographics', 'population'],
    owner: 'National Statistics Office',
  },
  {
    id: '2',
    name: 'Health Facility Survey',
    description:
      'Comprehensive survey of health facilities, services, and patient data across urban settlements',
    category: 'health',
    format: 'excel',
    size: '856 MB',
    records: 45000,
    lastUpdated: '2024-02-20',
    status: 'available',
    tags: ['health', 'facilities', 'survey'],
    owner: 'Ministry of Health',
  },
  {
    id: '3',
    name: 'Housing Quality Assessment',
    description:
      'Detailed assessment of housing conditions, infrastructure, and living standards in informal settlements',
    category: 'housing',
    format: 'json',
    size: '1.1 GB',
    records: 78000,
    lastUpdated: '2024-01-08',
    status: 'processing',
    tags: ['housing', 'infrastructure', 'quality'],
    owner: 'Urban Development Authority',
  },
  {
    id: '4',
    name: 'Migration Patterns 2024',
    description:
      'Analysis of internal and external migration patterns, reasons, and demographic impacts',
    category: 'migration',
    format: 'csv',
    size: '567 MB',
    records: 32000,
    lastUpdated: '2024-03-01',
    status: 'available',
    tags: ['migration', 'patterns', 'demographics'],
    owner: 'Population Research Institute',
  },
  {
    id: '5',
    name: 'Socioeconomic Indicators',
    description:
      'Comprehensive socioeconomic data including income, education, employment, and living standards',
    category: 'socioeconomic',
    format: 'excel',
    size: '1.8 GB',
    records: 95000,
    lastUpdated: '2024-02-10',
    status: 'archived',
    tags: ['socioeconomic', 'income', 'education'],
    owner: 'Economic Planning Department',
  },
];

const mockDataRequests: DataRequest[] = [
  {
    id: '1',
    title: 'Access to Population Census Data',
    description:
      'Request for access to population census data for research on urban migration patterns',
    requester: 'Dr. Sarah Kimani',
    dataset: 'Population Census 2023',
    purpose:
      'Academic research on urban migration patterns and demographic changes',
    status: 'approved',
    requestDate: '2024-03-01',
    responseDate: '2024-03-05',
    priority: 'medium',
    dataType: 'dataset',
  },
  {
    id: '2',
    title: 'Health Facility Data Analysis',
    description:
      'Request for health facility data to analyze healthcare access in informal settlements',
    requester: 'Ministry of Health',
    dataset: 'Health Facility Survey',
    purpose: 'Policy development and healthcare planning for urban areas',
    status: 'pending',
    requestDate: '2024-03-10',
    priority: 'high',
    dataType: 'analysis',
  },
  {
    id: '3',
    title: 'Housing Quality Report',
    description:
      'Request for housing quality data to generate comprehensive housing assessment report',
    requester: 'Urban Development Authority',
    dataset: 'Housing Quality Assessment',
    purpose: 'Urban planning and housing policy development',
    status: 'completed',
    requestDate: '2024-02-15',
    responseDate: '2024-02-20',
    priority: 'high',
    dataType: 'report',
  },
  {
    id: '4',
    title: 'Migration Analysis Dataset',
    description:
      'Request for migration patterns data for academic research on population dynamics',
    requester: 'Prof. John Mwangi',
    dataset: 'Migration Patterns 2024',
    purpose: 'Academic research on population dynamics and migration trends',
    status: 'rejected',
    requestDate: '2024-03-05',
    responseDate: '2024-03-08',
    priority: 'low',
    dataType: 'dataset',
  },
];

const mockDataReports: DataReport[] = [
  {
    id: '1',
    title: 'Urban Population Growth Analysis',
    description:
      'Comprehensive analysis of urban population growth patterns and demographic changes',
    type: 'analysis',
    author: 'Dr. Sarah Kimani',
    createdDate: '2024-02-15',
    lastModified: '2024-03-01',
    status: 'published',
    views: 245,
    downloads: 89,
    tags: ['population', 'urban', 'growth'],
    dataset: 'Population Census 2023',
  },
  {
    id: '2',
    title: 'Healthcare Access in Informal Settlements',
    description:
      'Detailed report on healthcare access, challenges, and recommendations for informal settlements',
    type: 'research',
    author: 'Ministry of Health',
    createdDate: '2024-01-20',
    lastModified: '2024-02-10',
    status: 'published',
    views: 189,
    downloads: 67,
    tags: ['health', 'access', 'informal-settlements'],
    dataset: 'Health Facility Survey',
  },
  {
    id: '3',
    title: 'Housing Quality Dashboard',
    description:
      'Interactive dashboard showing housing quality metrics and infrastructure assessment',
    type: 'dashboard',
    author: 'Urban Development Authority',
    createdDate: '2024-02-01',
    lastModified: '2024-02-28',
    status: 'published',
    views: 312,
    downloads: 145,
    tags: ['housing', 'dashboard', 'quality'],
    dataset: 'Housing Quality Assessment',
  },
  {
    id: '4',
    title: 'Migration Trends Summary',
    description:
      'Executive summary of migration trends and their impact on urban development',
    type: 'summary',
    author: 'Population Research Institute',
    createdDate: '2024-01-10',
    lastModified: '2024-01-25',
    status: 'draft',
    views: 45,
    downloads: 12,
    tags: ['migration', 'trends', 'summary'],
    dataset: 'Migration Patterns 2024',
  },
];

const statusConfig = {
  available: { label: 'Available', color: 'bg-green-100 text-green-800' },
  processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
  archived: { label: 'Archived', color: 'bg-gray-100 text-gray-800' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800' },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  published: { label: 'Published', color: 'bg-green-100 text-green-800' },
  population: { label: 'Population', color: 'bg-blue-100 text-blue-800' },
  health: { label: 'Health', color: 'bg-green-100 text-green-800' },
  housing: { label: 'Housing', color: 'bg-orange-100 text-orange-800' },
  migration: { label: 'Migration', color: 'bg-purple-100 text-purple-800' },
  socioeconomic: {
    label: 'Socioeconomic',
    color: 'bg-indigo-100 text-indigo-800',
  },
  low: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  high: { label: 'High', color: 'bg-red-100 text-red-800' },
  analysis: { label: 'Analysis', color: 'bg-blue-100 text-blue-800' },
  summary: { label: 'Summary', color: 'bg-green-100 text-green-800' },
  dashboard: { label: 'Dashboard', color: 'bg-purple-100 text-purple-800' },
  research: { label: 'Research', color: 'bg-orange-100 text-orange-800' },
};

export default function DataHubPage() {
  const [activeView, setActiveView] = useState<
    'main' | 'datasets' | 'requests' | 'reports'
  >('main');

  const handleViewChange = (view: typeof activeView) => {
    setActiveView(view);
  };

  const getStatusConfig = (status: string) => {
    return (
      statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        color: 'bg-gray-100 text-gray-800',
      }
    );
  };

  const renderMainView = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Data Hub</h1>
          <p className='text-gray-600 mt-2'>
            Manage datasets, requests, and reports
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Datasets Card */}
        <Card
          className='hover:shadow-lg transition-shadow duration-200 cursor-pointer'
          onClick={() => handleViewChange('datasets')}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg'>
                <Database className='w-6 h-6 text-white' />
              </div>
              <Badge className='bg-blue-100 text-blue-800'>
                {mockDatasets.length} Datasets
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Datasets
            </h3>
            <p className='text-gray-600 mb-4'>Browse and download data</p>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Available:{' '}
                {mockDatasets.filter(d => d.status === 'available').length}{' '}
                datasets
              </div>
              <ArrowRight className='w-4 h-4 text-gray-400' />
            </div>
          </CardContent>
        </Card>

        {/* Data Requests Card */}
        <Card
          className='hover:shadow-lg transition-shadow duration-200 cursor-pointer'
          onClick={() => handleViewChange('requests')}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='p-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg'>
                <FileText className='w-6 h-6 text-white' />
              </div>
              <Badge className='bg-orange-100 text-orange-800'>
                {mockDataRequests.length} Requests
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Data Requests
            </h3>
            <p className='text-gray-600 mb-4'>Manage access requests</p>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Pending:{' '}
                {mockDataRequests.filter(r => r.status === 'pending').length}{' '}
                requests
              </div>
              <ArrowRight className='w-4 h-4 text-gray-400' />
            </div>
          </CardContent>
        </Card>

        {/* Data Reports Card */}
        <Card
          className='hover:shadow-lg transition-shadow duration-200 cursor-pointer'
          onClick={() => handleViewChange('reports')}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg'>
                <BarChart3 className='w-6 h-6 text-white' />
              </div>
              <Badge className='bg-green-100 text-green-800'>
                {mockDataReports.length} Reports
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Data Reports & Analysis
            </h3>
            <p className='text-gray-600 mb-4'>View reports</p>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Published:{' '}
                {mockDataReports.filter(r => r.status === 'published').length}{' '}
                reports
              </div>
              <ArrowRight className='w-4 h-4 text-gray-400' />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDatasetsView = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleViewChange('main')}
            className='p-0 h-auto text-gray-600 hover:text-gray-900'
          >
            <ArrowRight className='w-4 h-4 mr-1 rotate-180' />
            Back to Main
          </Button>
          <h2 className='text-2xl font-bold text-gray-900'>Datasets</h2>
        </div>
        <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
          <Plus className='w-4 h-4 mr-2' />
          Upload Dataset
        </Button>
      </div>

      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Available Datasets
            </h3>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type='text'
                  placeholder='Search datasets...'
                  className='pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                />
              </div>
              <Button variant='outline' size='sm' className='border-gray-300'>
                <Filter className='w-4 h-4 mr-2' />
                Filter
              </Button>
            </div>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Dataset
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Category
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Format
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Size
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Records
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {mockDatasets.map(dataset => (
                <tr key={dataset.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <div className='h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center'>
                          <Database className='w-5 h-5 text-white' />
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {dataset.name}
                        </div>
                        <div className='text-sm text-gray-500 line-clamp-2'>
                          {dataset.description}
                        </div>
                        <div className='text-xs text-gray-400 mt-1'>
                          Owner: {dataset.owner}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge className={getStatusConfig(dataset.category).color}>
                      {getStatusConfig(dataset.category).label}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 uppercase'>
                    {dataset.format}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {dataset.size}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {dataset.records.toLocaleString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge className={getStatusConfig(dataset.status).color}>
                      {getStatusConfig(dataset.status).label}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex items-center gap-2'>
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
                        className='text-green-600 hover:text-green-700 hover:bg-green-50'
                      >
                        <Download className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRequestsView = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleViewChange('main')}
            className='p-0 h-auto text-gray-600 hover:text-gray-900'
          >
            <ArrowRight className='w-4 h-4 mr-1 rotate-180' />
            Back to Main
          </Button>
          <h2 className='text-2xl font-bold text-gray-900'>Data Requests</h2>
        </div>
        <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
          <Plus className='w-4 h-4 mr-2' />
          Request Access
        </Button>
      </div>

      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Data Access Requests
            </h3>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type='text'
                  placeholder='Search requests...'
                  className='pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                />
              </div>
              <Button variant='outline' size='sm' className='border-gray-300'>
                <Filter className='w-4 h-4 mr-2' />
                Filter
              </Button>
            </div>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Request
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Requester
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Dataset
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Purpose
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Priority
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {mockDataRequests.map(request => (
                <tr key={request.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <div className='h-10 w-10 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center'>
                          <FileText className='w-5 h-5 text-white' />
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {request.title}
                        </div>
                        <div className='text-sm text-gray-500 line-clamp-2'>
                          {request.description}
                        </div>
                        <div className='text-xs text-gray-400 mt-1'>
                          Requested: {request.requestDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {request.requester}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {request.dataset}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    <div className='max-w-xs truncate'>{request.purpose}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge className={getStatusConfig(request.priority).color}>
                      {getStatusConfig(request.priority).label}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge className={getStatusConfig(request.status).color}>
                      {getStatusConfig(request.status).label}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex items-center gap-2'>
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
                        className='text-green-600 hover:text-green-700 hover:bg-green-50'
                      >
                        <CheckCircle className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        <AlertCircle className='w-4 h-4' />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReportsView = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleViewChange('main')}
            className='p-0 h-auto text-gray-600 hover:text-gray-900'
          >
            <ArrowRight className='w-4 h-4 mr-1 rotate-180' />
            Back to Main
          </Button>
          <h2 className='text-2xl font-bold text-gray-900'>
            Data Reports & Analysis
          </h2>
        </div>
        <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
          <Plus className='w-4 h-4 mr-2' />
          Create Report
        </Button>
      </div>

      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Reports & Analysis
            </h3>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type='text'
                  placeholder='Search reports...'
                  className='pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                />
              </div>
              <Button variant='outline' size='sm' className='border-gray-300'>
                <Filter className='w-4 h-4 mr-2' />
                Filter
              </Button>
            </div>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Report
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Author
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Dataset
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Views
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Downloads
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {mockDataReports.map(report => (
                <tr key={report.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <div className='h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center'>
                          <BarChart3 className='w-5 h-5 text-white' />
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {report.title}
                        </div>
                        <div className='text-sm text-gray-500 line-clamp-2'>
                          {report.description}
                        </div>
                        <div className='text-xs text-gray-400 mt-1'>
                          Created: {report.createdDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge className={getStatusConfig(report.type).color}>
                      {getStatusConfig(report.type).label}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {report.author}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {report.dataset}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {report.views}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {report.downloads}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge className={getStatusConfig(report.status).color}>
                      {getStatusConfig(report.status).label}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex items-center gap-2'>
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
                        className='text-green-600 hover:text-green-700 hover:bg-green-50'
                      >
                        <Download className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <TopBar />
          <main className='flex-1 overflow-y-auto p-6'>
            <div className='max-w-7xl mx-auto'>
              {activeView === 'main' && renderMainView()}
              {activeView === 'datasets' && renderDatasetsView()}
              {activeView === 'requests' && renderRequestsView()}
              {activeView === 'reports' && renderReportsView()}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
