-- Database Schema for Hospital Management System

-- Create database
CREATE DATABASE IF NOT EXISTS hospital_management;

-- ID Counter Table (for sequential ID generation)
CREATE TABLE id_counter (
    id BIGSERIAL PRIMARY KEY,
    module_prefix VARCHAR(10) NOT NULL,
    date_key VARCHAR(8) NOT NULL,
    last_sequence INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(module_prefix, date_key)
);

-- Create index for faster lookups
CREATE INDEX idx_id_counter_module_date ON id_counter(module_prefix, date_key);

-- Users and Authentication
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

CREATE TABLE user_roles (
    user_id BIGINT REFERENCES users(id),
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role)
);

-- Patients
CREATE TABLE patients (
    id BIGSERIAL PRIMARY KEY,
    patient_id VARCHAR(50) UNIQUE NOT NULL,
    patient_type VARCHAR(20) NOT NULL DEFAULT 'OUTPATIENT',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    phone_number VARCHAR(20),
    email VARCHAR(150) UNIQUE,
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_number VARCHAR(20),
    insurance_number VARCHAR(100),
    insurance_provider VARCHAR(100),
    allergies TEXT,
    medical_history TEXT,
    user_id BIGINT REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Doctors
CREATE TABLE doctors (
    id BIGSERIAL PRIMARY KEY,
    doctor_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    date_of_birth DATE,
    phone_number VARCHAR(20),
    email VARCHAR(150) UNIQUE,
    specialization VARCHAR(100),
    license_number VARCHAR(100) UNIQUE,
    qualification VARCHAR(255),
    years_of_experience INTEGER,
    consultation_fee DECIMAL(10,2),
    address TEXT,
    user_id BIGINT REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Staff
CREATE TABLE staff (
    id BIGSERIAL PRIMARY KEY,
    staff_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    date_of_birth DATE,
    phone_number VARCHAR(20),
    email VARCHAR(150) UNIQUE,
    department VARCHAR(100),
    designation VARCHAR(100),
    qualification VARCHAR(255),
    joining_date DATE,
    salary DECIMAL(10,2),
    address TEXT,
    user_id BIGINT REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Appointments
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES patients(id),
    doctor_id BIGINT REFERENCES doctors(id),
    appointment_date TIMESTAMP,
    duration INTEGER,
    status VARCHAR(50),
    reason TEXT,
    notes TEXT,
    appointment_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Medical Records
CREATE TABLE medical_records (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES patients(id),
    doctor_id BIGINT REFERENCES doctors(id),
    visit_date TIMESTAMP,
    chief_complaint TEXT,
    present_illness TEXT,
    examination_findings TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    prescriptions TEXT,
    notes TEXT,
    follow_up_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Vital Signs
CREATE TABLE vital_signs (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES patients(id),
    recorded_at TIMESTAMP,
    temperature DECIMAL(5,2),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    respiratory_rate INTEGER,
    oxygen_saturation DECIMAL(5,2),
    weight DECIMAL(6,2),
    height DECIMAL(6,2),
    bmi DECIMAL(5,2),
    recorded_by VARCHAR(100),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Physician Orders (CPOE)
CREATE TABLE physician_orders (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES patients(id),
    doctor_id BIGINT REFERENCES doctors(id),
    order_type VARCHAR(100),
    order_details TEXT,
    status VARCHAR(50),
    priority VARCHAR(50),
    ordered_at TIMESTAMP,
    scheduled_for TIMESTAMP,
    completed_at TIMESTAMP,
    instructions TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Lab Tests
CREATE TABLE lab_tests (
    id BIGSERIAL PRIMARY KEY,
    test_code VARCHAR(50) UNIQUE NOT NULL,
    test_name VARCHAR(200) NOT NULL,
    description TEXT,
    test_category VARCHAR(100),
    price DECIMAL(10,2),
    normal_range VARCHAR(100),
    normal_range_male VARCHAR(100),
    normal_range_female VARCHAR(100),
    normal_range_child VARCHAR(100),
    unit VARCHAR(50),
    sample_type VARCHAR(100),
    sample_volume VARCHAR(50),
    sample_container VARCHAR(100),
    preparation_instructions TEXT,
    turnaround_time INTEGER,
    critical_low VARCHAR(50),
    critical_high VARCHAR(50),
    is_profile BOOLEAN DEFAULT FALSE,
    profile_tests TEXT,
    department VARCHAR(100),
    method VARCHAR(200),
    requires_fasting BOOLEAN DEFAULT FALSE,
    sample_required BOOLEAN DEFAULT TRUE,
    result_type VARCHAR(50) DEFAULT 'NUMERIC',
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Lab Test Requests
CREATE TABLE lab_test_requests (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES patients(id),
    doctor_id BIGINT REFERENCES doctors(id),
    lab_test_id BIGINT REFERENCES lab_tests(id),
    request_date TIMESTAMP,
    sample_collected_date TIMESTAMP,
    status VARCHAR(50),
    priority VARCHAR(50),
    clinical_notes TEXT,
    sample_type VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Lab Test Results
CREATE TABLE lab_test_results (
    id BIGSERIAL PRIMARY KEY,
    test_request_id BIGINT REFERENCES lab_test_requests(id),
    result_value VARCHAR(255),
    result_date TIMESTAMP,
    is_abnormal BOOLEAN,
    interpretation TEXT,
    technician_notes TEXT,
    tested_by VARCHAR(100),
    verified_by VARCHAR(100),
    verified_at TIMESTAMP,
    report_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Medications
CREATE TABLE medications (
    id BIGSERIAL PRIMARY KEY,
    medication_code VARCHAR(50) UNIQUE NOT NULL,
    medication_name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    brand_name VARCHAR(200),
    category VARCHAR(100),
    dosage_form VARCHAR(100),
    strength VARCHAR(50),
    unit_price DECIMAL(10,2),
    stock_quantity INTEGER,
    reorder_level INTEGER,
    manufacturer VARCHAR(200),
    expiry_alert_days INTEGER,
    description TEXT,
    storage_instructions VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Medication Inventory
CREATE TABLE medication_inventory (
    id BIGSERIAL PRIMARY KEY,
    medication_id BIGINT REFERENCES medications(id),
    batch_number VARCHAR(100),
    quantity INTEGER,
    manufacturing_date DATE,
    expiry_date DATE,
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    supplier_name VARCHAR(200),
    is_expired BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Prescriptions
CREATE TABLE prescriptions (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES patients(id),
    doctor_id BIGINT REFERENCES doctors(id),
    medication_id BIGINT REFERENCES medications(id),
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    quantity INTEGER,
    instructions TEXT,
    prescribed_date TIMESTAMP,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),
    dispensed_date TIMESTAMP,
    dispensed_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Beds
CREATE TABLE beds (
    id BIGSERIAL PRIMARY KEY,
    bed_number VARCHAR(50) UNIQUE NOT NULL,
    ward_name VARCHAR(100),
    bed_type VARCHAR(50),
    status VARCHAR(50),
    floor_number INTEGER,
    room_number VARCHAR(50),
    daily_charge DECIMAL(10,2),
    current_patient_id BIGINT REFERENCES patients(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Bills
CREATE TABLE bills (
    id BIGSERIAL PRIMARY KEY,
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id BIGINT REFERENCES patients(id),
    bill_date TIMESTAMP,
    consultation_charges DECIMAL(10,2),
    lab_charges DECIMAL(10,2),
    medication_charges DECIMAL(10,2),
    room_charges DECIMAL(10,2),
    procedure_charges DECIMAL(10,2),
    other_charges DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    paid_amount DECIMAL(10,2),
    due_amount DECIMAL(10,2),
    status VARCHAR(50),
    payment_method VARCHAR(50),
    insurance_claim_amount DECIMAL(10,2),
    insurance_approved_amount DECIMAL(10,2),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Create Indexes for better performance
CREATE INDEX idx_patients_patient_id ON patients(patient_id);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_doctors_doctor_id ON doctors(doctor_id);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_bills_patient_id ON bills(patient_id);
CREATE INDEX idx_bills_bill_number ON bills(bill_number);
