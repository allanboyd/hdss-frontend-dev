-- User Management Counts View Setup
-- Run this script in your Supabase SQL editor to create the missing view

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

-- Verify the view was created
SELECT * FROM user_management_counts; 