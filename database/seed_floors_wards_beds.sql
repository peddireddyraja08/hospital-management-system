-- Hospital Floors, Wards, and Beds Seed Data
-- Total: 5 Floors, 12 Wards, 133 Beds

BEGIN;

-- Clear existing data
DELETE FROM beds;
DELETE FROM wards;
DELETE FROM floors;

-- Reset sequences
ALTER SEQUENCE floors_id_seq RESTART WITH 1;
ALTER SEQUENCE wards_id_seq RESTART WITH 1;
ALTER SEQUENCE beds_id_seq RESTART WITH 1;

-- ============================================
-- INSERT FLOORS
-- ============================================

INSERT INTO floors (floor_number, floor_name, total_beds, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    (1, 'Floor 1 - General, Emergency, Isolation', 35, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    (2, 'Floor 2 - Twin-Share, Private, Special', 26, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    (3, 'Floor 3 - Deluxe, Pediatric, Maternity', 30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    (4, 'Floor 4 - Recovery, Pre-Op', 18, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    (5, 'Floor 5 - ICU, CCU, HDU', 24, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- INSERT WARDS
-- ============================================

-- Floor 1 Wards
INSERT INTO wards (ward_name, floor_id, ward_type, total_beds, available_beds, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('General', (SELECT id FROM floors WHERE floor_number = 1), 'GENERAL', 20, 20, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('Emergency', (SELECT id FROM floors WHERE floor_number = 1), 'EMERGENCY', 10, 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('Isolation', (SELECT id FROM floors WHERE floor_number = 1), 'ISOLATION', 5, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Floor 2 Wards
INSERT INTO wards (ward_name, floor_id, ward_type, total_beds, available_beds, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('Twin-Share', (SELECT id FROM floors WHERE floor_number = 2), 'SEMI_PRIVATE', 10, 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('Private', (SELECT id FROM floors WHERE floor_number = 2), 'PRIVATE', 10, 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('Special', (SELECT id FROM floors WHERE floor_number = 2), 'SPECIAL', 6, 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Floor 3 Wards
INSERT INTO wards (ward_name, floor_id, ward_type, total_beds, available_beds, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('Deluxe', (SELECT id FROM floors WHERE floor_number = 3), 'DELUXE', 10, 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('Pediatric', (SELECT id FROM floors WHERE floor_number = 3), 'PEDIATRIC', 8, 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('Maternity', (SELECT id FROM floors WHERE floor_number = 3), 'MATERNITY', 12, 12, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Floor 4 Wards
INSERT INTO wards (ward_name, floor_id, ward_type, total_beds, available_beds, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('Recovery', (SELECT id FROM floors WHERE floor_number = 4), 'RECOVERY', 12, 12, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('Pre-Op', (SELECT id FROM floors WHERE floor_number = 4), 'PRE_OP', 6, 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Floor 5 Wards
INSERT INTO wards (ward_name, floor_id, ward_type, total_beds, available_beds, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('ICU', (SELECT id FROM floors WHERE floor_number = 5), 'ICU', 8, 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('CCU', (SELECT id FROM floors WHERE floor_number = 5), 'CCU', 6, 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU', (SELECT id FROM floors WHERE floor_number = 5), 'HDU', 10, 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- INSERT BEDS - FLOOR 1 (35 beds)
-- ============================================

-- General Ward: 20 beds (G01–G20)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('G01', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G02', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G03', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G04', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G05', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G06', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G07', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G08', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G09', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G10', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G11', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G12', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G13', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G14', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G15', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G16', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G17', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G18', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G19', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G20', (SELECT id FROM wards WHERE ward_name = 'General'), 'GENERAL', 'AVAILABLE', 500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Emergency Ward: 10 beds (E01–E10)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('E01', (SELECT id FROM wards WHERE ward_name = 'Emergency'), 'EMERGENCY', 'AVAILABLE', 800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E02', (SELECT id FROM wards WHERE ward_name = 'Emergency'), 'EMERGENCY', 'AVAILABLE', 800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E03', (SELECT id FROM wards WHERE ward_name = 'Emergency'), 'EMERGENCY', 'AVAILABLE', 800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E04', (SELECT id FROM wards WHERE ward_name = 'Emergency'), 'EMERGENCY', 'AVAILABLE', 800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E05', (SELECT id FROM wards WHERE ward_name = 'Emergency'), 'EMERGENCY', 'AVAILABLE', 800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E06', (SELECT id FROM wards WHERE ward_name = 'Emergency'), 'EMERGENCY', 'AVAILABLE', 800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E07', (SELECT id FROM wards WHERE ward_name = 'Emergency'), 'EMERGENCY', 'AVAILABLE', 800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E08', (SELECT id FROM wards WHERE ward_name = 'Emergency'), 'EMERGENCY', 'AVAILABLE', 800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E09', (SELECT id FROM wards WHERE ward_name = 'Emergency'), 'EMERGENCY', 'AVAILABLE', 800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E10', (SELECT id FROM wards WHERE ward_name = 'Emergency'), 'EMERGENCY', 'AVAILABLE', 800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Isolation Ward: 5 beds (I01–I05)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('I01', (SELECT id FROM wards WHERE ward_name = 'Isolation'), 'ISOLATION', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('I02', (SELECT id FROM wards WHERE ward_name = 'Isolation'), 'ISOLATION', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('I03', (SELECT id FROM wards WHERE ward_name = 'Isolation'), 'ISOLATION', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('I04', (SELECT id FROM wards WHERE ward_name = 'Isolation'), 'ISOLATION', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('I05', (SELECT id FROM wards WHERE ward_name = 'Isolation'), 'ISOLATION', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- INSERT BEDS - FLOOR 2 (26 beds)
-- ============================================

-- Twin-Share Ward: 10 beds (TS01–TS10)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('TS01', (SELECT id FROM wards WHERE ward_name = 'Twin-Share'), 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS02', (SELECT id FROM wards WHERE ward_name = 'Twin-Share'), 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS03', (SELECT id FROM wards WHERE ward_name = 'Twin-Share'), 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS04', (SELECT id FROM wards WHERE ward_name = 'Twin-Share'), 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS05', (SELECT id FROM wards WHERE ward_name = 'Twin-Share'), 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS06', (SELECT id FROM wards WHERE ward_name = 'Twin-Share'), 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS07', (SELECT id FROM wards WHERE ward_name = 'Twin-Share'), 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS08', (SELECT id FROM wards WHERE ward_name = 'Twin-Share'), 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS09', (SELECT id FROM wards WHERE ward_name = 'Twin-Share'), 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS10', (SELECT id FROM wards WHERE ward_name = 'Twin-Share'), 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Private Ward: 10 beds (PR01–PR10)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('PR01', (SELECT id FROM wards WHERE ward_name = 'Private'), 'PRIVATE', 'AVAILABLE', 2000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR02', (SELECT id FROM wards WHERE ward_name = 'Private'), 'PRIVATE', 'AVAILABLE', 2000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR03', (SELECT id FROM wards WHERE ward_name = 'Private'), 'PRIVATE', 'AVAILABLE', 2000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR04', (SELECT id FROM wards WHERE ward_name = 'Private'), 'PRIVATE', 'AVAILABLE', 2000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR05', (SELECT id FROM wards WHERE ward_name = 'Private'), 'PRIVATE', 'AVAILABLE', 2000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR06', (SELECT id FROM wards WHERE ward_name = 'Private'), 'PRIVATE', 'AVAILABLE', 2000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR07', (SELECT id FROM wards WHERE ward_name = 'Private'), 'PRIVATE', 'AVAILABLE', 2000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR08', (SELECT id FROM wards WHERE ward_name = 'Private'), 'PRIVATE', 'AVAILABLE', 2000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR09', (SELECT id FROM wards WHERE ward_name = 'Private'), 'PRIVATE', 'AVAILABLE', 2000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR10', (SELECT id FROM wards WHERE ward_name = 'Private'), 'PRIVATE', 'AVAILABLE', 2000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Special Ward: 6 beds (SP01–SP06)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('SP01', (SELECT id FROM wards WHERE ward_name = 'Special'), 'SPECIAL', 'AVAILABLE', 2500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('SP02', (SELECT id FROM wards WHERE ward_name = 'Special'), 'SPECIAL', 'AVAILABLE', 2500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('SP03', (SELECT id FROM wards WHERE ward_name = 'Special'), 'SPECIAL', 'AVAILABLE', 2500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('SP04', (SELECT id FROM wards WHERE ward_name = 'Special'), 'SPECIAL', 'AVAILABLE', 2500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('SP05', (SELECT id FROM wards WHERE ward_name = 'Special'), 'SPECIAL', 'AVAILABLE', 2500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('SP06', (SELECT id FROM wards WHERE ward_name = 'Special'), 'SPECIAL', 'AVAILABLE', 2500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- INSERT BEDS - FLOOR 3 (30 beds)
-- ============================================

-- Deluxe Ward: 10 beds (DR01–DR10)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('DR01', (SELECT id FROM wards WHERE ward_name = 'Deluxe'), 'DELUXE', 'AVAILABLE', 3500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR02', (SELECT id FROM wards WHERE ward_name = 'Deluxe'), 'DELUXE', 'AVAILABLE', 3500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR03', (SELECT id FROM wards WHERE ward_name = 'Deluxe'), 'DELUXE', 'AVAILABLE', 3500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR04', (SELECT id FROM wards WHERE ward_name = 'Deluxe'), 'DELUXE', 'AVAILABLE', 3500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR05', (SELECT id FROM wards WHERE ward_name = 'Deluxe'), 'DELUXE', 'AVAILABLE', 3500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR06', (SELECT id FROM wards WHERE ward_name = 'Deluxe'), 'DELUXE', 'AVAILABLE', 3500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR07', (SELECT id FROM wards WHERE ward_name = 'Deluxe'), 'DELUXE', 'AVAILABLE', 3500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR08', (SELECT id FROM wards WHERE ward_name = 'Deluxe'), 'DELUXE', 'AVAILABLE', 3500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR09', (SELECT id FROM wards WHERE ward_name = 'Deluxe'), 'DELUXE', 'AVAILABLE', 3500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR10', (SELECT id FROM wards WHERE ward_name = 'Deluxe'), 'DELUXE', 'AVAILABLE', 3500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Pediatric Ward: 8 beds (P01–P08)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('P01', (SELECT id FROM wards WHERE ward_name = 'Pediatric'), 'PEDIATRIC', 'AVAILABLE', 1800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P02', (SELECT id FROM wards WHERE ward_name = 'Pediatric'), 'PEDIATRIC', 'AVAILABLE', 1800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P03', (SELECT id FROM wards WHERE ward_name = 'Pediatric'), 'PEDIATRIC', 'AVAILABLE', 1800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P04', (SELECT id FROM wards WHERE ward_name = 'Pediatric'), 'PEDIATRIC', 'AVAILABLE', 1800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P05', (SELECT id FROM wards WHERE ward_name = 'Pediatric'), 'PEDIATRIC', 'AVAILABLE', 1800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P06', (SELECT id FROM wards WHERE ward_name = 'Pediatric'), 'PEDIATRIC', 'AVAILABLE', 1800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P07', (SELECT id FROM wards WHERE ward_name = 'Pediatric'), 'PEDIATRIC', 'AVAILABLE', 1800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P08', (SELECT id FROM wards WHERE ward_name = 'Pediatric'), 'PEDIATRIC', 'AVAILABLE', 1800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Maternity Ward: 12 beds (M01–M12)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('M01', (SELECT id FROM wards WHERE ward_name = 'Maternity'), 'MATERNITY', 'AVAILABLE', 2200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M02', (SELECT id FROM wards WHERE ward_name = 'Maternity'), 'MATERNITY', 'AVAILABLE', 2200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M03', (SELECT id FROM wards WHERE ward_name = 'Maternity'), 'MATERNITY', 'AVAILABLE', 2200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M04', (SELECT id FROM wards WHERE ward_name = 'Maternity'), 'MATERNITY', 'AVAILABLE', 2200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M05', (SELECT id FROM wards WHERE ward_name = 'Maternity'), 'MATERNITY', 'AVAILABLE', 2200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M06', (SELECT id FROM wards WHERE ward_name = 'Maternity'), 'MATERNITY', 'AVAILABLE', 2200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M07', (SELECT id FROM wards WHERE ward_name = 'Maternity'), 'MATERNITY', 'AVAILABLE', 2200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M08', (SELECT id FROM wards WHERE ward_name = 'Maternity'), 'MATERNITY', 'AVAILABLE', 2200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M09', (SELECT id FROM wards WHERE ward_name = 'Maternity'), 'MATERNITY', 'AVAILABLE', 2200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M10', (SELECT id FROM wards WHERE ward_name = 'Maternity'), 'MATERNITY', 'AVAILABLE', 2200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M11', (SELECT id FROM wards WHERE ward_name = 'Maternity'), 'MATERNITY', 'AVAILABLE', 2200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M12', (SELECT id FROM wards WHERE ward_name = 'Maternity'), 'MATERNITY', 'AVAILABLE', 2200.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- INSERT BEDS - FLOOR 4 (18 beds)
-- ============================================

-- Recovery Ward: 12 beds (R01–R12)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('R01', (SELECT id FROM wards WHERE ward_name = 'Recovery'), 'RECOVERY', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R02', (SELECT id FROM wards WHERE ward_name = 'Recovery'), 'RECOVERY', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R03', (SELECT id FROM wards WHERE ward_name = 'Recovery'), 'RECOVERY', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R04', (SELECT id FROM wards WHERE ward_name = 'Recovery'), 'RECOVERY', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R05', (SELECT id FROM wards WHERE ward_name = 'Recovery'), 'RECOVERY', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R06', (SELECT id FROM wards WHERE ward_name = 'Recovery'), 'RECOVERY', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R07', (SELECT id FROM wards WHERE ward_name = 'Recovery'), 'RECOVERY', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R08', (SELECT id FROM wards WHERE ward_name = 'Recovery'), 'RECOVERY', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R09', (SELECT id FROM wards WHERE ward_name = 'Recovery'), 'RECOVERY', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R10', (SELECT id FROM wards WHERE ward_name = 'Recovery'), 'RECOVERY', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R11', (SELECT id FROM wards WHERE ward_name = 'Recovery'), 'RECOVERY', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R12', (SELECT id FROM wards WHERE ward_name = 'Recovery'), 'RECOVERY', 'AVAILABLE', 1500.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Pre-Op Ward: 6 beds (PRE01–PRE06)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('PRE01', (SELECT id FROM wards WHERE ward_name = 'Pre-Op'), 'PRE_OP', 'AVAILABLE', 1000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PRE02', (SELECT id FROM wards WHERE ward_name = 'Pre-Op'), 'PRE_OP', 'AVAILABLE', 1000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PRE03', (SELECT id FROM wards WHERE ward_name = 'Pre-Op'), 'PRE_OP', 'AVAILABLE', 1000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PRE04', (SELECT id FROM wards WHERE ward_name = 'Pre-Op'), 'PRE_OP', 'AVAILABLE', 1000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PRE05', (SELECT id FROM wards WHERE ward_name = 'Pre-Op'), 'PRE_OP', 'AVAILABLE', 1000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PRE06', (SELECT id FROM wards WHERE ward_name = 'Pre-Op'), 'PRE_OP', 'AVAILABLE', 1000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- INSERT BEDS - FLOOR 5 (24 beds)
-- ============================================

-- ICU Ward: 8 beds (ICU01–ICU08)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('ICU01', (SELECT id FROM wards WHERE ward_name = 'ICU'), 'ICU', 'AVAILABLE', 5000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU02', (SELECT id FROM wards WHERE ward_name = 'ICU'), 'ICU', 'AVAILABLE', 5000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU03', (SELECT id FROM wards WHERE ward_name = 'ICU'), 'ICU', 'AVAILABLE', 5000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU04', (SELECT id FROM wards WHERE ward_name = 'ICU'), 'ICU', 'AVAILABLE', 5000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU05', (SELECT id FROM wards WHERE ward_name = 'ICU'), 'ICU', 'AVAILABLE', 5000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU06', (SELECT id FROM wards WHERE ward_name = 'ICU'), 'ICU', 'AVAILABLE', 5000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU07', (SELECT id FROM wards WHERE ward_name = 'ICU'), 'ICU', 'AVAILABLE', 5000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU08', (SELECT id FROM wards WHERE ward_name = 'ICU'), 'ICU', 'AVAILABLE', 5000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- CCU Ward: 6 beds (CC01–CC06)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('CC01', (SELECT id FROM wards WHERE ward_name = 'CCU'), 'CCU', 'AVAILABLE', 6000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('CC02', (SELECT id FROM wards WHERE ward_name = 'CCU'), 'CCU', 'AVAILABLE', 6000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('CC03', (SELECT id FROM wards WHERE ward_name = 'CCU'), 'CCU', 'AVAILABLE', 6000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('CC04', (SELECT id FROM wards WHERE ward_name = 'CCU'), 'CCU', 'AVAILABLE', 6000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('CC05', (SELECT id FROM wards WHERE ward_name = 'CCU'), 'CCU', 'AVAILABLE', 6000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('CC06', (SELECT id FROM wards WHERE ward_name = 'CCU'), 'CCU', 'AVAILABLE', 6000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- HDU Ward: 10 beds (HDU01–HDU10)
INSERT INTO beds (bed_number, ward_id, bed_type, bed_status, daily_charge, is_active, created_at, updated_at, created_by, updated_by)
VALUES 
    ('HDU01', (SELECT id FROM wards WHERE ward_name = 'HDU'), 'HDU', 'AVAILABLE', 4000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU02', (SELECT id FROM wards WHERE ward_name = 'HDU'), 'HDU', 'AVAILABLE', 4000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU03', (SELECT id FROM wards WHERE ward_name = 'HDU'), 'HDU', 'AVAILABLE', 4000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU04', (SELECT id FROM wards WHERE ward_name = 'HDU'), 'HDU', 'AVAILABLE', 4000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU05', (SELECT id FROM wards WHERE ward_name = 'HDU'), 'HDU', 'AVAILABLE', 4000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU06', (SELECT id FROM wards WHERE ward_name = 'HDU'), 'HDU', 'AVAILABLE', 4000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU07', (SELECT id FROM wards WHERE ward_name = 'HDU'), 'HDU', 'AVAILABLE', 4000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU08', (SELECT id FROM wards WHERE ward_name = 'HDU'), 'HDU', 'AVAILABLE', 4000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU09', (SELECT id FROM wards WHERE ward_name = 'HDU'), 'HDU', 'AVAILABLE', 4000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU10', (SELECT id FROM wards WHERE ward_name = 'HDU'), 'HDU', 'AVAILABLE', 4000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

COMMIT;

-- ============================================
-- VERIFICATION SUMMARY
-- ============================================

SELECT 
    'Data Seed Completed Successfully!' as message,
    (SELECT COUNT(*) FROM floors) as total_floors,
    (SELECT COUNT(*) FROM wards) as total_wards,
    (SELECT COUNT(*) FROM beds) as total_beds,
    (SELECT COUNT(*) FROM beds WHERE bed_status = 'AVAILABLE') as available_beds;

-- Detailed breakdown by floor
SELECT 
    f.floor_number,
    f.floor_name,
    COUNT(DISTINCT w.id) as wards_count,
    COUNT(b.id) as beds_count
FROM floors f
LEFT JOIN wards w ON w.floor_id = f.id
LEFT JOIN beds b ON b.ward_id = w.id
GROUP BY f.id, f.floor_number, f.floor_name
ORDER BY f.floor_number;

-- Detailed breakdown by ward
SELECT 
    f.floor_number,
    w.ward_name,
    COUNT(b.id) as beds_count,
    w.total_beds as expected_beds
FROM wards w
JOIN floors f ON w.floor_id = f.id
LEFT JOIN beds b ON b.ward_id = w.id
GROUP BY f.floor_number, w.ward_name, w.total_beds
ORDER BY f.floor_number, w.ward_name;
