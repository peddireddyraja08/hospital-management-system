-- Reset admin password to a known working BCrypt hash
-- This hash is for password: "password"
UPDATE users 
SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'admin';

-- Verify
SELECT username, length(password) as pwd_length, substring(password, 1, 15) as pwd_start 
FROM users 
WHERE username = 'admin';
