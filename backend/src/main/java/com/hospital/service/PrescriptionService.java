package com.hospital.service;

import com.hospital.entity.Medication;
import com.hospital.entity.Prescription;
import com.hospital.enums.PrescriptionStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.MedicationRepository;
import com.hospital.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicationRepository medicationRepository;

    public Prescription createPrescription(Prescription prescription) {
        prescription.setPrescribedDate(LocalDateTime.now());
        prescription.setStatus(PrescriptionStatus.PENDING);
        prescription.setIsActive(true);
        return prescriptionRepository.save(prescription);
    }

    public Prescription getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "id", id));
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public List<Prescription> getPrescriptionsByPatientId(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPrescriptionsByDoctorId(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    public List<Prescription> getPrescriptionsByStatus(PrescriptionStatus status) {
        return prescriptionRepository.findByStatus(status);
    }

    public Prescription dispensePrescription(Long id, String dispensedBy) {
        Prescription prescription = getPrescriptionById(id);
        Medication medication = prescription.getMedication();
        
        // Check stock availability
        if (medication.getStockQuantity() < prescription.getQuantity()) {
            throw new IllegalStateException("Insufficient stock for medication: " + medication.getMedicationName());
        }
        
        // Update medication stock
        medication.setStockQuantity(medication.getStockQuantity() - prescription.getQuantity());
        medicationRepository.save(medication);
        
        // Update prescription
        prescription.setStatus(PrescriptionStatus.DISPENSED);
        prescription.setDispensedDate(LocalDateTime.now());
        prescription.setDispensedBy(dispensedBy);
        
        return prescriptionRepository.save(prescription);
    }

    public Prescription partiallyDispensePrescription(Long id, Integer dispensedQuantity, String dispensedBy) {
        Prescription prescription = getPrescriptionById(id);
        Medication medication = prescription.getMedication();
        
        // Check stock availability
        if (medication.getStockQuantity() < dispensedQuantity) {
            throw new IllegalStateException("Insufficient stock for medication: " + medication.getMedicationName());
        }
        
        // Update medication stock
        medication.setStockQuantity(medication.getStockQuantity() - dispensedQuantity);
        medicationRepository.save(medication);
        
        // Update prescription
        prescription.setStatus(PrescriptionStatus.PARTIALLY_DISPENSED);
        prescription.setDispensedDate(LocalDateTime.now());
        prescription.setDispensedBy(dispensedBy);
        
        return prescriptionRepository.save(prescription);
    }

    public Prescription updatePrescription(Long id, Prescription prescriptionDetails) {
        Prescription prescription = getPrescriptionById(id);
        
        prescription.setDosage(prescriptionDetails.getDosage());
        prescription.setFrequency(prescriptionDetails.getFrequency());
        prescription.setDuration(prescriptionDetails.getDuration());
        prescription.setQuantity(prescriptionDetails.getQuantity());
        prescription.setInstructions(prescriptionDetails.getInstructions());
        prescription.setStartDate(prescriptionDetails.getStartDate());
        prescription.setEndDate(prescriptionDetails.getEndDate());
        
        return prescriptionRepository.save(prescription);
    }

    public void cancelPrescription(Long id) {
        Prescription prescription = getPrescriptionById(id);
        prescription.setStatus(PrescriptionStatus.CANCELLED);
        prescriptionRepository.save(prescription);
    }
}
