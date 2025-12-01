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
All entities have auto-generated unique identifiers:
- Patients: `PAT` + 8-char UUID
- Doctors: `DOC` + 8-char UUID
- Staff: `STF` + 8-char UUID
- Lab Tests: `LAB` + 8-char UUID
- Medications: `MED` + 8-char UUID
- Bills: `BILL` + 8-char UUID

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

## Sample Data (Optional)

To insert sample data for testing:

```sql
-- Create admin user
INSERT INTO users (username, email, password, first_name, last_name, is_verified, is_active, created_at)
VALUES ('admin', 'admin@hospital.com', '$2a$10$...', 'Admin', 'User', true, true, NOW());

INSERT INTO user_roles (user_id, role)
VALUES ((SELECT id FROM users WHERE username = 'admin'), 'ADMIN');

-- Add more sample data as needed
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
