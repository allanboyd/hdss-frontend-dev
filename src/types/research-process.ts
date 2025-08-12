// Research Process Types

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Study {
  study_id: number;
  title: string;
  objectives: string;
  principal_investigator: number; // Changed back to number to match database schema
  start_date: string;
  study_type: StudyType;
  study_area: string;
  target_population: string;
  sample_size?: number;
  status: StudyStatus;
  created_at: string;
  updated_at: string;
  // Relationships
  principal_investigator_profile?: UserProfile;
  research_projects?: ResearchProject[];
}

export interface ResearchProject {
  research_project_id: number;
  study_id: number;
  title: string;
  lead_researcher_id: number; // Changed back to number to match database schema
  description?: string;
  start_date: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  // Relationships
  study?: Study;
  lead_researcher_profile?: UserProfile;
  research_questions?: ResearchQuestion[];
}

export interface ResearchQuestion {
  question_id: number;
  research_project_id: number;
  text: string;
  question_type: QuestionType;
  priority_level: PriorityLevel;
  data_requirements?: string;
  analysis_approach?: string;
  parent_question_id?: number;
  created_at: string;
  updated_at: string;
  // Relationships
  research_project?: ResearchProject;
  parent_question?: ResearchQuestion;
  sub_questions?: ResearchQuestion[];
}

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

export type StudyType = 'routine' | 'nested';
export type StudyStatus = 'active' | 'draft' | 'completed' | 'suspended' | 'terminated';
export type ProjectStatus = 'active' | 'completed' | 'suspended' | 'terminated';
export type QuestionType = 'main' | 'sub';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CreateStudyForm {
  title: string;
  objectives: string;
  start_date: string;
  study_type: StudyType;
  study_area: string;
  target_population: string;
  sample_size?: string;
}

export interface CreateResearchProjectForm {
  study_id: number;
  title: string;
  description?: string;
  start_date: string;
}

export interface CreateResearchQuestionForm {
  research_project_id: number;
  text: string;
  question_type: QuestionType;
  priority_level: PriorityLevel;
  data_requirements?: string;
  analysis_approach?: string;
  parent_question_id?: number;
}

export interface UpdateStudyForm {
  title?: string;
  objectives?: string;
  start_date?: string;
  study_type?: StudyType;
  study_area?: string;
  target_population?: string;
  sample_size?: number;
  status?: StudyStatus;
}

export interface UpdateResearchProjectForm {
  title?: string;
  description?: string;
  start_date?: string;
  status?: ProjectStatus;
}

export interface UpdateResearchQuestionForm {
  text?: string;
  priority_level?: PriorityLevel;
  data_requirements?: string;
  analysis_approach?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface StudyResponse {
  message: string;
  study_id: number;
  study: Study;
}

export interface ResearchProjectResponse {
  message: string;
  research_project_id: number;
  project: ResearchProject;
}

export interface ResearchQuestionResponse {
  message: string;
  question_id: number;
  question: ResearchQuestion;
}

export interface ApiError {
  error: string;
  details?: string;
  code?: string;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface ResearchProcessState {
  currentStep: ResearchStep;
  study: Study | null;
  researchProject: ResearchProject | null;
  mainQuestions: ResearchQuestion[];
  subQuestions: ResearchQuestion[];
  loading: boolean;
  error: string | null;
}

export type ResearchStep = 
  | 'define-topic'
  | 'define-questions' 
  | 'map-questions'
  | 'identify-data'
  | 'collect-data'
  | 'attach-documents';

export interface StepProgress {
  step: ResearchStep;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  path: string;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface StudyValidation {
  title: string[];
  objectives: string[];
  start_date: string[];
  study_type: string[];
  study_area: string[];
  target_population: string[];
}

export interface QuestionValidation {
  text: string[];
  question_type: string[];
  priority_level: string[];
}

// ============================================================================
// FILTER AND SEARCH TYPES
// ============================================================================

export interface StudyFilters {
  study_type?: StudyType[];
  status?: StudyStatus[];
  start_date_from?: string;
  start_date_to?: string;
  study_area?: string;
}

export interface QuestionFilters {
  question_type?: QuestionType[];
  priority_level?: PriorityLevel[];
  has_sub_questions?: boolean;
}

export interface SearchParams {
  query?: string;
  filters?: StudyFilters | QuestionFilters;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ============================================================================
// STATISTICS AND ANALYTICS TYPES
// ============================================================================

export interface ResearchStatistics {
  total_studies: number;
  active_studies: number;
  completed_studies: number;
  total_projects: number;
  total_questions: number;
  questions_by_priority: Record<PriorityLevel, number>;
  studies_by_type: Record<StudyType, number>;
  recent_activity: ResearchActivity[];
}

export interface ResearchActivity {
  id: string;
  type: 'study_created' | 'project_started' | 'question_added' | 'data_collected';
  entity_id: number;
  entity_type: string;
  description: string;
  timestamp: string;
  user_id: number;
  user_name: string;
}

// ============================================================================
// IMPORT TYPES
// ============================================================================

import { UserProfile } from './user-management';
