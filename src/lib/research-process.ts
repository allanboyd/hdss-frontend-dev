// Research Process Service Layer

import { 
  Study, 
  ResearchProject, 
  ResearchQuestion,
  CreateStudyForm,
  CreateResearchProjectForm,
  CreateResearchQuestionForm,
  StudyResponse,
  ResearchProjectResponse,
  ResearchQuestionResponse,
  ApiError
} from '@/types/research-process';

// ============================================================================
// BASE API CONFIGURATION
// ============================================================================

const API_BASE = '/api/analytics';

interface ApiConfig {
  headers: Record<string, string>;
}

const createApiConfig = (token: string): ApiConfig => ({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

class ResearchProcessError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: string
  ) {
    super(message);
    this.name = 'ResearchProcessError';
  }
}

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorData: ApiError;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: 'Unknown error occurred' };
    }
    
    throw new ResearchProcessError(
      errorData.error || 'Request failed',
      response.status,
      errorData.details
    );
  }
  
  return response.json();
};

// ============================================================================
// STUDY SERVICES
// ============================================================================

import { supabaseAdmin, createSupabaseAdmin } from './supabase-admin';

// Helper function to handle Supabase errors (similar to site-management)
const handleSupabaseError = async (error: unknown) => {
  return {
    data: null,
    error: error instanceof Error ? error.message : 'Unknown error',
  };
};

// Helper function to get or create Supabase admin client
const getSupabaseClient = () => {
  if (supabaseAdmin) {
    return supabaseAdmin;
  }
  
  const client = createSupabaseAdmin();
  if (!client) {
    throw new Error('Supabase client not available. Please check your environment variables.');
  }
  
  return client;
};

