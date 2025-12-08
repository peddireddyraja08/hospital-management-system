package com.hospital.service;

import com.hospital.dto.DrugAllergyAlert;
import com.hospital.entity.Patient;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class DrugAllergyChecker {

    private final PatientRepository patientRepository;

    // Drug class mappings for cross-allergy detection
    private static final Map<String, List<String>> DRUG_CLASS_MAP = new HashMap<>();
    private static final Map<String, String> CROSS_ALLERGY_MAP = new HashMap<>();

    static {
        // Beta-lactam antibiotics (penicillin family)
        DRUG_CLASS_MAP.put("PENICILLIN", Arrays.asList(
                "amoxicillin", "ampicillin", "penicillin", "piperacillin", "ticarcillin"
        ));
        DRUG_CLASS_MAP.put("CEPHALOSPORIN", Arrays.asList(
                "cefazolin", "ceftriaxone", "cefuroxime", "cephalexin", "cefixime", "cefotaxime"
        ));
        DRUG_CLASS_MAP.put("CARBAPENEM", Arrays.asList(
                "meropenem", "imipenem", "ertapenem", "doripenem"
        ));

        // NSAIDs
        DRUG_CLASS_MAP.put("NSAID", Arrays.asList(
                "ibuprofen", "naproxen", "diclofenac", "aspirin", "indomethacin", "ketorolac"
        ));

        // Sulfonamides
        DRUG_CLASS_MAP.put("SULFONAMIDE", Arrays.asList(
                "sulfamethoxazole", "trimethoprim", "sulfasalazine", "sulfadiazine"
        ));

        // Opioids
        DRUG_CLASS_MAP.put("OPIOID", Arrays.asList(
                "morphine", "codeine", "oxycodone", "hydrocodone", "fentanyl", "tramadol"
        ));

        // Cross-allergy relationships
        CROSS_ALLERGY_MAP.put("PENICILLIN->CEPHALOSPORIN", "10% cross-reactivity");
        CROSS_ALLERGY_MAP.put("PENICILLIN->CARBAPENEM", "1-2% cross-reactivity");
        CROSS_ALLERGY_MAP.put("CEPHALOSPORIN->CARBAPENEM", "Low cross-reactivity");
    }

    /**
     * Check patient allergies against prescribed drug
     */
    public List<DrugAllergyAlert> checkAllergies(Long patientId, String drugName) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        List<DrugAllergyAlert> alerts = new ArrayList<>();
        String normalizedDrugName = drugName.toLowerCase().trim();

        // Get patient allergies (assuming stored in Patient entity or related table)
        String patientAllergies = patient.getAllergies(); // This should be a comma-separated string or JSON

        if (patientAllergies == null || patientAllergies.isEmpty()) {
            log.debug("No allergies recorded for patient {}", patient.getPatientId());
            return alerts;
        }

        // Parse patient allergies
        List<String> allergyList = Arrays.stream(patientAllergies.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .toList();

        // Check for exact match
        if (allergyList.contains(normalizedDrugName)) {
            alerts.add(DrugAllergyAlert.builder()
                    .allergyType("KNOWN_ALLERGY")
                    .severity("SEVERE")
                    .drugName(drugName)
                    .allergen(drugName)
                    .reaction("Known allergy documented")
                    .recommendation("DO NOT PRESCRIBE. Consider alternative medication.")
                    .requiresOverride(true)
                    .build());
            
            log.warn("ALLERGY ALERT: Patient {} has known allergy to {}", patient.getPatientId(), drugName);
            return alerts; // Critical - return immediately
        }

        // Check for cross-allergies
        String prescribedDrugClass = getDrugClass(normalizedDrugName);
        if (prescribedDrugClass != null) {
            for (String allergy : allergyList) {
                String allergyClass = getDrugClass(allergy);
                if (allergyClass != null && !allergyClass.equals(prescribedDrugClass)) {
                    String crossAllergyKey = allergyClass + "->" + prescribedDrugClass;
                    if (CROSS_ALLERGY_MAP.containsKey(crossAllergyKey)) {
                        String severity = getCrossAllergySeverity(allergyClass, prescribedDrugClass);
                        alerts.add(DrugAllergyAlert.builder()
                                .allergyType("CROSS_ALLERGY")
                                .severity(severity)
                                .drugName(drugName)
                                .allergen(allergy)
                                .reaction(CROSS_ALLERGY_MAP.get(crossAllergyKey))
                                .recommendation("Consider alternative. If necessary, administer with caution and monitoring.")
                                .requiresOverride("SEVERE".equals(severity) || "LIFE_THREATENING".equals(severity))
                                .build());
                        
                        log.warn("CROSS-ALLERGY ALERT: Patient {} allergic to {} may react to {} ({})", 
                                patient.getPatientId(), allergy, drugName, prescribedDrugClass);
                    }
                }
            }
        }

        // Check for drug class allergies
        if (prescribedDrugClass != null) {
            if (allergyList.contains(prescribedDrugClass.toLowerCase())) {
                alerts.add(DrugAllergyAlert.builder()
                        .allergyType("KNOWN_ALLERGY")
                        .severity("SEVERE")
                        .drugName(drugName)
                        .allergen(prescribedDrugClass)
                        .reaction("Patient allergic to " + prescribedDrugClass + " class")
                        .recommendation("DO NOT PRESCRIBE. Select drug from different class.")
                        .requiresOverride(true)
                        .build());
            }
        }

        return alerts;
    }

    /**
     * Get drug class for a given drug name
     */
    private String getDrugClass(String drugName) {
        String normalized = drugName.toLowerCase();
        for (Map.Entry<String, List<String>> entry : DRUG_CLASS_MAP.entrySet()) {
            if (entry.getValue().contains(normalized)) {
                return entry.getKey();
            }
        }
        return null;
    }

    /**
     * Determine severity of cross-allergy
     */
    private String getCrossAllergySeverity(String allergyClass, String drugClass) {
        String key = allergyClass + "->" + drugClass;
        String reaction = CROSS_ALLERGY_MAP.get(key);
        
        if (reaction != null) {
            if (reaction.contains("10%")) return "SEVERE";
            if (reaction.contains("1-2%")) return "MODERATE";
            if (reaction.contains("Low")) return "MILD";
        }
        
        return "MODERATE";
    }

    /**
     * Get related drugs in same class
     */
    public List<String> getRelatedDrugs(String drugName) {
        String drugClass = getDrugClass(drugName.toLowerCase());
        if (drugClass != null) {
            return DRUG_CLASS_MAP.get(drugClass);
        }
        return Collections.emptyList();
    }

    /**
     * Check if two drugs are in same class
     */
    public boolean isSameClass(String drug1, String drug2) {
        String class1 = getDrugClass(drug1.toLowerCase());
        String class2 = getDrugClass(drug2.toLowerCase());
        return class1 != null && class1.equals(class2);
    }
}
