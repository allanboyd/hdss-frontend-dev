export interface Country {
  country_id: number;
  name: string;
  code: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Site {
  site_id: number;
  country_id: number;
  name: string;
  description?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  country?: Country;
}

export interface Village {
  village_id: number;
  site_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  site?: Site;
}

export interface Structure {
  structure_id: number;
  village_id: number;
  structure_code: string;
  structure_name?: string;
  address_description?: string;
  created_at: string;
  updated_at: string;
  village?: Village;
}

export interface DwellingUnit {
  dwelling_unit_id: number;
  unit_code: string;
  structure_id: number;
  unit_type: string;
  occupancy_status: string;
  description?: string;
  created_at: string;
  updated_at: string;
  structure?: Structure;
}

// Geographic counts view interface
export interface GeographicCounts {
  countries_count: number;
  sites_count: number;
  villages_count: number;
  structures_count: number;
  dwelling_units_count: number;
  last_updated: string;
}

// Form types for creating/updating entities
export interface CreateCountryForm {
  name: string;
  code: string;
  status: boolean;
}

export interface CreateSiteForm {
  country_id: number;
  name: string;
  description?: string;
  location_name?: string;
  latitude?: number | undefined;
  longitude?: number | undefined;
  address?: string;
  start_date: string;
  end_date?: string;
}

export interface CreateVillageForm {
  site_id: number;
  name: string;
}

export interface CreateStructureForm {
  village_id: number;
  structure_code: string;
  structure_name?: string;
  address_description?: string;
}

export interface CreateDwellingUnitForm {
  structure_id: number;
  unit_code: string;
  unit_type: string;
  occupancy_status: string;
  description?: string;
}