export const studyService = {
  async create(studyData: CreateStudyForm, token: string): Promise<StudyResponse> {
    try {
      // Get Supabase client (create if needed)
      const client = getSupabaseClient();

      // Get the user profile ID from the auth user ID
      let principalInvestigatorId = 1; // Fallback default
      
      try {
        // First, verify the token and get the auth user
        const { data: { user }, error: authError } = await client.auth.getUser(token);
        
        if (authError || !user) {
          console.warn('Could not get auth user, using default ID');
        } else {
          // Look up the user profile to get the integer ID
          const { data: profileData, error: profileError } = await client
            .from('user_profile')
            .select('user_id')
            .eq('auth_user_id', user.id)
            .single();
          
          if (profileError) {
            console.warn('Could not get user profile, using default ID:', profileError.message);
          } else if (profileData) {
            principalInvestigatorId = profileData.user_id;
          }
        }
      } catch (error) {
        console.warn('Error getting user profile, using default ID:', error);
      }

      // Insert study into database with proper user ID
      const { data, error } = await client
        .from('study')
        .insert({
          title: studyData.title,
          objectives: studyData.objectives,
          principal_investigator: principalInvestigatorId, // Use actual user profile ID
          start_date: studyData.start_date,
          study_type: studyData.study_type,
          study_area: studyData.study_area,
          target_population: studyData.target_population,
          sample_size: studyData.sample_size ? parseInt(studyData.sample_size) : null
        })
        .select()
        .single();

      if (error) {
        const handledError = await handleSupabaseError(error);
        if (handledError.error) throw new Error(handledError.error);
        throw error;
      }

      return {
        message: 'Study created successfully',
        study_id: data.study_id,
        study: {
          study_id: data.study_id,
          title: data.title,
          objectives: data.objectives,
          principal_investigator: principalInvestigatorId, // Use actual user profile ID
          start_date: data.start_date,
          study_type: data.study_type,
          study_area: data.study_area,
          target_population: data.target_population,
          sample_size: data.sample_size,
          status: 'draft' as const, // Set default status
          created_at: data.created_at,
          updated_at: data.created_at // Set initial updated_at to same as created_at
        }
      };
    } catch (error) {
      console.error('Error creating study:', error);
      throw error;
    }
  },

  async getById(studyId: number, token: string): Promise<Study> {
    try {
      // Get Supabase client (create if needed)
      const client = getSupabaseClient();

      // Get specific study from database directly (same pattern as site-management)
      const { data, error } = await client
        .from('study')
        .select('*')
        .eq('study_id', studyId)
        .single();

      if (error) {
        const handledError = await handleSupabaseError(error);
        if (handledError.error) throw new Error(handledError.error);
        throw error;
    }

      return data;
    } catch (error) {
      console.error('Error fetching study:', error);
      throw error;
    }
  },

  async getAll(token: string): Promise<Study[]> {
    try {
      // Get Supabase client (create if needed)
      const client = getSupabaseClient();

      // Get all studies from database directly (same pattern as site-management)
      const { data, error } = await client
        .from('study')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        const handledError = await handleSupabaseError(error);
        if (handledError.error) throw new Error(handledError.error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching studies:', error);
      throw error;
    }
  },

  async update(studyId: number, updates: Partial<Study>, token: string): Promise<Study> {
    const config = createApiConfig(token);
    const response = await fetch(`${API_BASE}/study/${studyId}`, {
      method: 'PUT',
      ...config,
      body: JSON.stringify(updates),
    });
    
    return handleApiResponse<Study>(response);
  },

  async delete(studyId: number, token: string): Promise<void> {
    const config = createApiConfig(token);
    const response = await fetch(`${API_BASE}/study/${studyId}`, {
      method: 'DELETE',
      headers: config.headers,
    });
    
    if (!response.ok) {
      throw new ResearchProcessError('Failed to delete study', response.status);
    }
  },
};

// ============================================================================
// RESEARCH PROJECT SERVICES
// ============================================================================

export const researchProjectService = {
  async create(projectData: CreateResearchProjectForm, token: string): Promise<ResearchProjectResponse> {
    try {
      // Get Supabase client (create if needed)
      const client = getSupabaseClient();

      // Get the user profile ID from the auth user ID
      let leadResearcherId = 1; // Fallback default
      
      try {
        // First, verify the token and get the auth user
        const { data: { user }, error: authError } = await client.auth.getUser(token);
        
        if (authError || !user) {
          console.warn('Could not get auth user, using default ID');
        } else {
          // Look up the user profile to get the integer ID
          const { data: profileData, error: profileError } = await client
            .from('user_profile')
            .select('user_id')
            .eq('auth_user_id', user.id)
            .single();
          
          if (profileError) {
            console.warn('Could not get user profile, using default ID:', profileError.message);
          } else if (profileData) {
            leadResearcherId = profileData.user_id;
          }
        }
      } catch (error) {
        console.warn('Error getting user profile, using default ID:', error);
      }

      // Insert research project into database with proper user ID
      const { data, error } = await client
        .from('research_project')
        .insert({
          study_id: projectData.study_id,
          title: projectData.title,
          lead_researcher_id: leadResearcherId, // Use actual user profile ID
          description: projectData.description,
          start_date: projectData.start_date
        })
        .select()
        .single();

      if (error) {
        const handledError = await handleSupabaseError(error);
        if (handledError.error) throw new Error(handledError.error);
        throw error;
    }

      return {
        message: 'Research project created successfully',
        research_project_id: data.research_project_id,
        project: {
          research_project_id: data.research_project_id,
          study_id: data.study_id,
          title: data.title,
          lead_researcher_id: data.lead_researcher_id,
          description: data.description,
          start_date: data.start_date,
          status: 'active' as const, // Set default status
          created_at: data.created_at,
          updated_at: data.created_at // Set initial updated_at to same as created_at
        }
      };
    } catch (error) {
      console.error('Error creating research project:', error);
      throw error;
    }
  },

  async getById(projectId: number, token: string): Promise<ResearchProject> {
    try {
      // Get Supabase client (create if needed)
      const client = getSupabaseClient();

      // Get specific research project from database directly (same pattern as site-management)
      const { data, error } = await client
        .from('research_project')
        .select('*')
        .eq('research_project_id', projectId)
        .single();

      if (error) {
        const handledError = await handleSupabaseError(error);
        if (handledError.error) throw new Error(handledError.error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching research project:', error);
      throw error;
    }
  },

  async getByStudyId(studyId: number, token: string): Promise<ResearchProject[]> {
    try {
      // Get Supabase client (create if needed)
      const client = getSupabaseClient();

      // Get research projects by study ID from database directly (same pattern as site-management)
      const { data, error } = await client
        .from('research_project')
        .select('*')
        .eq('study_id', studyId)
        .order('created_at', { ascending: false });

      if (error) {
        const handledError = await handleSupabaseError(error);
        if (handledError.error) throw new Error(handledError.error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching research projects by study ID:', error);
      throw error;
    }
  },

  async getAll(token: string): Promise<ResearchProject[]> {
    try {
      // Get Supabase client (create if needed)
      const client = getSupabaseClient();

      // Get all research projects from database directly (same pattern as site-management)
      const { data, error } = await client
        .from('research_project')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        const handledError = await handleSupabaseError(error);
        if (handledError.error) throw new Error(handledError.error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching research projects:', error);
      throw error;
    }
  },

  async update(projectId: number, updates: Partial<ResearchProject>, token: string): Promise<ResearchProject> {
    const config = createApiConfig(token);
    const response = await fetch(`${API_BASE}/research-project/${projectId}`, {
      method: 'PUT',
      ...config,
      body: JSON.stringify(updates),
    });
    
    return handleApiResponse<ResearchProject>(response);
  },

  async delete(projectId: number, token: string): Promise<void> {
    const config = createApiConfig(token);
    const response = await fetch(`${API_BASE}/research-project/${projectId}`, {
      method: 'DELETE',
      headers: config.headers,
    });
    
    if (!response.ok) {
      throw new ResearchProcessError('Failed to delete research project', response.status);
    }
  },
};

// ============================================================================
// RESEARCH QUESTION SERVICES
// ============================================================================

export const researchQuestionService = {
  async create(questionData: CreateResearchQuestionForm, token: string): Promise<ResearchQuestionResponse> {
    const config = createApiConfig(token);
    const response = await fetch(`${API_BASE}/research-question`, {
      method: 'POST',
      ...config,
      body: JSON.stringify(questionData),
    });
    
    return handleApiResponse<ResearchQuestionResponse>(response);
  },

  async createBatch(questions: CreateResearchQuestionForm[], token: string): Promise<ResearchQuestionResponse[]> {
    const config = createApiConfig(token);
    const promises = questions.map(question =>
      fetch(`${API_BASE}/research-question`, {
        method: 'POST',
        ...config,
        body: JSON.stringify(question),
      }).then(handleApiResponse<ResearchQuestionResponse>)
    );
    
    return Promise.all(promises);
  },

  async getById(questionId: number, token: string): Promise<ResearchQuestion> {
    const config = createApiConfig(token);
    const response = await fetch(`${API_BASE}/research-question?question_id=${questionId}`, {
      headers: config.headers,
    });
    
    return handleApiResponse<ResearchQuestion>(response);
  },

  async getByProjectId(projectId: number, token: string): Promise<ResearchQuestion[]> {
    const config = createApiConfig(token);
    const response = await fetch(`${API_BASE}/research-question?project_id=${projectId}`, {
      headers: config.headers,
    });
    
    return handleApiResponse<ResearchQuestion[]>(response);
  },

  async getMainQuestions(projectId: number, token: string): Promise<ResearchQuestion[]> {
    const questions = await this.getByProjectId(projectId, token);
    return questions.filter(q => q.question_type === 'main');
  },

  async getSubQuestions(projectId: number, token: string): Promise<ResearchQuestion[]> {
    const questions = await this.getByProjectId(projectId, token);
    return questions.filter(q => q.question_type === 'sub');
  },

  async getAll(token: string): Promise<ResearchQuestion[]> {
    const config = createApiConfig(token);
    const response = await fetch(`${API_BASE}/research-question`, {
      headers: config.headers,
    });
    
    return handleApiResponse<ResearchQuestion[]>(response);
  },

  async update(questionId: number, updates: Partial<ResearchQuestion>, token: string): Promise<ResearchQuestion> {
    const config = createApiConfig(token);
    const response = await fetch(`${API_BASE}/research-question/${questionId}`, {
      method: 'PUT',
      ...config,
      body: JSON.stringify(updates),
    });
    
    return handleApiResponse<ResearchQuestion>(response);
  },

  async delete(questionId: number, token: string): Promise<void> {
    const config = createApiConfig(token);
    const response = await fetch(`${API_BASE}/research-question/${questionId}`, {
      method: 'DELETE',
      headers: config.headers,
    });
    
    if (!response.ok) {
      throw new ResearchProcessError('Failed to delete research question', response.status);
    }
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const researchProcessUtils = {
  // Validate study data before submission
  validateStudy(study: CreateStudyForm): string[] {
    const errors: string[] = [];
    
    if (!study.title?.trim()) errors.push('Study title is required');
    if (!study.objectives?.trim()) errors.push('Study objectives are required');
    if (!study.start_date) errors.push('Start date is required');
    if (!study.study_type) errors.push('Study type is required');
    if (!study.study_area?.trim()) errors.push('Study area is required');
    if (!study.target_population?.trim()) errors.push('Target population is required');
    
    if (study.sample_size && parseInt(study.sample_size) <= 0) {
      errors.push('Sample size must be a positive number');
    }
    
    return errors;
  },

  // Validate question data before submission
  validateQuestion(question: CreateResearchQuestionForm): string[] {
    const errors: string[] = [];
    
    if (!question.text?.trim()) errors.push('Question text is required');
    if (!question.question_type) errors.push('Question type is required');
    if (!question.priority_level) errors.push('Priority level is required');
    if (!question.research_project_id) errors.push('Research project is required');
    
    return errors;
  },

  // Format date for display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Get priority level color classes
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'border-red-300 text-red-700';
      case 'medium': return 'border-yellow-300 text-yellow-700';
      case 'low': return 'border-green-300 text-green-700';
      default: return 'border-gray-300 text-gray-700';
    }
  },

  // Get question type color classes
  getQuestionTypeColor(type: string): string {
    switch (type) {
      case 'main': return 'bg-blue-100 text-blue-800';
      case 'sub': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  },
};

// ============================================================================
// EXPORT ALL SERVICES
// ============================================================================

export {
  ResearchProcessError,
  handleApiResponse,
};
