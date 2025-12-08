# Hospital Management System - AI Agent Instructions

## Architecture Overview

This is a **3-layer architecture** healthcare system with clear separation of concerns:
- **Backend**: Spring Boot 3.2 REST API (`backend/`) on port 8080 at `/api` context path
- **Frontend**: React 18 + Material UI (`frontend/`) on port 3000
- **Database**: PostgreSQL with JPA/Hibernate (`database/schema.sql`)

**Key Pattern**: All backend components follow strict layering: Controller → Service → Repository → Entity. Never bypass service layer or put business logic in controllers.

## Entity & Database Patterns

### BaseEntity Inheritance
All entities extend `BaseEntity` which provides:
- Auto-generated `id` (Long, Identity strategy)
- Audit fields: `createdAt`, `updatedAt`, `createdBy`, `updatedBy` (Spring Data JPA auditing)
- Soft delete: `isActive`, `isDeleted` flags

**Pattern**: Use soft delete (`setIsDeleted(true)`) instead of repository delete operations. See `PatientService.deletePatient()`.

### Entity Relationships
- Use `@OneToOne`, `@OneToMany`, `@ManyToOne` with explicit `@JoinColumn` naming
- All enums stored as `@Enumerated(EnumType.STRING)` for readability
- LocalDateTime/LocalDate for temporal fields (no java.util.Date)

**Example**: `Patient` has embedded user reference (`@OneToOne User`), blood group enum, and audit trail.

## API Layer Conventions

### Controller Pattern
```java
@RestController
@RequestMapping("/resource-name")
@RequiredArgsConstructor  // Lombok for constructor injection
@Tag(name = "...", description = "...")  // Swagger documentation
```

### Standard Response Format
ALL endpoints return `ApiResponse<T>`:
```java
ApiResponse.success(data)  // 200 OK
ApiResponse.success("message", data)  // 200 OK with message
ApiResponse.error("message")  // Error response
```
Response includes: `success`, `message`, `data`, `timestamp`

### Authorization
Use method-level `@PreAuthorize`:
- `hasRole('ADMIN')` - Admin only
- `hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')` - Multiple roles
- 8 roles exist: ADMIN, DOCTOR, NURSE, PHARMACIST, LAB_TECHNICIAN, RECEPTIONIST, ACCOUNTANT, PATIENT

**Critical**: Authentication endpoints (`/auth/**`) and Swagger (`/swagger-ui/**`, `/api-docs/**`) are public in SecurityConfig.

## Service Layer Rules

### Transaction Management
All services are `@Transactional` at class level. Service methods handle:
1. Business logic and validation
2. ID generation (e.g., `PAT-20250207-0001` for patient IDs via IdGeneratorService)
3. Entity state management (isActive, isDeleted)
4. Calling repositories

### Error Handling
Throw `ResourceNotFoundException(entityName, fieldName, value)` for missing resources. GlobalExceptionHandler converts to proper HTTP responses:
- 404 for ResourceNotFoundException
- 400 for validation errors (MethodArgumentNotValidException)
- 401 for BadCredentialsException
- 500 for general exceptions

**Never** return null from service methods—always throw exceptions for missing data.

## Security Implementation

### JWT Authentication
- Token in `Authorization: Bearer <token>` header
- Secret, expiration, refresh-expiration in `application.properties` with `jwt.*` prefix
- JwtAuthenticationFilter intercepts requests before UsernamePasswordAuthenticationFilter
- Stateless sessions (SessionCreationPolicy.STATELESS)

**Important**: UserDetailsService implementation is `CustomUserDetailsService` loading from UserRepository.

## Frontend Architecture

### API Integration
`src/services/api.js` provides axios instance with:
- Request interceptor: Auto-adds JWT from localStorage
- Response interceptor: Auto-redirects to `/login` on 401
- Named API modules: `authAPI`, `patientAPI`, `medicalRecordAPI`, `vitalSignAPI`, `physicianOrderAPI`

**Pattern**: Always use these API modules, never create raw axios calls.

