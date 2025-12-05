-- Hospital Management System - QC Materials Seed Data (Version 2)
-- Uses existing lab tests from the database
-- Run: psql -U postgres -d hospital_management -f qc_materials_seed_v2.sql

-- Get lab test IDs
DO $$
DECLARE
    cbc_test_id BIGINT;
    urine_test_id BIGINT;
BEGIN
    -- Get existing test IDs
    SELECT id INTO cbc_test_id FROM lab_tests WHERE test_name = 'CBP' LIMIT 1;
    SELECT id INTO urine_test_id FROM lab_tests WHERE test_name = 'Urine test' LIMIT 1;

    -- Insert QC Materials for CBC Test
    INSERT INTO qc_materials (
        id, created_at, created_by, is_active, is_deleted, updated_at, updated_by,
        description, expiry_date, level, lot_number, manufacturer, material_name,
        mean_value, preparation_instructions, std_deviation, storage_conditions,
        target_value, unit, lab_test_id
    ) VALUES
    -- CBP Level 1 (Low)
    (
        nextval('qc_materials_id_seq'), NOW(), 'admin', true, false, NOW(), 'admin',
        'Low-level hematology control for complete blood count',
        '2025-12-31', 'LEVEL_1', 'HEM-L1-2024-12345', 'Bio-Rad Laboratories',
        'Hematology Control Level 1', 4.5, 
        'Allow to reach room temperature (20-25°C) for 30 minutes before use. Mix by gentle inversion 8-10 times.',
        0.15, 'Store at 2-8°C. Do not freeze.', 4.5, '10^6/μL', cbc_test_id
    ),
    -- CBP Level 2 (Normal)
    (
        nextval('qc_materials_id_seq'), NOW(), 'admin', true, false, NOW(), 'admin',
        'Normal-level hematology control for complete blood count',
        '2025-12-31', 'LEVEL_2', 'HEM-L2-2024-12346', 'Bio-Rad Laboratories',
        'Hematology Control Level 2', 7.5,
        'Allow to reach room temperature (20-25°C) for 30 minutes before use. Mix by gentle inversion 8-10 times.',
        0.25, 'Store at 2-8°C. Do not freeze.', 7.5, '10^6/μL', cbc_test_id
    ),
    -- CBP Level 3 (High)
    (
        nextval('qc_materials_id_seq'), NOW(), 'admin', true, false, NOW(), 'admin',
        'High-level hematology control for complete blood count',
        '2025-12-31', 'LEVEL_3', 'HEM-L3-2024-12347', 'Bio-Rad Laboratories',
        'Hematology Control Level 3', 12.5,
        'Allow to reach room temperature (20-25°C) for 30 minutes before use. Mix by gentle inversion 8-10 times.',
        0.40, 'Store at 2-8°C. Do not freeze.', 12.5, '10^6/μL', cbc_test_id
    );

    -- Insert QC Materials for Urine Test
    INSERT INTO qc_materials (
        id, created_at, created_by, is_active, is_deleted, updated_at, updated_by,
        description, expiry_date, level, lot_number, manufacturer, material_name,
        mean_value, preparation_instructions, std_deviation, storage_conditions,
        target_value, unit, lab_test_id
    ) VALUES
    -- Urine Test Level 1 (Low)
    (
        nextval('qc_materials_id_seq'), NOW(), 'admin', true, false, NOW(), 'admin',
        'Low-level urine chemistry control',
        '2026-06-30', 'LEVEL_1', 'URI-L1-2024-56789', 'Roche Diagnostics',
        'Urine Chemistry Control Level 1', 50.0,
        'Mix well before use. Do not shake vigorously. Use within 30 days after opening.',
        2.5, 'Store at 2-8°C. Stable for 30 days after opening when stored properly.', 
        50.0, 'mg/dL', urine_test_id
    ),
    -- Urine Test Level 2 (Normal)
    (
        nextval('qc_materials_id_seq'), NOW(), 'admin', true, false, NOW(), 'admin',
        'Normal-level urine chemistry control',
        '2026-06-30', 'LEVEL_2', 'URI-L2-2024-56790', 'Roche Diagnostics',
        'Urine Chemistry Control Level 2', 100.0,
        'Mix well before use. Do not shake vigorously. Use within 30 days after opening.',
        3.5, 'Store at 2-8°C. Stable for 30 days after opening when stored properly.',
        100.0, 'mg/dL', urine_test_id
    ),
    -- Urine Test Level 3 (High)
    (
        nextval('qc_materials_id_seq'), NOW(), 'admin', true, false, NOW(), 'admin',
        'High-level urine chemistry control',
        '2026-06-30', 'LEVEL_3', 'URI-L3-2024-56791', 'Roche Diagnostics',
        'Urine Chemistry Control Level 3', 200.0,
        'Mix well before use. Do not shake vigorously. Use within 30 days after opening.',
        8.0, 'Store at 2-8°C. Stable for 30 days after opening when stored properly.',
        200.0, 'mg/dL', urine_test_id
    ),
    -- Expiring Soon Sample (for testing)
    (
        nextval('qc_materials_id_seq'), NOW(), 'admin', true, false, NOW(), 'admin',
        'Sample control material expiring soon - for testing expiry warnings',
        (CURRENT_DATE + INTERVAL '30 days')::DATE, 'LEVEL_2', 'EXP-SOON-2024-99999', 'Test Manufacturer',
        'Expiring Soon Control Sample', 8.0,
        'Standard preparation.', 0.3, 'Store at 2-8°C.', 8.0, '10^6/μL', cbc_test_id
    ),
    -- Expired Sample (for testing)
    (
        nextval('qc_materials_id_seq'), NOW(), 'admin', false, false, NOW(), 'admin',
        'Sample control material already expired - for testing expired materials display',
        '2024-11-30', 'LEVEL_1', 'EXP-PAST-2023-88888', 'Test Manufacturer',
        'Expired Control Sample', 20.0,
        'Standard preparation.', 1.0, 'Store at 2-8°C.', 20.0, 'U/L', urine_test_id
    );

    RAISE NOTICE '✅ Successfully inserted % QC materials', (SELECT COUNT(*) FROM qc_materials);
END $$;

-- Verify the inserted data
SELECT 
    qc.id,
    lt.test_name as "Test",
    qc.material_name as "Material",
    qc.lot_number as "Lot Number",
    qc.level as "Level",
    qc.mean_value as "Mean",
    qc.std_deviation as "SD",
    qc.expiry_date as "Expiry",
    qc.manufacturer as "Manufacturer"
FROM qc_materials qc
LEFT JOIN lab_tests lt ON qc.lab_test_id = lt.id
ORDER BY lt.test_name, qc.level;
