'use client';

// Force client-side rendering to avoid SSR issues with Supabase
export const dynamic = 'force-dynamic';
export const ssr = false;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle,
  FileText,
  Search,
  Target,
  Database,
  TrendingUp,
  MapPin,
  Users,
  BarChart3,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { useAuth } from '@/lib/auth-context';
import { studyService, researchProcessUtils } from '@/lib/research-process';
import { 
  CreateStudyForm,
  ResearchStep,
  StepProgress
} from '@/types/research-process';
import { 
  STUDY_TYPES,
  ROUTES 
} from '@/constants/research-process';

// Step configuration - using the existing 6-step process
const CREATE_STEPS: StepProgress[] = [
  {
    step: 'define-topic',
    title: 'Define Topic',
    description: 'Define Research Study Topic',
    completed: false,
    current: true,
    path: '/analytics/create'
  },
  {
    step: 'define-questions',
    title: 'Research Questions',
    description: 'Frame Research Questions',
    completed: false,
    current: false,
    path: '/analytics/create'
  },
  {
    step: 'map-questions',
    title: 'Map Questions',
    description: 'Structure Sub-Questions',
    completed: false,
    current: false,
    path: '/analytics/create'
  },
  {
    step: 'identify-data',
    title: 'Identify Data',
    description: 'Identify Missing Data',
    completed: false,
    current: false,
    path: '/analytics/create'
  },
  {
    step: 'collect-data',
    title: 'Collect Data',
    description: 'Initiate Data Collection',
    completed: false,
    current: false,
    path: '/analytics/create'
  },
  {
    step: 'attach-documents',
    title: 'Attach Documents',
    description: 'Attach Supporting Documents',
    completed: false,
    current: false,
    path: '/analytics/create'
  }
];

