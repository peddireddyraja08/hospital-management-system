# Hospital Management System - Setup Guide

## Prerequisites

### Backend Requirements
- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+

### Frontend Requirements
- Node.js 16+ and npm 8+

## Database Setup

### 1. Install PostgreSQL
Download and install PostgreSQL from: https://www.postgresql.org/download/

### 2. Create Database
```sql
CREATE DATABASE hospital_management;
CREATE USER hospital_user WITH PASSWORD 'hospital_pass';
GRANT ALL PRIVILEGES ON DATABASE hospital_management TO hospital_user;
```

### 3. Run Schema
```bash
cd database
psql -U hospital_user -d hospital_management -f schema.sql
```

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Update Database Configuration
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hospital_management
spring.datasource.username=hospital_user
spring.datasource.password=hospital_pass
```

### 3. Build and Run
```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on: http://localhost:8080/api

### 4. API Documentation
Once the backend is running, access Swagger UI at:
http://localhost:8080/api/swagger-ui.html

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

The frontend will start on: http://localhost:3000

## Testing the Application

### Default Test Users
You'll need to register users through the API or create them manually in the database.

### Sample Registration Request
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@hospital.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User",
  "phoneNumber": "1234567890",
  "roles": ["ROLE_ADMIN"]
}
```

## Project Structure

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/hospital/
│   ├── config/              # Configuration classes
│   ├── controller/          # REST Controllers
│   ├── dto/                 # Data Transfer Objects
│   ├── entity/              # JPA Entities
│   ├── enums/               # Enumerations
│   ├── exception/           # Exception handlers
│   ├── repository/          # JPA Repositories
│   ├── security/            # Security configuration
│   └── service/             # Business logic
└── src/main/resources/
    └── application.properties
```

### Frontend (React)
```
frontend/
├── public/
└── src/
    ├── components/          # Reusable components
    ├── context/             # React Context
    ├── pages/               # Page components
    ├── services/            # API services
    ├── App.js
    └── index.js
```

## Features Implemented

### 1. Patient & Clinical Management
- ✅ Patient registration and management
- ✅ Electronic Medical Records (EMR/EHR)
- ✅ Vital signs tracking
- ✅ Clinical documentation
- ✅ Computerized Physician Order Entry (CPOE)

### 2. Lab & Diagnostics
- ✅ Lab test definitions
- ✅ Test request management
- ✅ Result entry and approval
- ✅ Radiology Information System (RIS) integration structure

### 3. Pharmacy & Medication Management
- ✅ Medication inventory
- ✅ Stock management
- ✅ Medication Administration Records (MAR)
- ✅ E-Prescribing

### 4. Staff & Resource Management
- ✅ User/staff management
- ✅ Role-based permissions
- ✅ Doctor/nurse scheduling structure
- ✅ Bed management (ADT)
- ✅ Appointment management

### 5. Billing & Financial Management
- ✅ Bill generation
- ✅ Payment processing
- ✅ Insurance/TPA management
- ✅ Multiple payment methods

### 6. Security & Authentication
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Secure password storage
- ✅ Token refresh mechanism

### 7. Frontend
- ✅ React with Material UI
- ✅ Patient management interface
- ✅ Dashboard
- ✅ Authentication flow
- ✅ Responsive design

## API Endpoints

### Authentication
- POST `/auth/login` - User login
- POST `/auth/register` - User registration
- POST `/auth/refresh` - Refresh token

### Patients
- GET `/patients` - Get all patients
- GET `/patients/{id}` - Get patient by ID
- POST `/patients` - Create new patient
- PUT `/patients/{id}` - Update patient
- DELETE `/patients/{id}` - Delete patient

### Medical Records
- GET `/medical-records` - Get all records
- GET `/medical-records/patient/{patientId}` - Get patient records
- POST `/medical-records` - Create new record
- PUT `/medical-records/{id}` - Update record

### Vital Signs
- GET `/vital-signs/patient/{patientId}` - Get patient vital signs
- POST `/vital-signs` - Record vital signs
- PUT `/vital-signs/{id}` - Update vital signs

### Physician Orders (CPOE)
- GET `/physician-orders` - Get all orders
- GET `/physician-orders/patient/{patientId}` - Get patient orders
- POST `/physician-orders` - Create new order
- PATCH `/physician-orders/{id}/status` - Update order status

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change port in application.properties
server.port=8081
```

**Database connection error:**
- Verify PostgreSQL is running
- Check database credentials
- Ensure database exists

### Frontend Issues

**Port 3000 in use:**
- The app will prompt to use another port
- Or set PORT=3001 in .env file

**API connection error:**
- Ensure backend is running
- Check REACT_APP_API_URL in .env

## Next Steps

1. **Add More Modules**: Expand doctors, appointments, lab tests, pharmacy, and billing modules
2. **Implement Reporting**: Add analytics and reporting dashboards
3. **Add File Uploads**: Implement document/image upload for medical records
4. **Enhance Security**: Add email verification, password reset, 2FA
5. **Add Notifications**: Implement real-time notifications for appointments, test results
6. **Mobile App**: Create mobile applications using React Native
7. **Integration**: Connect with external systems (insurance, accounting, lab equipment)

## Support

For issues or questions, refer to:
- API Documentation: http://localhost:8080/api/swagger-ui.html
- README.md in the project root