### State Management
React Context (`AuthContext.js`) handles authentication state. Use `useAuth()` hook for:
- Current user info
- Login/logout functions
- Authentication status

### Routing
Private routes use `PrivateRoute` component wrapping protected pages. All authenticated pages under `/dashboard` structure.

## Build & Development Commands

### Backend
```bash
cd backend
mvn clean install          # Build
mvn spring-boot:run        # Run dev server
```
Access: http://localhost:8080/api
Swagger: http://localhost:8080/api/swagger-ui.html

### Frontend
```bash
cd frontend
npm install               # Install dependencies
npm start                 # Run dev server (port 3000)
npm run build            # Production build
```

### Database
```bash
createdb hospital_management
psql -d hospital_management -f database/schema.sql
```
Update credentials in `backend/src/main/resources/application.properties`

## Key Configuration Points

- **CORS**: Configured in `CorsConfig.java` for `http://localhost:3000` origin
- **JPA ddl-auto**: Set to `update` (see application.properties)
- **Logging**: DEBUG for `com.hospital` package, SQL logging enabled
- **File uploads**: Max 10MB, stored in `./uploads` directory

## Module-Specific Patterns

### Patient Management
- Auto-generated patient ID: Format `PAT-YYYYMMDD-XXXX` (e.g., `PAT-20250207-0001`)
- Email must be unique
- Required fields: firstName, lastName, patientId

### Medical Records
- Links Patient + Doctor entities
- Stores visit details, diagnosis, treatment plan, prescriptions
- followUpDate optional for scheduling

### Vital Signs
- Auto-calculates BMI from weight/height (if both provided)
- recordedBy stores the recording staff name/ID
- Links to Patient entity

### Physician Orders (CPOE)
- orderType: MEDICATION, LAB_TEST, IMAGING, PROCEDURE
- Status flow: PENDING → SCHEDULED → IN_PROGRESS → COMPLETED
- Can be cancelled or put ON_HOLD at any stage

### Doctor Management
- `Doctor`: Auto-generated doctorId (Format: `DOC-YYYYMMDD-XXXX`), specialization, licenseNumber (unique), consultationFee
- Links to User entity via @OneToOne relationship
- Controllers: `/doctors` with role-based access (ADMIN for create/delete, DOCTOR/RECEPTIONIST for view/update)
- Key methods: `createDoctor()`, `getDoctorsBySpecialization()`, `updateDoctor()`, soft delete via `deleteDoctor()`

**Pattern**: Follow same BaseEntity pattern with soft delete. Doctor user accounts created separately in User entity.

### Staff Management
- `Staff`: Auto-generated staffId (Format: `STF-YYYYMMDD-XXXX`), department, designation, joiningDate, salary
- Links to User entity via @OneToOne relationship
- Controllers: `/staff` with ADMIN-only access (sensitive HR data)
- Key methods: `createStaff()`, `getStaffByDepartment()`, `getStaffByDesignation()`, `updateStaff()`

**Pattern**: Staff records separate from User accounts. Department and designation for organizational structure.

### Appointment Management
- `Appointment`: Links Patient + Doctor with appointmentDate, duration (minutes), status, appointmentType
- AppointmentStatus: SCHEDULED → COMPLETED / CANCELLED / NO_SHOW
- AppointmentType: CONSULTATION, FOLLOW_UP, EMERGENCY
- Conflict detection: `hasConflict()` checks doctor availability before booking/rescheduling
- Controllers: `/appointments` with role-based access (RECEPTIONIST/DOCTOR for create, PATIENT can view own)
- Key methods: `createAppointment()` (with conflict check), `cancelAppointment()`, `completeAppointment()`, `getDoctorAppointmentsByDate()`

**Pattern**: Automatic conflict detection prevents double-booking. Check existing appointments in time window (appointmentDate ± duration) for same doctor.

