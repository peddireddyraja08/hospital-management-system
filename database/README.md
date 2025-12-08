# Database Setup Guide

## Prerequisites

- PostgreSQL 12 or higher
- pgAdmin (optional, for GUI management)

## Quick Setup

### 1. Create Database

```bash
# Using psql command line
psql -U postgres

# Then in psql:
CREATE DATABASE hospital_management;
\q
```

### 2. Run Schema Script

```bash
# From the project root directory
psql -U postgres -d hospital_management -f database/schema.sql
```

Alternatively, using pgAdmin:
1. Right-click on "Databases" → Create → Database
2. Name: `hospital_management`
3. Right-click on the new database → Query Tool
4. Open and execute `database/schema.sql`

### 3. Configure Application

Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hospital_management
spring.datasource.username=postgres
spring.datasource.password=your_password_here
```

## Database Schema Overview

### Core Tables

#### Users & Authentication
- `users` - User accounts with authentication details
- `user_roles` - Role assignments (8 roles: ADMIN, DOCTOR, NURSE, etc.)

#### Clinical Entities
- `patients` - Patient demographics and medical info
- `doctors` - Doctor profiles with specializations
- `staff` - Hospital staff records
- `appointments` - Appointment scheduling with conflict detection
- `beds` - Bed inventory with ADT (Admission, Discharge, Transfer) tracking

#### Medical Records
- `medical_records` - Patient visit records and diagnoses
- `vital_signs` - Patient vital sign measurements
- `physician_orders` - CPOE (Computerized Physician Order Entry)

#### Laboratory
- `lab_tests` - Test catalog with prices and normal ranges
- `lab_test_requests` - Test orders from doctors
- `lab_test_results` - Test results with verification status

#### Pharmacy
- `medications` - Medication catalog with stock management
- `medication_inventory` - Batch tracking with expiry dates
- `prescriptions` - Prescription orders and dispensing

#### Billing
- `bills` - Comprehensive billing with multiple charge categories
- Insurance claim tracking
- Payment recording with multiple payment methods

## Key Features

### Auto-Generated IDs
All entities have auto-generated sequential unique identifiers:
- Patients: `PAT-YYYYMMDD-XXXX` (e.g., PAT-20250207-0001)
- Doctors: `DOC-YYYYMMDD-XXXX` (e.g., DOC-20250207-0001)
- Staff: `STF-YYYYMMDD-XXXX` (e.g., STF-20250207-0001)
- Lab Tests: `LAB-YYYYMMDD-XXXX` (e.g., LAB-20250207-0001)
- Medications: `MED-YYYYMMDD-XXXX` (e.g., MED-20250207-0001)
- Bills: `BILL-YYYYMMDD-XXXX` (e.g., BILL-20250207-0001)
- Admissions: `ADM-YYYYMMDD-XXXX` (e.g., ADM-20250207-0001)
- Samples: `SAMP-YYYYMMDD-XXXX` (e.g., SAMP-20250207-0001)

**ID Generation**: Managed by `IdGeneratorService` with database-backed counters (`id_counter` table). Counters reset daily for each module prefix.

### Audit Trail
Every table includes:
- `created_at`, `updated_at` - Timestamps
- `created_by`, `updated_by` - User tracking
- `is_active`, `is_deleted` - Soft delete flags

### Indexes
Performance indexes on:
- Patient ID, Email
- Doctor ID, Specialization
- Appointment Patient/Doctor relationships
- Bill numbers and patient relationships

## Database Seeders

The project includes comprehensive database seeding scripts for development and testing.

### Available Scripts

1. **`clear_all_data.sql`** - Safely clears all data from database
2. **`seed_demo_data.sql`** - Loads comprehensive demo data with new ID format
3. **`migration_add_id_counter.sql`** - Migration for existing databases to add ID counter table

### Clear All Data

To remove all data from the database (useful for testing):

```bash
psql -U postgres -d hospital_management -f database/clear_all_data.sql
```

**WARNING**: This deletes ALL data. Use only in development/testing environments.

Features:
- Respects foreign key dependencies (clears in correct order)
- Resets all PostgreSQL sequences
- Clears ID counter table
- Provides verification query output

### Load Demo Data

The `seed_demo_data.sql` script creates realistic demo data including:

```bash
psql -U postgres -d hospital_management -f database/seed_demo_data.sql
```

**Demo Data Includes:**

**Users & Access (3 users):**
- Dr. Sarah Williams (DOCTOR role)
- John Doe (PATIENT role - Outpatient)
- Jane Smith (PATIENT role - Inpatient)
- Default password for all: `password123`

**Core Entities:**
- 1 Doctor: Dr. Sarah Williams (DOC-20250207-0001) - General Medicine specialist
- 2 Patients:
  - John Doe (OUT-20250207-0001) - Outpatient with completed visit
  - Jane Smith (IN-20250207-0001) - Inpatient currently admitted

**Master Data:**
- 10 Lab Tests: CBC, LFT, KFT, Blood Sugar, Thyroid Profile, Lipid Profile, Urine Routine, HbA1c, ESR, X-Ray Chest
- 5 Medications: Paracetamol, Amoxicillin, Omeprazole, Metformin, Aspirin (with stock quantities)
- 3 Beds: 2 in General Ward, 1 in ICU (1 occupied by Jane Smith)

**Transactions & Relationships:**
- 2 Appointments (both completed - regular consultation and pre-admission)
- 1 Active Admission (Jane Smith in General Ward bed 102)
- 2 Medical Records (with diagnosis, symptoms, treatment plans)
- 1 Vital Signs record (for admitted patient)
- 2 Lab Test Requests (CBC completed, LFT in progress)
- 3 Prescriptions (all dispensed with stock deduction)
- 2 Bills:
  - BILL-20250207-0001: $1,000 (PAID via credit card) - Outpatient
  - BILL-20250207-0002: $3,450 (INSURANCE_PENDING) - Inpatient

**Demo Login Credentials:**
```
Doctor:
  Username: dr.sarah
  Password: password123
  Email: dr.sarah@hospital.com

