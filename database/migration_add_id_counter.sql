-- Migration Script: Add ID Counter Table
-- Hospital Management System - ID Generation Refactoring
-- Date: 2025-02-07
-- 
-- This script adds the id_counter table for centralized sequential ID generation.
-- Safe to run on existing databases - will not affect existing data.

-- Create id_counter table
CREATE TABLE IF NOT EXISTS id_counter (
    id BIGSERIAL PRIMARY KEY,
    module_prefix VARCHAR(10) NOT NULL,
    date_key VARCHAR(8) NOT NULL,
    last_sequence INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(module_prefix, date_key)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_id_counter_module_date ON id_counter(module_prefix, date_key);

-- Insert initial counters for current date (optional - will be auto-created on first use)
-- Uncomment the following lines if you want to pre-populate counters
/*
INSERT INTO id_counter (module_prefix, date_key, last_sequence, created_at, updated_at)
VALUES 
    ('PAT', to_char(CURRENT_DATE, 'YYYYMMDD'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('IN', to_char(CURRENT_DATE, 'YYYYMMDD'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('OUT', to_char(CURRENT_DATE, 'YYYYMMDD'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('DOC', to_char(CURRENT_DATE, 'YYYYMMDD'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('STF', to_char(CURRENT_DATE, 'YYYYMMDD'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('LAB', to_char(CURRENT_DATE, 'YYYYMMDD'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('MED', to_char(CURRENT_DATE, 'YYYYMMDD'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('BILL', to_char(CURRENT_DATE, 'YYYYMMDD'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ADM', to_char(CURRENT_DATE, 'YYYYMMDD'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('SAMP', to_char(CURRENT_DATE, 'YYYYMMDD'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (module_prefix, date_key) DO NOTHING;
*/

-- Verification query
SELECT 
    'id_counter table created successfully' as status,
    COUNT(*) as initial_counter_count
FROM id_counter;

-- Expected result: status = "id_counter table created successfully", initial_counter_count = 0 (or 10 if uncommented above)

COMMIT;

-- NOTES:
-- 1. Existing data is NOT affected - old IDs remain unchanged
-- 2. New records will use the new ID format: PREFIX-YYYYMMDD-XXXX
-- 3. Counters auto-create on first use per module per day
-- 4. No manual intervention needed after running this script
-- 5. Backend must be restarted after applying this migration
