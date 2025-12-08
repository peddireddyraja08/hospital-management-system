# Database Seeder Refactoring Plan
## Hospital Management System - Sample Data Generation

**Purpose**: Create comprehensive demo data with proper relationships and new ID format

---

## 📋 Data to be Created

### Base Entities (Foundation)
1. **1 Doctor** (Dr. Sarah Williams - General Medicine)
   - ID: `DOC-20250207-0001`
   - Will treat both patients

2. **1 Outpatient** (John Doe)
   - ID: `OUT-20250207-0001`
   - Patient Type: OUTPATIENT
   - Blood Group: A_POSITIVE

3. **1 Inpatient** (Jane Smith)
   - ID: `IN-20250207-0001`
   - Patient Type: INPATIENT (will be auto-set during admission)
   - Blood Group: B_POSITIVE

### Supporting Entities
4. **Lab Tests Catalog** (10 common tests)
   - IDs: `LAB-20250207-0001` through `LAB-20250207-0010`
   - CBC, LFT, KFT, Blood Sugar, etc.

5. **Medications Catalog** (5 common medications)
   - IDs: `MED-20250207-0001` through `MED-20250207-0005`
   - Paracetamol, Amoxicillin, Omeprazole, etc.

6. **Beds** (3 beds for demo)
   - General Ward Bed 101 - Available
   - General Ward Bed 102 - Occupied (by Inpatient)
   - ICU Bed 201 - Available

### Relationship Entities

#### For Outpatient (John Doe):
7. **Appointment** - `APT-20250207-0001`
8. **Medical Record** - Basic consultation
9. **Lab Test Request** - CBC test
10. **Prescription** - Paracetamol prescription
11. **Bill** - `BILL-20250207-0001` (Consultation + Lab)

#### For Inpatient (Jane Smith):
12. **Admission** - `ADM-20250207-0001` (Assigned to Bed 102)
13. **Appointment** - `APT-20250207-0002` (Pre-admission)
14. **Medical Record** - Admission notes
15. **Vital Signs** - Latest vitals recorded
16. **Lab Test Request** - LFT test
17. **Prescription** - Multiple medications
18. **Bill** - `BILL-20250207-0002` (Room charges + Lab + Medications)

---

## 🗃️ Tables to be Cleared (in order)

### Phase 1: Relationship Tables (Foreign Keys)
1. `lab_test_results`
2. `lab_test_requests`
3. `prescriptions`
4. `bills`
5. `appointments`
6. `medical_records`
7. `vital_signs`
8. `physician_orders`
9. `medication_inventory`
10. `admissions` (if exists)
11. `samples` (if exists)
12. `nurse_tasks` (if exists)
13. `discharge_summaries` (if exists)

### Phase 2: Entity Tables
14. `beds`
15. `medications`
16. `lab_tests`
17. `doctors`
18. `staff`
19. `patients`
20. `user_roles`
21. `users`

### Phase 3: Counter Table
22. `id_counter` (reset all counters)

---

## 📝 Files to be Created/Modified

### New Files (2)
1. ✨ **`database/seed_demo_data.sql`**
   - Complete demo data seeder
   - Uses new ID format
   - Proper foreign key order
   - Transaction wrapped

2. ✨ **`database/clear_all_data.sql`**
   - Safe data clearing script
   - Respects foreign keys
   - Cascading deletes where needed
   - Resets sequences

### Modified Files (1)
3. 📝 **`database/README.md`**
   - Add seeder usage instructions
   - Document demo data
   - Add clear data instructions

---

## 🔄 Execution Order

### Step 1: Clear All Data
```bash
psql -U postgres -d hospital_management -f database/clear_all_data.sql
```

### Step 2: Seed Demo Data
```bash
psql -U postgres -d hospital_management -f database/seed_demo_data.sql
```

### Step 3: Verify Data
```bash
psql -U postgres -d hospital_management -c "SELECT * FROM patients;"
psql -U postgres -d hospital_management -c "SELECT * FROM appointments;"
```

---

## 🎯 Demo Data Details

### Doctor
```sql
ID: DOC-20250207-0001
Name: Dr. Sarah Williams
Specialization: General Medicine
License: MED2025001
Consultation Fee: $500
Phone: +1-555-0101
Email: dr.sarah@hospital.com
```

### Outpatient (John Doe)
```sql
ID: OUT-20250207-0001
DOB: 1985-05-15 (Age: 39)
Gender: MALE
Blood Group: A_POSITIVE
Phone: +1-555-0201
Email: john.doe@hospital.com
Address: 123 Maple Street, Springfield, IL
```

