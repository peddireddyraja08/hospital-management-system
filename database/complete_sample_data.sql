-- Complete Sample Data for Hospital Management System
-- This script creates sample data for all modules

BEGIN;

-- Clear existing data (except admin user)
DELETE FROM samples;
DELETE FROM lab_test_results WHERE test_request_id IN (SELECT id FROM lab_test_requests);
DELETE FROM lab_test_requests;
DELETE FROM lab_tests;
DELETE FROM prescriptions;
DELETE FROM medications;
DELETE FROM bills;
DELETE FROM physician_orders;
DELETE FROM vital_signs;
DELETE FROM medical_records;
DELETE FROM appointments;
DELETE FROM admissions;
DELETE FROM beds;
DELETE FROM doctors WHERE user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM patients WHERE user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM staff WHERE user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM users WHERE username != 'admin';

-- Reset ID sequences
ALTER SEQUENCE users_id_seq RESTART WITH 100;
ALTER SEQUENCE patients_id_seq RESTART WITH 1;
ALTER SEQUENCE doctors_id_seq RESTART WITH 1;
ALTER SEQUENCE staff_id_seq RESTART WITH 1;
ALTER SEQUENCE appointments_id_seq RESTART WITH 1;
ALTER SEQUENCE medical_records_id_seq RESTART WITH 1;
ALTER SEQUENCE vital_signs_id_seq RESTART WITH 1;
ALTER SEQUENCE physician_orders_id_seq RESTART WITH 1;
ALTER SEQUENCE bills_id_seq RESTART WITH 1;
ALTER SEQUENCE medications_id_seq RESTART WITH 1;
ALTER SEQUENCE prescriptions_id_seq RESTART WITH 1;
ALTER SEQUENCE lab_tests_id_seq RESTART WITH 1;
ALTER SEQUENCE lab_test_requests_id_seq RESTART WITH 1;
ALTER SEQUENCE lab_test_results_id_seq RESTART WITH 1;
ALTER SEQUENCE samples_id_seq RESTART WITH 1;
ALTER SEQUENCE beds_id_seq RESTART WITH 1;
ALTER SEQUENCE admissions_id_seq RESTART WITH 1;

