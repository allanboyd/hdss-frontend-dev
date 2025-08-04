-- Migration script for User Approval System
-- Run this script in your Supabase SQL editor to ensure all tables and relationships exist

-- Step 1: Ensure all required tables exist with proper structure
CREATE TABLE IF NOT EXISTS country (
    country_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Step 2: Enable RLS on all tables
ALTER TABLE country ENABLE ROW LEVEL SECURITY;
ALTER TABLE site ENABLE ROW LEVEL SECURITY;
ALTER TABLE role ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_account_request ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies
-- Allow public read access to system roles
DROP POLICY IF EXISTS "Allow public read access to system roles" ON role;
CREATE POLICY "Allow public read access to system roles" ON role 
FOR SELECT USING (is_system = true);

-- Allow public read access to sites
DROP POLICY IF EXISTS "Allow public read access to sites" ON site;
CREATE POLICY "Allow public read access to sites" ON site 
FOR SELECT USING (true);

-- Allow public read access to countries
DROP POLICY IF EXISTS "Allow public read access to countries" ON country;
CREATE POLICY "Allow public read access to countries" ON country 
FOR SELECT USING (true);

-- Allow authenticated users to read their own profile
CREATE POLICY "Users can read own profile" ON user_profile 
FOR SELECT USING (auth.uid() = auth_user_id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile" ON user_profile 
FOR UPDATE USING (auth.uid() = auth_user_id);

-- Allow public to create account requests
CREATE POLICY "Allow public to create account requests" ON user_account_request 
FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read account requests (for admins)
CREATE POLICY "Allow authenticated users to read account requests" ON user_account_request 
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update account requests (for admins)
CREATE POLICY "Allow authenticated users to update account requests" ON user_account_request 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 4: Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 5: Create triggers for all tables
DROP TRIGGER IF EXISTS update_country_updated_at ON country;
CREATE TRIGGER update_country_updated_at BEFORE UPDATE ON country FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_updated_at ON site;
CREATE TRIGGER update_site_updated_at BEFORE UPDATE ON site FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_role_updated_at ON role;
CREATE TRIGGER update_role_updated_at BEFORE UPDATE ON role FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profile_updated_at ON user_profile;
CREATE TRIGGER update_user_profile_updated_at BEFORE UPDATE ON user_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_user_updated_at ON site_user;
CREATE TRIGGER update_site_user_updated_at BEFORE UPDATE ON site_user FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_account_request_updated_at ON user_account_request;
CREATE TRIGGER update_user_account_request_updated_at BEFORE UPDATE ON user_account_request FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Insert basic data if tables are empty
-- Insert countries if none exist
INSERT INTO country (name, code) VALUES
('Kenya', 'KE'),
('Uganda', 'UG'),
('Tanzania', 'TZ')
ON CONFLICT (name) DO NOTHING;

-- Insert roles if none exist
INSERT INTO role (role_name, description, is_default, is_system) VALUES
('Super Admin', 'Full system access and administration', FALSE, FALSE),
('Site Admin', 'Site-level administration and management', FALSE, FALSE),
('Data Collector', 'Field data collection and entry', TRUE, TRUE),
('Researcher', 'Research and analysis activities', FALSE, TRUE),
('Viewer', 'Read-only access to data', FALSE, TRUE)
ON CONFLICT (role_name) DO NOTHING;

-- Insert sites if none exist
INSERT INTO site (name, country_id, description, location_name, latitude, longitude, address, start_date) VALUES
('Korogacho', 1, 'Nairobi slum area', 'Nairobi', -1.2921, 36.8219, 'Korogacho, Nairobi', '2023-01-01'),
('Kibera', 1, 'Largest slum in Nairobi', 'Nairobi', -1.3131, 36.7897, 'Kibera, Nairobi', '2023-01-01'),
('Mathare', 1, 'Nairobi informal settlement', 'Nairobi', -1.2667, 36.8333, 'Mathare, Nairobi', '2023-01-01')
ON CONFLICT DO NOTHING;

-- Step 7: Create or update views
CREATE OR REPLACE VIEW user_management_counts AS
SELECT 
    (SELECT COUNT(*) FROM role) AS roles_count,
    (SELECT COUNT(*) FROM user_profile) AS users_count,
    (SELECT COUNT(*) FROM user_account_request WHERE status = 'pending') AS pending_requests_count,
    (SELECT COUNT(*) FROM user_account_request) AS total_requests_count,
    NOW() AS last_updated
FROM role
LIMIT 1;

-- Step 8: Grant permissions
GRANT SELECT ON user_management_counts TO authenticated;
GRANT SELECT ON user_management_counts TO anon;

-- Step 9: Verify the migration
SELECT 'Migration completed successfully!' as status;

-- Check table structures
SELECT 'Table structures:' as info;
SELECT table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name IN ('country', 'site', 'role', 'user_profile', 'site_user', 'user_account_request')
ORDER BY table_name, ordinal_position;

-- Check sample data
SELECT 'Sample data:' as info;
SELECT 'Countries:' as table_name, COUNT(*) as count FROM country
UNION ALL
SELECT 'Sites:' as table_name, COUNT(*) as count FROM site
UNION ALL
SELECT 'Roles:' as table_name, COUNT(*) as count FROM role
UNION ALL
SELECT 'User Profiles:' as table_name, COUNT(*) as count FROM user_profile
UNION ALL
SELECT 'Site Users:' as table_name, COUNT(*) as count FROM site_user
UNION ALL
SELECT 'Account Requests:' as table_name, COUNT(*) as count FROM user_account_request;

-- Check RLS policies
SELECT 'RLS Policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('country', 'site', 'role', 'user_profile', 'site_user', 'user_account_request')
ORDER BY tablename, policyname; 