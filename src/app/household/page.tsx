'use client';

import { useState } from 'react';
import {
  Building2,
  Users,
  User,
  Home,
  TrendingUp,
  BarChart3,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  AlertCircle,
  ClipboardList,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Input } from '@/components/ui/Input/Input';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';

interface Site {
  id: string;
  name: string;
  location: string;
  households: number;
  individuals: number;
  status: 'active' | 'inactive' | 'pending';
  lastUpdated: string;
  coordinates: string;
}

interface Household {
  id: string;
  name: string;
  site: string;
  members: number;
  dwellingUnits: number;
  status: 'active' | 'inactive' | 'pending';
  lastUpdated: string;
  headOfHousehold: string;
}

interface Individual {
  id: string;
  name: string;
  household: string;
  site: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  status: 'resident' | 'migrant' | 'visitor';
  lastUpdated: string;
  occupation: string;
}

interface DwellingUnit {
  id: string;
  name: string;
  household: string;
  site: string;
  type: 'permanent' | 'temporary' | 'shared';
  status: 'occupied' | 'vacant' | 'under_construction';
  lastUpdated: string;
  rooms: number;
}

interface MigrationData {
  totalEntries: number;
  totalExits: number;
  hanging: number;
  missing: number;
  period: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface FieldStudy {
  id: string;
  title: string;
  site: string;
  type: 'survey' | 'interview' | 'observation' | 'focus-group';
  status: 'active' | 'completed' | 'pending' | 'draft';
  startDate: string;
  endDate: string;
  participants: number;
  targetSample: number;
  completionRate: number;
  researcher: string;
  lastUpdated: string;
  description: string;
  objectives: string[];
}

const mockSites: Site[] = [
  {
    id: '1',
    name: 'Kibera Settlement',
    location: 'Nairobi, Kenya',
    households: 245,
    individuals: 1247,
    status: 'active',
    lastUpdated: '2 hours ago',
    coordinates: '-1.2921, 36.8219',
  },
  {
    id: '2',
    name: 'Mathare Valley',
    location: 'Nairobi, Kenya',
    households: 189,
    individuals: 987,
    status: 'active',
    lastUpdated: '1 day ago',
    coordinates: '-1.2841, 36.8155',
  },
  {
    id: '3',
    name: 'Korogocho',
    location: 'Nairobi, Kenya',
    households: 156,
    individuals: 823,
    status: 'active',
    lastUpdated: '3 days ago',
    coordinates: '-1.2789, 36.8172',
  },
];

const mockHouseholds: Household[] = [
  {
    id: '1',
    name: 'Household A-001',
    site: 'Kibera Settlement',
    members: 5,
    dwellingUnits: 2,
    status: 'active',
    lastUpdated: '1 hour ago',
    headOfHousehold: 'John Kamau',
  },
  {
    id: '2',
    name: 'Household A-002',
    site: 'Kibera Settlement',
    members: 3,
    dwellingUnits: 1,
    status: 'active',
    lastUpdated: '2 hours ago',
    headOfHousehold: 'Mary Wanjiku',
  },
  {
    id: '3',
    name: 'Household B-001',
    site: 'Mathare Valley',
    members: 7,
    dwellingUnits: 3,
    status: 'active',
    lastUpdated: '1 day ago',
    headOfHousehold: 'Peter Otieno',
  },
];

const mockIndividuals: Individual[] = [
  {
    id: '1',
    name: 'John Kamau',
    household: 'Household A-001',
    site: 'Kibera Settlement',
    age: 35,
    gender: 'male',
    status: 'resident',
    lastUpdated: '1 hour ago',
    occupation: 'Construction Worker',
  },
  {
    id: '2',
    name: 'Mary Wanjiku',
    household: 'Household A-002',
    site: 'Kibera Settlement',
    age: 28,
    gender: 'female',
    status: 'resident',
    lastUpdated: '2 hours ago',
    occupation: 'Market Vendor',
  },
  {
    id: '3',
    name: 'Peter Otieno',
    household: 'Household B-001',
    site: 'Mathare Valley',
    age: 42,
    gender: 'male',
    status: 'resident',
    lastUpdated: '1 day ago',
    occupation: 'Driver',
  },
];

const mockDwellingUnits: DwellingUnit[] = [
  {
    id: '1',
    name: 'Unit A-001-1',
    household: 'Household A-001',
    site: 'Kibera Settlement',
    type: 'permanent',
    status: 'occupied',
    lastUpdated: '1 hour ago',
    rooms: 2,
  },
  {
    id: '2',
    name: 'Unit A-001-2',
    household: 'Household A-001',
    site: 'Kibera Settlement',
    type: 'permanent',
    status: 'occupied',
    lastUpdated: '1 hour ago',
    rooms: 1,
  },
  {
    id: '3',
    name: 'Unit A-002-1',
    household: 'Household A-002',
    site: 'Kibera Settlement',
    type: 'permanent',
    status: 'occupied',
    lastUpdated: '2 hours ago',
    rooms: 2,
  },
];

const mockMigrationData: MigrationData = {
  totalEntries: 156,
  totalExits: 89,
  hanging: 23,
  missing: 12,
  period: 'Last 30 days',
  trend: 'increasing',
};

const mockFieldStudies: FieldStudy[] = [
  {
    id: '1',
    title: 'Maternal Health Survey',
    site: 'Kibera Settlement',
    type: 'survey',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    participants: 245,
    targetSample: 300,
    completionRate: 82,
    researcher: 'Dr. Sarah Kimani',
    lastUpdated: '2 hours ago',
    description:
      'Comprehensive survey on maternal health practices and healthcare access in urban settlements',
    objectives: [
      'Assess maternal health knowledge and practices',
      'Evaluate healthcare access and barriers',
      'Identify risk factors for maternal complications',
      'Document traditional birthing practices',
    ],
  },
  {
    id: '2',
    title: 'Youth Migration Patterns',
    site: 'Mathare Valley',
    type: 'interview',
    status: 'completed',
    startDate: '2023-11-01',
    endDate: '2024-01-31',
    participants: 89,
    targetSample: 100,
    completionRate: 89,
    researcher: 'Dr. Peter Otieno',
    lastUpdated: '1 week ago',
    description:
      'In-depth interviews exploring youth migration patterns and decision-making processes',
    objectives: [
      'Understand migration motivations and triggers',
      'Map migration routes and destinations',
      'Analyze economic factors in migration decisions',
      'Assess social networks and support systems',
    ],
  },
  {
    id: '3',
    title: 'Housing Quality Assessment',
    site: 'Korogocho',
    type: 'observation',
    status: 'pending',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    participants: 0,
    targetSample: 150,
    completionRate: 0,
    researcher: 'Dr. Mary Wanjiku',
    lastUpdated: '3 days ago',
    description:
      'Systematic observation of housing conditions and infrastructure quality',
    objectives: [
      'Document housing conditions and quality',
      'Assess infrastructure and basic services',
      'Evaluate overcrowding and space utilization',
      'Identify housing improvement priorities',
    ],
  },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  resident: { label: 'Resident', color: 'bg-blue-100 text-blue-800' },
  migrant: { label: 'Migrant', color: 'bg-orange-100 text-orange-800' },
  visitor: { label: 'Visitor', color: 'bg-purple-100 text-purple-800' },
  occupied: { label: 'Occupied', color: 'bg-green-100 text-green-800' },
  vacant: { label: 'Vacant', color: 'bg-gray-100 text-gray-800' },
  under_construction: {
    label: 'Under Construction',
    color: 'bg-yellow-100 text-yellow-800',
  },
  permanent: { label: 'Permanent', color: 'bg-blue-100 text-blue-800' },
  temporary: { label: 'Temporary', color: 'bg-orange-100 text-orange-800' },
  shared: { label: 'Shared', color: 'bg-purple-100 text-purple-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  survey: { label: 'Survey', color: 'bg-blue-100 text-blue-800' },
  interview: { label: 'Interview', color: 'bg-purple-100 text-purple-800' },
  observation: { label: 'Observation', color: 'bg-orange-100 text-orange-800' },
  'focus-group': { label: 'Focus Group', color: 'bg-teal-100 text-teal-800' },
};

export default function HouseholdPage() {
  const [activeView, setActiveView] = useState<
    | 'main'
    | 'sites'
    | 'households'
    | 'individuals'
    | 'dwelling'
    | 'migration'
    | 'field-studies'
  >('main');
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewChange = (view: typeof activeView) => {
    setActiveView(view);
  };

  const getStatusConfig = (status: string) => {
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive
    );
  };

  const renderMainView = () => (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-0'>
          <div className='p-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg'>
            <Building2 className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Household Management
            </h1>
            <p className='text-gray-600'>
              Manage sites, households, individuals, and migration data
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              type='text'
              placeholder='Search...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-10 w-64'
            />
          </div>
          <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
            <Plus className='w-4 h-4 mr-2' />
            Add New
          </Button>
        </div>
      </div>

      {/* Main Menu Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Sites Card */}
        <Card
          className='hover:shadow-lg transition-shadow duration-200 cursor-pointer'
          onClick={() => handleViewChange('sites')}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg'>
                <Building2 className='w-6 h-6 text-white' />
              </div>
              <Badge className='bg-blue-100 text-blue-800'>
                {mockSites.length} Sites
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>Sites</h3>
            <p className='text-gray-600 mb-4'>
              Manage settlement sites and their locations
            </p>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Total:{' '}
                {mockSites.reduce((acc, site) => acc + site.households, 0)}{' '}
                households
              </div>
              <ArrowRight className='w-4 h-4 text-gray-400' />
            </div>
          </CardContent>
        </Card>

        {/* Households Card */}
        <Card
          className='hover:shadow-lg transition-shadow duration-200 cursor-pointer'
          onClick={() => handleViewChange('households')}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg'>
                <Users className='w-6 h-6 text-white' />
              </div>
              <Badge className='bg-green-100 text-green-800'>
                {mockHouseholds.length} Households
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Households
            </h3>
            <p className='text-gray-600 mb-4'>
              Manage household units and family structures
            </p>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Total: {mockHouseholds.reduce((acc, hh) => acc + hh.members, 0)}{' '}
                members
              </div>
              <ArrowRight className='w-4 h-4 text-gray-400' />
            </div>
          </CardContent>
        </Card>

        {/* Individuals Card */}
        <Card
          className='hover:shadow-lg transition-shadow duration-200 cursor-pointer'
          onClick={() => handleViewChange('individuals')}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg'>
                <User className='w-6 h-6 text-white' />
              </div>
              <Badge className='bg-purple-100 text-purple-800'>
                {mockIndividuals.length} Individuals
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Individuals
            </h3>
            <p className='text-gray-600 mb-4'>
              Manage individual residents and their details
            </p>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Active:{' '}
                {
                  mockIndividuals.filter(ind => ind.status === 'resident')
                    .length
                }{' '}
                residents
              </div>
              <ArrowRight className='w-4 h-4 text-gray-400' />
            </div>
          </CardContent>
        </Card>

        {/* Dwelling Units Card */}
        <Card
          className='hover:shadow-lg transition-shadow duration-200 cursor-pointer'
          onClick={() => handleViewChange('dwelling')}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg'>
                <Home className='w-6 h-6 text-white' />
              </div>
              <Badge className='bg-orange-100 text-orange-800'>
                {mockDwellingUnits.length} Units
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Dwelling Units
            </h3>
            <p className='text-gray-600 mb-4'>
              Manage housing units and occupancy status
            </p>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Occupied:{' '}
                {
                  mockDwellingUnits.filter(unit => unit.status === 'occupied')
                    .length
                }{' '}
                units
              </div>
              <ArrowRight className='w-4 h-4 text-gray-400' />
            </div>
          </CardContent>
        </Card>

        {/* Migration Analysis Card */}
        <Card
          className='hover:shadow-lg transition-shadow duration-200 cursor-pointer'
          onClick={() => handleViewChange('migration')}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg'>
                <TrendingUp className='w-6 h-6 text-white' />
              </div>
              <Badge className='bg-teal-100 text-teal-800'>Migration</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Migration Analysis
            </h3>
            <p className='text-gray-600 mb-4'>
              Track population movement and migration patterns
            </p>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Net: +
                {mockMigrationData.totalEntries - mockMigrationData.totalExits}
              </div>
              <ArrowRight className='w-4 h-4 text-gray-400' />
            </div>
          </CardContent>
        </Card>

        {/* Field Studies Card */}
        <Card
          className='hover:shadow-lg transition-shadow duration-200 cursor-pointer'
          onClick={() => handleViewChange('field-studies')}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg'>
                <ClipboardList className='w-6 h-6 text-white' />
              </div>
              <Badge className='bg-indigo-100 text-indigo-800'>
                {mockFieldStudies.length} Studies
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Population Field Studies
            </h3>
            <p className='text-gray-600 mb-4'>
              Manage research studies and data collection
            </p>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Active:{' '}
                {
                  mockFieldStudies.filter(study => study.status === 'active')
                    .length
                }{' '}
                studies
              </div>
              <ArrowRight className='w-4 h-4 text-gray-400' />
            </div>
          </CardContent>
        </Card>

        {/* Analytics Card */}
        <Card className='hover:shadow-lg transition-shadow duration-200 cursor-pointer'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg'>
                <BarChart3 className='w-6 h-6 text-white' />
              </div>
              <Badge className='bg-violet-100 text-violet-800'>Analytics</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Analytics & Reports
            </h3>
            <p className='text-gray-600 mb-4'>
              Generate insights and comprehensive reports
            </p>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>Reports available</div>
              <ArrowRight className='w-4 h-4 text-gray-400' />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSitesView = () => (
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
          <h2 className='text-2xl font-bold text-gray-900'>Sites</h2>
        </div>
        <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
          <Plus className='w-4 h-4 mr-2' />
          Add Site
        </Button>
      </div>

      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Settlement Sites
            </h3>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type='text'
                  placeholder='Search sites...'
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
                  Site
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Location
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Coordinates
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Households
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Individuals
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
              {mockSites.map(site => (
                <tr key={site.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <div className='h-10 w-10 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center'>
                          <Building2 className='w-5 h-5 text-white' />
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {site.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          ID: {site.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center text-sm text-gray-900'>
                      <MapPin className='w-4 h-4 mr-2 text-gray-400' />
                      {site.location}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {site.coordinates}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {site.households}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {site.individuals}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge className={getStatusConfig(site.status).color}>
                      {getStatusConfig(site.status).label}
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
                        className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        <Trash2 className='w-4 h-4' />
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

  const renderHouseholdsView = () => (
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
          <h2 className='text-2xl font-bold text-gray-900'>Households</h2>
        </div>
        <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
          <Plus className='w-4 h-4 mr-2' />
          Add Household
        </Button>
      </div>

      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900'>Households</h3>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type='text'
                  placeholder='Search households...'
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
                  Household
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Site
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Head of Household
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Members
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Dwelling Units
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
              {mockHouseholds.map(household => (
                <tr key={household.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <div className='h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center'>
                          <Users className='w-5 h-5 text-white' />
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {household.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          ID: {household.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {household.site}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {household.headOfHousehold}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {household.members}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {household.dwellingUnits}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge className={getStatusConfig(household.status).color}>
                      {getStatusConfig(household.status).label}
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
                        className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        <Trash2 className='w-4 h-4' />
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

  const renderIndividualsView = () => (
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
          <h2 className='text-2xl font-bold text-gray-900'>Individuals</h2>
        </div>
        <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
          <Plus className='w-4 h-4 mr-2' />
          Add Individual
        </Button>
      </div>

      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900'>Individuals</h3>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type='text'
                  placeholder='Search individuals...'
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
                  Individual
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Household
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Site
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Age
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Gender
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Occupation
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
              {mockIndividuals.map(individual => (
                <tr key={individual.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <div className='h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center'>
                          <User className='w-5 h-5 text-white' />
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {individual.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          ID: {individual.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {individual.household}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {individual.site}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {individual.age}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize'>
                    {individual.gender}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {individual.occupation}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge className={getStatusConfig(individual.status).color}>
                      {getStatusConfig(individual.status).label}
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
                        className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        <Trash2 className='w-4 h-4' />
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

  const renderDwellingView = () => (
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
          <h2 className='text-2xl font-bold text-gray-900'>Dwelling Units</h2>
        </div>
        <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
          <Plus className='w-4 h-4 mr-2' />
          Add Unit
        </Button>
      </div>

      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Dwelling Units
            </h3>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type='text'
                  placeholder='Search units...'
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
                  Unit
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Household
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Site
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Rooms
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
              {mockDwellingUnits.map(unit => (
                <tr key={unit.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <div className='h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center'>
                          <Home className='w-5 h-5 text-white' />
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {unit.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          ID: {unit.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {unit.household}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {unit.site}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge className={getStatusConfig(unit.type).color}>
                      {getStatusConfig(unit.type).label}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {unit.rooms}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge className={getStatusConfig(unit.status).color}>
                      {getStatusConfig(unit.status).label}
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
                        className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        <Trash2 className='w-4 h-4' />
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

  const renderMigrationView = () => (
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
            Migration Analysis
          </h2>
        </div>
        <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
          <BarChart3 className='w-4 h-4 mr-2' />
          Generate Report
        </Button>
      </div>

      {/* Migration Overview Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card className='border-0 shadow-sm'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Entries
                </p>
                <p className='text-2xl font-bold text-green-600'>
                  {mockMigrationData.totalEntries}
                </p>
              </div>
              <div className='p-2 bg-green-100 rounded-lg'>
                <TrendingUp className='w-6 h-6 text-green-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-0 shadow-sm'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Total Exits</p>
                <p className='text-2xl font-bold text-red-600'>
                  {mockMigrationData.totalExits}
                </p>
              </div>
              <div className='p-2 bg-red-100 rounded-lg'>
                <TrendingUp className='w-6 h-6 text-red-600 rotate-180' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-0 shadow-sm'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Hanging</p>
                <p className='text-2xl font-bold text-yellow-600'>
                  {mockMigrationData.hanging}
                </p>
              </div>
              <div className='p-2 bg-yellow-100 rounded-lg'>
                <AlertCircle className='w-6 h-6 text-yellow-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-0 shadow-sm'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Missing</p>
                <p className='text-2xl font-bold text-gray-600'>
                  {mockMigrationData.missing}
                </p>
              </div>
              <div className='p-2 bg-gray-100 rounded-lg'>
                <AlertCircle className='w-6 h-6 text-gray-600' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Migration Details */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='border-0 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>
              Migration Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Period:</span>
                <span className='font-semibold'>
                  {mockMigrationData.period}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Net Migration:</span>
                <span
                  className={`font-semibold ${mockMigrationData.totalEntries - mockMigrationData.totalExits > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {mockMigrationData.totalEntries -
                    mockMigrationData.totalExits >
                  0
                    ? '+'
                    : ''}
                  {mockMigrationData.totalEntries -
                    mockMigrationData.totalExits}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600'>Trend:</span>
                <Badge
                  className={
                    mockMigrationData.trend === 'increasing'
                      ? 'bg-green-100 text-green-800'
                      : mockMigrationData.trend === 'decreasing'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                  }
                >
                  {mockMigrationData.trend.charAt(0).toUpperCase() +
                    mockMigrationData.trend.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-0 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>
              Migration Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between items-center p-3 bg-green-50 rounded-lg'>
                <span className='text-sm text-gray-600'>Entry Rate</span>
                <span className='font-semibold text-green-600'>
                  {Math.round(
                    (mockMigrationData.totalEntries /
                      (mockMigrationData.totalEntries +
                        mockMigrationData.totalExits)) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className='flex justify-between items-center p-3 bg-red-50 rounded-lg'>
                <span className='text-sm text-gray-600'>Exit Rate</span>
                <span className='font-semibold text-red-600'>
                  {Math.round(
                    (mockMigrationData.totalExits /
                      (mockMigrationData.totalEntries +
                        mockMigrationData.totalExits)) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className='flex justify-between items-center p-3 bg-yellow-50 rounded-lg'>
                <span className='text-sm text-gray-600'>Hanging Rate</span>
                <span className='font-semibold text-yellow-600'>
                  {Math.round(
                    (mockMigrationData.hanging /
                      (mockMigrationData.totalEntries +
                        mockMigrationData.totalExits)) *
                      100
                  )}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderFieldStudiesView = () => (
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
            Population Field Studies
          </h2>
        </div>
        <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
          <Plus className='w-4 h-4 mr-2' />
          New Study
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {mockFieldStudies.map(study => (
          <Card
            key={study.id}
            className='hover:shadow-lg transition-shadow duration-200'
          >
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-2'>
                  <Badge className={getStatusConfig(study.status).color}>
                    {getStatusConfig(study.status).label}
                  </Badge>
                  <Badge className={getStatusConfig(study.type).color}>
                    {getStatusConfig(study.type).label}
                  </Badge>
                </div>
                <div className='text-xs text-gray-500'>{study.lastUpdated}</div>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  {study.title}
                </h3>
                <p className='text-sm text-gray-600 mb-3'>{study.site}</p>
                <div className='text-xs text-gray-500'>
                  Researcher: {study.researcher}
                </div>
              </div>

              <div className='space-y-2'>
                <p className='text-sm text-gray-600 line-clamp-2'>
                  {study.description}
                </p>
              </div>

              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-gray-500'>Progress:</span>
                  <div className='flex items-center gap-2'>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-orange-500 to-amber-600 h-2 rounded-full'
                        style={{ width: `${study.completionRate}%` }}
                      ></div>
                    </div>
                    <span className='text-xs font-medium'>
                      {study.completionRate}%
                    </span>
                  </div>
                </div>
                <div>
                  <span className='text-gray-500'>Participants:</span>
                  <p className='font-semibold text-gray-900'>
                    {study.participants}/{study.targetSample}
                  </p>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-xs text-gray-500'>
                  <Calendar className='w-3 h-3' />
                  {study.startDate} - {study.endDate}
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-500'>
                  <Target className='w-3 h-3' />
                  {study.objectives.length} objectives
                </div>
              </div>

              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1 border-orange-200 text-orange-700 hover:bg-orange-50'
                >
                  <Eye className='w-3 h-3 mr-1' />
                  View
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1 border-orange-200 text-orange-700 hover:bg-orange-50'
                >
                  <Edit className='w-3 h-3 mr-1' />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50'>
        <Sidebar />

        <div className='flex-1 flex flex-col overflow-hidden'>
          <TopBar />

          <div className='flex-1 p-4 overflow-y-auto'>
            <div className='max-w-7xl mx-auto'>
              {activeView === 'main' && renderMainView()}
              {activeView === 'sites' && renderSitesView()}
              {activeView === 'households' && renderHouseholdsView()}
              {activeView === 'individuals' && renderIndividualsView()}
              {activeView === 'dwelling' && renderDwellingView()}
              {activeView === 'migration' && renderMigrationView()}
              {activeView === 'field-studies' && renderFieldStudiesView()}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
