-- Create admin user with properly encoded password
-- Password: admin123 (tested BCrypt hash)
-- This is a validated BCrypt hash that matches "admin123"

DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username = 'admin';

INSERT INTO users (username, email, password, first_name, last_name, phone_number, is_verified, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES ('admin', 'admin@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye7v7DJNQn0f6iLLxKZhXw6U7vhBYqFIS', 'Admin', 'User', '+1-555-0100', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Assign ADMIN role
INSERT INTO user_roles (user_id, role)
VALUES ((SELECT id FROM users WHERE username = 'admin'), 'ROLE_ADMIN');

-- Verify
SELECT u.id, u.username, u.email, ur.role, length(u.password) as pwd_len
FROM users u 
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.username = 'admin';
