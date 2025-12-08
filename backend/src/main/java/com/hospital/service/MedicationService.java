package com.hospital.service;

import com.hospital.entity.Medication;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.MedicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final IdGeneratorService idGeneratorService;

    public Medication createMedication(Medication medication) {
        // Generate unique medication code if not provided
        if (medication.getMedicationCode() == null || medication.getMedicationCode().isEmpty()) {
            medication.setMedicationCode(idGeneratorService.generateId("MED"));
        }
        medication.setIsActive(true);
        return medicationRepository.save(medication);
    }

    public Medication getMedicationById(Long id) {
        return medicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medication", "id", id));
    }

    public Medication getMedicationByCode(String medicationCode) {
        return medicationRepository.findByMedicationCode(medicationCode)
                .orElseThrow(() -> new ResourceNotFoundException("Medication", "medicationCode", medicationCode));
    }

    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    public List<Medication> getMedicationsByCategory(String category) {
        return medicationRepository.findByCategory(category);
    }

    public List<Medication> getLowStockMedications() {
        return medicationRepository.findByStockQuantityLessThanReorderLevel();
    }

    public Medication updateMedication(Long id, Medication medicationDetails) {
        Medication medication = getMedicationById(id);
        
        medication.setMedicationName(medicationDetails.getMedicationName());
        medication.setGenericName(medicationDetails.getGenericName());
        medication.setBrandName(medicationDetails.getBrandName());
        medication.setCategory(medicationDetails.getCategory());
        medication.setDosageForm(medicationDetails.getDosageForm());
        medication.setStrength(medicationDetails.getStrength());
        medication.setUnitPrice(medicationDetails.getUnitPrice());
        medication.setStockQuantity(medicationDetails.getStockQuantity());
        medication.setReorderLevel(medicationDetails.getReorderLevel());
        medication.setManufacturer(medicationDetails.getManufacturer());
        medication.setExpiryAlertDays(medicationDetails.getExpiryAlertDays());
        medication.setDescription(medicationDetails.getDescription());
        medication.setStorageInstructions(medicationDetails.getStorageInstructions());
        
        return medicationRepository.save(medication);
    }

    public Medication updateStock(Long id, Integer quantity) {
        Medication medication = getMedicationById(id);
        medication.setStockQuantity(medication.getStockQuantity() + quantity);
        return medicationRepository.save(medication);
    }

    public void deleteMedication(Long id) {
        Medication medication = getMedicationById(id);
        medication.setIsDeleted(true);
        medication.setIsActive(false);
        medicationRepository.save(medication);
    }
}
