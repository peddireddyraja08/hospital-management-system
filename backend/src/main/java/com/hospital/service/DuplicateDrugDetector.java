package com.hospital.service;

import com.hospital.dto.DuplicateDrugAlert;
import com.hospital.entity.PhysicianOrder;
import com.hospital.entity.Prescription;
import com.hospital.enums.OrderStatus;
import com.hospital.enums.PrescriptionStatus;
import com.hospital.repository.PhysicianOrderRepository;
import com.hospital.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class DuplicateDrugDetector {

    private final PhysicianOrderRepository physicianOrderRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final DrugAllergyChecker drugAllergyChecker;

    // Therapeutic equivalents
    private static final Map<String, List<String>> THERAPEUTIC_EQUIVALENTS = new HashMap<>();
    
    static {
        // Proton Pump Inhibitors
        THERAPEUTIC_EQUIVALENTS.put("PPI", Arrays.asList(
                "omeprazole", "pantoprazole", "esomeprazole", "lansoprazole", "rabeprazole"
        ));
        
        // ACE Inhibitors
        THERAPEUTIC_EQUIVALENTS.put("ACE_INHIBITOR", Arrays.asList(
                "lisinopril", "enalapril", "ramipril", "captopril", "perindopril"
        ));
        
        // ARBs (Angiotensin Receptor Blockers)
        THERAPEUTIC_EQUIVALENTS.put("ARB", Arrays.asList(
                "losartan", "valsartan", "irbesartan", "telmisartan", "candesartan"
        ));
        
        // Beta Blockers
        THERAPEUTIC_EQUIVALENTS.put("BETA_BLOCKER", Arrays.asList(
                "metoprolol", "atenolol", "propranolol", "carvedilol", "bisoprolol"
        ));
        
        // Statins
        THERAPEUTIC_EQUIVALENTS.put("STATIN", Arrays.asList(
                "atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lovastatin"
        ));
        
        // H2 Blockers
        THERAPEUTIC_EQUIVALENTS.put("H2_BLOCKER", Arrays.asList(
                "ranitidine", "famotidine", "cimetidine", "nizatidine"
        ));
        
        // Benzodiazepines
        THERAPEUTIC_EQUIVALENTS.put("BENZODIAZEPINE", Arrays.asList(
                "diazepam", "lorazepam", "alprazolam", "clonazepam", "midazolam"
        ));
    }

    /**
     * Check for duplicate medications
     */
    public List<DuplicateDrugAlert> checkDuplicates(Long patientId, String drugName, LocalDateTime orderDate) {
        List<DuplicateDrugAlert> alerts = new ArrayList<>();
        String normalizedDrugName = drugName.toLowerCase().trim();

        // Get active orders for patient
        List<PhysicianOrder> activeOrders = physicianOrderRepository.findByPatientIdAndOrderType(patientId, "MEDICATION")
                .stream()
                .filter(order -> order.getStatus() != OrderStatus.COMPLETED && 
                               order.getStatus() != OrderStatus.CANCELLED)
                .toList();

        // Get active prescriptions
        List<Prescription> activePrescriptions = prescriptionRepository.findByPatientId(patientId)
                .stream()
                .filter(rx -> rx.getStatus() != PrescriptionStatus.DISPENSED && 
                            rx.getStatus() != PrescriptionStatus.CANCELLED &&
                            rx.getStatus() != PrescriptionStatus.EXPIRED)
                .toList();

        // Check for exact duplicates in orders
        for (PhysicianOrder order : activeOrders) {
            String existingDrug = extractDrugName(order.getOrderDetails());
            if (existingDrug != null && existingDrug.equalsIgnoreCase(normalizedDrugName)) {
                alerts.add(DuplicateDrugAlert.builder()
                        .alertType("EXACT_DUPLICATE")
                        .severity("HIGH")
                        .drugName(drugName)
                        .existingDrug(existingDrug)
                        .existingOrderDate(order.getCreatedAt())
                        .recommendation("DUPLICATE ORDER: Same medication already ordered. Consider cancelling existing order or modifying dose.")
                        .requiresReview(true)
                        .build());
                
                log.warn("DUPLICATE ORDER: {} already ordered for patient on {}", drugName, order.getCreatedAt());
            }
        }

        // Check for exact duplicates in prescriptions
        for (Prescription rx : activePrescriptions) {
            String existingDrug = rx.getMedication().getMedicationName();
            if (existingDrug != null && existingDrug.toLowerCase().equals(normalizedDrugName)) {
                alerts.add(DuplicateDrugAlert.builder()
                        .alertType("EXACT_DUPLICATE")
                        .severity("HIGH")
                        .drugName(drugName)
                        .existingDrug(existingDrug)
                        .existingOrderDate(rx.getCreatedAt())
                        .recommendation("DUPLICATE PRESCRIPTION: Same medication already prescribed. Review existing prescription.")
                        .requiresReview(true)
                        .build());
            }
        }

        // Check for therapeutic duplicates
        String newDrugClass = getTherapeuticClass(normalizedDrugName);
        if (newDrugClass != null) {
            // Check orders
            for (PhysicianOrder order : activeOrders) {
                String existingDrug = extractDrugName(order.getOrderDetails());
                if (existingDrug != null) {
                    String existingDrugClass = getTherapeuticClass(existingDrug.toLowerCase());
                    if (newDrugClass.equals(existingDrugClass)) {
                        alerts.add(DuplicateDrugAlert.builder()
                                .alertType("THERAPEUTIC_DUPLICATE")
                                .severity("MEDIUM")
                                .drugName(drugName)
                                .existingDrug(existingDrug)
                                .drugClass(newDrugClass)
                                .therapeuticCategory(newDrugClass)
                                .existingOrderDate(order.getCreatedAt())
                                .recommendation("THERAPEUTIC DUPLICATE: Patient already on " + existingDrug + " (" + newDrugClass + "). Consider using only one.")
                                .requiresReview(true)
                                .build());
                        
                        log.info("Therapeutic duplicate detected: {} and {} are both {}", drugName, existingDrug, newDrugClass);
                    }
                }
            }

            // Check prescriptions
            for (Prescription rx : activePrescriptions) {
                String existingDrug = rx.getMedication().getMedicationName().toLowerCase();
                String existingDrugClass = getTherapeuticClass(existingDrug);
                if (newDrugClass.equals(existingDrugClass)) {
                    alerts.add(DuplicateDrugAlert.builder()
                            .alertType("THERAPEUTIC_DUPLICATE")
                            .severity("MEDIUM")
                            .drugName(drugName)
                            .existingDrug(rx.getMedication().getMedicationName())
                            .drugClass(newDrugClass)
                            .therapeuticCategory(newDrugClass)
                            .existingOrderDate(rx.getCreatedAt())
                            .recommendation("THERAPEUTIC DUPLICATE: Patient already prescribed " + rx.getMedication().getMedicationName() + " (" + newDrugClass + ").")
                            .requiresReview(true)
                            .build());
                }
            }
        }

        // Check for same drug class (using allergy checker's drug class map)
        for (PhysicianOrder order : activeOrders) {
            String existingDrug = extractDrugName(order.getOrderDetails());
            if (existingDrug != null && drugAllergyChecker.isSameClass(normalizedDrugName, existingDrug)) {
                alerts.add(DuplicateDrugAlert.builder()
                        .alertType("SAME_CLASS")
                        .severity("LOW")
                        .drugName(drugName)
                        .existingDrug(existingDrug)
                        .recommendation("INFO: Same drug class as existing order. Review for appropriateness.")
                        .requiresReview(false)
                        .build());
            }
        }

        return alerts;
    }

    /**
     * Extract drug name from order details string
     */
    private String extractDrugName(String orderDetails) {
        if (orderDetails == null) return null;
        // Assuming format like "Drug: Aspirin, Dose: 100mg"
        if (orderDetails.toLowerCase().contains("drug:")) {
            String[] parts = orderDetails.split(",");
            for (String part : parts) {
                if (part.toLowerCase().contains("drug:")) {
                    return part.split(":")[1].trim();
                }
            }
        }
        return null;
    }

    /**
     * Get therapeutic class for drug
     */
    private String getTherapeuticClass(String drugName) {
        for (Map.Entry<String, List<String>> entry : THERAPEUTIC_EQUIVALENTS.entrySet()) {
            if (entry.getValue().contains(drugName.toLowerCase())) {
                return entry.getKey();
            }
        }
        return null;
    }

    /**
     * Check if drugs are therapeutic equivalents
     */
    public boolean areTherapeuticEquivalents(String drug1, String drug2) {
        String class1 = getTherapeuticClass(drug1.toLowerCase());
        String class2 = getTherapeuticClass(drug2.toLowerCase());
        return class1 != null && class1.equals(class2);
    }
}
