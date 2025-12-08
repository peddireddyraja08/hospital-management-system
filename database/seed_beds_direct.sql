-- Hospital Beds Seed Data (Direct Structure)
-- Total: 5 Floors, 12 Wards, 133 Beds

BEGIN;

-- Clear existing bed data
DELETE FROM beds;

-- Reset sequence
ALTER SEQUENCE beds_id_seq RESTART WITH 1;

-- ============================================
-- FLOOR 1: General, Emergency, Isolation (35 beds)
-- ============================================

-- General Ward: 20 beds (G01–G20)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('G01', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G02', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G03', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G04', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G05', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G06', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G07', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G08', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G09', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G10', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G11', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G12', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G13', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G14', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G15', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G16', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G17', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G18', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G19', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('G20', 'General', 1, 'GENERAL', 'AVAILABLE', 500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Emergency Ward: 10 beds (E01–E10)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('E01', 'Emergency', 1, 'EMERGENCY', 'AVAILABLE', 800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E02', 'Emergency', 1, 'EMERGENCY', 'AVAILABLE', 800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E03', 'Emergency', 1, 'EMERGENCY', 'AVAILABLE', 800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E04', 'Emergency', 1, 'EMERGENCY', 'AVAILABLE', 800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E05', 'Emergency', 1, 'EMERGENCY', 'AVAILABLE', 800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E06', 'Emergency', 1, 'EMERGENCY', 'AVAILABLE', 800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E07', 'Emergency', 1, 'EMERGENCY', 'AVAILABLE', 800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E08', 'Emergency', 1, 'EMERGENCY', 'AVAILABLE', 800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E09', 'Emergency', 1, 'EMERGENCY', 'AVAILABLE', 800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('E10', 'Emergency', 1, 'EMERGENCY', 'AVAILABLE', 800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Isolation Ward: 5 beds (I01–I05)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, is_isolation_bed, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('I01', 'Isolation', 1, 'ISOLATION', 'AVAILABLE', 1500.00, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('I02', 'Isolation', 1, 'ISOLATION', 'AVAILABLE', 1500.00, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('I03', 'Isolation', 1, 'ISOLATION', 'AVAILABLE', 1500.00, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('I04', 'Isolation', 1, 'ISOLATION', 'AVAILABLE', 1500.00, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('I05', 'Isolation', 1, 'ISOLATION', 'AVAILABLE', 1500.00, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- FLOOR 2: Twin-Share, Private, Special (26 beds)
-- ============================================

-- Twin-Share Ward: 10 beds (TS01–TS10)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('TS01', 'Twin-Share', 2, 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS02', 'Twin-Share', 2, 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS03', 'Twin-Share', 2, 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS04', 'Twin-Share', 2, 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS05', 'Twin-Share', 2, 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS06', 'Twin-Share', 2, 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS07', 'Twin-Share', 2, 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS08', 'Twin-Share', 2, 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS09', 'Twin-Share', 2, 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('TS10', 'Twin-Share', 2, 'SEMI_PRIVATE', 'AVAILABLE', 1200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Private Ward: 10 beds (PR01–PR10)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('PR01', 'Private', 2, 'PRIVATE', 'AVAILABLE', 2000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR02', 'Private', 2, 'PRIVATE', 'AVAILABLE', 2000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR03', 'Private', 2, 'PRIVATE', 'AVAILABLE', 2000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR04', 'Private', 2, 'PRIVATE', 'AVAILABLE', 2000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR05', 'Private', 2, 'PRIVATE', 'AVAILABLE', 2000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR06', 'Private', 2, 'PRIVATE', 'AVAILABLE', 2000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR07', 'Private', 2, 'PRIVATE', 'AVAILABLE', 2000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR08', 'Private', 2, 'PRIVATE', 'AVAILABLE', 2000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR09', 'Private', 2, 'PRIVATE', 'AVAILABLE', 2000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PR10', 'Private', 2, 'PRIVATE', 'AVAILABLE', 2000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Special Ward: 6 beds (SP01–SP06)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('SP01', 'Special', 2, 'SPECIAL', 'AVAILABLE', 2500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('SP02', 'Special', 2, 'SPECIAL', 'AVAILABLE', 2500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('SP03', 'Special', 2, 'SPECIAL', 'AVAILABLE', 2500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('SP04', 'Special', 2, 'SPECIAL', 'AVAILABLE', 2500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('SP05', 'Special', 2, 'SPECIAL', 'AVAILABLE', 2500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('SP06', 'Special', 2, 'SPECIAL', 'AVAILABLE', 2500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- FLOOR 3: Deluxe, Pediatric, Maternity (30 beds)
-- ============================================

-- Deluxe Ward: 10 beds (DR01–DR10)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('DR01', 'Deluxe', 3, 'DELUXE', 'AVAILABLE', 3500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR02', 'Deluxe', 3, 'DELUXE', 'AVAILABLE', 3500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR03', 'Deluxe', 3, 'DELUXE', 'AVAILABLE', 3500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR04', 'Deluxe', 3, 'DELUXE', 'AVAILABLE', 3500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR05', 'Deluxe', 3, 'DELUXE', 'AVAILABLE', 3500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR06', 'Deluxe', 3, 'DELUXE', 'AVAILABLE', 3500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR07', 'Deluxe', 3, 'DELUXE', 'AVAILABLE', 3500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR08', 'Deluxe', 3, 'DELUXE', 'AVAILABLE', 3500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR09', 'Deluxe', 3, 'DELUXE', 'AVAILABLE', 3500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('DR10', 'Deluxe', 3, 'DELUXE', 'AVAILABLE', 3500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Pediatric Ward: 8 beds (P01–P08)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('P01', 'Pediatric', 3, 'PEDIATRIC', 'AVAILABLE', 1800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P02', 'Pediatric', 3, 'PEDIATRIC', 'AVAILABLE', 1800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P03', 'Pediatric', 3, 'PEDIATRIC', 'AVAILABLE', 1800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P04', 'Pediatric', 3, 'PEDIATRIC', 'AVAILABLE', 1800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P05', 'Pediatric', 3, 'PEDIATRIC', 'AVAILABLE', 1800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P06', 'Pediatric', 3, 'PEDIATRIC', 'AVAILABLE', 1800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P07', 'Pediatric', 3, 'PEDIATRIC', 'AVAILABLE', 1800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('P08', 'Pediatric', 3, 'PEDIATRIC', 'AVAILABLE', 1800.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Maternity Ward: 12 beds (M01–M12)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('M01', 'Maternity', 3, 'MATERNITY', 'AVAILABLE', 2200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M02', 'Maternity', 3, 'MATERNITY', 'AVAILABLE', 2200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M03', 'Maternity', 3, 'MATERNITY', 'AVAILABLE', 2200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M04', 'Maternity', 3, 'MATERNITY', 'AVAILABLE', 2200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M05', 'Maternity', 3, 'MATERNITY', 'AVAILABLE', 2200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M06', 'Maternity', 3, 'MATERNITY', 'AVAILABLE', 2200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M07', 'Maternity', 3, 'MATERNITY', 'AVAILABLE', 2200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M08', 'Maternity', 3, 'MATERNITY', 'AVAILABLE', 2200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M09', 'Maternity', 3, 'MATERNITY', 'AVAILABLE', 2200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M10', 'Maternity', 3, 'MATERNITY', 'AVAILABLE', 2200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M11', 'Maternity', 3, 'MATERNITY', 'AVAILABLE', 2200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('M12', 'Maternity', 3, 'MATERNITY', 'AVAILABLE', 2200.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- FLOOR 4: Recovery, Pre-Op (18 beds)
-- ============================================

-- Recovery Ward: 12 beds (R01–R12)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('R01', 'Recovery', 4, 'RECOVERY', 'AVAILABLE', 1500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R02', 'Recovery', 4, 'RECOVERY', 'AVAILABLE', 1500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R03', 'Recovery', 4, 'RECOVERY', 'AVAILABLE', 1500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R04', 'Recovery', 4, 'RECOVERY', 'AVAILABLE', 1500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R05', 'Recovery', 4, 'RECOVERY', 'AVAILABLE', 1500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R06', 'Recovery', 4, 'RECOVERY', 'AVAILABLE', 1500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R07', 'Recovery', 4, 'RECOVERY', 'AVAILABLE', 1500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R08', 'Recovery', 4, 'RECOVERY', 'AVAILABLE', 1500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R09', 'Recovery', 4, 'RECOVERY', 'AVAILABLE', 1500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R10', 'Recovery', 4, 'RECOVERY', 'AVAILABLE', 1500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R11', 'Recovery', 4, 'RECOVERY', 'AVAILABLE', 1500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('R12', 'Recovery', 4, 'RECOVERY', 'AVAILABLE', 1500.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- Pre-Op Ward: 6 beds (PRE01–PRE06)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('PRE01', 'Pre-Op', 4, 'PRE_OP', 'AVAILABLE', 1000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PRE02', 'Pre-Op', 4, 'PRE_OP', 'AVAILABLE', 1000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PRE03', 'Pre-Op', 4, 'PRE_OP', 'AVAILABLE', 1000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PRE04', 'Pre-Op', 4, 'PRE_OP', 'AVAILABLE', 1000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PRE05', 'Pre-Op', 4, 'PRE_OP', 'AVAILABLE', 1000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('PRE06', 'Pre-Op', 4, 'PRE_OP', 'AVAILABLE', 1000.00, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- ============================================
-- FLOOR 5: ICU, CCU, HDU (24 beds)
-- ============================================

-- ICU Ward: 8 beds (ICU01–ICU08)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, has_ventilator, requires_monitoring, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('ICU01', 'ICU', 5, 'ICU', 'AVAILABLE', 5000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU02', 'ICU', 5, 'ICU', 'AVAILABLE', 5000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU03', 'ICU', 5, 'ICU', 'AVAILABLE', 5000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU04', 'ICU', 5, 'ICU', 'AVAILABLE', 5000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU05', 'ICU', 5, 'ICU', 'AVAILABLE', 5000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU06', 'ICU', 5, 'ICU', 'AVAILABLE', 5000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU07', 'ICU', 5, 'ICU', 'AVAILABLE', 5000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('ICU08', 'ICU', 5, 'ICU', 'AVAILABLE', 5000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- CCU Ward: 6 beds (CC01–CC06)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, has_ventilator, requires_monitoring, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('CC01', 'CCU', 5, 'CCU', 'AVAILABLE', 6000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('CC02', 'CCU', 5, 'CCU', 'AVAILABLE', 6000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('CC03', 'CCU', 5, 'CCU', 'AVAILABLE', 6000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('CC04', 'CCU', 5, 'CCU', 'AVAILABLE', 6000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('CC05', 'CCU', 5, 'CCU', 'AVAILABLE', 6000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('CC06', 'CCU', 5, 'CCU', 'AVAILABLE', 6000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

-- HDU Ward: 10 beds (HDU01–HDU10)
INSERT INTO beds (bed_number, ward_name, floor_number, bed_type, status, daily_charge, has_oxygen_support, requires_monitoring, is_active, is_deleted, created_at, updated_at, created_by, updated_by)
VALUES 
    ('HDU01', 'HDU', 5, 'HDU', 'AVAILABLE', 4000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU02', 'HDU', 5, 'HDU', 'AVAILABLE', 4000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU03', 'HDU', 5, 'HDU', 'AVAILABLE', 4000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU04', 'HDU', 5, 'HDU', 'AVAILABLE', 4000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU05', 'HDU', 5, 'HDU', 'AVAILABLE', 4000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU06', 'HDU', 5, 'HDU', 'AVAILABLE', 4000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU07', 'HDU', 5, 'HDU', 'AVAILABLE', 4000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU08', 'HDU', 5, 'HDU', 'AVAILABLE', 4000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU09', 'HDU', 5, 'HDU', 'AVAILABLE', 4000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM'),
    ('HDU10', 'HDU', 5, 'HDU', 'AVAILABLE', 4000.00, true, true, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SYSTEM', 'SYSTEM');

COMMIT;

-- ============================================
-- VERIFICATION SUMMARY
-- ============================================

SELECT 
    'Bed Data Loaded Successfully!' as message,
    (SELECT COUNT(*) FROM beds) as total_beds,
    (SELECT COUNT(*) FROM beds WHERE status = 'AVAILABLE') as available_beds,
    (SELECT COUNT(DISTINCT floor_number) FROM beds) as total_floors,
    (SELECT COUNT(DISTINCT ward_name) FROM beds) as total_wards;

-- Detailed breakdown by floor
SELECT 
    floor_number,
    COUNT(DISTINCT ward_name) as wards,
    COUNT(*) as beds,
    STRING_AGG(DISTINCT ward_name, ', ' ORDER BY ward_name) as ward_names
FROM beds
GROUP BY floor_number
ORDER BY floor_number;

-- Detailed breakdown by ward
SELECT 
    floor_number,
    ward_name,
    COUNT(*) as bed_count,
    MIN(bed_number) as first_bed,
    MAX(bed_number) as last_bed,
    MIN(daily_charge) as daily_charge
FROM beds
GROUP BY floor_number, ward_name
ORDER BY floor_number, ward_name;
