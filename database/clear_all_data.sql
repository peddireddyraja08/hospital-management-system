-- ============================================================================
-- Clear All Data Script
-- Hospital Management System
-- ============================================================================
-- Purpose: Safely clear all existing data from the database
-- Usage: psql -U postgres -d hospital_management -f database/clear_all_data.sql
-- WARNING: This will DELETE ALL DATA. Use only for development/testing.
-- ============================================================================

BEGIN;

-- Disable triggers temporarily for faster deletion
SET session_replication_role = 'replica';

-- ============================================================================
-- Phase 1: Clear Relationship Tables (Foreign Key Dependencies)
-- ============================================================================

TRUNCATE TABLE lab_test_results CASCADE;
TRUNCATE TABLE lab_test_requests CASCADE;
TRUNCATE TABLE samples CASCADE;
TRUNCATE TABLE prescriptions CASCADE;
TRUNCATE TABLE bills CASCADE;
TRUNCATE TABLE appointments CASCADE;
TRUNCATE TABLE medical_records CASCADE;
TRUNCATE TABLE vital_signs CASCADE;
TRUNCATE TABLE physician_orders CASCADE;
TRUNCATE TABLE medication_inventory CASCADE;
TRUNCATE TABLE nurse_tasks CASCADE;
TRUNCATE TABLE discharge_summaries CASCADE;
TRUNCATE TABLE care_pathways CASCADE;
TRUNCATE TABLE clinical_scores CASCADE;
TRUNCATE TABLE admissions CASCADE;
TRUNCATE TABLE qc_runs CASCADE;
TRUNCATE TABLE critical_alerts CASCADE;

-- ============================================================================
-- Phase 2: Clear Entity Tables
-- ============================================================================

TRUNCATE TABLE beds CASCADE;
TRUNCATE TABLE medications CASCADE;
TRUNCATE TABLE lab_tests CASCADE;
TRUNCATE TABLE qc_materials CASCADE;
TRUNCATE TABLE doctors CASCADE;
TRUNCATE TABLE staff CASCADE;
TRUNCATE TABLE patients CASCADE;
TRUNCATE TABLE user_roles CASCADE;
TRUNCATE TABLE users CASCADE;

-- ============================================================================
-- Phase 3: Reset ID Counter Table
-- ============================================================================

TRUNCATE TABLE id_counter CASCADE;

-- ============================================================================
-- Phase 4: Reset PostgreSQL Sequences
-- ============================================================================

-- Reset sequences for all tables with BIGSERIAL primary keys
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE patients_id_seq RESTART WITH 1;
ALTER SEQUENCE doctors_id_seq RESTART WITH 1;
ALTER SEQUENCE staff_id_seq RESTART WITH 1;
ALTER SEQUENCE appointments_id_seq RESTART WITH 1;
ALTER SEQUENCE medical_records_id_seq RESTART WITH 1;
ALTER SEQUENCE vital_signs_id_seq RESTART WITH 1;
ALTER SEQUENCE physician_orders_id_seq RESTART WITH 1;
ALTER SEQUENCE lab_tests_id_seq RESTART WITH 1;
ALTER SEQUENCE lab_test_requests_id_seq RESTART WITH 1;
ALTER SEQUENCE lab_test_results_id_seq RESTART WITH 1;
ALTER SEQUENCE medications_id_seq RESTART WITH 1;
ALTER SEQUENCE medication_inventory_id_seq RESTART WITH 1;
ALTER SEQUENCE prescriptions_id_seq RESTART WITH 1;
ALTER SEQUENCE beds_id_seq RESTART WITH 1;
ALTER SEQUENCE bills_id_seq RESTART WITH 1;
ALTER SEQUENCE admissions_id_seq RESTART WITH 1;
ALTER SEQUENCE samples_id_seq RESTART WITH 1;
ALTER SEQUENCE nurse_tasks_id_seq RESTART WITH 1;
ALTER SEQUENCE discharge_summaries_id_seq RESTART WITH 1;
ALTER SEQUENCE care_pathways_id_seq RESTART WITH 1;
ALTER SEQUENCE clinical_scores_id_seq RESTART WITH 1;
ALTER SEQUENCE qc_materials_id_seq RESTART WITH 1;
ALTER SEQUENCE qc_runs_id_seq RESTART WITH 1;
ALTER SEQUENCE critical_alerts_id_seq RESTART WITH 1;
ALTER SEQUENCE id_counter_id_seq RESTART WITH 1;

-- Re-enable triggers
SET session_replication_role = 'origin';

COMMIT;

-- ============================================================================
-- Verification
-- ============================================================================

SELECT 
    'Data cleared successfully!' as status,
    (SELECT COUNT(*) FROM users) as users_count,
    (SELECT COUNT(*) FROM patients) as patients_count,
    (SELECT COUNT(*) FROM doctors) as doctors_count,
    (SELECT COUNT(*) FROM appointments) as appointments_count,
    (SELECT COUNT(*) FROM bills) as bills_count,
    (SELECT COUNT(*) FROM id_counter) as id_counter_count;

-- Expected: All counts should be 0
