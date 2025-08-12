import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      study_id,
      title,
      description,
      start_date
    } = body;

    // Get current user from auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get user info
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid session' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!study_id || !title || !start_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert research project into database using auth user ID directly
    const { data, error } = await supabaseAdmin
      .from('research_project')
      .insert({
        study_id,
        title,
        lead_researcher_id: user.id, // Use auth user ID directly
        description,
        start_date
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create research project');
    }

    return NextResponse.json({
      message: 'Research project created successfully',
      research_project_id: data.research_project_id,
      project: {
        research_project_id: data.research_project_id,
        study_id: data.study_id,
        title: data.title,
        description: data.description,
        start_date: data.start_date,
        created_at: data.created_at
      }
    });

  } catch (error) {
    console.error('Error creating research project:', error);
    return NextResponse.json(
      { error: 'Failed to create research project' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const studyId = searchParams.get('study_id');

    if (projectId) {
      // Get specific research project
      const { data, error } = await supabaseAdmin
        .from('research_project')
        .select('*')
        .eq('research_project_id', parseInt(projectId))
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Research project not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    } else if (studyId) {
      // Get research projects for a specific study
      const { data, error } = await supabaseAdmin
        .from('research_project')
        .select('*')
        .eq('study_id', parseInt(studyId))
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch research projects');
      }

      return NextResponse.json(data);
    } else {
      // Get all research projects
      const { data, error } = await supabaseAdmin
        .from('research_project')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch research projects');
      }

      return NextResponse.json(data);
    }

  } catch (error) {
    console.error('Error fetching research projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch research projects' },
      { status: 500 }
    );
  }
}
