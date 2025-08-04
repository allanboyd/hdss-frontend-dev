-- Complete Database Setup for A-SEARCH User Management
-- Run this script in your Supabase SQL editor

-- Create Role table with new fields
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

-- Grant access to the view
GRANT SELECT ON user_management_counts TO authenticated;
GRANT SELECT ON user_management_counts TO anon;

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

-- Verify the setup
SELECT 'Database setup completed successfully!' as status;
SELECT * FROM user_management_counts; 