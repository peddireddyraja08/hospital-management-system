package com.hospital.service;

import com.hospital.entity.Patient;
import com.hospital.enums.PatientType;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;
    private final IdGeneratorService idGeneratorService;

    public Patient createPatient(Patient patient) {
        // Generate unique patient ID based on patient type
        if (patient.getPatientId() == null || patient.getPatientId().isEmpty()) {
            String prefix = (patient.getPatientType() == PatientType.INPATIENT) ? "IN" : "OUT";
            patient.setPatientId(idGeneratorService.generateId(prefix));
        }
        
        // Set default patient type if not specified
        if (patient.getPatientType() == null) {
            patient.setPatientType(PatientType.OUTPATIENT);
        }
        
        // Convert empty email to null to avoid unique constraint violation
        if (patient.getEmail() != null && patient.getEmail().trim().isEmpty()) {
            patient.setEmail(null);
        }
        
        // Handle empty string values for optional fields - convert to null
        if (patient.getPhoneNumber() != null && patient.getPhoneNumber().trim().isEmpty()) {
            patient.setPhoneNumber(null);
        }
        if (patient.getAddress() != null && patient.getAddress().trim().isEmpty()) {
            patient.setAddress(null);
        }
        if (patient.getEmergencyContactName() != null && patient.getEmergencyContactName().trim().isEmpty()) {
            patient.setEmergencyContactName(null);
        }
        if (patient.getEmergencyContactNumber() != null && patient.getEmergencyContactNumber().trim().isEmpty()) {
            patient.setEmergencyContactNumber(null);
        }
        if (patient.getInsuranceNumber() != null && patient.getInsuranceNumber().trim().isEmpty()) {
            patient.setInsuranceNumber(null);
        }
        if (patient.getInsuranceProvider() != null && patient.getInsuranceProvider().trim().isEmpty()) {
            patient.setInsuranceProvider(null);
        }
        if (patient.getAllergies() != null && patient.getAllergies().trim().isEmpty()) {
            patient.setAllergies(null);
        }
        if (patient.getMedicalHistory() != null && patient.getMedicalHistory().trim().isEmpty()) {
            patient.setMedicalHistory(null);
        }
        
        patient.setIsActive(true);
        return patientRepository.save(patient);
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
    }

    public Patient getPatientByPatientId(String patientId) {
        return patientRepository.findByPatientId(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "patientId", patientId));
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient updatePatient(Long id, Patient patientDetails) {
        Patient patient = getPatientById(id);
        
        patient.setFirstName(patientDetails.getFirstName());
        patient.setLastName(patientDetails.getLastName());
        patient.setDateOfBirth(patientDetails.getDateOfBirth());
        patient.setGender(patientDetails.getGender());
        patient.setBloodGroup(patientDetails.getBloodGroup());
        patient.setPhoneNumber(patientDetails.getPhoneNumber());
        
        // Convert empty email to null to avoid unique constraint violation
        String email = patientDetails.getEmail();
        patient.setEmail((email != null && email.trim().isEmpty()) ? null : email);
        
        patient.setAddress(patientDetails.getAddress());
        patient.setEmergencyContactName(patientDetails.getEmergencyContactName());
        patient.setEmergencyContactNumber(patientDetails.getEmergencyContactNumber());
        patient.setInsuranceNumber(patientDetails.getInsuranceNumber());
        patient.setInsuranceProvider(patientDetails.getInsuranceProvider());
        patient.setAllergies(patientDetails.getAllergies());
        patient.setMedicalHistory(patientDetails.getMedicalHistory());
        
        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        Patient patient = getPatientById(id);
        patient.setIsDeleted(true);
        patient.setIsActive(false);
        patientRepository.save(patient);
    }

    public Patient searchByEmail(String email) {
        return patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "email", email));
    }
}
