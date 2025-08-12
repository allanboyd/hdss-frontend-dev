'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Badge } from '@/components/ui/Badge/Badge';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';
import { ArrowLeft, Plus, Save, CheckCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface ResearchQuestion {
  text: string;
  question_type: 'main' | 'sub';
  priority_level: 'low' | 'medium' | 'high';
  data_requirements: string;
  analysis_approach: string;
}

interface ResearchProject {
  research_project_id: number;
  title: string;
  description: string;
}

export default function DefineQuestionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studyId = searchParams.get('study_id');
  const { session } = useAuth();
  
  const [researchProject, setResearchProject] = useState<ResearchProject | null>(null);
  const [questions, setQuestions] = useState<ResearchQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<ResearchQuestion>({
    text: '',
    question_type: 'main',
    priority_level: 'medium',
    data_requirements: '',
    analysis_approach: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (studyId && session?.access_token) {
      createResearchProject();
    }
  }, [studyId, session]);

  const createResearchProject = async () => {
    if (!session?.access_token) {
      setError('No valid session found. Please log in again.');
      return;
    }

    try {
      const response = await fetch('/api/analytics/research-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          study_id: parseInt(studyId!),
          title: 'Research Project', // Will be updated with actual title
          description: 'Research project for the study',
          start_date: new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setResearchProject(result.project);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create research project');
      }
    } catch (err) {
      console.error('Failed to create research project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create research project');
    }
  };

  const addQuestion = () => {
    if (currentQuestion.text.trim()) {
      setQuestions(prev => [...prev, { ...currentQuestion }]);
      setCurrentQuestion({
        text: '',
        question_type: 'main',
        priority_level: 'medium',
        data_requirements: '',
        analysis_approach: ''
      });
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length === 0) {
      setError('Please add at least one research question');
      return;
    }

    if (!session?.access_token) {
      setError('No valid session found. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create all questions
      const questionPromises = questions.map(question =>
        fetch('/api/analytics/research-question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            ...question,
            research_project_id: researchProject?.research_project_id,
          }),
        })
      );

      const responses = await Promise.all(questionPromises);
      
      // Check if all requests were successful
      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create some questions');
        }
      }

      setSuccess(true);
      
      // Redirect to next step after a brief delay
      setTimeout(() => {
        router.push(`/analytics/map-questions?project_id=${researchProject?.research_project_id}`);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.push('/analytics/define-topic');
  };

  const goToAnalytics = () => {
    router.push('/analytics');
  };

  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <TopBar />

          <div className='flex-1 p-4 overflow-y-auto'>
            <div className='max-w-4xl mx-auto'>
              {/* Header */}
              <div className='flex items-center gap-4 mb-6'>
                <Button
                  variant='outline'
                  onClick={goBack}
                  className='flex items-center gap-2'
                >
                  <ArrowLeft className='w-4 h-4' />
                  Back
                </Button>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900'>
                    Define Research Questions
                  </h1>
                  <p className='text-gray-600'>
                    Step 2: Frame the central and sub-questions guiding the study
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className='mb-8'>
                <div className='flex items-center gap-2 mb-4'>
                  <Badge variant='default' className='bg-green-100 text-green-800'>
                    Step 2 of 6
                  </Badge>
                  <span className='text-sm text-gray-600'>Define Research Questions</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div className='bg-green-500 h-2 rounded-full' style={{ width: '33.33%' }}></div>
                </div>
              </div>

              {success ? (
                <Card className='border-green-200 bg-green-50'>
                  <CardContent className='p-6'>
                    <div className='flex items-center gap-3 text-green-800'>
                      <CheckCircle className='w-8 h-8' />
                      <div>
                        <h3 className='text-lg font-semibold'>Questions Created Successfully!</h3>
                        <p>Redirecting to the next step...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className='space-y-6'>
                  {/* Add New Question */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Plus className='w-5 h-5 text-orange-500' />
                        Add Research Question
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Question Text *
                        </label>
                        <Textarea
                          placeholder='e.g., What factors contribute to maternal mortality in Turkana County?'
                          value={currentQuestion.text}
                          onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                          rows={3}
                          className='w-full'
                        />
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Question Type *
                          </label>
                          <select
                            value={currentQuestion.question_type}
                            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question_type: e.target.value as 'main' | 'sub' }))}
                            className='w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                          >
                            <option value='main'>Main Question</option>
                            <option value='sub'>Sub Question</option>
                          </select>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Priority Level *
                          </label>
                          <select
                            value={currentQuestion.priority_level}
                            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, priority_level: e.target.value as 'low' | 'medium' | 'high' }))}
                            className='w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                          >
                            <option value='low'>Low</option>
                            <option value='medium'>Medium</option>
                            <option value='high'>High</option>
                          </select>
                        </div>

                        <div className='flex items-end'>
                          <Button
                            type='button'
                            onClick={addQuestion}
                            disabled={!currentQuestion.text.trim()}
                            className='w-full bg-orange-500 hover:bg-orange-600 text-white'
                          >
                            <Plus className='w-4 h-4 mr-2' />
                            Add Question
                          </Button>
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Data Requirements
                          </label>
                          <Textarea
                            placeholder='What data is needed to answer this question?'
                            value={currentQuestion.data_requirements}
                            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, data_requirements: e.target.value }))}
                            rows={2}
                            className='w-full'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Analysis Approach
                          </label>
                          <Textarea
                            placeholder='How will this question be analyzed?'
                            value={currentQuestion.analysis_approach}
                            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, analysis_approach: e.target.value }))}
                            rows={2}
                            className='w-full'
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Questions List */}
                  {questions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Research Questions ({questions.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-3'>
                          {questions.map((question, index) => (
                            <div key={index} className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg border'>
                              <div className='flex-1'>
                                <div className='flex items-center gap-2 mb-2'>
                                  <Badge 
                                    variant={question.question_type === 'main' ? 'default' : 'secondary'}
                                    className={question.question_type === 'main' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                                  >
                                    {question.question_type === 'main' ? 'Main' : 'Sub'}
                                  </Badge>
                                  <Badge 
                                    variant='outline'
                                    className={`${
                                      question.priority_level === 'high' ? 'border-red-300 text-red-700' :
                                      question.priority_level === 'medium' ? 'border-yellow-300 text-yellow-700' :
                                      'border-green-300 text-green-700'
                                    }`}
                                  >
                                    {question.priority_level.charAt(0).toUpperCase() + question.priority_level.slice(1)}
                                  </Badge>
                                </div>
                                <p className='font-medium text-gray-900 mb-2'>{question.text}</p>
                                {question.data_requirements && (
                                  <p className='text-sm text-gray-600 mb-1'>
                                    <span className='font-medium'>Data:</span> {question.data_requirements}
                                  </p>
                                )}
                                {question.analysis_approach && (
                                  <p className='text-sm text-gray-600'>
                                    <span className='font-medium'>Analysis:</span> {question.analysis_approach}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => removeQuestion(index)}
                                className='text-red-600 hover:text-red-700 hover:bg-red-50'
                              >
                                <Trash2 className='w-4 h-4' />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Example Questions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Example Research Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-3'>
                        <div className='p-3 bg-blue-50 rounded-lg border border-blue-200'>
                          <h4 className='font-medium text-blue-900'>Main Question</h4>
                          <p className='text-sm text-blue-700'>"What factors contribute to maternal mortality in Turkana County?"</p>
                        </div>
                        <div className='p-3 bg-green-50 rounded-lg border border-green-200'>
                          <h4 className='font-medium text-green-900'>Sub Question</h4>
                          <p className='text-sm text-green-700'>"What is the average distance to the nearest healthcare facility?"</p>
                        </div>
                        <div className='p-3 bg-purple-50 rounded-lg border border-purple-200'>
                          <h4 className='font-medium text-purple-900'>Sub Question</h4>
                          <p className='text-sm text-purple-700'>"Are there cultural practices influencing maternal health outcomes?"</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <div className='flex justify-between'>
                    <Button
                      variant='outline'
                      onClick={goToAnalytics}
                      className='px-6 py-3'
                    >
                      Back to Analytics
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || questions.length === 0}
                      className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-3'
                    >
                      {loading ? 'Creating Questions...' : (
                        <>
                          <Save className='w-4 h-4 mr-2' />
                          Save Questions & Continue
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
                  <p className='text-red-800'>{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
