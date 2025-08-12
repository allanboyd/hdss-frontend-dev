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
import { ArrowLeft, Plus, Save, CheckCircle, Trash2, Link } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface ResearchQuestion {
  question_id: number;
  text: string;
  question_type: 'main' | 'sub';
  priority_level: 'low' | 'medium' | 'high';
  data_requirements: string;
  analysis_approach: string;
  parent_question_id?: number;
}

interface SubQuestionForm {
  text: string;
  priority_level: 'low' | 'medium' | 'high';
  data_requirements: string;
  analysis_approach: string;
  parent_question_id: number;
}

export default function MapQuestionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project_id');
  const { session } = useAuth();
  
  const [mainQuestions, setMainQuestions] = useState<ResearchQuestion[]>([]);
  const [subQuestions, setSubQuestions] = useState<ResearchQuestion[]>([]);
  const [currentSubQuestion, setCurrentSubQuestion] = useState<SubQuestionForm>({
    text: '',
    priority_level: 'medium',
    data_requirements: '',
    analysis_approach: '',
    parent_question_id: 0
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (projectId && session?.access_token) {
      fetchQuestions();
    }
  }, [projectId, session]);

  const fetchQuestions = async () => {
    if (!session?.access_token) {
      setError('No valid session found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`/api/analytics/research-question?project_id=${projectId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      
      if (response.ok) {
        const questions = await response.json();
        setMainQuestions(questions.filter((q: ResearchQuestion) => q.question_type === 'main'));
        setSubQuestions(questions.filter((q: ResearchQuestion) => q.question_type === 'sub'));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch questions');
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    }
  };

  const addSubQuestion = () => {
    if (currentSubQuestion.text.trim() && currentSubQuestion.parent_question_id) {
      setSubQuestions(prev => [...prev, {
        question_id: Date.now(), // Temporary ID for display
        ...currentSubQuestion,
        question_type: 'sub' as const
      }]);
      setCurrentSubQuestion({
        text: '',
        priority_level: 'medium',
        data_requirements: '',
        analysis_approach: '',
        parent_question_id: 0
      });
    }
  };

  const removeSubQuestion = (index: number) => {
    setSubQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subQuestions.length === 0) {
      setError('Please add at least one sub-question');
      return;
    }

    if (!session?.access_token) {
      setError('No valid session found. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create all sub-questions
      const subQuestionPromises = subQuestions.map(question =>
        fetch('/api/analytics/research-question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            ...question,
            research_project_id: parseInt(projectId!),
            question_type: 'sub',
            parent_question_id: question.parent_question_id,
          }),
        })
      );

      const responses = await Promise.all(subQuestionPromises);
      
      // Check if all requests were successful
      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create some sub-questions');
        }
      }

      setSuccess(true);
      
      // Redirect to next step after a brief delay
      setTimeout(() => {
        router.push(`/analytics/identify-data?project_id=${projectId}`);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.push(`/analytics/define-questions?study_id=${projectId}`);
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
                    Map Sub-Questions
                  </h1>
                  <p className='text-gray-600'>
                    Step 3: Break down and structure questions for analysis and data collection
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className='mb-8'>
                <div className='flex items-center gap-2 mb-4'>
                  <Badge variant='default' className='bg-green-100 text-green-800'>
                    Step 3 of 6
                  </Badge>
                  <span className='text-sm text-gray-600'>Map Sub-Questions</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div className='bg-green-500 h-2 rounded-full' style={{ width: '50%' }}></div>
                </div>
              </div>

              {success ? (
                <Card className='border-green-200 bg-green-50'>
                  <CardContent className='p-6'>
                    <div className='flex items-center gap-3 text-green-800'>
                      <CheckCircle className='w-8 h-8' />
                      <div>
                        <h3 className='text-lg font-semibold'>Sub-Questions Mapped Successfully!</h3>
                        <p>Redirecting to the next step...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className='space-y-6'>
                  {/* Main Questions Display */}
                  {mainQuestions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <Link className='w-5 h-5 text-blue-500' />
                          Main Research Questions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-3'>
                          {mainQuestions.map((question) => (
                            <div key={question.question_id} className='p-3 bg-blue-50 rounded-lg border border-blue-200'>
                              <div className='flex items-center gap-2 mb-2'>
                                <Badge variant='default' className='bg-blue-100 text-blue-800'>
                                  Main Question
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
                              <p className='font-medium text-blue-900'>{question.text}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Add Sub-Question */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <Plus className='w-5 h-5 text-orange-500' />
                        Add Sub-Question
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Parent Question *
                        </label>
                        <select
                          value={currentSubQuestion.parent_question_id}
                          onChange={(e) => setCurrentSubQuestion(prev => ({ ...prev, parent_question_id: parseInt(e.target.value) }))}
                          className='w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                        >
                          <option value={0}>Select a main question</option>
                          {mainQuestions.map((question) => (
                            <option key={question.question_id} value={question.question_id}>
                              {question.text.substring(0, 60)}...
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Sub-Question Text *
                        </label>
                        <Textarea
                          placeholder='e.g., What is the infection rate per square km across slums?'
                          value={currentSubQuestion.text}
                          onChange={(e) => setCurrentSubQuestion(prev => ({ ...prev, text: e.target.value }))}
                          rows={3}
                          className='w-full'
                        />
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Priority Level *
                          </label>
                          <select
                            value={currentSubQuestion.priority_level}
                            onChange={(e) => setCurrentSubQuestion(prev => ({ ...prev, priority_level: e.target.value as 'low' | 'medium' | 'high' }))}
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
                            onClick={addSubQuestion}
                            disabled={!currentSubQuestion.text.trim() || !currentSubQuestion.parent_question_id}
                            className='w-full bg-orange-500 hover:bg-orange-600 text-white'
                          >
                            <Plus className='w-4 h-4 mr-2' />
                            Add Sub-Question
                          </Button>
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Data Requirements
                          </label>
                          <Textarea
                            placeholder='What data is needed to answer this sub-question?'
                            value={currentSubQuestion.data_requirements}
                            onChange={(e) => setCurrentSubQuestion(prev => ({ ...prev, data_requirements: e.target.value }))}
                            rows={2}
                            className='w-full'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Analysis Approach
                          </label>
                          <Textarea
                            placeholder='How will this sub-question be analyzed?'
                            value={currentSubQuestion.analysis_approach}
                            onChange={(e) => setCurrentSubQuestion(prev => ({ ...prev, analysis_approach: e.target.value }))}
                            rows={2}
                            className='w-full'
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sub-Questions List */}
                  {subQuestions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Sub-Questions ({subQuestions.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-3'>
                          {subQuestions.map((question, index) => {
                            const parentQuestion = mainQuestions.find(q => q.question_id === question.parent_question_id);
                            return (
                              <div key={index} className='p-3 bg-gray-50 rounded-lg border'>
                                <div className='flex items-start gap-3'>
                                  <div className='flex-1'>
                                    <div className='flex items-center gap-2 mb-2'>
                                      <Badge variant='secondary' className='bg-gray-100 text-gray-800'>
                                        Sub-Question
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
                                    {parentQuestion && (
                                      <div className='mb-2 p-2 bg-blue-50 rounded border border-blue-200'>
                                        <p className='text-xs text-blue-600 font-medium'>Parent:</p>
                                        <p className='text-sm text-blue-800'>{parentQuestion.text}</p>
                                      </div>
                                    )}
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
                                    onClick={() => removeSubQuestion(index)}
                                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                                  >
                                    <Trash2 className='w-4 h-4' />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Example Sub-Questions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Example Sub-Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-3'>
                        <div className='p-3 bg-blue-50 rounded-lg border border-blue-200'>
                          <h4 className='font-medium text-blue-900'>Main Question</h4>
                          <p className='text-sm text-blue-700'>"How does urban overcrowding impact disease spread?"</p>
                          <div className='mt-2 p-2 bg-white rounded border'>
                            <h5 className='font-medium text-blue-800 text-sm'>Sub-Question:</h5>
                            <p className='text-sm text-blue-700'>"What is the infection rate per square km across slums?"</p>
                          </div>
                        </div>
                        <div className='p-3 bg-green-50 rounded-lg border border-green-200'>
                          <h4 className='font-medium text-green-900'>Main Question</h4>
                          <p className='text-sm text-green-700'>"What factors contribute to maternal mortality?"</p>
                          <div className='mt-2 p-2 bg-white rounded border'>
                            <h5 className='font-medium text-green-800 text-sm'>Sub-Question:</h5>
                            <p className='text-sm text-green-700'>"What is the average distance to healthcare facilities?"</p>
                          </div>
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
                      disabled={loading || subQuestions.length === 0}
                      className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-3'
                    >
                      {loading ? 'Mapping Questions...' : (
                        <>
                          <Save className='w-4 h-4 mr-2' />
                          Save Mapping & Continue
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
