-- Site Management Database Setup
-- Run this script in your Supabase SQL editor

-- Create Country table
CREATE TABLE IF NOT EXISTS country (
    country_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Site table
CREATE TABLE IF NOT EXISTS site (
    site_id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES country(country_id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location_name VARCHAR(200),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(country_id, name)
);

-- Create Village table
CREATE TABLE IF NOT EXISTS village (
    village_id SERIAL PRIMARY KEY,
    site_id INTEGER NOT NULL REFERENCES site(site_id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(site_id, name)
);

-- Create Structure table
CREATE TABLE IF NOT EXISTS structure (
    structure_id SERIAL PRIMARY KEY,
    village_id INTEGER NOT NULL REFERENCES village(village_id) ON DELETE RESTRICT,
    structure_code VARCHAR(50) NOT NULL,
    structure_name VARCHAR(100),
    address_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(village_id, structure_code)
);

-- Create DwellingUnit table
CREATE TABLE IF NOT EXISTS dwelling_unit (
    dwelling_unit_id SERIAL PRIMARY KEY,
    structure_id INTEGER NOT NULL REFERENCES structure(structure_id) ON DELETE RESTRICT,
    unit_code VARCHAR(50) NOT NULL,
    unit_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(structure_id, unit_code)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_country_updated_at BEFORE UPDATE ON country FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_updated_at BEFORE UPDATE ON site FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_village_updated_at BEFORE UPDATE ON village FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_structure_updated_at BEFORE UPDATE ON structure FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dwelling_unit_updated_at BEFORE UPDATE ON dwelling_unit FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE country ENABLE ROW LEVEL SECURITY;
ALTER TABLE site ENABLE ROW LEVEL SECURITY;
ALTER TABLE village ENABLE ROW LEVEL SECURITY;
ALTER TABLE structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE dwelling_unit ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (adjust as needed for your auth setup)
CREATE POLICY "Allow authenticated users to read all data" ON country FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON country FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON country FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete data" ON country FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read all data" ON site FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON site FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON site FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete data" ON site FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read all data" ON village FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON village FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON village FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete data" ON village FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read all data" ON structure FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON structure FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON structure FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete data" ON structure FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read all data" ON dwelling_unit FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert data" ON dwelling_unit FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update data" ON dwelling_unit FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete data" ON dwelling_unit FOR DELETE USING (auth.role() = 'authenticated'); 

-- Create geographic counts view
CREATE OR REPLACE VIEW geographic_counts AS
SELECT 
    (SELECT COUNT(*) FROM country) AS countries_count,
    (SELECT COUNT(*) FROM site) AS sites_count,
    (SELECT COUNT(*) FROM village) AS villages_count,
    (SELECT COUNT(*) FROM structure) AS structures_count,
    (SELECT COUNT(*) FROM dwelling_unit) AS dwelling_units_count,
    NOW() AS last_updated
FROM country
LIMIT 1;

-- Insert sample data
INSERT INTO country (name, code, status) VALUES
('Kenya', 'KE', true),
('Uganda', 'UG', true),
('Tanzania', 'TZ', true),
('Ethiopia', 'ET', true),
('Ghana', 'GH', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO site (country_id, name, description, location_name, latitude, longitude, address, start_date, end_date) VALUES
(1, 'Korogacho', 'Nairobi slum area research site', 'Nairobi', -1.2921, 36.8219, 'Korogacho, Nairobi, Kenya', '2024-01-01', NULL),
(1, 'Kibera', 'Largest slum in Nairobi', 'Nairobi', -1.3131, 36.7811, 'Kibera, Nairobi, Kenya', '2024-01-01', NULL),
(2, 'Kampala Urban', 'Urban research site in Kampala', 'Kampala', 0.3476, 32.5825, 'Kampala, Uganda', '2024-01-01', NULL)
ON CONFLICT (country_id, name) DO NOTHING;

INSERT INTO village (site_id, name) VALUES
(1, 'Village A'),
(1, 'Village B'),
(1, 'Village C'),
(2, 'Central Village'),
(2, 'Outer Village'),
(3, 'Urban Village 1'),
(3, 'Urban Village 2')
ON CONFLICT (site_id, name) DO NOTHING;

INSERT INTO structure (village_id, structure_code, structure_name, address_description) VALUES
(1, 'STR001', 'Building A', 'Main building in Village A'),
(1, 'STR002', 'Building B', 'Secondary building in Village A'),
(2, 'STR003', 'Building C', 'Main building in Village B'),
(3, 'STR004', 'Building D', 'Main building in Village C'),
(4, 'STR005', 'Building E', 'Central building in Central Village'),
(5, 'STR006', 'Building F', 'Main building in Outer Village'),
(6, 'STR007', 'Building G', 'Urban building 1'),
(7, 'STR008', 'Building H', 'Urban building 2')
ON CONFLICT (village_id, structure_code) DO NOTHING;

INSERT INTO dwelling_unit (structure_id, unit_code, unit_name) VALUES
(1, 'UNIT001', 'Apartment 1A'),
(1, 'UNIT002', 'Apartment 1B'),
(1, 'UNIT003', 'Apartment 1C'),
(2, 'UNIT004', 'Apartment 2A'),
(2, 'UNIT005', 'Apartment 2B'),
(3, 'UNIT006', 'Apartment 3A'),
(3, 'UNIT007', 'Apartment 3B'),
(4, 'UNIT008', 'Apartment 4A'),
(5, 'UNIT009', 'Apartment 5A'),
(5, 'UNIT010', 'Apartment 5B'),
(6, 'UNIT011', 'Apartment 6A'),
(7, 'UNIT012', 'Apartment 7A'),
(8, 'UNIT013', 'Apartment 8A')
ON CONFLICT (structure_id, unit_code) DO NOTHING; 

-- User Management Tables

-- Create Roles table
CREATE TABLE IF NOT EXISTS role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create User Profile table with Supabase auth integration
CREATE TABLE IF NOT EXISTS user_profile (
    user_id SERIAL PRIMARY KEY,
    auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    phone_number VARCHAR(20),
    role_id INTEGER NOT NULL REFERENCES role(role_id) ON DELETE RESTRICT,
    site_id INTEGER REFERENCES site(site_id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(auth_user_id)
);

-- Create SiteUser table for managing user access to sites
CREATE TABLE IF NOT EXISTS site_user (
    site_user_id SERIAL PRIMARY KEY,
    site_id INTEGER NOT NULL REFERENCES site(site_id) ON DELETE RESTRICT,
    role_id INTEGER NOT NULL REFERENCES role(role_id) ON DELETE RESTRICT,
    user_profile_id INTEGER NOT NULL REFERENCES user_profile(user_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(site_id, user_profile_id)
);

-- Create UserAccountRequest table for pending account requests
CREATE TABLE IF NOT EXISTS user_account_request (
    request_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    phone_number VARCHAR(20),
    requested_role_id INTEGER REFERENCES role(role_id) ON DELETE SET NULL,
    requested_site_id INTEGER REFERENCES site(site_id) ON DELETE SET NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by INTEGER REFERENCES user_profile(user_id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user management tables
ALTER TABLE role ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_account_request ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user management tables
CREATE POLICY "Enable read access for authenticated users" ON role FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON role FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON role FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete access for authenticated users" ON role FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON user_profile FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON user_profile FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON user_profile FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete access for authenticated users" ON user_profile FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON site_user FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON site_user FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON site_user FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete access for authenticated users" ON site_user FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON user_account_request FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON user_account_request FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON user_account_request FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete access for authenticated users" ON user_account_request FOR DELETE USING (auth.role() = 'authenticated');

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for user management tables
CREATE TRIGGER update_role_updated_at BEFORE UPDATE ON role FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profile_updated_at BEFORE UPDATE ON user_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_user_updated_at BEFORE UPDATE ON site_user FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_account_request_updated_at BEFORE UPDATE ON user_account_request FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create user management counts view
CREATE OR REPLACE VIEW user_management_counts AS
SELECT 
    (SELECT COUNT(*) FROM role) AS roles_count,
    (SELECT COUNT(*) FROM user_profile) AS users_count,
    (SELECT COUNT(*) FROM user_account_request WHERE status = 'pending') AS pending_requests_count,
    (SELECT COUNT(*) FROM user_account_request) AS total_requests_count,
    NOW() AS last_updated
FROM role
LIMIT 1;

-- Insert sample data for user management
INSERT INTO role (role_name, description, is_default, is_public) VALUES
('Super Admin', 'Full system access and administration', FALSE, FALSE),
('Site Admin', 'Site-level administration and management', FALSE, FALSE),
('Data Collector', 'Field data collection and entry', TRUE, TRUE),
('Researcher', 'Research and analysis activities', FALSE, TRUE),
('Viewer', 'Read-only access to data', FALSE, TRUE)
ON CONFLICT (role_name) DO NOTHING;

-- Insert sample account requests
INSERT INTO user_account_request (email, full_name, phone_number, requested_role_id, requested_site_id, reason, status) VALUES
('john.doe@example.com', 'John Doe', '+1234567890', 2, 1, 'Need access for site management activities', 'pending'),
('jane.smith@example.com', 'Jane Smith', '+1234567891', 3, 2, 'Field data collection for research project', 'pending'),
('mike.wilson@example.com', 'Mike Wilson', '+1234567892', 4, 1, 'Research analysis and reporting', 'approved'),
('sarah.jones@example.com', 'Sarah Jones', '+1234567893', 3, 3, 'Data collection for village survey', 'rejected')
ON CONFLICT DO NOTHING; 