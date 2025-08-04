-- Complete Database Setup for A-SEARCH
-- Run this script in your Supabase SQL editor

-- Step 1: Create Country table if it doesn't exist
CREATE TABLE IF NOT EXISTS country (
    country_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Insert basic country data
INSERT INTO country (name, code) VALUES
('Kenya', 'KE'),
('Uganda', 'UG'),
('Tanzania', 'TZ')
ON CONFLICT (name) DO NOTHING;

-- Step 3: Create Site table if it doesn't exist
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

-- Step 4: Create Role table with new fields
CREATE TABLE IF NOT EXISTS role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create User Profile table
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

-- Step 6: Create SiteUser table
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

-- Step 7: Create UserAccountRequest table
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

-- Step 8: Enable RLS on all tables
ALTER TABLE country ENABLE ROW LEVEL SECURITY;
ALTER TABLE site ENABLE ROW LEVEL SECURITY;
ALTER TABLE role ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_account_request ENABLE ROW LEVEL SECURITY;

-- Step 9: Create RLS policies for public access to roles and sites
-- Allow public read access to system roles
CREATE POLICY "Allow public read access to system roles" ON role 
FOR SELECT USING (is_system = true);

-- Allow public read access to sites
CREATE POLICY "Allow public read access to sites" ON site 
FOR SELECT USING (true);

-- Allow public read access to countries
CREATE POLICY "Allow public read access to countries" ON country 
FOR SELECT USING (true);

-- Step 10: Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 11: Create triggers for all tables
CREATE TRIGGER update_country_updated_at BEFORE UPDATE ON country FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_updated_at BEFORE UPDATE ON site FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_role_updated_at BEFORE UPDATE ON role FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profile_updated_at BEFORE UPDATE ON user_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_user_updated_at BEFORE UPDATE ON site_user FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_account_request_updated_at BEFORE UPDATE ON user_account_request FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 12: Insert sample data
-- Insert roles
INSERT INTO role (role_name, description, is_default, is_system) VALUES
('Super Admin', 'Full system access and administration', FALSE, FALSE),
('Site Admin', 'Site-level administration and management', FALSE, FALSE),
('Data Collector', 'Field data collection and entry', TRUE, TRUE),
('Researcher', 'Research and analysis activities', FALSE, TRUE),
('Viewer', 'Read-only access to data', FALSE, TRUE)
ON CONFLICT (role_name) DO NOTHING;

-- Insert sites
INSERT INTO site (name, country_id, description, location_name, latitude, longitude, address, start_date) VALUES
('Korogacho', 1, 'Nairobi slum area', 'Nairobi', -1.2921, 36.8219, 'Korogacho, Nairobi', '2023-01-01'),
('Kibera', 1, 'Largest slum in Nairobi', 'Nairobi', -1.3131, 36.7897, 'Kibera, Nairobi', '2023-01-01'),
('Mathare', 1, 'Nairobi informal settlement', 'Nairobi', -1.2667, 36.8333, 'Mathare, Nairobi', '2023-01-01')
ON CONFLICT DO NOTHING;

-- Step 13: Create user management counts view
CREATE OR REPLACE VIEW user_management_counts AS
SELECT 
    (SELECT COUNT(*) FROM role) AS roles_count,
    (SELECT COUNT(*) FROM user_profile) AS users_count,
    (SELECT COUNT(*) FROM user_account_request WHERE status = 'pending') AS pending_requests_count,
    (SELECT COUNT(*) FROM user_account_request) AS total_requests_count,
    NOW() AS last_updated
FROM role
LIMIT 1;

-- Step 14: Grant access to the view
GRANT SELECT ON user_management_counts TO authenticated;
GRANT SELECT ON user_management_counts TO anon;

-- Step 15: Verify the setup
SELECT 'Database setup completed successfully!' as status;

-- Check roles
SELECT 'Roles:' as info;
SELECT role_id, role_name, is_system, is_default FROM role ORDER BY role_id;

-- Check sites
SELECT 'Sites:' as info;
SELECT site_id, name, description FROM site ORDER BY site_id;

-- Check user management counts
SELECT 'User Management Counts:' as info;
SELECT * FROM user_management_counts; 