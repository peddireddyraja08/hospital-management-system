-- Sample Data for Hospital Management System

-- Insert Lab Tests
INSERT INTO lab_tests (test_name, test_code, description, price, normal_range, unit, category, turnaround_time, is_active, is_deleted, created_at, updated_at, sample_type, sample_volume, sample_container, requires_fasting, normal_range_male, normal_range_female, normal_range_child, critical_low, critical_high, department, method, is_profile, profile_tests) 
VALUES 
('Complete Blood Count', 'CBC001', 'Full blood count with differential', 500.00, '12-16 g/dL', 'g/dL', 'HEMATOLOGY', '24 hours', true, false, NOW(), NOW(), 'BLOOD', '5 ml', 'EDTA tube', false, '13-17 g/dL', '12-15 g/dL', '11-13 g/dL', '8', '18', 'Hematology', 'Automated', false, NULL),
('Liver Function Test', 'LFT001', 'Complete liver panel', 800.00, 'See report', 'Various', 'BIOCHEMISTRY', '24 hours', true, false, NOW(), NOW(), 'SERUM', '3 ml', 'Plain tube', true, NULL, NULL, NULL, NULL, NULL, 'Biochemistry', 'Automated', true, 'SGOT,SGPT,ALP,Bilirubin'),
('Kidney Function Test', 'KFT001', 'Renal function panel', 700.00, 'See report', 'Various', 'BIOCHEMISTRY', '24 hours', true, false, NOW(), NOW(), 'SERUM', '3 ml', 'Plain tube', false, NULL, NULL, NULL, NULL, NULL, 'Biochemistry', 'Automated', true, 'Urea,Creatinine,Uric Acid'),
('Blood Sugar Fasting', 'FBS001', 'Fasting blood glucose', 150.00, '70-100 mg/dL', 'mg/dL', 'BIOCHEMISTRY', '4 hours', true, false, NOW(), NOW(), 'BLOOD', '2 ml', 'Fluoride tube', true, '70-100', '70-100', '70-100', '50', '200', 'Biochemistry', 'Enzymatic', false, NULL),
('Thyroid Profile', 'THYROID001', 'T3, T4, TSH', 900.00, 'See report', 'Various', 'ENDOCRINOLOGY', '48 hours', true, false, NOW(), NOW(), 'SERUM', '3 ml', 'Plain tube', false, NULL, NULL, NULL, NULL, NULL, 'Biochemistry', 'CLIA', true, 'T3,T4,TSH'),
('Lipid Profile', 'LIPID001', 'Complete cholesterol panel', 600.00, 'See report', 'mg/dL', 'BIOCHEMISTRY', '24 hours', true, false, NOW(), NOW(), 'SERUM', '3 ml', 'Plain tube', true, NULL, NULL, NULL, NULL, NULL, 'Biochemistry', 'Enzymatic', true, 'Total Cholesterol,LDL,HDL,Triglycerides'),
('Urine Routine', 'URINE001', 'Complete urine analysis', 200.00, 'Normal', 'Various', 'CLINICAL_PATHOLOGY', '6 hours', true, false, NOW(), NOW(), 'URINE', '10 ml', 'Sterile container', false, NULL, NULL, NULL, NULL, NULL, 'Clinical Pathology', 'Microscopy', false, NULL),
('HbA1c', 'HBA1C001', 'Glycated hemoglobin', 400.00, '4-6%', '%', 'BIOCHEMISTRY', '24 hours', true, false, NOW(), NOW(), 'BLOOD', '2 ml', 'EDTA tube', false, '4-6', '4-6', '4-6', '3', '10', 'Biochemistry', 'HPLC', false, NULL),
('ESR', 'ESR001', 'Erythrocyte Sedimentation Rate', 100.00, '0-20 mm/hr', 'mm/hr', 'HEMATOLOGY', '2 hours', true, false, NOW(), NOW(), 'BLOOD', '2 ml', 'EDTA tube', false, '0-15', '0-20', '0-20', NULL, '100', 'Hematology', 'Westergren', false, NULL),
('X-Ray Chest', 'XRAY001', 'Chest X-ray PA view', 300.00, 'Normal', 'N/A', 'RADIOLOGY', '2 hours', true, false, NOW(), NOW(), NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, 'Radiology', 'Digital', false, NULL)
ON CONFLICT DO NOTHING;

-- Insert Sample Patients
INSERT INTO patients (patient_id, patient_type, first_name, last_name, date_of_birth, gender, blood_group, phone_number, email, address, is_active, is_deleted, created_at, updated_at)
VALUES 
('OUT12345678', 'OUTPATIENT', 'John', 'Doe', '1985-05-15', 'MALE', 'A_POSITIVE', '9876543210', 'john.doe@email.com', '123 Main St, City', true, false, NOW(), NOW()),
('OUT87654321', 'OUTPATIENT', 'Jane', 'Smith', '1990-08-20', 'FEMALE', 'B_POSITIVE', '9876543211', 'jane.smith@email.com', '456 Oak Ave, City', true, false, NOW(), NOW()),
('IN98765432', 'INPATIENT', 'Robert', 'Johnson', '1978-12-10', 'MALE', 'O_POSITIVE', '9876543212', 'robert.j@email.com', '789 Pine Rd, City', true, false, NOW(), NOW())
ON CONFLICT (patient_id) DO NOTHING;

-- Insert Sample Doctors
INSERT INTO doctors (doctor_id, first_name, last_name, specialization, license_number, qualification, experience, consultation_fee, phone_number, email, is_active, is_deleted, created_at, updated_at)
VALUES 
('DOC12345678', 'Sarah', 'Williams', 'General Medicine', 'MED123456', 'MBBS, MD', 10, 500.00, '9998887771', 'dr.sarah@hospital.com', true, false, NOW(), NOW()),
('DOC87654321', 'Michael', 'Brown', 'Pathology', 'PATH123456', 'MBBS, MD Pathology', 15, 700.00, '9998887772', 'dr.michael@hospital.com', true, false, NOW(), NOW()),
('DOC11223344', 'Emily', 'Davis', 'Cardiology', 'CARD123456', 'MBBS, DM Cardiology', 12, 1000.00, '9998887773', 'dr.emily@hospital.com', true, false, NOW(), NOW())
ON CONFLICT (doctor_id) DO NOTHING;

COMMIT;
