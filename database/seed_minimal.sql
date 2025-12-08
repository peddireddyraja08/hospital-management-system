-- Minimal Demo Data Seeder
BEGIN;

-- Initialize ID counters
INSERT INTO id_counter (module_prefix, date_key, last_sequence, created_at, updated_at)
VALUES 
    ('OUT', '20250207', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('IN', '20250207', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('DOC', '20250207', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (module_prefix, date_key) DO UPDATE
SET last_sequence = EXCLUDED.last_sequence;

-- Create users
INSERT INTO users (username, email, password, first_name, last_name, phone_number, is_verified, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('dr.sarah', 'dr.sarah@hospital.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Sarah', 'Williams', '+1-555-0101', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('john.doe', 'john.doe@hospital.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'John', 'Doe', '+1-555-0201', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('jane.smith', 'jane.smith@hospital.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Jane', 'Smith', '+1-555-0202', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Assign roles
INSERT INTO user_roles (user_id, role)
VALUES 
    ((SELECT id FROM users WHERE username = 'dr.sarah'), 'DOCTOR'),
    ((SELECT id FROM users WHERE username = 'john.doe'), 'PATIENT'),
    ((SELECT id FROM users WHERE username = 'jane.smith'), 'PATIENT');

-- Create doctor
INSERT INTO doctors (doctor_id, first_name, last_name, specialization, license_number, qualification, years_of_experience, consultation_fee, phone_number, email, is_active, is_deleted, created_at, updated_at, created_by, updated_by, user_id)
VALUES ('DOC-20250207-0001', 'Sarah', 'Williams', 'General Medicine', 'MED2025001', 'MBBS, MD', 10, 500.00, '+1-555-0101', 'dr.sarah@hospital.com', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'dr.sarah'));

-- Create patients
INSERT INTO patients (patient_id, patient_type, first_name, last_name, date_of_birth, gender, blood_group, phone_number, email, address, emergency_contact_name, emergency_contact_number, is_active, is_deleted, created_at, updated_at, created_by, updated_by, user_id)
VALUES 
    ('OUT-20250207-0001', 'OUTPATIENT', 'John', 'Doe', '1985-05-15', 'MALE', 'A_POSITIVE', '+1-555-0201', 'john.doe@hospital.com', '123 Maple St', 'Mary Doe', '+1-555-0203', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'john.doe')),
    ('IN-20250207-0001', 'INPATIENT', 'Jane', 'Smith', '1990-08-20', 'FEMALE', 'B_POSITIVE', '+1-555-0202', 'jane.smith@hospital.com', '456 Oak Ave', 'Robert Smith', '+1-555-0204', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'jane.smith'));

COMMIT;

SELECT 'Demo data loaded successfully!' as status;
SELECT 'Patients' as entity, COUNT(*) as count FROM patients
UNION ALL SELECT 'Doctors', COUNT(*) FROM doctors
UNION ALL SELECT 'Users', COUNT(*) FROM users;
