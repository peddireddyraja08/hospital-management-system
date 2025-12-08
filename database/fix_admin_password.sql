-- Fix admin password with BCrypt hash for "admin"
UPDATE users 
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = 'admin';

-- Verify
SELECT username, length(password) as pwd_length, substring(password, 1, 10) as pwd_start 
FROM users 
WHERE username = 'admin';