### Inpatient (Jane Smith)
```sql
ID: IN-20250207-0001
DOB: 1990-08-20 (Age: 34)
Gender: FEMALE
Blood Group: B_POSITIVE
Phone: +1-555-0202
Email: jane.smith@hospital.com
Address: 456 Oak Avenue, Springfield, IL
Admission Number: ADM-20250207-0001
Ward: General Ward
Room: 102
Bed: Bed-102
```

### Lab Tests
```sql
LAB-20250207-0001: Complete Blood Count (CBC) - $500
LAB-20250207-0002: Liver Function Test (LFT) - $800
LAB-20250207-0003: Kidney Function Test (KFT) - $700
LAB-20250207-0004: Blood Sugar Fasting - $150
LAB-20250207-0005: Thyroid Profile - $900
LAB-20250207-0006: Lipid Profile - $600
LAB-20250207-0007: Urine Routine - $200
LAB-20250207-0008: HbA1c - $400
LAB-20250207-0009: ESR - $100
LAB-20250207-0010: X-Ray Chest - $300
```

### Medications
```sql
MED-20250207-0001: Paracetamol 500mg - $5/tablet - Stock: 1000
MED-20250207-0002: Amoxicillin 500mg - $15/capsule - Stock: 500
MED-20250207-0003: Omeprazole 20mg - $10/capsule - Stock: 800
MED-20250207-0004: Metformin 500mg - $8/tablet - Stock: 600
MED-20250207-0005: Aspirin 75mg - $3/tablet - Stock: 1500
```

### Appointments
```sql
APT-20250207-0001: John Doe → Dr. Sarah Williams
  Date: 2025-02-07 10:00 AM
  Duration: 30 minutes
  Status: COMPLETED
  Type: CONSULTATION

APT-20250207-0002: Jane Smith → Dr. Sarah Williams
  Date: 2025-02-07 11:00 AM
  Duration: 60 minutes
  Status: COMPLETED
  Type: CONSULTATION (Pre-admission)
```

### Bills
```sql
BILL-20250207-0001: John Doe (Outpatient)
  Consultation: $500
  Lab (CBC): $500
  Total: $1,000
  Status: PAID
  Payment Method: CREDIT_CARD

BILL-20250207-0002: Jane Smith (Inpatient)
  Consultation: $500
  Lab (LFT): $800
  Room Charges (1 day): $2,000
  Medications: $150
  Total: $3,450
  Status: PENDING
  Payment Method: INSURANCE_PENDING
```

---

## ⚠️ Important Notes

1. **ID Counter Table**: Will be populated with initial values for each module
2. **Foreign Keys**: All relationships properly maintained
3. **Timestamps**: Use current timestamp for created_at/updated_at
4. **Soft Delete**: All entities have is_active=true, is_deleted=false
5. **Audit Fields**: created_by='SYSTEM', updated_by='SYSTEM'
6. **Passwords**: All user passwords hashed with BCrypt (demo: 'password123')
7. **Date Format**: DD/MM/YYYY HH:mm:ss throughout
8. **No Runtime Changes**: Only database seeding - no service layer modifications

---

## 🧪 Verification Queries

After seeding, verify with:

```sql
-- Check patients
SELECT patient_id, first_name, last_name, patient_type FROM patients;

-- Check appointments
SELECT id, patient_id, doctor_id, appointment_date, status FROM appointments;

-- Check admissions
SELECT admission_number, patient_id, ward, room_number, status FROM admissions;

-- Check bills
SELECT bill_number, patient_id, total_amount, bill_status FROM bills;

-- Check ID counters
SELECT module_prefix, date_key, last_sequence FROM id_counter ORDER BY module_prefix;
```

---

## 📊 Total Records

- **Users**: 3 (1 doctor, 2 patients)
- **Patients**: 2 (1 OUT, 1 IN)
- **Doctors**: 1
- **Lab Tests**: 10 (catalog)
- **Medications**: 5 (catalog)
- **Beds**: 3
- **Appointments**: 2
- **Medical Records**: 2
- **Lab Test Requests**: 2
- **Prescriptions**: 2
- **Bills**: 2
- **Admissions**: 1
- **Vital Signs**: 1
- **ID Counters**: ~10 (one per module)

**Total**: ~40-45 records across all tables

---

**Status**: ⏸️ AWAITING APPROVAL

Once approved, will generate SQL scripts for:
1. `clear_all_data.sql`
2. `seed_demo_data.sql`
3. Updated `database/README.md`
