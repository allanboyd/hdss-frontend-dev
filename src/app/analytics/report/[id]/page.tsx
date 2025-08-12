'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  ThumbsUp,
  Code,
  Download,
  MoreVertical,
  FileText,
  Calendar,
  Tag,
  Eye,
  Share2,
  BookOpen,
  Database,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Plus,
  BarChart3,
  MapPin,
  Users,
  Target,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs/Tabs';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { useAuth } from '@/lib/auth-context';
import { studyService, researchProjectService } from '@/lib/research-process';
import { Study, ResearchProject, StudyStatus, ProjectStatus } from '@/types/research-process';

interface ResearchReport {
  id: string;
  title: string;
  tagline: string;
  author: string;
  updatedAt: string;
  upvotes: number;
  status: 'completed' | 'active' | 'pending' | 'draft';
  progress: number;
  currentStep: string;
  department: string;
  type: string;
  location: string;
  description: string;
  keyFindings: string[];
  methodology: string;
  dataSources: string[];
  tags: string[];
  usability: number;
  license: string;
  updateFrequency: string;
  thumbnail: string;
}

const mockReport: ResearchReport = {
  id: '1',
  title: 'Maternal Mortality Trends in Rural Kenya',
  tagline:
    'Comprehensive analysis of maternal health outcomes and contributing factors in rural communities',
  author: 'DR. SARAH KIMANI',
  updatedAt: '7 hours ago',
  upvotes: 24,
  status: 'completed',
  progress: 100,
  currentStep: 'Finalized',
  department: 'Health',
  type: 'Population Study',
  location: 'Rural Kenya',
  description:
    'This comprehensive research study analyzes maternal mortality trends in rural Kenya, examining the complex interplay of healthcare access, cultural practices, and socioeconomic factors. The study employed mixed-methods research including quantitative analysis of health facility records and qualitative interviews with healthcare workers and community members.',
  keyFindings: [
    'Distance to healthcare facilities significantly impacts maternal outcomes',
    'Cultural practices influence maternal health-seeking behavior',
    'Socioeconomic status correlates with maternal mortality rates',
    'Community health workers play crucial role in maternal care',
    'Mobile health interventions show promising results',
  ],
  methodology:
    'Mixed-methods research combining quantitative analysis of health facility records (2019-2024) and qualitative interviews with 150 healthcare workers and community members across 12 rural counties.',
  dataSources: [
    'Kenya Demographic and Health Survey (KDHS) 2022',
    'Ministry of Health facility records',
    'WHO Global Health Observatory',
    'Community health worker interviews',
    'Focus group discussions with rural communities',
  ],
  tags: [
    'Maternal Health',
    'Rural Healthcare',
    'Population Studies',
    'Healthcare Access',
    'Kenya',
  ],
  usability: 9.8,
  license: 'Creative Commons Attribution 4.0',
  updateFrequency: 'Quarterly',
  thumbnail: '/api/placeholder/400/200',
};