### Bed Management (ADT)
- `Bed`: Unique bedNumber, wardName, bedType (ICU/General/Private), BedStatus enum, dailyCharge
- BedStatus: AVAILABLE → OCCUPIED → AVAILABLE (also UNDER_MAINTENANCE, CLEANING, RESERVED)
- ADT Operations: Admission (`admitPatient()`), Discharge (`dischargePatient()`), Transfer (`transferPatient()`)
- Links to Patient via currentPatient (ManyToOne, nullable)
- Controllers: `/beds` with role-based access (NURSE/DOCTOR for ADT operations, ADMIN for create/delete)
- Key methods: `admitPatient()`, `dischargePatient()`, `transferPatient()`, `getAvailableBeds()`, `getAvailableBedsByWard()`

**Pattern**: ADT operations update BedStatus and currentPatient atomically. Transfer discharges from old bed, admits to new bed. Cannot delete occupied beds.

### Lab & Diagnostics
- `LabTest`: Catalog with auto-generated testCode (Format: `LAB-YYYYMMDD-XXXX`), price, normalRange, turnaroundTime
- `LabTestRequest`: Links Patient + Doctor + LabTest with TestStatus enum
- `LabTestResult`: Stores test values, verification status, and result interpretation
- TestStatus flow: REQUESTED → SAMPLE_COLLECTED → IN_PROGRESS → COMPLETED → VERIFIED → CANCELLED
- Priority levels: ROUTINE, URGENT, STAT
- Controllers: `/lab-tests`, `/lab-test-requests` with role-based access (LAB_TECHNICIAN, DOCTOR)
- Key methods: `addLabTestResult()`, `verifyLabTestResult()`, status transitions

**Pattern**: Lab test requests follow CPOE pattern—create request → collect sample → add result → verify result.

### Pharmacy & Medication
- `Medication`: Master catalog with auto-generated medicationCode (Format: `MED-YYYYMMDD-XXXX`), stockQuantity, reorderLevel
- `MedicationInventory`: Batch tracking with batchNumber, expiryDate, isExpired flag (not yet in controllers)
- `Prescription`: Links Patient + Doctor + Medication with PrescriptionStatus enum
- PrescriptionStatus: PENDING → DISPENSED / PARTIALLY_DISPENSED / CANCELLED / EXPIRED
- Controllers: `/medications`, `/prescriptions` with role-based access (PHARMACIST, DOCTOR)
- Key methods: `dispensePrescription()`, `partiallyDispensePrescription()`, `getLowStockMedications()`
- Stock deduction: Automatic during dispensing with validation

**Pattern**: Stock management checks availability before dispensing. `updateStock()` for manual adjustments (positive/negative quantities).

### Billing & Financial
- `Bill`: Auto-generated billNumber (Format: `BILL-YYYYMMDD-XXXX`), comprehensive charge tracking
- Charge categories: consultationCharges, labCharges, medicationCharges, roomCharges, procedureCharges, otherCharges
- Auto-calculates: subtotal, totalAmount, dueAmount in `BillService.calculateBillAmounts()`
- BillStatus: PENDING → PARTIALLY_PAID → PAID (also INSURANCE_PENDING → INSURANCE_APPROVED/REJECTED)
- PaymentMethod enum: CASH, CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, INSURANCE, CHEQUE
- Insurance workflow: `processInsuranceClaim()` → `approveInsuranceClaim()` / `rejectInsuranceClaim()`
- Controllers: `/bills` with role-based access (ACCOUNTANT, RECEPTIONIST)
- Key methods: `addPayment()`, `processInsuranceClaim()`, `approveInsuranceClaim()`

**Pattern**: Totals auto-calculated on create/update. Payment tracking updates status automatically (PAID when dueAmount ≤ 0). Insurance approval adds to paidAmount.

## Documentation
- API docs: See `API_DOCUMENTATION.md` for all endpoints
- Setup guide: See `SETUP.md` for detailed installation
- Project summary: See `PROJECT_SUMMARY.md` for architecture overview

## Common Pitfalls to Avoid
1. Don't put business logic in controllers—services only
2. Don't use hard delete—always soft delete with isDeleted flag
3. Don't forget @PreAuthorize on new endpoints
4. Don't return entities directly—wrap in ApiResponse
5. Don't create new axios instances—use api.js modules
6. Don't bypass JPA auditing—BaseEntity handles timestamps
