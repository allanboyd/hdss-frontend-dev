import { supabaseAdmin } from './supabase-admin'
import { handleAuthError } from './auth-utils'
import {
  Country,
  Site,
  Village,
  Structure,
  DwellingUnit,
  GeographicCounts,
  CreateCountryForm,
  CreateSiteForm,
  CreateVillageForm,
  CreateStructureForm,
  CreateDwellingUnitForm
} from '@/types/site-management'

// Helper function to handle Supabase errors
const handleSupabaseError = async (error: unknown) => {
  if (error && typeof error === 'object' && 'message' in error && 
      typeof error.message === 'string' &&
      (error.message.includes('Invalid Refresh Token') || 
       error.message.includes('Refresh Token Not Found'))) {
    const result = await handleAuthError(error)
    if (result.shouldRedirect && result.redirectTo) {
      window.location.href = result.redirectTo
      return { data: null, error: 'Authentication required' }
    }
  }
  return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
}

// Country CRUD operations
export const countryService = {
  async getAll(): Promise<Country[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('country')
        .select('*')
        .order('name')
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading countries:', error)
      throw error
    }
  },

  async getById(id: number): Promise<Country | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('country')
        .select('*')
        .eq('country_id', id)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error loading country:', error)
      throw error
    }
  },

  async create(country: CreateCountryForm): Promise<Country> {
    try {
      const { data, error } = await supabaseAdmin
        .from('country')
        .insert(country)
        .select()
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error creating country:', error)
      throw error
    }
  },

  async update(id: number, updates: Partial<CreateCountryForm>): Promise<Country> {
    try {
      const { data, error } = await supabaseAdmin
        .from('country')
        .update(updates)
        .eq('country_id', id)
        .select()
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error updating country:', error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('country')
        .delete()
        .eq('country_id', id)
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting country:', error)
      throw error
    }
  }
}

