// Shared Research Process Components

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  ResearchStep, 
  StepProgress, 
  PriorityLevel, 
  QuestionType,
  researchProcessUtils 
} from '@/types/research-process';

// ============================================================================
// PROGRESS INDICATOR
// ============================================================================

interface ProgressIndicatorProps {
  currentStep: ResearchStep;
  steps: StepProgress[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, steps }) => {
  const currentStepIndex = steps.findIndex(step => step.step === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className='mb-8'>
      <div className='flex items-center gap-2 mb-4'>
        <Badge variant='default' className='bg-green-100 text-green-800'>
          Step {currentStepIndex + 1} of {steps.length}
        </Badge>
        <span className='text-sm text-gray-600'>
          {steps[currentStepIndex]?.title || 'Current Step'}
        </span>
      </div>
      <div className='w-full bg-gray-200 rounded-full h-2'>
        <div 
          className='bg-green-500 h-2 rounded-full transition-all duration-300' 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// STEP NAVIGATION
// ============================================================================

interface StepNavigationProps {
  currentStep: ResearchStep;
  steps: StepProgress[];
  onStepClick?: (step: ResearchStep) => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({ 
  currentStep, 
  steps, 
  onStepClick 
}) => {
  return (
    <div className='mb-6'>
      <div className='grid grid-cols-1 md:grid-cols-6 gap-2'>
        {steps.map((step, index) => (
          <div
            key={step.step}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              step.current 
                ? 'border-blue-500 bg-blue-50' 
                : step.completed 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
            onClick={() => onStepClick?.(step.step)}
          >
            <div className='text-center'>
              <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                step.current 
                  ? 'bg-blue-500 text-white' 
                  : step.completed 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {step.completed ? '✓' : index + 1}
              </div>
              <p className={`text-xs font-medium ${
                step.current 
                  ? 'text-blue-700' 
                  : step.completed 
                  ? 'text-green-700' 
                  : 'text-gray-600'
              }`}>
                {step.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// PAGE HEADER
// ============================================================================

interface PageHeaderProps {
  title: string;
  description: string;
  currentStep: ResearchStep;
  onBack?: () => void;
  backLabel?: string;
  backPath?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  currentStep, 
  onBack, 
  backLabel = 'Back',
  backPath 
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  return (
    <div className='flex items-center gap-4 mb-6'>
      <Button
        variant='outline'
        onClick={handleBack}
        className='flex items-center gap-2'
      >
        <ArrowLeft className='w-4 h-4' />
        {backLabel}
      </Button>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
        <p className='text-gray-600'>{description}</p>
      </div>
    </div>
  );
};

// ============================================================================
// SUCCESS MESSAGE
// ============================================================================

interface SuccessMessageProps {
  title: string;
  message: string;
  onContinue?: () => void;
  continueLabel?: string;
  autoRedirect?: boolean;
  redirectDelay?: number;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  title, 
  message, 
  onContinue, 
  continueLabel = 'Continue',
  autoRedirect = false,
  redirectDelay = 2000
}) => {
  React.useEffect(() => {
    if (autoRedirect && onContinue) {
      const timer = setTimeout(onContinue, redirectDelay);
      return () => clearTimeout(timer);
    }
  }, [autoRedirect, onContinue, redirectDelay]);

  return (
    <Card className='border-green-200 bg-green-50'>
      <CardContent className='p-6'>
        <div className='flex items-center gap-3 text-green-800'>
          <CheckCircle className='w-8 h-8' />
          <div>
            <h3 className='text-lg font-semibold'>{title}</h3>
            <p>{message}</p>
            {!autoRedirect && onContinue && (
              <Button
                onClick={onContinue}
                className='mt-3 bg-green-600 hover:bg-green-700 text-white'
              >
                {continueLabel}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// ERROR MESSAGE
// ============================================================================

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry, 
  retryLabel = 'Try Again' 
}) => {
  return (
    <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
      <div className='flex items-center gap-3'>
        <AlertCircle className='w-5 h-5 text-red-600' />
        <div className='flex-1'>
          <p className='text-red-800'>{error}</p>
          {onRetry && (
            <Button
              variant='outline'
              size='sm'
              onClick={onRetry}
              className='mt-2 text-red-600 border-red-300 hover:bg-red-50'
            >
              {retryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// QUESTION CARD
// ============================================================================

interface QuestionCardProps {
  question: {
    text: string;
    question_type: QuestionType;
    priority_level: PriorityLevel;
    data_requirements?: string;
    analysis_approach?: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  className?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onEdit, 
  onDelete, 
  showActions = true,
  className = ''
}) => {
  return (
    <div className={`p-3 bg-gray-50 rounded-lg border ${className}`}>
      <div className='flex items-start gap-3'>
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-2'>
            <Badge 
              variant={question.question_type === 'main' ? 'default' : 'secondary'}
              className={researchProcessUtils.getQuestionTypeColor(question.question_type)}
            >
              {question.question_type === 'main' ? 'Main' : 'Sub'}
            </Badge>
            <Badge 
              variant='outline'
              className={researchProcessUtils.getPriorityColor(question.priority_level)}
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
        {showActions && (onEdit || onDelete) && (
          <div className='flex gap-2'>
            {onEdit && (
              <Button
                variant='outline'
                size='sm'
                onClick={onEdit}
                className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant='outline'
                size='sm'
                onClick={onDelete}
                className='text-red-600 hover:text-red-700 hover:bg-red-50'
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE CARD
// ============================================================================

interface ExampleCardProps {
  title: string;
  description: string;
  examples: Array<{
    title: string;
    description: string;
    color: 'blue' | 'green' | 'purple' | 'orange';
  }>;
}

export const ExampleCard: React.FC<ExampleCardProps> = ({ title, description, examples }) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'green': return 'bg-green-50 border-green-200 text-green-900';
      case 'purple': return 'bg-purple-50 border-purple-200 text-purple-900';
      case 'orange': return 'bg-orange-50 border-orange-200 text-orange-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getDescriptionColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-700';
      case 'green': return 'text-green-700';
      case 'purple': return 'text-purple-700';
      case 'orange': return 'text-orange-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-gray-600 mb-4'>{description}</p>
        <div className='space-y-3'>
          {examples.map((example, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border ${getColorClasses(example.color)}`}
            >
              <h4 className='font-medium mb-1'>{example.title}</h4>
              <p className={`text-sm ${getDescriptionColor(example.color)}`}>
                {example.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// SUBMIT BUTTONS
// ============================================================================

interface SubmitButtonsProps {
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  submitIcon?: React.ReactNode;
  className?: string;
}

export const SubmitButtons: React.FC<SubmitButtonsProps> = ({ 
  onSubmit, 
  onCancel, 
  submitLabel, 
  cancelLabel = 'Cancel',
  loading = false,
  disabled = false,
  submitIcon,
  className = ''
}) => {
  return (
    <div className={`flex justify-between ${className}`}>
      {onCancel && (
        <Button
          variant='outline'
          onClick={onCancel}
          disabled={loading}
          className='px-6 py-3'
        >
          {cancelLabel}
        </Button>
      )}
      <Button
        onClick={onSubmit}
        disabled={disabled || loading}
        className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-3'
      >
        {loading ? (
          'Processing...'
        ) : (
          <>
            {submitIcon}
            {submitLabel}
          </>
        )}
      </Button>
    </div>
  );
};
