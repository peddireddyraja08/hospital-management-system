-- Comprehensive Lab Tests Seed Data
-- Includes all major categories: Pathology, Biochemistry, Hematology, Microbiology, Radiology, and Cath Lab

BEGIN;

-- Clear existing lab test data
DELETE FROM lab_test_results;
DELETE FROM lab_test_requests;
DELETE FROM lab_tests;

-- Reset sequence
ALTER SEQUENCE lab_tests_id_seq RESTART WITH 1;

-- ============================================
-- PATHOLOGY TESTS
-- ============================================

INSERT INTO lab_tests (test_code, test_name, description, test_category, price, normal_range, unit, sample_type, sample_volume, sample_container, preparation_instructions, turnaround_time, department, method, requires_fasting, sample_required, result_type, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('LAB-20250207-0001', 'Complete Blood Count (CBC)', 'Comprehensive blood cell analysis including WBC, RBC, Hemoglobin, Hematocrit, Platelets', 'PATHOLOGY', 150.00, 'WBC: 4-11 K/uL, RBC: 4.5-5.5 M/uL, Hb: 13-17 g/dL, Platelet: 150-400 K/uL', 'cells/mcL', 'BLOOD', '3-5 mL', 'EDTA (Purple top)', 'No special preparation required', 2, 'Hematology', 'Automated Cell Counter', false, true, 'TEXT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0002', 'Erythrocyte Sedimentation Rate (ESR)', 'Non-specific marker of inflammation', 'PATHOLOGY', 80.00, 'Male: 0-15 mm/hr, Female: 0-20 mm/hr', 'mm/hr', 'BLOOD', '2 mL', 'EDTA (Purple top)', 'No fasting required', 1, 'Hematology', 'Westergren Method', false, true, 'NUMERIC', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0003', 'C-Reactive Protein (CRP)', 'Acute phase reactant for inflammation and infection', 'PATHOLOGY', 200.00, '<10 mg/L', 'mg/L', 'SERUM', '2 mL', 'Plain (Red top)', 'No special preparation', 2, 'Biochemistry', 'Immunoturbidimetry', false, true, 'NUMERIC', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0004', 'Urine Routine Examination', 'Microscopic and chemical analysis of urine', 'PATHOLOGY', 100.00, 'pH: 4.5-8.0, Specific Gravity: 1.005-1.030, No protein/glucose/blood', 'Various', 'URINE', '10-20 mL', 'Sterile Container', 'Collect first morning mid-stream urine', 2, 'Clinical Pathology', 'Dipstick + Microscopy', false, true, 'TEXT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0005', 'Stool Examination', 'Microscopic examination for parasites, ova, and occult blood', 'PATHOLOGY', 120.00, 'No parasites, ova, or occult blood', 'Qualitative', 'STOOL', '5-10 g', 'Stool Container', 'Collect fresh sample, avoid contamination', 3, 'Microbiology', 'Microscopy + Chemical', false, true, 'TEXT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- BIOCHEMISTRY TESTS
-- ============================================

INSERT INTO lab_tests (test_code, test_name, description, test_category, price, normal_range, normal_range_male, normal_range_female, unit, sample_type, sample_volume, sample_container, preparation_instructions, turnaround_time, critical_low, critical_high, department, method, requires_fasting, sample_required, result_type, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('LAB-20250207-0006', 'Blood Sugar Fasting (FBS)', 'Fasting blood glucose measurement', 'BIOCHEMISTRY', 80.00, '70-100 mg/dL', '70-100 mg/dL', '70-100 mg/dL', 'mg/dL', 'SERUM', '2 mL', 'Plain/Fluoride (Gray top)', '8-12 hours fasting required', 1, '40', '400', 'Biochemistry', 'Enzymatic Colorimetric', true, true, 'NUMERIC', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0007', 'Blood Sugar Post Prandial (PPBS)', 'Blood glucose 2 hours after meal', 'BIOCHEMISTRY', 80.00, '<140 mg/dL', '<140 mg/dL', '<140 mg/dL', 'mg/dL', 'SERUM', '2 mL', 'Plain/Fluoride (Gray top)', 'Measure 2 hours after normal meal', 1, '40', '400', 'Biochemistry', 'Enzymatic Colorimetric', false, true, 'NUMERIC', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0008', 'HbA1c (Glycated Hemoglobin)', '3-month average blood sugar control', 'BIOCHEMISTRY', 250.00, '<5.7%', '<5.7%', '<5.7%', '%', 'BLOOD', '2 mL', 'EDTA (Purple top)', 'No fasting required', 4, NULL, '10', 'Biochemistry', 'HPLC', false, true, 'NUMERIC', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0009', 'Lipid Profile', 'Comprehensive cholesterol and triglyceride analysis', 'BIOCHEMISTRY', 350.00, 'Total Cholesterol: <200, LDL: <100, HDL: >40, TG: <150', 'HDL: >40 mg/dL', 'HDL: >50 mg/dL', 'mg/dL', 'SERUM', '3 mL', 'Plain (Red top)', '12-14 hours fasting required', 4, NULL, 'Total Chol >300', 'Biochemistry', 'Enzymatic Colorimetric', true, true, 'TEXT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0010', 'Liver Function Test (LFT)', 'Panel of tests to assess liver health', 'BIOCHEMISTRY', 400.00, 'Bilirubin: 0.3-1.2, ALT: 7-56, AST: 10-40, ALP: 44-147, Albumin: 3.5-5.5', NULL, NULL, 'U/L, mg/dL, g/dL', 'SERUM', '3 mL', 'Plain (Red top)', '8-12 hours fasting preferred', 6, NULL, 'Bilirubin >20', 'Biochemistry', 'Enzymatic + Spectrophotometry', true, true, 'TEXT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0011', 'Kidney Function Test (KFT/RFT)', 'Panel to assess kidney function', 'BIOCHEMISTRY', 350.00, 'Creatinine: 0.6-1.2, Urea: 15-40, BUN: 7-20, Na: 135-145, K: 3.5-5.0', 'Creatinine: 0.7-1.3 mg/dL', 'Creatinine: 0.6-1.1 mg/dL', 'mg/dL, mEq/L', 'SERUM', '3 mL', 'Plain (Red top)', 'No special preparation', 6, 'K <2.5', 'K >6.5, Creatinine >10', 'Biochemistry', 'Enzymatic + ISE', false, true, 'TEXT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- HEMATOLOGY TESTS
-- ============================================

INSERT INTO lab_tests (test_code, test_name, description, test_category, price, normal_range, normal_range_male, normal_range_female, normal_range_child, unit, sample_type, sample_volume, sample_container, preparation_instructions, turnaround_time, critical_low, critical_high, department, method, requires_fasting, sample_required, result_type, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('LAB-20250207-0012', 'Hemoglobin (Hb)', 'Measures oxygen-carrying capacity of blood', 'HEMATOLOGY', 100.00, '13-17 g/dL', '13.5-17.5 g/dL', '12.0-15.5 g/dL', '11-13 g/dL', 'g/dL', 'BLOOD', '2 mL', 'EDTA (Purple top)', 'No special preparation', 1, '7', '20', 'Hematology', 'Automated Analyzer', false, true, 'NUMERIC', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0013', 'Platelet Count', 'Measures blood clotting cell count', 'HEMATOLOGY', 120.00, '150-400 K/uL', '150-400 K/uL', '150-400 K/uL', '150-450 K/uL', 'K/uL', 'BLOOD', '2 mL', 'EDTA (Purple top)', 'No special preparation', 1, '20', '1000', 'Hematology', 'Automated Cell Counter', false, true, 'NUMERIC', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0014', 'Coagulation Profile (PT/INR/APTT)', 'Blood clotting factor assessment', 'HEMATOLOGY', 300.00, 'PT: 11-13.5 sec, INR: 0.8-1.1, APTT: 25-35 sec', NULL, NULL, NULL, 'seconds', 'PLASMA', '3 mL', 'Sodium Citrate (Blue top)', 'No anticoagulants 24hrs before', 2, NULL, 'INR >5', 'Coagulation Lab', 'Automated Coagulometer', false, true, 'TEXT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- MICROBIOLOGY TESTS
-- ============================================

INSERT INTO lab_tests (test_code, test_name, description, test_category, price, normal_range, unit, sample_type, sample_volume, sample_container, preparation_instructions, turnaround_time, department, method, requires_fasting, sample_required, result_type, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('LAB-20250207-0015', 'Blood Culture', 'Detects bacteria/fungi in bloodstream', 'MICROBIOLOGY', 600.00, 'No growth', 'Qualitative', 'BLOOD', '5-10 mL', 'Blood Culture Bottle', 'Sterile technique, before antibiotics', 72, 'Microbiology', 'Automated Culture System', false, true, 'TEXT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0016', 'Urine Culture & Sensitivity', 'Identifies UTI pathogens and antibiotic sensitivity', 'MICROBIOLOGY', 400.00, 'No significant growth', 'CFU/mL', 'URINE', '5-10 mL', 'Sterile Container', 'Mid-stream clean-catch urine', 48, 'Microbiology', 'Culture + Disc Diffusion', false, true, 'TEXT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0017', 'Sputum Culture & AFB', 'Detects respiratory pathogens including TB', 'MICROBIOLOGY', 500.00, 'Normal flora, No AFB', 'Qualitative', 'SPUTUM', '5 mL', 'Sterile Sputum Container', 'Early morning deep cough sample', 72, 'Microbiology', 'Culture + Ziehl-Neelsen Staining', false, true, 'TEXT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0018', 'Wound Swab Culture & Sensitivity', 'Identifies wound infection organisms', 'MICROBIOLOGY', 450.00, 'Normal skin flora', 'Qualitative', 'SWAB', '1 swab', 'Swab in Transport Medium', 'Clean wound before swabbing', 48, 'Microbiology', 'Culture + Disc Diffusion', false, true, 'TEXT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- RADIOLOGY TESTS (Imaging)
-- ============================================

INSERT INTO lab_tests (test_code, test_name, description, test_category, price, normal_range, unit, sample_type, sample_volume, sample_container, preparation_instructions, turnaround_time, department, method, requires_fasting, sample_required, result_type, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('LAB-20250207-0019', 'X-Ray Chest (PA View)', 'Chest radiograph for lungs, heart, and bones', 'RADIOLOGY', 500.00, 'Normal chest anatomy', 'Image', NULL, NULL, NULL, 'Remove metal objects, jewelry', 1, 'Radiology', 'Digital Radiography', false, false, 'IMAGE', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0020', 'Ultrasound Abdomen', 'Sonographic examination of abdominal organs', 'RADIOLOGY', 800.00, 'Normal organ structure and size', 'Image', NULL, NULL, NULL, '6 hours fasting, full bladder', 1, 'Radiology', 'Ultrasonography', true, false, 'IMAGE', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0021', 'CT Scan Brain (Plain)', 'Computed tomography of brain', 'RADIOLOGY', 2500.00, 'No acute findings', 'Image', NULL, NULL, NULL, 'No special preparation', 2, 'Radiology', 'CT Scanner', false, false, 'IMAGE', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0022', 'MRI Brain', 'Magnetic resonance imaging of brain', 'RADIOLOGY', 5000.00, 'Normal brain structure', 'Image', NULL, NULL, NULL, 'Remove all metal, no pacemaker', 3, 'Radiology', 'MRI Scanner', false, false, 'IMAGE', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0023', 'Ultrasound Pelvis', 'Pelvic organ evaluation', 'RADIOLOGY', 900.00, 'Normal pelvic organs', 'Image', NULL, NULL, NULL, 'Full bladder required', 1, 'Radiology', 'Ultrasonography', false, false, 'IMAGE', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- CATH LAB PROCEDURES
-- ============================================

INSERT INTO lab_tests (test_code, test_name, description, test_category, price, normal_range, unit, sample_type, sample_volume, sample_container, preparation_instructions, turnaround_time, department, method, requires_fasting, sample_required, result_type, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('LAB-20250207-0024', 'Coronary Angiography', 'Diagnostic imaging of coronary arteries', 'CATH_LAB', 15000.00, 'Normal coronary anatomy', 'Report', NULL, NULL, NULL, '6-8 hours fasting, IV line, consent', 2, 'Cath Lab', 'Fluoroscopy with Contrast', true, false, 'REPORT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0025', 'Coronary Angioplasty (PTCA)', 'Percutaneous coronary intervention with balloon', 'CATH_LAB', 50000.00, 'Successful revascularization', 'Procedure', NULL, NULL, NULL, '6-8 hours fasting, IV line, consent, pre-procedure tests', 3, 'Cath Lab', 'Percutaneous Intervention', true, false, 'REPORT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0026', 'Coronary Stent Deployment', 'Placement of coronary artery stent', 'CATH_LAB', 80000.00, 'Successful stent placement', 'Procedure', NULL, NULL, NULL, '6-8 hours fasting, IV access, antiplatelet therapy', 3, 'Cath Lab', 'Percutaneous Stenting', true, false, 'REPORT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0027', 'Permanent Pacemaker Implantation', 'Implantation of cardiac pacemaker', 'CATH_LAB', 150000.00, 'Normal pacemaker function', 'Procedure', NULL, NULL, NULL, '6 hours fasting, IV line, consent, ECG', 4, 'Cath Lab', 'Device Implantation', true, false, 'REPORT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0028', 'Electrophysiology Study (EPS)', 'Diagnostic cardiac rhythm assessment', 'CATH_LAB', 25000.00, 'Normal conduction pathways', 'Report', NULL, NULL, NULL, '6 hours fasting, IV access, consent', 3, 'Cath Lab', 'Intracardiac Recording', true, false, 'REPORT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0029', 'Left Heart Catheterization', 'Assessment of left ventricular function', 'CATH_LAB', 12000.00, 'Normal LV function', 'Report', NULL, NULL, NULL, '6 hours fasting, IV line, consent', 2, 'Cath Lab', 'Cardiac Catheterization', true, false, 'REPORT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0030', 'Right Heart Catheterization', 'Hemodynamic assessment of right heart', 'CATH_LAB', 12000.00, 'Normal right heart pressures', 'Report', NULL, NULL, NULL, '6 hours fasting, IV access, consent', 2, 'Cath Lab', 'Cardiac Catheterization', true, false, 'REPORT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- ADDITIONAL COMMON TESTS
-- ============================================

INSERT INTO lab_tests (test_code, test_name, description, test_category, price, normal_range, unit, sample_type, sample_volume, sample_container, preparation_instructions, turnaround_time, department, method, requires_fasting, sample_required, result_type, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('LAB-20250207-0031', 'Serum Electrolytes', 'Sodium, Potassium, Chloride, Bicarbonate', 'BIOCHEMISTRY', 250.00, 'Na: 135-145, K: 3.5-5.0, Cl: 98-107, HCO3: 22-29', 'mEq/L', 'SERUM', '2 mL', 'Plain (Red top)', 'No special preparation', 2, 'Biochemistry', 'Ion Selective Electrode', false, true, 'TEXT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0032', 'Thyroid Function Test (TFT)', 'TSH, T3, T4 assessment', 'BIOCHEMISTRY', 500.00, 'TSH: 0.5-5.0 mIU/L, T3: 80-200 ng/dL, T4: 5-12 ug/dL', 'Various', 'SERUM', '3 mL', 'Plain (Red top)', 'Morning sample preferred', 6, 'Biochemistry', 'Chemiluminescence', false, true, 'TEXT', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0033', 'Cardiac Enzymes (Troponin I)', 'Myocardial injury marker', 'BIOCHEMISTRY', 400.00, '<0.04 ng/mL', 'ng/mL', 'SERUM', '2 mL', 'Plain (Red top)', 'No special preparation', 1, 'Biochemistry', 'Immunoassay', false, true, 'NUMERIC', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0034', 'D-Dimer', 'Thrombosis and fibrinolysis marker', 'HEMATOLOGY', 350.00, '<500 ng/mL', 'ng/mL', 'PLASMA', '2 mL', 'Sodium Citrate (Blue top)', 'No special preparation', 2, 'Coagulation', 'Immunoturbidimetry', false, true, 'NUMERIC', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    
    ('LAB-20250207-0035', 'Serum Calcium', 'Calcium level measurement', 'BIOCHEMISTRY', 120.00, '8.5-10.5 mg/dL', 'mg/dL', 'SERUM', '2 mL', 'Plain (Red top)', 'No special preparation', 2, 'Biochemistry', 'Colorimetric', false, true, 'NUMERIC', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

COMMIT;

-- Display summary
SELECT 
    'Lab Tests Seed Data Created Successfully!' as message,
    (SELECT COUNT(*) FROM lab_tests WHERE test_category = 'PATHOLOGY') as pathology_tests,
    (SELECT COUNT(*) FROM lab_tests WHERE test_category = 'BIOCHEMISTRY') as biochemistry_tests,
    (SELECT COUNT(*) FROM lab_tests WHERE test_category = 'HEMATOLOGY') as hematology_tests,
    (SELECT COUNT(*) FROM lab_tests WHERE test_category = 'MICROBIOLOGY') as microbiology_tests,
    (SELECT COUNT(*) FROM lab_tests WHERE test_category = 'RADIOLOGY') as radiology_tests,
    (SELECT COUNT(*) FROM lab_tests WHERE test_category = 'CATH_LAB') as cath_lab_procedures,
    (SELECT COUNT(*) FROM lab_tests) as total_tests;
