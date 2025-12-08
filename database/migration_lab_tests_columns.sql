-- Migration to add new columns to lab_tests table
-- This adds support for comprehensive lab test management

BEGIN;

-- Add new columns to lab_tests table
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS normal_range_male VARCHAR(100);
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS normal_range_female VARCHAR(100);
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS normal_range_child VARCHAR(100);
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS sample_type VARCHAR(100);
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS sample_volume VARCHAR(50);
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS sample_container VARCHAR(100);
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS critical_low VARCHAR(50);
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS critical_high VARCHAR(50);
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS is_profile BOOLEAN DEFAULT FALSE;
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS profile_tests TEXT;
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS method VARCHAR(200);
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS requires_fasting BOOLEAN DEFAULT FALSE;
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS sample_required BOOLEAN DEFAULT TRUE;
ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS result_type VARCHAR(50) DEFAULT 'NUMERIC';

-- Update existing records to have default values
UPDATE lab_tests SET sample_required = TRUE WHERE sample_required IS NULL;
UPDATE lab_tests SET result_type = 'NUMERIC' WHERE result_type IS NULL;
UPDATE lab_tests SET is_profile = FALSE WHERE is_profile IS NULL;
UPDATE lab_tests SET requires_fasting = FALSE WHERE requires_fasting IS NULL;

COMMIT;

-- Display confirmation
SELECT 
    'Migration completed successfully!' as message,
    COUNT(*) as existing_lab_tests
FROM lab_tests;
