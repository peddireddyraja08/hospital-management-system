-- Critical Alerts Test Data
-- This script creates sample data to test the critical alerts system

-- First, ensure we have lab tests with critical thresholds
-- Update existing lab tests or insert new ones with critical values

-- Update Complete Blood Picture (CBP) tests with critical thresholds
UPDATE lab_tests 
SET critical_low = 2.0, critical_high = 18.0 
WHERE test_name LIKE '%Hemoglobin%' OR test_name LIKE '%Hb%';

UPDATE lab_tests 
SET critical_low = 2000, critical_high = 25000 
WHERE test_name LIKE '%WBC%' OR test_name LIKE '%White Blood%';

UPDATE lab_tests 
SET critical_low = 50000, critical_high = 1000000 
WHERE test_name LIKE '%Platelet%';

-- Update Blood Glucose with critical thresholds
UPDATE lab_tests 
SET critical_low = 40, critical_high = 400 
WHERE test_name LIKE '%Glucose%' OR test_name LIKE '%Sugar%';

-- Update Creatinine with critical thresholds
UPDATE lab_tests 
SET critical_low = 0.3, critical_high = 10.0 
WHERE test_name LIKE '%Creatinine%';

-- Update Potassium with critical thresholds
UPDATE lab_tests 
SET critical_low = 2.5, critical_high = 6.5 
WHERE test_name LIKE '%Potassium%' OR test_name LIKE '%K+%';

-- If no lab tests exist, insert sample tests with critical values
INSERT INTO lab_tests (test_code, test_name, test_category, department, price, normal_range, critical_low, critical_high, turnaround_time, sample_type, unit, is_active, is_deleted, created_at)
SELECT 'LAB-HB-001', 'Hemoglobin (Hb)', 'HEMATOLOGY', 'LABORATORY', 150, '12-16 g/dL', 2.0, 18.0, 120, 'BLOOD', 'g/dL', true, false, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lab_tests WHERE test_code = 'LAB-HB-001');

INSERT INTO lab_tests (test_code, test_name, test_category, department, price, normal_range, critical_low, critical_high, turnaround_time, sample_type, unit, is_active, is_deleted, created_at)
SELECT 'LAB-GLU-001', 'Blood Glucose', 'BIOCHEMISTRY', 'LABORATORY', 100, '70-100 mg/dL', 40, 400, 60, 'BLOOD', 'mg/dL', true, false, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lab_tests WHERE test_code = 'LAB-GLU-001');

INSERT INTO lab_tests (test_code, test_name, test_category, department, price, normal_range, critical_low, critical_high, turnaround_time, sample_type, unit, is_active, is_deleted, created_at)
SELECT 'LAB-CREAT-001', 'Creatinine', 'BIOCHEMISTRY', 'LABORATORY', 200, '0.6-1.2 mg/dL', 0.3, 10.0, 180, 'SERUM', 'mg/dL', true, false, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lab_tests WHERE test_code = 'LAB-CREAT-001');

INSERT INTO lab_tests (test_code, test_name, test_category, department, price, normal_range, critical_low, critical_high, turnaround_time, sample_type, unit, is_active, is_deleted, created_at)
SELECT 'LAB-K-001', 'Potassium (K+)', 'BIOCHEMISTRY', 'LABORATORY', 150, '3.5-5.0 mEq/L', 2.5, 6.5, 120, 'SERUM', 'mEq/L', true, false, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lab_tests WHERE test_code = 'LAB-K-001');

-- Show updated lab tests
SELECT test_code, test_name, critical_low, critical_high, normal_range 
FROM lab_tests 
WHERE critical_low IS NOT NULL OR critical_high IS NOT NULL;
