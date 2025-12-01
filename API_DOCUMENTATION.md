# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

All endpoints except `/auth/**` require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "admin",
    "email": "admin@hospital.com",
    "type": "Bearer"
  },
  "timestamp": "2024-12-01T10:30:00"
}
```

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "roles": ["ROLE_PATIENT"]
}
```

## Patient Management

### Get All Patients
```http
GET /patients
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Operation successful",
  "data": [
    {
      "id": 1,
      "patientId": "PAT12345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phoneNumber": "1234567890",
      "bloodGroup": "A_POSITIVE",
      "dateOfBirth": "1990-01-15",
      "gender": "MALE",
      ...
    }
  ]
}
```

### Create Patient
```http
POST /patients
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1985-06-20",
  "gender": "FEMALE",
  "bloodGroup": "O_POSITIVE",
  "phoneNumber": "9876543210",
  "email": "jane@example.com",
  "address": "123 Main St, City",
  "emergencyContactName": "John Smith",
  "emergencyContactNumber": "1234567890",
  "allergies": "Penicillin",
  "medicalHistory": "No significant history"
}
```

### Get Patient by ID
```http
GET /patients/{id}
Authorization: Bearer <token>
```

### Update Patient
```http
PUT /patients/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  ...
}
```

## Medical Records

### Get Patient Medical Records
```http
GET /medical-records/patient/{patientId}
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "visitDate": "2024-11-20T14:30:00",
      "chiefComplaint": "Fever and cough",
      "diagnosis": "Upper respiratory tract infection",
      "treatmentPlan": "Antibiotics and rest",
      "prescriptions": "Amoxicillin 500mg TID for 7 days",
      "followUpDate": "2024-11-27"
    }
  ]
}
```

### Create Medical Record
```http
POST /medical-records
Authorization: Bearer <token>
Content-Type: application/json

{
  "patient": { "id": 1 },
  "doctor": { "id": 2 },
  "visitDate": "2024-12-01T10:00:00",
  "chiefComplaint": "Headache",
  "presentIllness": "Persistent headache for 3 days",
  "examinationFindings": "BP: 120/80, Normal examination",
  "diagnosis": "Tension headache",
  "treatmentPlan": "Pain management and stress reduction",
  "prescriptions": "Ibuprofen 400mg as needed",
  "notes": "Follow up if symptoms persist"
}
```

## Vital Signs

### Record Vital Signs
```http
POST /vital-signs
Authorization: Bearer <token>
Content-Type: application/json

{
  "patient": { "id": 1 },
  "recordedAt": "2024-12-01T09:00:00",
  "temperature": 37.5,
  "bloodPressureSystolic": 120,
  "bloodPressureDiastolic": 80,
  "heartRate": 75,
  "respiratoryRate": 16,
  "oxygenSaturation": 98.0,
  "weight": 70.5,
  "height": 175.0,
  "recordedBy": "Nurse Mary"
}
```

### Get Patient Vital Signs
```http
GET /vital-signs/patient/{patientId}
Authorization: Bearer <token>
```

## Physician Orders (CPOE)

### Create Order
```http
POST /physician-orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "patient": { "id": 1 },
  "doctor": { "id": 2 },
  "orderType": "LAB_TEST",
  "orderDetails": "Complete Blood Count (CBC)",
  "priority": "ROUTINE",
  "scheduledFor": "2024-12-02T08:00:00",
  "instructions": "Fasting required"
}
```

### Get Orders by Status
```http
GET /physician-orders/status/PENDING
Authorization: Bearer <token>
```

### Update Order Status
```http
PATCH /physician-orders/{id}/status?status=COMPLETED
Authorization: Bearer <token>
```

## Role-Based Access

### Roles
- `ROLE_ADMIN` - Full system access
- `ROLE_DOCTOR` - Access to patient records, orders, prescriptions
- `ROLE_NURSE` - Access to vital signs, orders execution
- `ROLE_PHARMACIST` - Access to prescriptions, medication management
- `ROLE_LAB_TECHNICIAN` - Access to lab tests and results
- `ROLE_RECEPTIONIST` - Access to patient registration, appointments
- `ROLE_ACCOUNTANT` - Access to billing and financial records
- `ROLE_PATIENT` - Limited access to own records

### Endpoint Permissions

| Endpoint | Admin | Doctor | Nurse | Patient |
|----------|-------|--------|-------|---------|
| POST /patients | ✓ | ✓ | ✗ | ✗ |
| GET /patients | ✓ | ✓ | ✓ | ✗ |
| GET /patients/{id} | ✓ | ✓ | ✓ | ✓* |
| POST /medical-records | ✓ | ✓ | ✗ | ✗ |
| GET /medical-records/patient/{id} | ✓ | ✓ | ✓ | ✓* |
| POST /vital-signs | ✓ | ✓ | ✓ | ✗ |
| POST /physician-orders | ✓ | ✓ | ✗ | ✗ |

*Only for own records

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "firstName": "First name is required",
    "email": "Invalid email format"
  },
  "timestamp": "2024-12-01T10:30:00"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized: Authentication token was either missing or invalid.",
  "data": null,
  "timestamp": "2024-12-01T10:30:00"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Patient not found with id: '123'",
  "data": null,
  "timestamp": "2024-12-01T10:30:00"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An error occurred: ...",
  "data": null,
  "timestamp": "2024-12-01T10:30:00"
}
```

## Enums

### Gender
- MALE
- FEMALE
- OTHER

### Blood Group
- A_POSITIVE, A_NEGATIVE
- B_POSITIVE, B_NEGATIVE
- AB_POSITIVE, AB_NEGATIVE
- O_POSITIVE, O_NEGATIVE

### Order Status
- PENDING
- SCHEDULED
- IN_PROGRESS
- COMPLETED
- CANCELLED
- ON_HOLD

### Test Status
- REQUESTED
- SAMPLE_COLLECTED
- IN_PROGRESS
- COMPLETED
- VERIFIED
- CANCELLED

### Prescription Status
- PENDING
- DISPENSED
- PARTIALLY_DISPENSED
- CANCELLED
- EXPIRED

### Bill Status
- PENDING
- PARTIALLY_PAID
- PAID
- CANCELLED
- INSURANCE_PENDING
- INSURANCE_APPROVED
- INSURANCE_REJECTED

### Payment Method
- CASH
- CREDIT_CARD
- DEBIT_CARD
- UPI
- NET_BANKING
- INSURANCE
- CHEQUE
