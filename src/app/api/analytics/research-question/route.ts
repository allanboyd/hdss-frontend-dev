import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      research_project_id,
      text,
      question_type,
      priority_level,
      data_requirements,
      analysis_approach,
      parent_question_id
    } = body;

    // Validate required fields
    if (!research_project_id || !text || !question_type || !priority_level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert research question into database using existing supabaseAdmin
    const { data, error } = await supabaseAdmin
      .from('research_question')
      .insert({
        research_project_id,
        text,
        question_type,
        priority_level,
        data_requirements: data_requirements || null,
        analysis_approach: analysis_approach || null,
        parent_question_id: parent_question_id || null
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create research question');
    }

    return NextResponse.json({
      message: 'Research question created successfully',
      question_id: data.question_id,
      question: {
        question_id: data.question_id,
        research_project_id: data.research_project_id,
        text: data.text,
        question_type: data.question_type,
        priority_level: data.priority_level,
        data_requirements: data.data_requirements,
        analysis_approach: data.analysis_approach,
        parent_question_id: data.parent_question_id,
        created_at: data.created_at
      }
    });

  } catch (error) {
    console.error('Error creating research question:', error);
    return NextResponse.json(
      { error: 'Failed to create research question' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('question_id');
    const projectId = searchParams.get('project_id');

    if (questionId) {
      // Get specific research question
      const { data, error } = await supabaseAdmin
        .from('research_question')
        .select('*')
        .eq('question_id', parseInt(questionId))
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Research question not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    } else if (projectId) {
      // Get research questions for a specific project
      const { data, error } = await supabaseAdmin
        .from('research_question')
        .select('*')
        .eq('research_project_id', parseInt(projectId))
        .order('question_type', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error('Failed to fetch research questions');
      }

      return NextResponse.json(data);
    } else {
      // Get all research questions
      const { data, error } = await supabaseAdmin
        .from('research_question')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch research questions');
      }

      return NextResponse.json(data);
    }

  } catch (error) {
    console.error('Error fetching research questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch research questions' },
      { status: 500 }
    );
  }
}
