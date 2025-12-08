package com.hospital.service;

import com.hospital.dto.DoseValidationResult;
import com.hospital.entity.Patient;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoseValidator {

    private final PatientRepository patientRepository;

    // Dose range database (drug name -> dose ranges by age/weight)
    private static final Map<String, DoseRange> DOSE_RANGES = new HashMap<>();

    static {
        // Acetaminophen (Paracetamol)
        DOSE_RANGES.put("acetaminophen", DoseRange.builder()
                .adultMinDose(325.0).adultMaxDose(1000.0).adultMaxDaily(4000.0)
                .pediatricDosePerKg(10.0).pediatricMaxDosePerKg(15.0).pediatricMaxDaily(75.0)
                .unit("mg")
                .build());

        // Ibuprofen
        DOSE_RANGES.put("ibuprofen", DoseRange.builder()
                .adultMinDose(200.0).adultMaxDose(800.0).adultMaxDaily(3200.0)
                .pediatricDosePerKg(5.0).pediatricMaxDosePerKg(10.0).pediatricMaxDaily(40.0)
                .unit("mg")
                .build());

        // Amoxicillin
        DOSE_RANGES.put("amoxicillin", DoseRange.builder()
                .adultMinDose(250.0).adultMaxDose(1000.0).adultMaxDaily(3000.0)
                .pediatricDosePerKg(20.0).pediatricMaxDosePerKg(40.0).pediatricMaxDaily(100.0)
                .unit("mg")
                .build());

        // Aspirin
        DOSE_RANGES.put("aspirin", DoseRange.builder()
                .adultMinDose(75.0).adultMaxDose(1000.0).adultMaxDaily(4000.0)
                .pediatricDosePerKg(0.0).pediatricMaxDosePerKg(0.0).pediatricMaxDaily(0.0) // Not for children <12
                .unit("mg")
                .contraindication("Not recommended for children under 12 years (Reye's syndrome risk)")
                .build());

        // Metformin
        DOSE_RANGES.put("metformin", DoseRange.builder()
                .adultMinDose(500.0).adultMaxDose(1000.0).adultMaxDaily(2550.0)
                .requiresRenalFunction(true)
                .renalAdjustment("Contraindicated if eGFR < 30 mL/min")
                .unit("mg")
                .build());

        // Morphine
        DOSE_RANGES.put("morphine", DoseRange.builder()
                .adultMinDose(2.5).adultMaxDose(15.0).adultMaxDaily(120.0)
                .pediatricDosePerKg(0.1).pediatricMaxDosePerKg(0.2).pediatricMaxDaily(2.0)
                .unit("mg")
                .requiresWeightBased(true)
                .build());

        // Warfarin
        DOSE_RANGES.put("warfarin", DoseRange.builder()
                .adultMinDose(1.0).adultMaxDose(10.0).adultMaxDaily(10.0)
                .requiresINRMonitoring(true)
                .unit("mg")
                .contraindication("Requires INR monitoring, adjust based on INR")
                .build());

        // Digoxin
        DOSE_RANGES.put("digoxin", DoseRange.builder()
                .adultMinDose(0.0625).adultMaxDose(0.25).adultMaxDaily(0.25)
                .requiresRenalFunction(true)
                .renalAdjustment("Reduce dose if eGFR < 50 mL/min")
                .unit("mg")
                .build());
    }

    /**
     * Validate dose based on patient parameters
     */
    public DoseValidationResult validateDose(Long patientId, String drugName, Double dose, String unit, String frequency) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        String normalizedDrugName = drugName.toLowerCase().trim();
        DoseRange doseRange = DOSE_RANGES.get(normalizedDrugName);

        if (doseRange == null) {
            // No dose range data available
            return DoseValidationResult.builder()
                    .isValid(true)
                    .validationType("NO_DATA")
                    .severity("INFO")
                    .prescribedDose(dose)
                    .prescribedUnit(unit)
                    .message("No dose range data available for " + drugName)
                    .recommendation("Verify dose against drug reference")
                    .build();
        }

        DoseValidationResult result = DoseValidationResult.builder()
                .prescribedDose(dose)
                .prescribedUnit(unit)
                .recommendedUnit(doseRange.getUnit())
                .build();

        // Calculate patient age
        int ageYears = Period.between(patient.getDateOfBirth(), LocalDate.now()).getYears();
        boolean isPediatric = ageYears < 18;

        // Age-based validation
        if (isPediatric) {
            result.setValidationType("AGE_BASED");
            result.setPatientFactor("Age: " + ageYears + " years");

            // Check if drug is contraindicated in children
            if (doseRange.getContraindication() != null && doseRange.getContraindication().contains("children")) {
                result.setIsValid(false);
                result.setSeverity("CRITICAL");
                result.setMessage("CONTRAINDICATED: " + doseRange.getContraindication());
                result.setRecommendation("Consider alternative medication suitable for pediatric use");
                return result;
            }

            // Weight-based validation for pediatric patients
            if (doseRange.getPediatricDosePerKg() != null && doseRange.getPediatricDosePerKg() > 0) {
                return validatePediatricDose(patient, dose, doseRange, result);
            }
        } else {
            // Adult dosing
            result.setValidationType("AGE_BASED");
            result.setPatientFactor("Adult (Age: " + ageYears + " years)");
            return validateAdultDose(dose, doseRange, result);
        }

        return result;
    }

    /**
     * Validate adult dose
     */
    private DoseValidationResult validateAdultDose(Double dose, DoseRange doseRange, DoseValidationResult result) {
        result.setRecommendedMinDose(doseRange.getAdultMinDose());
        result.setRecommendedMaxDose(doseRange.getAdultMaxDose());

        if (dose < doseRange.getAdultMinDose()) {
            result.setIsValid(false);
            result.setSeverity("WARNING");
            result.setMessage("Dose below recommended range");
            result.setRecommendation(String.format("Recommended range: %.2f - %.2f %s per dose", 
                    doseRange.getAdultMinDose(), doseRange.getAdultMaxDose(), doseRange.getUnit()));
            result.addWarning("Subtherapeutic dose may be ineffective");
        } else if (dose > doseRange.getAdultMaxDose()) {
            result.setIsValid(false);
            result.setSeverity("CRITICAL");
            result.setMessage("Dose EXCEEDS maximum recommended");
            result.setRecommendation(String.format("Maximum recommended dose: %.2f %s per dose", 
                    doseRange.getAdultMaxDose(), doseRange.getUnit()));
            result.addWarning("Risk of toxicity or adverse effects");
        } else {
            result.setIsValid(true);
            result.setSeverity("INFO");
            result.setMessage("Dose within recommended range");
            result.setRecommendation("Dose appropriate for adult patient");
        }

        // Check daily max if applicable
        if (doseRange.getAdultMaxDaily() != null) {
            result.addWarning(String.format("Maximum daily dose: %.2f %s", 
                    doseRange.getAdultMaxDaily(), doseRange.getUnit()));
        }

        // Check for renal function requirement
        if (doseRange.getRequiresRenalFunction() != null && doseRange.getRequiresRenalFunction()) {
            result.addWarning("RENAL ADJUSTMENT: " + doseRange.getRenalAdjustment());
        }

        return result;
    }

    /**
     * Validate pediatric dose (weight-based)
     */
    private DoseValidationResult validatePediatricDose(Patient patient, Double dose, DoseRange doseRange, DoseValidationResult result) {
        // Get patient weight (assuming it's stored in Patient or VitalSign)
        Double weight = getPatientWeight(patient);
        
        if (weight == null || weight <= 0) {
            result.setIsValid(false);
            result.setSeverity("WARNING");
            result.setValidationType("WEIGHT_BASED");
            result.setMessage("Patient weight not available");
            result.setRecommendation("Enter patient weight to validate dose");
            result.addWarning("Weight-based dosing required for pediatric patient");
            return result;
        }

        result.setValidationType("WEIGHT_BASED");
        result.setPatientFactor("Weight: " + weight + " kg");

        // Calculate recommended dose range
        Double minDose = doseRange.getPediatricDosePerKg() * weight;
        Double maxDose = doseRange.getPediatricMaxDosePerKg() * weight;

        result.setRecommendedMinDose(minDose);
        result.setRecommendedMaxDose(maxDose);

        if (dose < minDose) {
            result.setIsValid(false);
            result.setSeverity("WARNING");
            result.setMessage("Dose below weight-based recommendation");
            result.setRecommendation(String.format("Recommended: %.2f - %.2f %s (%.1f-%.1f %s/kg)", 
                    minDose, maxDose, doseRange.getUnit(),
                    doseRange.getPediatricDosePerKg(), doseRange.getPediatricMaxDosePerKg(), doseRange.getUnit()));
        } else if (dose > maxDose) {
            result.setIsValid(false);
            result.setSeverity("CRITICAL");
            result.setMessage("Dose EXCEEDS weight-based maximum");
            result.setRecommendation(String.format("Maximum: %.2f %s (%.1f %s/kg)", 
                    maxDose, doseRange.getUnit(), doseRange.getPediatricMaxDosePerKg(), doseRange.getUnit()));
            result.addWarning("OVERDOSE RISK: Immediate review required");
        } else {
            result.setIsValid(true);
            result.setSeverity("INFO");
            result.setMessage("Dose appropriate for patient weight");
            result.setRecommendation(String.format("Dose: %.2f %s (%.2f %s/kg)", 
                    dose, doseRange.getUnit(), dose / weight, doseRange.getUnit()));
        }

        // Check daily max
        if (doseRange.getPediatricMaxDaily() != null) {
            Double maxDaily = doseRange.getPediatricMaxDaily() * weight;
            result.addWarning(String.format("Maximum daily dose: %.2f %s (%.1f %s/kg)", 
                    maxDaily, doseRange.getUnit(), doseRange.getPediatricMaxDaily(), doseRange.getUnit()));
        }

        return result;
    }

    /**
     * Get patient weight from recent vitals
     */
    private Double getPatientWeight(Patient patient) {
        // This should fetch the most recent vital sign with weight
        // For now, return null if not available
        // In real implementation: vitalSignRepository.findMostRecentByPatientId(patient.getId())
        return null; // Placeholder
    }

    /**
     * Dose range data structure
     */
    @lombok.Data
    @lombok.Builder
    private static class DoseRange {
        private Double adultMinDose;
        private Double adultMaxDose;
        private Double adultMaxDaily;
        private Double pediatricDosePerKg;
        private Double pediatricMaxDosePerKg;
        private Double pediatricMaxDaily;
        private String unit;
        private Boolean requiresWeightBased;
        private Boolean requiresRenalFunction;
        private Boolean requiresINRMonitoring;
        private String renalAdjustment;
        private String contraindication;
    }
}