// Site CRUD operations
export const siteService = {
  async getAll(): Promise<Site[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('site')
        .select(`
          *,
          country:country_id(*)
        `)
        .order('name')
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading sites:', error)
      throw error
    }
  },

  async getById(id: number): Promise<Site | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('site')
        .select(`
          *,
          country:country_id(*)
        `)
        .eq('site_id', id)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error loading site:', error)
      throw error
    }
  },

  async getByCountry(countryId: number): Promise<Site[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('site')
        .select(`
          *,
          country:country_id(*)
        `)
        .eq('country_id', countryId)
        .order('name')
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading sites by country:', error)
      throw error
    }
  },

  async create(site: CreateSiteForm): Promise<Site> {
    try {
      const { data, error } = await supabaseAdmin
        .from('site')
        .insert(site)
        .select(`
          *,
          country:country_id(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error creating site:', error)
      throw error
    }
  },

  async update(id: number, updates: Partial<CreateSiteForm>): Promise<Site> {
    try {
      const { data, error } = await supabaseAdmin
        .from('site')
        .update(updates)
        .eq('site_id', id)
        .select(`
          *,
          country:country_id(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error updating site:', error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('site')
        .delete()
        .eq('site_id', id)
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting site:', error)
      throw error
    }
  }
}

// Village CRUD operations
export const villageService = {
  async getAll(): Promise<Village[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('village')
        .select(`
          *,
          site:site_id(*)
        `)
        .order('name')
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading villages:', error)
      throw error
    }
  },

  async getById(id: number): Promise<Village | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('village')
        .select(`
          *,
          site:site_id(*)
        `)
        .eq('village_id', id)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error loading village:', error)
      throw error
    }
  },

  async getBySite(siteId: number): Promise<Village[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('village')
        .select(`
          *,
          site:site_id(*)
        `)
        .eq('site_id', siteId)
        .order('name')
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading villages by site:', error)
      throw error
    }
  },

  async create(village: CreateVillageForm): Promise<Village> {
    try {
      const { data, error } = await supabaseAdmin
        .from('village')
        .insert(village)
        .select(`
          *,
          site:site_id(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error creating village:', error)
      throw error
    }
  },

  async update(id: number, updates: Partial<CreateVillageForm>): Promise<Village> {
    try {
      const { data, error } = await supabaseAdmin
        .from('village')
        .update(updates)
        .eq('village_id', id)
        .select(`
          *,
          site:site_id(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error updating village:', error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('village')
        .delete()
        .eq('village_id', id)
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting village:', error)
      throw error
    }
  }
}

// Structure CRUD operations
export const structureService = {
  async getAll(): Promise<Structure[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('structure')
        .select(`
          *,
          village:village_id(*)
        `)
        .order('structure_code')
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading structures:', error)
      throw error
    }
  },

  async getById(id: number): Promise<Structure | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('structure')
        .select(`
          *,
          village:village_id(*)
        `)
        .eq('structure_id', id)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error loading structure:', error)
      throw error
    }
  },

  async getByVillage(villageId: number): Promise<Structure[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('structure')
        .select(`
          *,
          village:village_id(*)
        `)
        .eq('village_id', villageId)
        .order('structure_code')
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading structures by village:', error)
      throw error
    }
  },

  async create(structure: CreateStructureForm): Promise<Structure> {
    try {
      const { data, error } = await supabaseAdmin
        .from('structure')
        .insert(structure)
        .select(`
          *,
          village:village_id(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error creating structure:', error)
      throw error
    }
  },

  async update(id: number, updates: Partial<CreateStructureForm>): Promise<Structure> {
    try {
      const { data, error } = await supabaseAdmin
        .from('structure')
        .update(updates)
        .eq('structure_id', id)
        .select(`
          *,
          village:village_id(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error updating structure:', error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('structure')
        .delete()
        .eq('structure_id', id)
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting structure:', error)
      throw error
    }
  }
}

// Dwelling Unit CRUD operations
export const dwellingUnitService = {
  async getAll(): Promise<DwellingUnit[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('dwelling_unit')
        .select(`
          *,
          structure:structure_id(*)
        `)
        .order('unit_code')
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading dwelling units:', error)
      throw error
    }
  },

  async getById(id: number): Promise<DwellingUnit | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('dwelling_unit')
        .select(`
          *,
          structure:structure_id(*)
        `)
        .eq('dwelling_unit_id', id)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error loading dwelling unit:', error)
      throw error
    }
  },

  async getByStructure(structureId: number): Promise<DwellingUnit[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('dwelling_unit')
        .select(`
          *,
          structure:structure_id(*)
        `)
        .eq('structure_id', structureId)
        .order('unit_code')
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error loading dwelling units by structure:', error)
      throw error
    }
  },

  async create(dwellingUnit: CreateDwellingUnitForm): Promise<DwellingUnit> {
    try {
      const { data, error } = await supabaseAdmin
        .from('dwelling_unit')
        .insert(dwellingUnit)
        .select(`
          *,
          structure:structure_id(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error creating dwelling unit:', error)
      throw error
    }
  },

  async update(id: number, updates: Partial<CreateDwellingUnitForm>): Promise<DwellingUnit> {
    try {
      const { data, error } = await supabaseAdmin
        .from('dwelling_unit')
        .update(updates)
        .eq('dwelling_unit_id', id)
        .select(`
          *,
          structure:structure_id(*)
        `)
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error updating dwelling unit:', error)
      throw error
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('dwelling_unit')
        .delete()
        .eq('dwelling_unit_id', id)
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting dwelling unit:', error)
      throw error
    }
  }
} 

// Geographic counts service
export const geographicCountsService = {
  async getCounts(): Promise<GeographicCounts | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('geographic_counts')
        .select('*')
        .single()
      
      if (error) {
        const handledError = await handleSupabaseError(error)
        if (handledError.error) throw new Error(handledError.error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error loading geographic counts:', error)
      throw error
    }
  }
} 