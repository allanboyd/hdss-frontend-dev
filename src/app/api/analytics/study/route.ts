import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    
    const {
      title,
      objectives,
      start_date,
      study_type,
      study_area,
      target_population,
      sample_size
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
    if (!title || !objectives || !start_date || !study_type || !study_area || !target_population) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert study into database using auth user ID directly
    console.log('Attempting to insert study with data:', {
      title,
      objectives,
      principal_investigator: user.id,
      start_date,
      study_type,
      study_area,
      target_population,
      sample_size: sample_size ? parseInt(sample_size) : null
    });
    
    const { data, error } = await supabaseAdmin
      .from('study')
      .insert({
        title,
        objectives,
        principal_investigator: user.id, // Use auth user ID directly
        start_date,
        study_type,
        study_area,
        target_population,
        sample_size: sample_size ? parseInt(sample_size) : null
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      console.error('User ID being used:', user.id);
      console.error('Study data:', { title, objectives, start_date, study_type, study_area, target_population, sample_size });
      throw new Error('Failed to create study');
    }

    return NextResponse.json({
      message: 'Study created successfully',
      study_id: data.study_id,
      study: {
        study_id: data.study_id,
        title: data.title,
        objectives: data.objectives,
        start_date: data.start_date,
        study_type: data.study_type,
        study_area: data.study_area,
        target_population: data.target_population,
        sample_size: data.sample_size,
        created_at: data.created_at
      }
    });

  } catch (error) {
    console.error('Error creating study:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's a database connection issue
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = (error as any).message;
      if (typeof errorMessage === 'string' && errorMessage.includes('fetch')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please check your Supabase configuration.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create study. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studyId = searchParams.get('study_id');

    if (studyId) {
      // Get specific study
      const { data, error } = await supabaseAdmin
        .from('study')
        .select('*')
        .eq('study_id', parseInt(studyId))
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Study not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    } else {
      // Get all studies
      const { data, error } = await supabaseAdmin
        .from('study')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch studies');
      }

      return NextResponse.json(data);
    }

  } catch (error) {
    console.error('Error fetching studies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch studies' },
      { status: 500 }
    );
  }
}
