-- Basic Data Setup for A-SEARCH
-- Run this script in your Supabase SQL editor

-- Insert basic roles
INSERT INTO role (role_name, description, is_default, is_public) VALUES
('Super Admin', 'Full system access and administration', FALSE, FALSE),
('Site Admin', 'Site-level administration and management', FALSE, FALSE),
('Data Collector', 'Field data collection and entry', TRUE, TRUE),
('Researcher', 'Research and analysis activities', FALSE, TRUE),
('Viewer', 'Read-only access to data', FALSE, TRUE)
ON CONFLICT (role_name) DO NOTHING;

-- Insert basic sites (assuming you have a country with id=1)
INSERT INTO site (name, country_id, description, location_name, latitude, longitude, address, start_date) VALUES
('Korogacho', 1, 'Nairobi slum area', 'Nairobi', -1.2921, 36.8219, 'Korogacho, Nairobi', '2023-01-01'),
('Kibera', 1, 'Largest slum in Nairobi', 'Nairobi', -1.3131, 36.7897, 'Kibera, Nairobi', '2023-01-01'),
('Mathare', 1, 'Nairobi informal settlement', 'Nairobi', -1.2667, 36.8333, 'Mathare, Nairobi', '2023-01-01')
ON CONFLICT DO NOTHING;

-- Verify the data
SELECT 'Roles:' as info;
SELECT role_id, role_name, is_public, is_default FROM role ORDER BY role_id;

SELECT 'Sites:' as info;
SELECT site_id, name, description FROM site ORDER BY site_id; 