Outpatient:
  Username: john.doe
  Password: password123
  Email: john.doe@hospital.com

Inpatient:
  Username: jane.smith
  Password: password123
  Email: jane.smith@hospital.com
```

### Typical Workflow

**For new setup:**
```bash
# 1. Create database
createdb hospital_management

# 2. Run schema
psql -U postgres -d hospital_management -f database/schema.sql

# 3. Load demo data
psql -U postgres -d hospital_management -f database/seed_demo_data.sql
```

**For existing database (migration):**
```bash
# 1. Apply ID counter migration
psql -U postgres -d hospital_management -f database/migration_add_id_counter.sql

# 2. (Optional) Clear old data and load new demo data
psql -U postgres -d hospital_management -f database/clear_all_data.sql
psql -U postgres -d hospital_management -f database/seed_demo_data.sql
```

**For testing (reset data):**
```bash
# Clear and reload
psql -U postgres -d hospital_management -f database/clear_all_data.sql
psql -U postgres -d hospital_management -f database/seed_demo_data.sql
```

### Verify Demo Data

After loading, verify with:

```sql
-- Check record counts
SELECT 
    'Users' as entity, COUNT(*) as count FROM users
UNION ALL
SELECT 'Patients', COUNT(*) FROM patients
UNION ALL
SELECT 'Doctors', COUNT(*) FROM doctors
UNION ALL
SELECT 'Appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'Admissions', COUNT(*) FROM admissions
UNION ALL
SELECT 'Bills', COUNT(*) FROM bills;

-- Expected output:
-- Users: 3
-- Patients: 2
-- Doctors: 1
-- Appointments: 2
-- Admissions: 1
-- Bills: 2

-- View demo patients
SELECT patient_id, first_name, last_name, patient_type, blood_group 
FROM patients;

-- View active admission
SELECT admission_number, p.patient_id, p.first_name, ward, room_number, b.bed_number, status
FROM admissions adm
JOIN patients p ON adm.patient_id = p.id
JOIN beds b ON adm.current_bed_id = b.id
WHERE adm.status = 'ADMITTED';

-- Check ID generation counters
SELECT module_prefix, date_key, last_sequence 
FROM id_counter 
ORDER BY module_prefix;
```

## Maintenance

### Backup Database

```bash
pg_dump -U postgres hospital_management > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
psql -U postgres hospital_management < backup_20231201.sql
```

### View Table Statistics

```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_live_tup AS row_count
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Troubleshooting

### Connection Issues

1. Check PostgreSQL is running:
```bash
pg_isready -h localhost -p 5432
```

2. Verify credentials in application.properties

3. Check PostgreSQL logs:
```bash
# Location varies by OS
# Ubuntu: /var/log/postgresql/
# Windows: C:\Program Files\PostgreSQL\{version}\data\log\
```

### Schema Updates

If schema changes are needed:
1. Make changes to `schema.sql`
2. Either drop and recreate database (development only):
```sql
DROP DATABASE hospital_management;
CREATE DATABASE hospital_management;
\c hospital_management
\i database/schema.sql
```

Or use migration tools like Flyway/Liquibase for production.

## Security Considerations

1. **Never commit passwords** - Use environment variables or secrets management
2. **Restrict database user permissions** - Create app-specific user with limited access
3. **Enable SSL** for production database connections
4. **Regular backups** - Automate daily backups
5. **Audit sensitive tables** - Track access to patient records

## Production Deployment

For production environments:

```sql
-- Create dedicated application user
CREATE USER hospital_app WITH PASSWORD 'strong_password_here';
GRANT CONNECT ON DATABASE hospital_management TO hospital_app;
GRANT USAGE ON SCHEMA public TO hospital_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO hospital_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO hospital_app;
```

Update application.properties:
```properties
spring.datasource.url=jdbc:postgresql://production-db-host:5432/hospital_management?sslmode=require
spring.datasource.username=hospital_app
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
```

## Support

For database-related issues, check:
- PostgreSQL documentation: https://www.postgresql.org/docs/
- Project issues: https://github.com/peddireddyraja08/hospital-management-system/issues