export default function CreateResearchPage() {
  const router = useRouter();
  const { session } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [existingStudyId, setExistingStudyId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateStudyForm & {
    mainQuestion: string;
    subQuestions: Array<{
      text: string;
      priority: 'high' | 'medium' | 'low';
      dataRequirements: string;
    }>;
  }>({
    title: '',
    objectives: '',
    start_date: '',
    study_type: 'routine',
    study_area: '',
    target_population: '',
    sample_size: '',
    mainQuestion: '',
    subQuestions: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Check for edit or view mode from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    const viewId = urlParams.get('view');
    
    if (editId) {
      setIsEditMode(true);
      setExistingStudyId(editId);
      // TODO: Load existing study data for editing
    } else if (viewId) {
      setIsViewMode(true);
      setExistingStudyId(viewId);
      // TODO: Load existing study data for viewing
    }
  }, []);

  const currentStepData = CREATE_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === CREATE_STEPS.length - 1;

  // Ensure currentStepData exists
  if (!currentStepData) {
    return <div>Step not found</div>;
  }

  const handleInputChange = (field: keyof CreateStudyForm | 'mainQuestion', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSubQuestion = () => {
    setFormData(prev => ({
      ...prev,
      subQuestions: [
        ...prev.subQuestions,
        {
          text: '',
          priority: 'medium' as const,
          dataRequirements: ''
        }
      ]
    }));
  };

  const handleRemoveSubQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subQuestions: prev.subQuestions.filter((_, i) => i !== index)
    }));
  };

  const handleSubQuestionChange = (index: number, field: 'text' | 'priority' | 'dataRequirements', value: string) => {
    setFormData(prev => ({
      ...prev,
      subQuestions: prev.subQuestions.map((subQ, i) => 
        i === index ? { ...subQ, [field]: value } : subQ
      )
    }));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Define Topic
        return !!(formData.title?.trim() && formData.objectives?.trim() && formData.start_date);
      case 1: // Research Questions
        return !!(formData.study_type && formData.study_area && formData.target_population);
      case 2: // Map Questions
        return !!(formData.sample_size || true); // Sample size is optional
      case 3: // Identify Data
        return true; // This step is informational
      case 4: // Collect Data
        return true; // This step is informational
      case 5: // Attach Documents
        return true; // This step is informational
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (isLastStep) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
        // Update the current step in CREATE_STEPS
        CREATE_STEPS[currentStep].completed = true;
        CREATE_STEPS[currentStep].current = false;
        CREATE_STEPS[currentStep + 1].current = true;
      }
    } else {
      setError('Please complete all required fields before proceeding.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      // Update the current step in CREATE_STEPS
      CREATE_STEPS[currentStep].current = false;
      CREATE_STEPS[currentStep - 1].current = true;
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      // Save draft logic here
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!session?.access_token) {
      setError('No valid session found');
      return;
    }

    setLoading(true);
    try {
      const response = await studyService.create(formData, session.access_token);
      if (response.study_id) {
        setSuccess(true);
        // Show success message briefly, then redirect to report page
        setTimeout(() => {
          router.push(`/analytics/report/${response.study_id}`);
        }, 2000);
      }
    } catch (error) {
      setError('Failed to create research study');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.push(ROUTES.analytics);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Define Topic
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-3">
                Research Topic *
              </label>
              <Input
                type="text"
                placeholder="e.g., Maternal Mortality Trends in Rural Kenya"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="w-full text-lg px-4 py-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Be specific and descriptive about the health or population issue
              </p>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-800 mb-3">
                Description *
              </label>
              <Textarea
                placeholder="Provide a comprehensive description of your research topic..."
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Describe the main goals, expected outcomes, and significance of this study
              </p>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-800 mb-3">
                Start Date *
              </label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                required
                className="w-full px-4 py-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>
        );

      case 1: // Research Questions
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Study Type *
                </label>
                <select
                  value={formData.study_type}
                  onChange={(e) => handleInputChange('study_type', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                >
                  {STUDY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  Select the type of research study
                </p>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Study Area *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Rural Health Centers in Western Kenya"
                  value={formData.study_area}
                  onChange={(e) => handleInputChange('study_area', e.target.value)}
                  required
                  className="w-full px-4 py-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  Geographic scope of your study
                </p>
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-800 mb-3">
                Target Population *
              </label>
              <Textarea
                placeholder="Describe the population you will be studying..."
                value={formData.target_population}
                onChange={(e) => handleInputChange('target_population', e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Be specific about demographics, age groups, and characteristics
              </p>
            </div>

            {/* Main Research Question */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Main Research Question</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Research Question *
                </label>
                <Textarea
                  placeholder="e.g., What are the key factors contributing to maternal mortality in rural health centers?"
                  value={formData.mainQuestion || ''}
                  onChange={(e) => handleInputChange('mainQuestion', e.target.value)}
                  required
                  rows={3}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Formulate your main research question clearly and specifically
                </p>
              </div>
            </div>

            {/* Sub-Questions */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Sub-Questions</h3>
                <Button
                  type="button"
                  onClick={() => handleAddSubQuestion()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Sub-Question
                </Button>
              </div>
              
              <div className="space-y-4">
                {(formData.subQuestions || []).map((subQ, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub-Question {index + 1}
                      </label>
                      <Textarea
                        placeholder="e.g., How do healthcare worker training levels affect maternal care quality?"
                        value={subQ.text}
                        onChange={(e) => handleSubQuestionChange(index, 'text', e.target.value)}
                        rows={2}
                        className="w-full"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Priority Level
                          </label>
                          <select
                            value={subQ.priority}
                            onChange={(e) => handleSubQuestionChange(index, 'priority', e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Data Requirements
                          </label>
                          <Input
                            type="text"
                            placeholder="e.g., Training records, patient outcomes"
                            value={subQ.dataRequirements}
                            onChange={(e) => handleSubQuestionChange(index, 'dataRequirements', e.target.value)}
                            className="w-full text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleRemoveSubQuestion(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {(!formData.subQuestions || formData.subQuestions.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No sub-questions added yet</p>
                    <p className="text-xs">Click "Add Sub-Question" to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2: // Map Questions
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h4 className="font-medium text-blue-900">Research Summary</h4>
              </div>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Topic:</strong> {formData.title || 'Not specified'}</p>
                <p><strong>Type:</strong> {formData.study_type || 'Not specified'}</p>
                <p><strong>Area:</strong> {formData.study_area || 'Not specified'}</p>
                <p><strong>Population:</strong> {formData.target_population || 'Not specified'}</p>
                <p><strong>Start Date:</strong> {formData.start_date || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sample Size
              </label>
              <Input
                type="number"
                placeholder="e.g., 500"
                value={formData.sample_size}
                onChange={(e) => handleInputChange('sample_size', e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                Expected number of participants (optional)
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h4 className="font-medium text-green-900">Ready to Proceed</h4>
              </div>
              <p className="text-sm text-green-800">
                Your research study is ready to be created. Click "Next" to continue to the next phase where you'll identify data requirements.
              </p>
            </div>
          </div>
        );

      case 3: // Identify Data
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-purple-600" />
                <h4 className="text-lg font-medium text-purple-900">Identify Missing Data</h4>
              </div>
              <p className="text-purple-800 mb-4">
                Based on your research questions, identify what data you need to collect and what might be missing.
              </p>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-medium text-purple-900 mb-2">Data Requirements Analysis</h5>
                  <p className="text-sm text-purple-700">
                    Review your research questions and determine what data sources, variables, and measurements are needed.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-medium text-purple-900 mb-2">Gap Assessment</h5>
                  <p className="text-sm text-purple-700">
                    Identify what data is currently available and what needs to be collected through new research.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Collect Data
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-indigo-600" />
                <h4 className="text-lg font-medium text-indigo-900">Initiate Data Collection</h4>
              </div>
              <p className="text-indigo-800 mb-4">
                Plan and begin your data collection process based on the identified requirements.
              </p>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-medium text-indigo-900 mb-2">Collection Methods</h5>
                  <p className="text-sm text-indigo-700">
                    Choose appropriate data collection methods: surveys, interviews, observations, or existing data sources.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-medium text-indigo-900 mb-2">Timeline Planning</h5>
                  <p className="text-sm text-indigo-700">
                    Establish a realistic timeline for data collection, considering seasonal factors and participant availability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Attach Documents
        return (
          <div className="space-y-6">
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-pink-600" />
                <h4 className="text-lg font-medium text-pink-900">Attach Supporting Documents</h4>
              </div>
              <p className="text-pink-800 mb-4">
                Include relevant documents that support your research proposal and methodology.
              </p>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-medium text-pink-900 mb-2">Literature Review</h5>
                  <p className="text-sm text-pink-700">
                    Attach relevant research papers, articles, and literature that inform your study design.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-medium text-pink-900 mb-2">Methodology Documents</h5>
                  <p className="text-sm text-pink-700">
                    Include detailed methodology, data collection tools, and analysis frameworks.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <h5 className="font-medium text-pink-900 mb-2">References</h5>
                  <p className="text-sm text-pink-700">
                    Provide a comprehensive bibliography of sources used in your research design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-12">
                <div className="mb-4">
                  <nav className="text-base text-gray-500">
                    Research > Create a new research
                  </nav>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900">
                  Create a New Research
                </h1>
              </div>

              {/* Progress Steps - Enhanced Design with Better Spacing and Overflow Handling */}
              <div className="mb-12 bg-white rounded-xl border border-gray-100 p-6 lg:p-8 shadow-sm">
                <div className="flex items-center justify-between overflow-x-auto pb-4 scrollbar-hide">
                  {CREATE_STEPS.map((step, index) => (
                    <div key={step.step} className="flex items-center flex-shrink-0 min-w-0">
                      <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                        {/* Step Circle */}
                        <div className={`relative w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold transition-all duration-300 flex-shrink-0 ${
                          index === currentStep 
                            ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg ring-4 ring-orange-100' 
                            : index < currentStep 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                        }`}>
                          {index < currentStep ? (
                            <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                          ) : (
                            <span className="text-sm lg:text-base">{index + 1}</span>
                          )}
                        </div>
                        
                        {/* Step Info */}
                        <div className={`min-w-0 ${index === currentStep ? 'text-gray-900' : 'text-gray-500'}`}>
                          <div className={`font-semibold text-xs lg:text-sm mb-1 truncate ${
                            index === currentStep ? 'text-orange-600' : 'text-gray-600'
                          }`}>
                            Step {index + 1}: {step.title}
                          </div>
                          <div className="text-xs leading-relaxed text-gray-600 line-clamp-2 max-w-32 lg:max-w-40">{step.description}</div>
                        </div>
                      </div>
                      
                      {/* Connector Line */}
                      {index < CREATE_STEPS.length - 1 && (
                        <div className={`w-12 lg:w-16 h-0.5 mx-2 lg:mx-4 flex-shrink-0 ${
                          index < currentStep ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Progress Bar */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span className="font-medium">Overall Progress</span>
                    <span className="font-semibold text-orange-600">{Math.round(((currentStep + 1) / CREATE_STEPS.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / CREATE_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Main Content Card */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="pb-8 border-b border-gray-100">
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                    {currentStepData.title}
                  </CardTitle>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {currentStepData.description}
                  </p>
                </CardHeader>
                <CardContent className="pb-10 pt-8">
                  {renderStepContent()}
                </CardContent>
              </Card>

                            {/* Action Buttons */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  {!isFirstStep && (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={loading || saving}
                      className="flex items-center gap-2 px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Previous
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={loading || saving}
                    className="flex items-center gap-2 px-8 py-3 border-orange-200 text-orange-700 hover:bg-orange-50"
                  >
                    <Save className="w-5 h-5" />
                    Save Draft
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={loading || saving || !validateCurrentStep()}
                    className="flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg"
                  >
                    {loading || saving ? (
                      'Processing...'
                    ) : (
                      <>
                        {isLastStep ? 'Create Research' : 'Next'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Success Display */}
              {success && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    {isLastStep ? 'Research study created successfully!' : 'Draft saved successfully!'}
                  </p>
                  {isLastStep && (
                    <p className="text-green-700 text-sm mt-1">
                      Redirecting to research report page where you can view, update, and analyze your research.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
