'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Badge } from '@/components/ui/Badge/Badge';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { Plus, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { 
  PageHeader, 
  ProgressIndicator, 
  SuccessMessage, 
  ErrorMessage,
  ExampleCard,
  SubmitButtons 
} from '@/components/research-process/shared';
import { studyService, researchProcessUtils } from '@/lib/research-process';
import { 
  CreateStudyForm, 
  StudyType
} from '@/types/research-process';
import { 
  RESEARCH_STEPS,
  STUDY_TYPES,
  ROUTES,
  EXAMPLE_STUDIES 
} from '@/constants/research-process';

export default function DefineTopicPage() {
  const router = useRouter();
  const { session } = useAuth();
  const [formData, setFormData] = useState<CreateStudyForm>({
    title: '',
    objectives: '',
    start_date: '',
    study_type: 'routine',
    study_area: '',
    target_population: '',
    sample_size: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const currentStep = 'define-topic';
  const steps = RESEARCH_STEPS.map((step, index) => ({
    ...step,
    current: step.step === currentStep,
    completed: false
  }));

  const handleInputChange = (field: keyof CreateStudyForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validationErrors = researchProcessUtils.validateStudy(formData);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    if (!session?.access_token) {
      setError('No valid session found. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await studyService.create(formData, session.access_token);
      setSuccess(true);
      
      // Redirect to next step after a brief delay
      setTimeout(() => {
        router.push(`${ROUTES.defineQuestions}?study_id=${result.study_id}`);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.push(ROUTES.analytics);
  };

  const goToAnalytics = () => {
    router.push(ROUTES.analytics);
  };

  const examples = EXAMPLE_STUDIES.map(study => ({
    title: study.title,
    description: study.description,
    color: 'blue' as const
  }));

  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <TopBar />

          <div className='flex-1 p-4 overflow-y-auto'>
            <div className='max-w-4xl mx-auto'>
              {/* Header */}
              <PageHeader
                title='Define Research Study Topic'
                description="Step 1: Clearly specify the health or population issue you're investigating"
                currentStep={currentStep}
                backPath={ROUTES.analytics}
                backLabel='Back to Analytics'
              />

              {/* Progress Indicator */}
              <ProgressIndicator currentStep={currentStep} steps={steps} />

              {success ? (
                <SuccessMessage
                  title='Study Created Successfully!'
                  message='Redirecting to the next step...'
                  autoRedirect={true}
                  redirectDelay={2000}
                />
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className='space-y-6'>
                    {/* Study Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <Plus className='w-5 h-5 text-orange-500' />
                          Study Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Study Title *
                          </label>
                          <Input
                            type='text'
                            placeholder='e.g., Maternal Mortality Trends in Rural Kenya'
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            required
                            className='w-full'
                          />
                          <p className='text-sm text-gray-500 mt-1'>
                            Be specific and descriptive about the health or population issue
                          </p>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Study Objectives *
                          </label>
                          <Textarea
                            placeholder='Describe the main goals and expected outcomes of this study...'
                            value={formData.objectives}
                            onChange={(e) => handleInputChange('objectives', e.target.value)}
                            required
                            rows={4}
                            className='w-full'
                          />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                              Start Date *
                            </label>
                            <Input
                              type='date'
                              value={formData.start_date}
                              onChange={(e) => handleInputChange('start_date', e.target.value)}
                              required
                              className='w-full'
                            />
                          </div>

                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                              Study Type *
                            </label>
                            <select
                              value={formData.study_type}
                              onChange={(e) => handleInputChange('study_type', e.target.value)}
                              className='w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                            >
                              {STUDY_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Study Scope & Population */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Study Scope & Population</CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Study Area *
                          </label>
                          <Input
                            type='text'
                            placeholder='e.g., Turkana County, Kenya'
                            value={formData.study_area}
                            onChange={(e) => handleInputChange('study_area', e.target.value)}
                            required
                            className='w-full'
                          />
                          <p className='text-sm text-gray-500 mt-1'>
                            Geographic scope of your study
                          </p>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Target Population *
                          </label>
                          <Textarea
                            placeholder='Describe the population you will be studying...'
                            value={formData.target_population}
                            onChange={(e) => handleInputChange('target_population', e.target.value)}
                            required
                            rows={3}
                            className='w-full'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Expected Sample Size
                          </label>
                          <Input
                            type='number'
                            placeholder='e.g., 1000'
                            value={formData.sample_size}
                            onChange={(e) => handleInputChange('sample_size', e.target.value)}
                            className='w-full'
                          />
                          <p className='text-sm text-gray-500 mt-1'>
                            Number of participants or data points you plan to collect
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Example Studies */}
                    <ExampleCard
                      title='Example Study Topics'
                      description='Here are some examples of well-defined research study topics:'
                      examples={examples}
                    />

                    {/* Submit Button */}
                    <SubmitButtons
                      onSubmit={() => {
                        const event = new Event('submit') as any;
                        handleSubmit(event);
                      }}
                      onCancel={goToAnalytics}
                      submitLabel='Create Study & Continue'
                      cancelLabel='Back to Analytics'
                      loading={loading}
                      disabled={loading}
                      submitIcon={<Save className='w-4 h-4 mr-2' />}
                    />
                  </div>
                </form>
              )}

              {error && (
                <ErrorMessage 
                  error={error} 
                  onRetry={() => setError('')}
                  retryLabel='Clear Error'
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