export default function ResearchReportPage() {
  const router = useRouter();
  const params = useParams();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [upvoted, setUpvoted] = useState(false);
  
  // Research data state
  const [study, setStudy] = useState<Study | null>(null);
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const studyId = params.id as string;

  // Load research data
  useEffect(() => {
    const loadResearchData = async () => {
      if (!session?.access_token || !studyId) return;
      
      try {
        setLoading(true);
        setError('');
        
        // Load study and research projects
        const [studyData, projectsData] = await Promise.all([
          studyService.getById(parseInt(studyId), session.access_token),
          researchProjectService.getByStudyId(parseInt(studyId), session.access_token)
        ]);
        
        setStudy(studyData);
        setResearchProjects(projectsData);
      } catch (err) {
        console.error('Error loading research data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load research data');
      } finally {
        setLoading(false);
      }
    };
    
    loadResearchData();
  }, [session, studyId]);

  const handleUpvote = () => {
    setUpvoted(!upvoted);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAddProject = () => {
    // TODO: Navigate to project creation
    router.push(`/analytics/create?study_id=${studyId}`);
  };

  const handleAnalyze = (type: string) => {
    // TODO: Navigate to analysis tools
    console.log('Analyze:', type);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
        };
      case 'active':
        return {
          label: 'Active',
          color: 'bg-orange-100 text-orange-800',
          icon: TrendingUp,
        };
      case 'pending':
        return {
          label: 'Pending',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
        };
      case 'draft':
        return {
          label: 'Draft',
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
        };
    }
  };

  const StatusIcon = getStatusConfig(mockReport.status).icon;

  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50'>
        <Sidebar />

        <div className='flex-1 flex flex-col overflow-hidden'>
          <TopBar />

          <div className='flex-1 p-4 overflow-y-auto'>
            <div className='max-w-7xl mx-auto'>
              {/* Header with Action Buttons */}
              <div className='mb-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => router.push('/analytics')}
                      className='p-0 h-auto text-gray-600 hover:text-gray-900'
                    >
                      <ArrowLeft className='w-4 h-4 mr-1' />
                      Research
                    </Button>
                    <ChevronRight className='w-4 h-4' />
                    <span>Report</span>
                  </div>
                  
                  {/* Main Action Buttons */}
                  <div className='flex items-center gap-3'>
                    <Button
                      variant='outline'
                      onClick={() => router.push(`/analytics/create?edit=${studyId}`)}
                      className='flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50'
                    >
                      <Edit className='w-4 h-4' />
                      Edit Research
                    </Button>
                    <Button
                      onClick={() => router.push(`/analytics/create?view=${studyId}`)}
                      className='flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
                    >
                      <Eye className='w-4 h-4' />
                      View in Wizard
                    </Button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading research data...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-medium text-red-800">Error Loading Research</h3>
                  </div>
                  <p className="text-red-700 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                    Try Again
                  </Button>
                </div>
              )}

              {/* Main Content - Only show when data is loaded */}
              {!loading && !error && study && (
                <>
                  {/* Main Content */}
                  <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                {/* Left Column - Main Content */}
                <div className='lg:col-span-3'>
                  {/* Header Section */}
                  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center'>
                          <span className='text-white font-semibold text-sm'>
                            {mockReport.author
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <p className='text-sm text-gray-600'>
                            {mockReport.author}
                          </p>
                          <p className='text-xs text-gray-500'>
                            UPDATED {mockReport.updatedAt.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        {/* Edit Mode Toggle */}
                        {isEditing ? (
                          <>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={handleSave}
                              className='flex items-center gap-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                            >
                              <CheckCircle className='w-4 h-4' />
                              Save
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={handleCancel}
                              className='flex items-center gap-1'
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={handleEdit}
                            className='flex items-center gap-1'
                          >
                            <Edit className='w-4 h-4' />
                            Edit
                          </Button>
                        )}
                        
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={handleUpvote}
                          className={`flex items-center gap-1 ${upvoted ? 'bg-orange-50 border-orange-200 text-orange-700' : ''}`}
                        >
                          <ThumbsUp
                            className={`w-4 h-4 ${upvoted ? 'fill-current' : ''}`}
                          />
                          {upvoted ? 1 : 0}
                        </Button>
                        
                        <Button
                          variant='outline'
                          size='sm'
                          className='flex items-center gap-1'
                        >
                          <Download className='w-4 h-4' />
                          Export
                        </Button>
                        
                        <Button variant='ghost' size='sm'>
                          <MoreVertical className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>

                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                      {study.title}
                    </h1>
                    <p className='text-lg text-gray-600 mb-4'>
                      {study.objectives}
                    </p>

                    {/* Status and Progress */}
                    <div className='flex items-center gap-4'>
                      <Badge
                        className={getStatusConfig(mockReport.status).color}
                      >
                        <StatusIcon className='w-3 h-3 mr-1' />
                        {getStatusConfig(mockReport.status).label}
                      </Badge>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-600'>Progress:</span>
                        <div className='w-32 bg-gray-200 rounded-full h-2'>
                          <div
                            className='bg-gradient-to-r from-orange-500 to-amber-600 h-2 rounded-full'
                            style={{ width: `${mockReport.progress}%` }}
                          ></div>
                        </div>
                        <span className='text-sm text-gray-600'>
                          {mockReport.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Tabs */}
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className='mb-6'
                  >
                    <TabsList className='grid w-full grid-cols-5'>
                      <TabsTrigger value='overview'>Overview</TabsTrigger>
                      <TabsTrigger value='methodology'>Methodology</TabsTrigger>
                      <TabsTrigger value='findings'>Findings</TabsTrigger>
                      <TabsTrigger value='data'>Data</TabsTrigger>
                      <TabsTrigger value='analysis'>Analysis Tools</TabsTrigger>
                    </TabsList>

                    <TabsContent value='overview' className='mt-6'>
                      <Card className='border-0 shadow-sm'>
                        <CardHeader>
                          <CardTitle className='text-xl font-bold'>
                            About Research
                          </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                          <div>
                            <h3 className='text-lg font-semibold mb-3'>
                              Research Overview
                            </h3>
                            <p className='text-gray-700 leading-relaxed'>
                              {mockReport.description}
                            </p>
                          </div>

                          <div>
                            <h3 className='text-lg font-semibold mb-3'>
                              Key Findings
                            </h3>
                            <ul className='space-y-2'>
                              {mockReport.keyFindings.map((finding, index) => (
                                <li
                                  key={index}
                                  className='flex items-start gap-2'
                                >
                                  <div className='w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0'></div>
                                  <span className='text-gray-700'>
                                    {finding}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className='text-lg font-semibold mb-3'>
                              Research Details
                            </h3>
                            <div className='grid grid-cols-2 gap-4'>
                              <div>
                                <span className='text-sm font-medium text-gray-600'>
                                  Department:
                                </span>
                                <p className='text-gray-900'>
                                  {mockReport.department}
                                </p>
                              </div>
                              <div>
                                <span className='text-sm font-medium text-gray-600'>
                                  Type:
                                </span>
                                <p className='text-gray-900'>
                                  {mockReport.type}
                                </p>
                              </div>
                              <div>
                                <span className='text-sm font-medium text-gray-600'>
                                  Location:
                                </span>
                                <p className='text-gray-900'>
                                  {mockReport.location}
                                </p>
                              </div>
                              <div>
                                <span className='text-sm font-medium text-gray-600'>
                                  Status:
                                </span>
                                <p className='text-gray-900'>
                                  {getStatusConfig(mockReport.status).label}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value='methodology' className='mt-6'>
                      <Card className='border-0 shadow-sm'>
                        <CardHeader>
                          <CardTitle className='text-xl font-bold'>
                            Research Methodology
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className='text-gray-700 leading-relaxed'>
                            {mockReport.methodology}
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value='findings' className='mt-6'>
                      <Card className='border-0 shadow-sm'>
                        <CardHeader>
                          <CardTitle className='text-xl font-bold'>
                            Detailed Findings
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className='space-y-6'>
                            {mockReport.keyFindings.map((finding, index) => (
                              <div
                                key={index}
                                className='border-l-4 border-orange-500 pl-4'
                              >
                                <h4 className='font-semibold text-gray-900 mb-2'>
                                  Finding {index + 1}
                                </h4>
                                <p className='text-gray-700'>{finding}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value='data' className='mt-6'>
                      <Card className='border-0 shadow-sm'>
                        <CardHeader>
                          <CardTitle className='text-xl font-bold'>
                            Data Sources
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className='space-y-3'>
                            {mockReport.dataSources.map((source, index) => (
                              <div
                                key={index}
                                className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'
                              >
                                <Database className='w-5 h-5 text-orange-600' />
                                <span className='text-gray-700'>{source}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value='analysis' className='mt-6'>
                      <Card className='border-0 shadow-sm'>
                        <CardHeader>
                          <CardTitle className='text-xl font-bold flex items-center gap-2'>
                            <BarChart3 className='w-5 h-5' />
                            Analysis Tools
                          </CardTitle>
                          <p className='text-gray-600'>
                            Explore and analyze your research data with advanced tools
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {/* Data Analysis */}
                            <Card className='border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer'>
                              <CardContent className='p-4' onClick={() => handleAnalyze('data-analysis')}>
                                <div className='flex items-center gap-3 mb-3'>
                                  <BarChart3 className='w-6 h-6 text-orange-500' />
                                  <h4 className='font-semibold text-gray-900'>Data Analysis</h4>
                                </div>
                                <p className='text-sm text-gray-600 mb-3'>
                                  Statistical analysis, trends, and data visualization
                                </p>
                                <div className='flex items-center gap-2 text-xs text-gray-500'>
                                  <Database className='w-3 h-3' />
                                  <span>Analyze datasets</span>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Geographic Analysis */}
                            <Card className='border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer'>
                              <CardContent className='p-4' onClick={() => handleAnalyze('geographic')}>
                                <div className='flex items-center gap-3 mb-3'>
                                  <MapPin className='w-6 h-6 text-orange-500' />
                                  <h4 className='font-semibold text-gray-900'>Geographic Analysis</h4>
                                </div>
                                <p className='text-sm text-gray-600 mb-3'>
                                  Spatial analysis and mapping of research findings
                                </p>
                                <div className='flex items-center gap-2 text-xs text-gray-500'>
                                  <MapPin className='w-3 h-3' />
                                  <span>Map data</span>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Population Analysis */}
                            <Card className='border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer'>
                              <CardContent className='p-4' onClick={() => handleAnalyze('population')}>
                                <div className='flex items-center gap-3 mb-3'>
                                  <Users className='w-6 h-6 text-orange-500' />
                                  <h4 className='font-semibold text-gray-900'>Population Analysis</h4>
                                </div>
                                <p className='text-sm text-gray-600 mb-3'>
                                  Demographic analysis and population health insights
                                </p>
                                <div className='flex items-center gap-2 text-xs text-gray-500'>
                                  <Users className='w-3 h-3' />
                                  <span>Study demographics</span>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Research Questions */}
                            <Card className='border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer'>
                              <CardContent className='p-4' onClick={() => handleAnalyze('questions')}>
                                <div className='flex items-center gap-3 mb-3'>
                                  <Target className='w-6 h-6 text-orange-500' />
                                  <h4 className='font-semibold text-gray-900'>Research Questions</h4>
                                </div>
                                <p className='text-sm text-gray-600 mb-3'>
                                  Manage and analyze research questions and hypotheses
                                </p>
                                <div className='flex items-center gap-2 text-xs text-gray-500'>
                                  <Target className='w-3 h-3' />
                                  <span>Question analysis</span>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Add New Project */}
                            <Card className='border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors cursor-pointer'>
                              <CardContent className='p-4 text-center' onClick={handleAddProject}>
                                <Plus className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                                <h4 className='font-semibold text-gray-900 mb-1'>Add Research Project</h4>
                                <p className='text-sm text-gray-600'>
                                  Create a new research project within this study
                                </p>
                              </CardContent>
                            </Card>

                            {/* Settings & Configuration */}
                            <Card className='border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer'>
                              <CardContent className='p-4' onClick={() => handleAnalyze('settings')}>
                                <div className='flex items-center gap-3 mb-3'>
                                  <Settings className='w-6 h-6 text-orange-500' />
                                  <h4 className='font-semibold text-gray-900'>Settings</h4>
                                </div>
                                <p className='text-sm text-gray-600 mb-3'>
                                  Configure analysis parameters and research settings
                                </p>
                                <div className='flex items-center gap-2 text-xs text-gray-500'>
                                  <Settings className='w-3 h-3' />
                                  <span>Configure</span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right Column - Sidebar */}
                <div className='lg:col-span-1'>
                  <div className='space-y-6'>
                    {/* Research Metadata */}
                    <Card className='border-0 shadow-sm'>
                      <CardContent className='p-6'>
                        <div className='space-y-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <Eye className='w-4 h-4 text-gray-500' />
                              <span className='text-sm font-medium text-gray-600'>
                                Usability
                              </span>
                            </div>
                            <span className='text-lg font-bold text-gray-900'>
                              {mockReport.usability}
                            </span>
                          </div>

                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <FileText className='w-4 h-4 text-gray-500' />
                              <span className='text-sm font-medium text-gray-600'>
                                License
                              </span>
                            </div>
                            <span className='text-sm text-gray-900'>
                              {mockReport.license}
                            </span>
                          </div>

                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <Calendar className='w-4 h-4 text-gray-500' />
                              <span className='text-sm font-medium text-gray-600'>
                                Update Frequency
                              </span>
                            </div>
                            <span className='text-sm text-gray-900'>
                              {mockReport.updateFrequency}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card className='border-0 shadow-sm'>
                      <CardHeader>
                        <CardTitle className='text-lg font-semibold flex items-center gap-2'>
                          <Tag className='w-5 h-5' />
                          Tags
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='flex flex-wrap gap-2'>
                          {mockReport.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant='secondary'
                              className='bg-gray-100 text-gray-700 hover:bg-gray-200'
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className='border-0 shadow-sm'>
                      <CardHeader>
                        <CardTitle className='text-lg font-semibold'>
                          Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-3'>
                        <Button className='w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
                          <Download className='w-4 h-4 mr-2' />
                          Download Report
                        </Button>
                        <Button
                          variant='outline'
                          className='w-full border-orange-200 text-orange-700 hover:bg-orange-50'
                        >
                          <Share2 className='w-4 h-4 mr-2' />
                          Share Research
                        </Button>
                        <Button
                          variant='outline'
                          className='w-full border-orange-200 text-orange-700 hover:bg-orange-50'
                        >
                          <BookOpen className='w-4 h-4 mr-2' />
                          View Full Study
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