-- Create Users (Password: "password" for all)
INSERT INTO users (username, email, password, first_name, last_name, phone_number, is_verified, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    -- Doctors
    ('dr.smith', 'dr.smith@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Smith', '+1-555-0101', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('dr.williams', 'dr.williams@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah', 'Williams', '+1-555-0102', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('dr.johnson', 'dr.johnson@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Michael', 'Johnson', '+1-555-0103', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('dr.brown', 'dr.brown@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Emily', 'Brown', '+1-555-0104', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    -- Nurses
    ('nurse.davis', 'nurse.davis@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lisa', 'Davis', '+1-555-0201', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('nurse.wilson', 'nurse.wilson@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'James', 'Wilson', '+1-555-0202', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    -- Lab Technicians
    ('lab.tech1', 'lab.tech1@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'David', 'Martinez', '+1-555-0301', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    -- Pharmacists
    ('pharmacist1', 'pharmacist1@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Robert', 'Anderson', '+1-555-0401', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    -- Receptionists
    ('reception1', 'reception1@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Maria', 'Garcia', '+1-555-0501', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    -- Accountants
    ('accountant1', 'accountant1@hospital.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jennifer', 'Taylor', '+1-555-0601', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    -- Patients
    ('patient1', 'patient1@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alice', 'Cooper', '+1-555-1001', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('patient2', 'patient2@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob', 'Miller', '+1-555-1002', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('patient3', 'patient3@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carol', 'White', '+1-555-1003', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('patient4', 'patient4@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Daniel', 'Harris', '+1-555-1004', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('patient5', 'patient5@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Emma', 'Clark', '+1-555-1005', true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Assign User Roles
INSERT INTO user_roles (user_id, role)
VALUES 
    ((SELECT id FROM users WHERE username = 'dr.smith'), 'ROLE_DOCTOR'),
    ((SELECT id FROM users WHERE username = 'dr.williams'), 'ROLE_DOCTOR'),
    ((SELECT id FROM users WHERE username = 'dr.johnson'), 'ROLE_DOCTOR'),
    ((SELECT id FROM users WHERE username = 'dr.brown'), 'ROLE_DOCTOR'),
    ((SELECT id FROM users WHERE username = 'nurse.davis'), 'ROLE_NURSE'),
    ((SELECT id FROM users WHERE username = 'nurse.wilson'), 'ROLE_NURSE'),
    ((SELECT id FROM users WHERE username = 'lab.tech1'), 'ROLE_LAB_TECHNICIAN'),
    ((SELECT id FROM users WHERE username = 'pharmacist1'), 'ROLE_PHARMACIST'),
    ((SELECT id FROM users WHERE username = 'reception1'), 'ROLE_RECEPTIONIST'),
    ((SELECT id FROM users WHERE username = 'accountant1'), 'ROLE_ACCOUNTANT'),
    ((SELECT id FROM users WHERE username = 'patient1'), 'ROLE_PATIENT'),
    ((SELECT id FROM users WHERE username = 'patient2'), 'ROLE_PATIENT'),
    ((SELECT id FROM users WHERE username = 'patient3'), 'ROLE_PATIENT'),
    ((SELECT id FROM users WHERE username = 'patient4'), 'ROLE_PATIENT'),
    ((SELECT id FROM users WHERE username = 'patient5'), 'ROLE_PATIENT');

-- Create Doctors
INSERT INTO doctors (doctor_id, first_name, last_name, specialization, license_number, qualification, years_of_experience, consultation_fee, phone_number, email, is_active, is_deleted, created_at, updated_at, created_by, updated_by, user_id)
VALUES 
    ('DOC-20250207-0001', 'John', 'Smith', 'Cardiology', 'MED2025001', 'MD, FACC', 15, 750.00, '+1-555-0101', 'dr.smith@hospital.com', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'dr.smith')),
    ('DOC-20250207-0002', 'Sarah', 'Williams', 'Pediatrics', 'MED2025002', 'MD, FAAP', 10, 500.00, '+1-555-0102', 'dr.williams@hospital.com', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'dr.williams')),
    ('DOC-20250207-0003', 'Michael', 'Johnson', 'Orthopedics', 'MED2025003', 'MD, FAAOS', 12, 650.00, '+1-555-0103', 'dr.johnson@hospital.com', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'dr.johnson')),
    ('DOC-20250207-0004', 'Emily', 'Brown', 'Neurology', 'MED2025004', 'MD, PhD', 8, 700.00, '+1-555-0104', 'dr.brown@hospital.com', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'dr.brown'));

-- Create Staff
INSERT INTO staff (staff_id, first_name, last_name, department, designation, joining_date, salary, phone_number, email, is_active, is_deleted, created_at, updated_at, created_by, updated_by, user_id)
VALUES 
    ('STF-20250207-0001', 'Lisa', 'Davis', 'Nursing', 'Senior Nurse', '2020-01-15', 65000.00, '+1-555-0201', 'nurse.davis@hospital.com', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'nurse.davis')),
    ('STF-20250207-0002', 'James', 'Wilson', 'Nursing', 'Staff Nurse', '2022-03-10', 55000.00, '+1-555-0202', 'nurse.wilson@hospital.com', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'nurse.wilson')),
    ('STF-20250207-0003', 'David', 'Martinez', 'Laboratory', 'Lab Technician', '2021-06-01', 50000.00, '+1-555-0301', 'lab.tech1@hospital.com', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'lab.tech1')),
    ('STF-20250207-0004', 'Robert', 'Anderson', 'Pharmacy', 'Pharmacist', '2019-09-15', 70000.00, '+1-555-0401', 'pharmacist1@hospital.com', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'pharmacist1')),
    ('STF-20250207-0005', 'Maria', 'Garcia', 'Administration', 'Receptionist', '2023-01-20', 40000.00, '+1-555-0501', 'reception1@hospital.com', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'reception1')),
    ('STF-20250207-0006', 'Jennifer', 'Taylor', 'Finance', 'Accountant', '2020-11-10', 75000.00, '+1-555-0601', 'accountant1@hospital.com', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'accountant1'));

-- Create Patients
INSERT INTO patients (patient_id, first_name, last_name, date_of_birth, gender, blood_group, address, city, state, postal_code, country, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, is_active, is_deleted, created_at, updated_at, created_by, updated_by, user_id)
VALUES 
    ('OUT-20250207-0001', 'Alice', 'Cooper', '1985-05-15', 'FEMALE', 'O_POSITIVE', '123 Main St', 'New York', 'NY', '10001', 'USA', 'John Cooper', '+1-555-2001', 'Spouse', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'patient1')),
    ('OUT-20250207-0002', 'Bob', 'Miller', '1990-08-22', 'MALE', 'A_POSITIVE', '456 Oak Ave', 'Los Angeles', 'CA', '90001', 'USA', 'Jane Miller', '+1-555-2002', 'Spouse', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'patient2')),
    ('IN-20250207-0001', 'Carol', 'White', '1978-12-10', 'FEMALE', 'B_POSITIVE', '789 Pine Rd', 'Chicago', 'IL', '60601', 'USA', 'Tom White', '+1-555-2003', 'Spouse', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'patient3')),
    ('OUT-20250207-0003', 'Daniel', 'Harris', '1995-03-30', 'MALE', 'AB_POSITIVE', '321 Elm St', 'Houston', 'TX', '77001', 'USA', 'Sarah Harris', '+1-555-2004', 'Mother', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'patient4')),
    ('OUT-20250207-0004', 'Emma', 'Clark', '2010-07-18', 'FEMALE', 'A_NEGATIVE', '654 Maple Dr', 'Phoenix', 'AZ', '85001', 'USA', 'Mary Clark', '+1-555-2005', 'Mother', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM users WHERE username = 'patient5'));

-- Create Floors, Wards, and Beds
INSERT INTO floors (floor_number, floor_name, total_wards, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    (1, 'Ground Floor - Emergency', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    (2, 'First Floor - General Medicine', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    (3, 'Second Floor - ICU & Critical Care', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

INSERT INTO wards (ward_name, floor_id, ward_type, total_beds, available_beds, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('Emergency Ward A', (SELECT id FROM floors WHERE floor_number = 1), 'EMERGENCY', 10, 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('General Ward 1', (SELECT id FROM floors WHERE floor_number = 2), 'GENERAL', 15, 12, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('General Ward 2', (SELECT id FROM floors WHERE floor_number = 2), 'GENERAL', 15, 15, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU Ward', (SELECT id FROM floors WHERE floor_number = 3), 'ICU', 8, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('Private Ward', (SELECT id FROM floors WHERE floor_number = 2), 'PRIVATE', 10, 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by, current_patient_id)
VALUES 
    ('E-A-01', (SELECT id FROM wards WHERE ward_name = 'Emergency Ward A'), 'EMERGENCY', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', NULL),
    ('E-A-02', (SELECT id FROM wards WHERE ward_name = 'Emergency Ward A'), 'EMERGENCY', 'OCCUPIED', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', (SELECT id FROM patients WHERE patient_id = 'IN-20250207-0001')),
    ('G1-01', (SELECT id FROM wards WHERE ward_name = 'General Ward 1'), 'GENERAL', 'AVAILABLE', 300.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', NULL),
    ('G1-02', (SELECT id FROM wards WHERE ward_name = 'General Ward 1'), 'GENERAL', 'AVAILABLE', 300.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', NULL),
    ('ICU-01', (SELECT id FROM wards WHERE ward_name = 'ICU Ward'), 'ICU', 'AVAILABLE', 2000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', NULL),
    ('ICU-02', (SELECT id FROM wards WHERE ward_name = 'ICU Ward'), 'ICU', 'OCCUPIED', 2000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', NULL),
    ('P-01', (SELECT id FROM wards WHERE ward_name = 'Private Ward'), 'PRIVATE', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', NULL),
    ('P-02', (SELECT id FROM wards WHERE ward_name = 'Private Ward'), 'PRIVATE', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM', NULL);

-- Create Appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, duration, status, appointment_type, reason, notes, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ((SELECT id FROM patients WHERE patient_id = 'OUT-20250207-0001'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0001'), CURRENT_TIMESTAMP + INTERVAL '1 day', 30, 'SCHEDULED', 'CONSULTATION', 'Chest pain checkup', 'New patient', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ((SELECT id FROM patients WHERE patient_id = 'OUT-20250207-0002'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0002'), CURRENT_TIMESTAMP - INTERVAL '2 days', 30, 'COMPLETED', 'CONSULTATION', 'Child vaccination', 'Routine checkup completed', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ((SELECT id FROM patients WHERE patient_id = 'OUT-20250207-0004'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0003'), CURRENT_TIMESTAMP + INTERVAL '3 days', 45, 'SCHEDULED', 'FOLLOW_UP', 'Post-surgery follow-up', 'Follow-up after knee surgery', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Create Medical Records
INSERT INTO medical_records (patient_id, doctor_id, visit_date, diagnosis, symptoms, treatment_plan, prescriptions, follow_up_date, notes, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ((SELECT id FROM patients WHERE patient_id = 'OUT-20250207-0002'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0002'), CURRENT_TIMESTAMP - INTERVAL '2 days', 'Routine vaccination', 'None', 'Administered MMR vaccine', 'Paracetamol if fever', CURRENT_TIMESTAMP + INTERVAL '6 months', 'Child in good health', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ((SELECT id FROM patients WHERE patient_id = 'IN-20250207-0001'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0001'), CURRENT_TIMESTAMP - INTERVAL '1 day', 'Acute Myocardial Infarction', 'Severe chest pain, shortness of breath', 'Emergency intervention, bed rest, medication', 'Aspirin, Beta-blockers, ACE inhibitors', CURRENT_TIMESTAMP + INTERVAL '1 week', 'Patient admitted to ICU', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Create Vital Signs
INSERT INTO vital_signs (patient_id, recorded_at, temperature, pulse_rate, blood_pressure_systolic, blood_pressure_diastolic, respiratory_rate, oxygen_saturation, height, weight, bmi, recorded_by, notes, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ((SELECT id FROM patients WHERE patient_id = 'OUT-20250207-0001'), CURRENT_TIMESTAMP - INTERVAL '1 hour', 98.6, 72, 120, 80, 16, 98, 165, 70, 25.7, 'Nurse Davis', 'Normal vitals', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ((SELECT id FROM patients WHERE patient_id = 'IN-20250207-0001'), CURRENT_TIMESTAMP - INTERVAL '30 minutes', 99.2, 95, 140, 90, 20, 95, 170, 80, 27.7, 'Nurse Wilson', 'Elevated BP, monitoring', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ((SELECT id FROM patients WHERE patient_id = 'OUT-20250207-0004'), CURRENT_TIMESTAMP - INTERVAL '2 hours', 98.4, 68, 118, 75, 15, 99, 175, 75, 24.5, 'Nurse Davis', 'Post-op vitals stable', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Create Medications
INSERT INTO medications (medication_code, medication_name, generic_name, category, manufacturer, unit_price, stock_quantity, reorder_level, expiry_alert_days, dosage_form, strength, storage_conditions, side_effects, contraindications, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('MED-20250207-0001', 'Aspirin', 'Acetylsalicylic Acid', 'ANTIPLATELET', 'PharmaCorp', 5.00, 1000, 100, 90, 'Tablet', '75mg', 'Room temperature', 'Stomach upset, bleeding', 'Active bleeding, peptic ulcer', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('MED-20250207-0002', 'Amoxicillin', 'Amoxicillin', 'ANTIBIOTIC', 'MediPharma', 15.00, 500, 50, 90, 'Capsule', '500mg', 'Room temperature', 'Diarrhea, nausea, rash', 'Penicillin allergy', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('MED-20250207-0003', 'Paracetamol', 'Acetaminophen', 'ANALGESIC', 'HealthMed', 3.00, 2000, 200, 90, 'Tablet', '500mg', 'Room temperature', 'Rare allergic reactions', 'Liver disease', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('MED-20250207-0004', 'Metformin', 'Metformin HCl', 'ANTIDIABETIC', 'DiabetesCare', 10.00, 800, 80, 90, 'Tablet', '500mg', 'Room temperature', 'GI upset, lactic acidosis', 'Kidney disease, heart failure', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('MED-20250207-0005', 'Lisinopril', 'Lisinopril', 'ACE_INHIBITOR', 'CardioMed', 20.00, 600, 60, 90, 'Tablet', '10mg', 'Room temperature', 'Dry cough, dizziness', 'Pregnancy, angioedema', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Create Prescriptions
INSERT INTO prescriptions (patient_id, doctor_id, medication_id, dosage, frequency, duration, quantity, instructions, prescription_date, status, dispensed_quantity, dispensed_date, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ((SELECT id FROM patients WHERE patient_id = 'IN-20250207-0001'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0001'), (SELECT id FROM medications WHERE medication_code = 'MED-20250207-0001'), '75mg', 'Once daily', 30, 30, 'Take after breakfast', CURRENT_TIMESTAMP, 'DISPENSED', 30, CURRENT_TIMESTAMP, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ((SELECT id FROM patients WHERE patient_id = 'IN-20250207-0001'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0001'), (SELECT id FROM medications WHERE medication_code = 'MED-20250207-0005'), '10mg', 'Once daily', 30, 30, 'Take in the morning', CURRENT_TIMESTAMP, 'DISPENSED', 30, CURRENT_TIMESTAMP, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ((SELECT id FROM patients WHERE patient_id = 'OUT-20250207-0002'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0002'), (SELECT id FROM medications WHERE medication_code = 'MED-20250207-0003'), '500mg', 'As needed', 5, 10, 'For fever only', CURRENT_TIMESTAMP - INTERVAL '2 days', 'DISPENSED', 10, CURRENT_TIMESTAMP - INTERVAL '2 days', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Create Lab Tests
INSERT INTO lab_tests (test_code, test_name, test_category, department, specimen_type, test_method, normal_range, unit, turnaround_time, price, preparation_instructions, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('LAB-20250207-0001', 'Complete Blood Count', 'HEMATOLOGY', 'Laboratory', 'Blood', 'Automated Hematology Analyzer', 'WBC: 4-11, RBC: 4.5-5.5, Hb: 13-17', 'cells/mcL', 2, 150.00, 'Fasting not required', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('LAB-20250207-0002', 'Lipid Profile', 'BIOCHEMISTRY', 'Laboratory', 'Blood', 'Spectrophotometry', 'Total: <200, LDL: <100, HDL: >40', 'mg/dL', 4, 250.00, '12 hour fasting required', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('LAB-20250207-0003', 'HbA1c', 'BIOCHEMISTRY', 'Laboratory', 'Blood', 'HPLC', '<5.7%', '%', 4, 200.00, 'No special preparation', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('LAB-20250207-0004', 'Troponin I', 'BIOCHEMISTRY', 'Laboratory', 'Blood', 'Immunoassay', '<0.04', 'ng/mL', 1, 300.00, 'None', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('LAB-20250207-0005', 'Chest X-Ray', 'RADIOLOGY', 'Radiology', 'N/A', 'X-Ray', 'Normal chest anatomy', 'Image', 1, 500.00, 'Remove metal objects', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Create Lab Test Requests
INSERT INTO lab_test_requests (request_number, patient_id, doctor_id, lab_test_id, priority, test_status, requested_date, sample_collection_date, report_date, clinical_notes, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('REQ-20250207-0001', (SELECT id FROM patients WHERE patient_id = 'IN-20250207-0001'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0001'), (SELECT id FROM lab_tests WHERE test_code = 'LAB-20250207-0001'), 'STAT', 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'Cardiac patient - urgent', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('REQ-20250207-0002', (SELECT id FROM patients WHERE patient_id = 'IN-20250207-0001'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0001'), (SELECT id FROM lab_tests WHERE test_code = 'LAB-20250207-0004'), 'STAT', 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Check cardiac markers', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('REQ-20250207-0003', (SELECT id FROM patients WHERE patient_id = 'OUT-20250207-0001'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0001'), (SELECT id FROM lab_tests WHERE test_code = 'LAB-20250207-0002'), 'ROUTINE', 'IN_PROGRESS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, 'Routine checkup', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Create Lab Test Results
INSERT INTO lab_test_results (test_request_id, result_value, result_status, result_interpretation, tested_date, tested_by, verified_date, verified_by, remarks, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ((SELECT id FROM lab_test_requests WHERE request_number = 'REQ-20250207-0001'), 'WBC: 10.5, RBC: 4.8, Hb: 14.5', 'NORMAL', 'All parameters within normal range', CURRENT_TIMESTAMP - INTERVAL '3 hours', 'David Martinez', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'Dr. Smith', 'Normal CBC', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ((SELECT id FROM lab_test_requests WHERE request_number = 'REQ-20250207-0002'), '1.2 ng/mL', 'ABNORMAL', 'Elevated troponin indicating cardiac injury', CURRENT_TIMESTAMP - INTERVAL '4 hours', 'David Martinez', CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Dr. Smith', 'Consistent with MI', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Create Samples
INSERT INTO samples (accession_number, patient_id, test_request_id, sample_type, collection_date, collected_by, sample_status, storage_location, barcode, volume, container_type, notes, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('SAMPLE-20250207-0001', (SELECT id FROM patients WHERE patient_id = 'IN-20250207-0001'), (SELECT id FROM lab_test_requests WHERE request_number = 'REQ-20250207-0001'), 'BLOOD', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Nurse Davis', 'TESTED', 'Fridge-A1', 'BC20250207001', '5 mL', 'EDTA Tube', 'Urgent sample', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('SAMPLE-20250207-0002', (SELECT id FROM patients WHERE patient_id = 'IN-20250207-0001'), (SELECT id FROM lab_test_requests WHERE request_number = 'REQ-20250207-0002'), 'BLOOD', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Nurse Davis', 'TESTED', 'Fridge-A1', 'BC20250207002', '3 mL', 'Serum Tube', 'Cardiac markers', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('SAMPLE-20250207-0003', (SELECT id FROM patients WHERE patient_id = 'OUT-20250207-0001'), (SELECT id FROM lab_test_requests WHERE request_number = 'REQ-20250207-0003'), 'BLOOD', CURRENT_TIMESTAMP, 'Nurse Wilson', 'RECEIVED', 'Fridge-B2', 'BC20250207003', '5 mL', 'Serum Tube', 'Lipid profile sample', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Create Physician Orders
INSERT INTO physician_orders (order_number, patient_id, doctor_id, order_type, order_description, priority, status, ordered_date, scheduled_date, completed_date, notes, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('ORD-20250207-0001', (SELECT id FROM patients WHERE patient_id = 'IN-20250207-0001'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0001'), 'MEDICATION', 'Aspirin 75mg daily', 'ROUTINE', 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Cardiac patient', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ORD-20250207-0002', (SELECT id FROM patients WHERE patient_id = 'IN-20250207-0001'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0001'), 'LAB_TEST', 'CBC and Cardiac markers', 'URGENT', 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'STAT labs', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ORD-20250207-0003', (SELECT id FROM patients WHERE patient_id = 'OUT-20250207-0001'), (SELECT id FROM doctors WHERE doctor_id = 'DOC-20250207-0001'), 'IMAGING', 'ECG', 'ROUTINE', 'SCHEDULED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 day', NULL, 'Pre-op evaluation', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Create Bills
INSERT INTO bills (bill_number, patient_id, bill_date, total_amount, paid_amount, due_amount, payment_status, payment_method, consultation_charges, lab_charges, medication_charges, room_charges, procedure_charges, other_charges, discount_amount, tax_amount, notes, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('BILL-20250207-0001', (SELECT id FROM patients WHERE patient_id = 'OUT-20250207-0002'), CURRENT_TIMESTAMP - INTERVAL '2 days', 950.00, 950.00, 0.00, 'PAID', 'CREDIT_CARD', 500.00, 150.00, 30.00, 0.00, 0.00, 20.00, 50.00, 70.00, 'Pediatric consultation and vaccination', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('BILL-20250207-0002', (SELECT id FROM patients WHERE patient_id = 'IN-20250207-0001'), CURRENT_TIMESTAMP, 8500.00, 3000.00, 5500.00, 'PARTIALLY_PAID', 'CASH', 750.00, 650.00, 200.00, 2000.00, 0.00, 0.00, 0.00, 850.00, 'ICU admission - cardiac patient', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('BILL-20250207-0003', (SELECT id FROM patients WHERE patient_id = 'OUT-20250207-0001'), CURRENT_TIMESTAMP, 1200.00, 0.00, 1200.00, 'PENDING', NULL, 750.00, 250.00, 0.00, 0.00, 0.00, 0.00, 0.00, 120.00, 'Cardiology consultation and tests', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

COMMIT;

-- Summary
SELECT 'Sample data created successfully!' as message,
       (SELECT COUNT(*) FROM users WHERE username != 'admin') as total_users,
       (SELECT COUNT(*) FROM doctors) as total_doctors,
       (SELECT COUNT(*) FROM patients) as total_patients,
       (SELECT COUNT(*) FROM staff) as total_staff,
       (SELECT COUNT(*) FROM appointments) as total_appointments,
       (SELECT COUNT(*) FROM medical_records) as total_medical_records,
       (SELECT COUNT(*) FROM medications) as total_medications,
       (SELECT COUNT(*) FROM lab_tests) as total_lab_tests,
       (SELECT COUNT(*) FROM samples) as total_samples,
       (SELECT COUNT(*) FROM bills) as total_bills,
       (SELECT COUNT(*) FROM beds) as total_beds;
