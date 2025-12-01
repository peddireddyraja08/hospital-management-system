# Hospital Management System

A comprehensive, fully automated hospital management system with a 3-layer architecture.

## Architecture

### Presentation Layer
- **Technology**: React with Material UI
- **Features**: Patient Portal, Doctor Portal, Admin Dashboard

### Business Logic Layer
- **Technology**: Spring Boot (Java) with REST APIs
- **Features**: Business rules, validation, orchestration

### Data Access Layer
- **Technology**: Spring Data JPA (Hibernate + PostgreSQL)
- **Features**: Database operations, transaction management

## Modules

1. **Patient & Clinical Management** - Patient registration, EMR/EHR, vital signs, clinical documentation, CPOE
2. **Lab & Diagnostics** - Lab test management, result entry, RIS integration
3. **Pharmacy & Medication Management** - Inventory, stock management, MAR, E-Prescribing
4. **Staff & Resource Management** - User management, scheduling, bed management, OT management
5. **Billing & Financial Management** - Billing, payments, insurance/TPA, accounting integration
6. **Reporting & Analytics** - Dashboards, KPIs, data export, auditing, compliance
7. **Patient & Doctor Portals** - Online booking, records access, remote EMR access

## Project Structure

```
hospital-management-system/
├── backend/                 # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── application.properties
├── frontend/               # React application
│   ├── src/
│   ├── package.json
│   └── public/
└── database/              # Database scripts
    └── schema.sql
```

## Setup Instructions

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Database Setup
1. Install PostgreSQL
2. Create database: `CREATE DATABASE hospital_management;`
3. Run schema.sql
4. Update application.properties with your database credentials

## Default Ports
- Backend: http://localhost:8080
- Frontend: http://localhost:3000
- Database: PostgreSQL on port 5432

## Default Credentials
- Admin: admin@hospital.com / admin123
- Doctor: doctor@hospital.com / doctor123
- Patient: patient@hospital.com / patient123
