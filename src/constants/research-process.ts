// Research Process Constants

import { StepProgress, ResearchStep } from '@/types/research-process';

// ============================================================================
// RESEARCH PROCESS STEPS
// ============================================================================

export const RESEARCH_STEPS: StepProgress[] = [
  {
    step: 'define-topic',
    title: 'Define Topic',
    description: 'Define Research Study Topic',
    completed: false,
    current: true,
    path: '/analytics/define-topic'
  },
  {
    step: 'define-questions',
    title: 'Define Questions',
    description: 'Frame Research Questions',
    completed: false,
    current: false,
    path: '/analytics/define-questions'
  },
  {
    step: 'map-questions',
    title: 'Map Questions',
    description: 'Structure Sub-Questions',
    completed: false,
    current: false,
    path: '/analytics/map-questions'
  },
  {
    step: 'identify-data',
    title: 'Identify Data',
    description: 'Identify Missing Data',
    completed: false,
    current: false,
    path: '/analytics/identify-data'
  },
  {
    step: 'collect-data',
    title: 'Collect Data',
    description: 'Initiate Data Collection',
    completed: false,
    current: false,
    path: '/analytics/collect-data'
  },
  {
    step: 'attach-documents',
    title: 'Attach Documents',
    description: 'Attach Supporting Documents',
    completed: false,
    current: false,
    path: '/analytics/attach-documents'
  }
];

// ============================================================================
// STUDY TYPES
// ============================================================================

export const STUDY_TYPES = [
  { value: 'routine', label: 'Routine', description: 'Regular monitoring and evaluation' },
  { value: 'nested', label: 'Nested', description: 'Study within another study or program' }
] as const;

// ============================================================================
// PRIORITY LEVELS
// ============================================================================

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'green', description: 'Can be addressed later' },
  { value: 'medium', label: 'Medium', color: 'yellow', description: 'Important but not urgent' },
  { value: 'high', label: 'High', color: 'red', description: 'Critical and urgent' },
  { value: 'critical', label: 'Critical', color: 'red', description: 'Extremely urgent and critical' }
] as const;

// ============================================================================
// QUESTION TYPES
// ============================================================================

export const QUESTION_TYPES = [
  { value: 'main', label: 'Main Question', description: 'Primary research question' },
  { value: 'sub', label: 'Sub Question', description: 'Supporting or detailed question' }
] as const;

// ============================================================================
// STUDY STATUSES
// ============================================================================

export const STUDY_STATUSES = [
  { value: 'active', label: 'Active', color: 'blue', description: 'Currently running' },
  { value: 'draft', label: 'Draft', color: 'gray', description: 'Work in progress' },
  { value: 'completed', label: 'Completed', color: 'green', description: 'Finished successfully' },
  { value: 'suspended', label: 'Suspended', color: 'yellow', description: 'Temporarily paused' },
  { value: 'terminated', label: 'Terminated', color: 'red', description: 'Permanently stopped' }
] as const;

// ============================================================================
// PROJECT STATUSES
// ============================================================================

export const PROJECT_STATUSES = [
  { value: 'active', label: 'Active', color: 'green', description: 'Currently running' },
  { value: 'completed', label: 'Completed', color: 'green', description: 'Finished successfully' },
  { value: 'suspended', label: 'Suspended', color: 'yellow', description: 'Temporarily paused' },
  { value: 'terminated', label: 'Terminated', color: 'red', description: 'Permanently stopped' }
] as const;

// ============================================================================
// EXAMPLE STUDIES
// ============================================================================

export const EXAMPLE_STUDIES = [
  {
    title: 'Maternal Mortality Trends in Rural Kenya',
    description: 'Focus on rural healthcare access and maternal health outcomes',
    type: 'routine' as const,
    area: 'Turkana County, Kenya',
    population: 'Pregnant women in rural communities'
  },
  {
    title: 'Youth Access to Reproductive Health Services',
    description: 'Study barriers and facilitators in Sub-Saharan Africa',
    type: 'nested' as const,
    area: 'Multiple countries in SSA',
    population: 'Adolescents and young adults (15-24 years)'
  },
  {
    title: 'Impact of Population Density on COVID-19 Spread',
    description: 'Analysis of urban density patterns and disease transmission',
    type: 'routine' as const,
    area: 'Urban centers globally',
    population: 'Urban populations with varying density levels'
  }
];

