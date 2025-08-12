'use client';

// Force client-side rendering to avoid SSR issues with Supabase
export const dynamic = 'force-dynamic';
export const ssr = false;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileText,
  Users,
  Globe,
  TrendingUp,
  Database,
  Filter,
  SortAsc,
  SortDesc,
  Target,
  Edit,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Input } from '@/components/ui/Input/Input';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { useAuth } from '@/lib/auth-context';
import { studyService, researchProjectService } from '@/lib/research-process';
import { 
  Study, 
  ResearchProject, 
  StudyType, 
  StudyStatus,
  ProjectStatus 
} from '@/types/research-process';
import { RESEARCH_STEPS, ROUTES } from '@/constants/research-process';

// Research status types
type ResearchStatus = 'active' | 'pending' | 'completed' | 'draft';

// Research step types
type ResearchStep =
  | 'define-topic'
  | 'define-questions'
  | 'map-questions'
  | 'identify-data'
  | 'collect-data'
  | 'attach-documents';

interface ResearchProjectDisplay {
  id: string;
  title: string;
  description: string;
  status: ResearchStatus;
  currentStep: ResearchStep;
  progress: number;
  department: string;
  type: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  study?: Study;
  project?: ResearchProject;
}

const stepLabels: Record<ResearchStep, string> = {
  'define-topic': 'Define Research Topic',
  'define-questions': 'Define Research Questions',
  'map-questions': 'Map Sub-Questions',
  'identify-data': 'Identify Missing Data',
  'collect-data': 'Initiate Data Collection',
  'attach-documents': 'Attach Supporting Documents',
};

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: Play },
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  completed: {
    label: 'Completed',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
  },
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-800',
    icon: AlertCircle,
  },
};

const departmentColors = {
  Health: 'bg-green-500',
  Population: 'bg-blue-500',
  Infrastructure: 'bg-purple-500',
  Nutrition: 'bg-orange-500',
  Research: 'bg-indigo-500',
  Evaluation: 'bg-pink-500',
};

export default function AnalyticsPage() {
  const router = useRouter();
  const { session } = useAuth();
  const [activeFilter, setActiveFilter] = useState<ResearchStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [researchProjects, setResearchProjects] = useState<ResearchProjectDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showResearchSteps, setShowResearchSteps] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(9);
  
  // Sorting state
  const [sortBy, setSortBy] = useState<'created_at' | 'title' | 'status'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch research projects from database
  const fetchResearchProjects = async () => {
    if (!session?.access_token) return;

    try {
      setLoading(true);
      setError('');

      // Fetch studies and projects
      const [studies, projects] = await Promise.all([
        studyService.getAll(session.access_token),
        researchProjectService.getAll(session.access_token)
      ]);

      // Combine and transform data
      const combinedProjects: ResearchProjectDisplay[] = studies.map(study => {
        const studyProjects = projects.filter(p => p.study_id === study.study_id);
        
        if (studyProjects.length === 0) {
                  // Study without projects
        return {
          id: `study-${study.study_id}`,
          title: study.title,
          description: study.objectives,
          status: mapStudyStatus(study.status || 'draft'),
          currentStep: 'define-topic' as ResearchStep,
          progress: 10,
          department: 'Research',
          type: study.study_type || 'Research',
          location: study.study_area,
          createdAt: study.created_at,
          updatedAt: study.updated_at,
          study,
        };
        }

        // Study with projects
        return studyProjects.map(project => ({
          id: `project-${project.research_project_id}`,
          title: project.title || study.title,
          description: project.description || study.objectives,
          status: mapProjectStatus(project.status || 'active'),
          currentStep: determineCurrentStep(project.research_project_id, projects),
          progress: calculateProgress(project.research_project_id, projects),
          department: 'Research',
          type: study.study_type || 'Research',
          location: study.study_area,
          createdAt: project.created_at,
          updatedAt: project.updated_at,
          study,
          project,
        }));
      }).flat();

      setResearchProjects(combinedProjects);
      setTotalItems(combinedProjects.length);
      setTotalPages(Math.ceil(combinedProjects.length / itemsPerPage));
      setCurrentPage(1);

    } catch (err) {
      console.error('Error fetching research projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch research projects');
    } finally {
      setLoading(false);
    }
  };

  // Map study status to display status
  const mapStudyStatus = (status: StudyStatus): ResearchStatus => {
    switch (status) {
      case 'active': return 'active';
      case 'completed': return 'completed';
      case 'suspended': return 'pending';
      case 'terminated': return 'draft';
      case 'draft': return 'draft';
      default: return 'draft';
    }
  };

  // Map project status to display status
  const mapProjectStatus = (status: ProjectStatus): ResearchStatus => {
    switch (status) {
      case 'active': return 'active';
      case 'completed': return 'completed';
      case 'suspended': return 'pending';
      case 'terminated': return 'draft';
      default: return 'draft';
    }
  };

  // Determine current step based on project progress
  const determineCurrentStep = (projectId: number, allProjects: ResearchProject[]): ResearchStep => {
    // This would need to be enhanced based on actual question data
    // For now, return a default step
    return 'define-questions';
  };

  // Calculate progress percentage
  const calculateProgress = (projectId: number, allProjects: ResearchProject[]): number => {
    // This would need to be enhanced based on actual question data
    // For now, return a default progress
    return 25;
  };

  // Load data on component mount
  useEffect(() => {
    if (session?.access_token) {
      fetchResearchProjects();
    }
  }, [session]);

  // Filter and search logic
  const filteredResearch = researchProjects.filter(project => {
    const matchesFilter = activeFilter === 'all' || project.status === activeFilter;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResearch = filteredResearch.slice(startIndex, endIndex);

  // Get status counts
  const getStatusCount = (status: ResearchStatus) => {
    return researchProjects.filter(project => project.status === status).length;
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sorting
  const handleSort = (field: 'created_at' | 'title' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Sort research projects
  const sortedResearch = [...filteredResearch].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'created_at':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });



  const handleContinueResearch = (projectId: string, currentStep: ResearchStep) => {
    // Extract the actual ID from the combined ID
    const actualId = projectId.replace(/^(study-|project-)/, '');
    
    if (projectId.startsWith('study-')) {
      router.push(`${ROUTES.defineTopic}?study_id=${actualId}`);
    } else {
      router.push(`${ROUTES.defineQuestions}?project_id=${actualId}`);
    }
  };

  const handleViewReport = (projectId: string) => {
    // Extract the actual ID from the combined ID and navigate to report page
    const actualId = projectId.replace(/^(study-|project-)/, '');
    router.push(`/analytics/report/${actualId}`);
  };

  // Empty state component following international standards
  const EmptyState = () => (
    <div className='text-center py-16 px-4'>
      <div className='max-w-md mx-auto'>
        {/* Icon */}
        <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
          <BarChart3 className='w-10 h-10 text-gray-400' />
        </div>
        
        {/* Title */}
        <h3 className='text-xl font-semibold text-gray-900 mb-3'>
          {searchQuery ? 'No research projects found' : 'No research projects yet'}
        </h3>
        
        {/* Description */}
        <p className='text-gray-600 mb-6 leading-relaxed'>
          {searchQuery 
            ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
            : 'Get started with your first research project to analyze health and population data.'
          }
        </p>
        
        {/* Action buttons */}
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          {!searchQuery && (
            <div className='flex flex-col sm:flex-row gap-3'>
              <Button
                onClick={() => router.push('/analytics/create')}
                className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
              >
                <Plus className='w-4 h-4 mr-2' />
                Start Your First Research
              </Button>
              <Button
                onClick={() => setShowResearchSteps(true)}
                variant='outline'
                className='border-orange-200 text-orange-600 hover:bg-orange-50'
              >
                View Research Steps
              </Button>
            </div>
          )}
          
          <Button
            variant='outline'
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className='border-gray-300 text-gray-700 hover:bg-gray-50'
          >
            <Filter className='w-4 h-4 mr-2' />
            Clear Filters
          </Button>
        </div>
        
        {/* Help text */}
        <div className='mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200'>
          <h4 className='font-medium text-blue-900 mb-2 flex items-center gap-2'>
            <Globe className='w-4 h-4' />
            Research Standards
          </h4>
          <p className='text-sm text-blue-700'>
            Follow WHO guidelines and international research standards for health and population studies.
          </p>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <ProtectedRoute>
        <div className='flex h-screen bg-gray-50'>
          <Sidebar />
          <div className='flex-1 flex flex-col overflow-hidden'>
            <TopBar />
            <div className='flex-1 p-4 overflow-y-auto'>
              <div className='max-w-7xl mx-auto'>
                <div className='animate-pulse'>
                  <div className='h-8 bg-gray-200 rounded w-1/4 mb-4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2 mb-8'></div>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className='h-64 bg-gray-200 rounded'></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50'>
        <Sidebar />

        <div className='flex-1 flex flex-col overflow-hidden'>
          <TopBar />

          <div className='flex-1 p-4 overflow-y-auto'>
            <div className='max-w-7xl mx-auto'>
              {/* Header */}
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
                <div className='flex items-center gap-3 mb-4 sm:mb-0'>
                  <div className='p-2 bg-gradient-to-r from-white to-white rounded-lg'>
                    <BarChart3 className='w-6 h-6 text-amber-500' />
                  </div>
                  <div>
                    <h1 className='text-2xl font-bold text-gray-900'>
                      Research Analytics
                    </h1>
                    <p className='text-gray-600'>
                      Manage research projects and analytics
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <Input
                      placeholder='Search research projects...'
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className='pl-10 w-64'
                    />
                  </div>
                  <Button
                    onClick={() => router.push('/analytics/create')}
                    className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
                  >
                    <Plus className='w-4 h-4 mr-2' />
                    Start New Research
                  </Button>
                  <Button
                    onClick={() => setShowResearchSteps(!showResearchSteps)}
                    variant='outline'
                    className='border-orange-200 text-orange-700 hover:bg-orange-50'
                  >
                    <BarChart3 className='w-4 h-4 mr-2' />
                    {showResearchSteps ? 'Hide Research Steps' : 'View Research Steps'}
                  </Button>
                </div>
              </div>

              {/* Research Process Steps - Only shown when "Start a Research" is clicked */}
              {showResearchSteps && (
                <div className='mb-8'>
                  <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-lg font-semibold text-gray-900'>Research Creation Wizard</h2>
                    <Button
                      onClick={() => router.push('/analytics/create')}
                      className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
                    >
                      <Plus className='w-4 h-4 mr-2' />
                      Start New Research
                    </Button>
                  </div>
                  
                  {/* New Wizard Steps Display */}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <Card className='border-2 border-dashed border-orange-200 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer'>
                      <CardContent className='p-6 text-center'>
                        <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <FileText className='w-8 h-8 text-orange-600' />
                        </div>
                        <h3 className='font-semibold text-gray-900 mb-2 text-lg'>1. Define Topic</h3>
                        <p className='text-sm text-gray-600 mb-4'>Define Research Study Topic</p>
                        <div className='text-xs text-orange-600 font-medium'>
                          Research title, description, and start date
                        </div>
                      </CardContent>
                    </Card>

                    <Card className='border-2 border-dashed border-blue-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer'>
                      <CardContent className='p-6 text-center'>
                        <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <Search className='w-8 h-8 text-blue-600' />
                        </div>
                        <h3 className='font-semibold text-gray-900 mb-2 text-lg'>2. Research Questions</h3>
                        <p className='text-sm text-gray-600 mb-4'>Frame Research Questions</p>
                        <div className='text-xs text-blue-600 font-medium'>
                          Study type, area, population, and sample size
                        </div>
                      </CardContent>
                    </Card>

                    <Card className='border-2 border-dashed border-green-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer'>
                      <CardContent className='p-6 text-center'>
                        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <Target className='w-8 h-8 text-green-600' />
                        </div>
                        <h3 className='font-semibold text-gray-900 mb-2 text-lg'>3. Map Questions</h3>
                        <p className='text-sm text-gray-600 mb-4'>Structure Sub-Questions</p>
                        <div className='text-xs text-green-600 font-medium'>
                          Review summary and confirm research details
                        </div>
                      </CardContent>
                    </Card>

                    <Card className='border-2 border-dashed border-purple-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer'>
                      <CardContent className='p-6 text-center'>
                        <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <Database className='w-8 h-8 text-purple-600' />
                        </div>
                        <h3 className='font-semibold text-gray-900 mb-2 text-lg'>4. Identify Data</h3>
                        <p className='text-sm text-gray-600 mb-4'>Identify Missing Data</p>
                        <div className='text-xs text-purple-600 font-medium'>
                          Data requirements analysis and gap assessment
                        </div>
                      </CardContent>
                    </Card>

                    <Card className='border-2 border-dashed border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer'>
                      <CardContent className='p-6 text-center'>
                        <div className='w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <TrendingUp className='w-8 h-8 text-indigo-600' />
                        </div>
                        <h3 className='font-semibold text-gray-900 mb-2 text-lg'>5. Collect Data</h3>
                        <p className='text-sm text-gray-600 mb-4'>Initiate Data Collection</p>
                        <div className='text-xs text-indigo-600 font-medium'>
                          Collection methods and timeline planning
                        </div>
                      </CardContent>
                    </Card>

                    <Card className='border-2 border-dashed border-pink-200 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer'>
                      <CardContent className='p-6 text-center'>
                        <div className='w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <FileText className='w-8 h-8 text-pink-600' />
                        </div>
                        <h3 className='font-semibold text-gray-900 mb-2 text-lg'>6. Attach Documents</h3>
                        <p className='text-sm text-gray-600 mb-4'>Attach Supporting Documents</p>
                        <div className='text-xs text-pink-600 font-medium'>
                          Literature reviews, methodology, and references
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Wizard Description */}
                  <div className='mt-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200'>
                    <div className='text-center'>
                      <h3 className='text-lg font-semibold text-orange-900 mb-3'>
                        Experience the New Research Creation Wizard
                      </h3>
                      <p className='text-orange-800 mb-4 max-w-2xl mx-auto'>
                        Our new step-by-step wizard provides a seamless, focused experience for creating research studies. 
                        Each step is designed to guide you through the process with clear instructions and validation.
                      </p>
                      <Button
                        onClick={() => router.push('/analytics/create')}
                        className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-3'
                      >
                        <Plus className='w-4 h-4 mr-2' />
                        Start with the New Wizard
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Filters and Sorting */}
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
                {/* Status Filters */}
                <div className='flex flex-wrap gap-2'>
                  <Button
                    variant={activeFilter === 'all' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setActiveFilter('all')}
                    className={
                      activeFilter === 'all'
                        ? 'bg-amber-100 text-black-500'
                        : ''
                    }
                  >
                    All ({researchProjects.length})
                  </Button>
                  <Button
                    variant={activeFilter === 'active' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setActiveFilter('active')}
                    className={`flex items-center gap-1 ${activeFilter === 'active' ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white' : ''}`}
                  >
                    <Play className='w-3 h-3' />
                    Active ({getStatusCount('active')})
                  </Button>
                  <Button
                    variant={activeFilter === 'completed' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setActiveFilter('completed')}
                    className={`flex items-center gap-1 ${activeFilter === 'completed' ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white' : ''}`}
                  >
                    <CheckCircle className='w-3 h-3' />
                    Completed ({getStatusCount('completed')})
                  </Button>
                  <Button
                    variant={activeFilter === 'draft' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setActiveFilter('draft')}
                    className={`flex items-center gap-1 ${activeFilter === 'draft' ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white' : ''}`}
                  >
                    <AlertCircle className='w-3 h-3' />
                    Draft ({getStatusCount('draft')})
                  </Button>
                </div>

                {/* Sorting */}
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-600'>Sort by:</span>
                  <div className='flex border border-gray-200 rounded-md'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleSort('created_at')}
                      className={`px-3 py-1 text-xs border-0 rounded-l-md ${
                        sortBy === 'created_at' ? 'bg-orange-50 text-orange-700' : ''
                      }`}
                    >
                      Date
                      {sortBy === 'created_at' && (
                        sortOrder === 'asc' ? <SortAsc className='w-3 h-3 ml-1' /> : <SortDesc className='w-3 h-3 ml-1' />
                      )}
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleSort('title')}
                      className={`px-3 py-1 text-xs border-0 ${
                        sortBy === 'title' ? 'bg-orange-50 text-orange-700' : ''
                      }`}
                    >
                      Title
                      {sortBy === 'title' && (
                        sortOrder === 'asc' ? <SortAsc className='w-3 h-3 ml-1' /> : <SortDesc className='w-3 h-3 ml-1' />
                      )}
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleSort('status')}
                      className={`px-3 py-1 text-xs border-0 rounded-r-md ${
                        sortBy === 'status' ? 'bg-orange-50 text-orange-700' : ''
                      }`}
                    >
                      Status
                      {sortBy === 'status' && (
                        sortOrder === 'asc' ? <SortAsc className='w-3 h-3 ml-1' /> : <SortDesc className='w-3 h-3 ml-1' />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <AlertCircle className='w-5 h-5 text-red-600' />
                    <div>
                      <p className='text-red-800 font-medium'>Error loading research projects</p>
                      <p className='text-red-700 text-sm'>{error}</p>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={fetchResearchProjects}
                      className='text-red-600 border-red-300 hover:bg-red-50'
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              )}

              {/* Research Grid */}
              {paginatedResearch.length > 0 ? (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {paginatedResearch.map(project => {
                      const statusInfo = statusConfig[project.status];
                      const StatusIcon = statusInfo.icon;
                      const departmentColor =
                        departmentColors[
                          project.department as keyof typeof departmentColors
                        ] || 'bg-gray-500';

                      return (
                        <Card
                          key={project.id}
                          className='hover:shadow-lg transition-shadow duration-200'
                        >
                          <CardHeader className='pb-3'>
                            <div className='flex items-start justify-between'>
                              <div className='flex items-center gap-2'>
                                <StatusIcon className='w-4 h-4' />
                                <Badge className={statusInfo.color}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <div className='text-xs text-gray-500'>
                                {new Date(project.updatedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className='space-y-4'>
                            <div>
                              <h3 className='font-semibold text-gray-900 mb-2 line-clamp-2'>
                                {project.title}
                              </h3>
                              <p className='text-sm text-gray-600 line-clamp-3'>
                                {project.description}
                              </p>
                            </div>

                            {/* Progress Bar */}
                            <div className='space-y-2'>
                              <div className='flex justify-between text-xs text-gray-500'>
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <div className='w-full bg-gray-200 rounded-full h-2'>
                                <div
                                  className='bg-gradient-to-r from-orange-500 to-amber-600 h-2 rounded-full transition-all duration-300'
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <p className='text-xs text-gray-500'>
                                Current: {stepLabels[project.currentStep]}
                              </p>
                            </div>

                            {/* Tags */}
                            <div className='flex flex-wrap gap-2'>
                              <Badge variant='secondary' className='text-xs'>
                                <div
                                  className={`w-2 h-2 rounded-full ${departmentColor} mr-1`}
                                ></div>
                                {project.department}
                              </Badge>
                              <Badge variant='outline' className='text-xs'>
                                {project.type}
                              </Badge>
                              <Badge variant='outline' className='text-xs'>
                                {project.location}
                              </Badge>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-2'>
                              {/* Update/Edit Button */}
                              <Button
                                onClick={() => {
                                  if (project.status === 'completed') {
                                    // For completed research, go to edit mode
                                    router.push(`/analytics/create?edit=${project.id.replace(/^(study-|project-)/, '')}`);
                                  } else {
                                    // For ongoing research, continue from current step
                                    handleContinueResearch(project.id, project.currentStep);
                                  }
                                }}
                                variant='outline'
                                size='sm'
                                className='flex-1 border-orange-200 text-orange-700 hover:bg-orange-50'
                              >
                                <Edit className='w-3 h-3 mr-1' />
                                {project.status === 'completed' ? 'Edit' : 'Update'}
                              </Button>
                              
                              {/* View/Report Button */}
                              <Button
                                onClick={() => handleViewReport(project.id)}
                                size='sm'
                                className='flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
                              >
                                <Eye className='w-3 h-3 mr-1' />
                                {project.status === 'completed' ? 'View Report' : 'View Progress'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className='mt-8 flex items-center justify-between'>
                      <div className='text-sm text-gray-700'>
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredResearch.length)} of {filteredResearch.length} results
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className='flex items-center gap-1'
                        >
                          <ChevronLeft className='w-4 h-4' />
                          Previous
                        </Button>
                        
                        <div className='flex items-center gap-1'>
                          {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            const isCurrentPage = page === currentPage;
                            const isNearCurrent = Math.abs(page - currentPage) <= 2;
                            
                            if (isNearCurrent || page === 1 || page === totalPages) {
                              return (
                                <Button
                                  key={page}
                                  variant={isCurrentPage ? 'default' : 'outline'}
                                  size='sm'
                                  onClick={() => handlePageChange(page)}
                                  className={`w-8 h-8 p-0 ${isCurrentPage ? 'bg-orange-500 text-white' : ''}`}
                                >
                                  {page}
                                </Button>
                              );
                            } else if (page === 2 && currentPage > 4) {
                              return <span key={page} className='px-2 text-gray-500'>...</span>;
                            } else if (page === totalPages - 1 && currentPage < totalPages - 3) {
                              return <span key={page} className='px-2 text-gray-500'>...</span>;
                            }
                            return null;
                          })}
                        </div>
                        
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className='flex items-center gap-1'
                        >
                          Next
                          <ChevronRight className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