// ============================================================================
// EXAMPLE QUESTIONS
// ============================================================================

export const EXAMPLE_MAIN_QUESTIONS = [
  {
    text: 'What factors contribute to maternal mortality in Turkana County?',
    type: 'main' as const,
    priority: 'high' as const,
    sub_questions: [
      'What is the average distance to the nearest healthcare facility?',
      'Are there cultural practices influencing maternal health outcomes?',
      'What is the availability of skilled birth attendants?'
    ]
  },
  {
    text: 'How does urban overcrowding impact disease spread?',
    type: 'main' as const,
    priority: 'high' as const,
    sub_questions: [
      'What is the infection rate per square km across slums?',
      'How does population density correlate with transmission rates?',
      'What are the environmental factors contributing to spread?'
    ]
  }
];

export const EXAMPLE_SUB_QUESTIONS = [
  {
    text: 'What is the average distance to healthcare facilities?',
    type: 'sub' as const,
    priority: 'medium' as const,
    parent: 'Main Question: What factors contribute to maternal mortality?'
  },
  {
    text: 'Are there cultural practices influencing maternal health outcomes?',
    type: 'sub' as const,
    priority: 'high' as const,
    parent: 'Main Question: What factors contribute to maternal mortality?'
  },
  {
    text: 'What is the infection rate per square km across slums?',
    type: 'sub' as const,
    priority: 'high' as const,
    parent: 'Main Question: How does urban overcrowding impact disease spread?'
  }
];

// ============================================================================
// FORM VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  study: {
    title: {
      minLength: 10,
      maxLength: 200,
      required: true
    },
    objectives: {
      minLength: 20,
      maxLength: 1000,
      required: true
    },
    study_area: {
      minLength: 5,
      maxLength: 100,
      required: true
    },
    target_population: {
      minLength: 10,
      maxLength: 200,
      required: true
    },
    sample_size: {
      min: 1,
      max: 1000000,
      required: false
    }
  },
  question: {
    text: {
      minLength: 10,
      maxLength: 500,
      required: true
    },
    data_requirements: {
      maxLength: 300,
      required: false
    },
    analysis_approach: {
      maxLength: 300,
      required: false
    }
  }
} as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  study: '/api/analytics/study',
  researchProject: '/api/analytics/research-project',
  researchQuestion: '/api/analytics/research-question'
} as const;

// ============================================================================
// ROUTING PATHS
// ============================================================================

export const ROUTES = {
  analytics: '/analytics',
  defineTopic: '/analytics/define-topic',
  defineQuestions: '/analytics/define-questions',
  mapQuestions: '/analytics/map-questions',
  identifyData: '/analytics/identify-data',
  collectData: '/analytics/collect-data',
  attachDocuments: '/analytics/attach-documents'
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const getStepByPath = (path: string): StepProgress | undefined => {
  return RESEARCH_STEPS.find(step => step.path === path);
};

export const getCurrentStepIndex = (currentStep: ResearchStep): number => {
  return RESEARCH_STEPS.findIndex(step => step.step === currentStep);
};

export const getNextStep = (currentStep: ResearchStep): StepProgress | undefined => {
  const currentIndex = getCurrentStepIndex(currentStep);
  return RESEARCH_STEPS[currentIndex + 1];
};

export const getPreviousStep = (currentStep: ResearchStep): StepProgress | undefined => {
  const currentIndex = getCurrentStepIndex(currentStep);
  return RESEARCH_STEPS[currentIndex - 1];
};

export const isStepCompleted = (step: ResearchStep, completedSteps: ResearchStep[]): boolean => {
  return completedSteps.includes(step);
};

export const getProgressPercentage = (currentStep: ResearchStep): number => {
  const currentIndex = getCurrentStepIndex(currentStep);
  return ((currentIndex + 1) / RESEARCH_STEPS.length) * 100;
};
