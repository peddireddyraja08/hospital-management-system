package com.hospital.service;

import com.hospital.dto.*;
import com.hospital.entity.Patient;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderValidationService {

    private final DrugAllergyChecker drugAllergyChecker;
    private final DuplicateDrugDetector duplicateDrugDetector;
    private final DoseValidator doseValidator;
    private final PatientRepository patientRepository;

    /**
     * Comprehensive order validation with decision support
     */
    public OrderValidationResponse validateMedicationOrder(
            Long patientId, 
            String drugName, 
            Double dose, 
            String unit, 
            String frequency) {

        log.info("Validating medication order: {} {}mg for patient {}", drugName, dose, patientId);

        OrderValidationResponse response = OrderValidationResponse.builder()
                .canProceed(true)
                .requiresOverride(false)
                .overallSeverity("SAFE")
                .build();

        // Verify patient exists
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        // 1. Check Drug Allergies
        List<DrugAllergyAlert> allergyAlerts = drugAllergyChecker.checkAllergies(patientId, drugName);
        allergyAlerts.forEach(response::addAllergyAlert);

        // 2. Check for Duplicate Drugs
        List<DuplicateDrugAlert> duplicateAlerts = duplicateDrugDetector.checkDuplicates(
                patientId, drugName, LocalDateTime.now());
        duplicateAlerts.forEach(response::addDuplicateAlert);

        // 3. Validate Dose
        DoseValidationResult doseValidation = doseValidator.validateDose(
                patientId, drugName, dose, unit, frequency);
        response.addDoseValidation(doseValidation);

        // Determine overall severity and whether order can proceed
        determineOverallStatus(response);

        // Generate summary
        response.setSummary(generateSummary(response, patient, drugName, dose, unit));

        log.info("Validation complete for {}: {} - Can proceed: {}", 
                drugName, response.getOverallSeverity(), response.getCanProceed());

        return response;
    }

    /**
     * Quick validation (allergies and critical duplicates only)
     */
    public OrderValidationResponse quickValidate(Long patientId, String drugName) {
        OrderValidationResponse response = OrderValidationResponse.builder()
                .canProceed(true)
                .requiresOverride(false)
                .overallSeverity("SAFE")
                .build();

        // Check allergies only
        List<DrugAllergyAlert> allergyAlerts = drugAllergyChecker.checkAllergies(patientId, drugName);
        allergyAlerts.forEach(response::addAllergyAlert);

        // Check for exact duplicates only
        List<DuplicateDrugAlert> duplicateAlerts = duplicateDrugDetector.checkDuplicates(
                patientId, drugName, LocalDateTime.now()).stream()
                .filter(alert -> "EXACT_DUPLICATE".equals(alert.getAlertType()))
                .toList();
        duplicateAlerts.forEach(response::addDuplicateAlert);

        determineOverallStatus(response);
        return response;
    }

    /**
     * Batch validation for multiple drugs (e.g., prescription with multiple medications)
     */
    public OrderValidationResponse validateMultipleDrugs(
            Long patientId, 
            List<String> drugNames) {

        OrderValidationResponse combinedResponse = OrderValidationResponse.builder()
                .canProceed(true)
                .requiresOverride(false)
                .overallSeverity("SAFE")
                .build();

        for (String drugName : drugNames) {
            // Check allergies
            List<DrugAllergyAlert> allergyAlerts = drugAllergyChecker.checkAllergies(patientId, drugName);
            allergyAlerts.forEach(combinedResponse::addAllergyAlert);

            // Check duplicates
            List<DuplicateDrugAlert> duplicateAlerts = duplicateDrugDetector.checkDuplicates(
                    patientId, drugName, LocalDateTime.now());
            duplicateAlerts.forEach(combinedResponse::addDuplicateAlert);
        }

        // Check for interactions between the prescribed drugs
        checkDrugInteractions(drugNames, combinedResponse);

        determineOverallStatus(combinedResponse);
        return combinedResponse;
    }

    /**
     * Check interactions between multiple drugs
     */
    private void checkDrugInteractions(List<String> drugNames, OrderValidationResponse response) {
        // Check if multiple drugs from same class are being prescribed together
        for (int i = 0; i < drugNames.size(); i++) {
            for (int j = i + 1; j < drugNames.size(); j++) {
                String drug1 = drugNames.get(i);
                String drug2 = drugNames.get(j);

                if (drugAllergyChecker.isSameClass(drug1, drug2)) {
                    response.addGeneralWarning(
                            String.format("WARNING: %s and %s are from the same drug class. Consider if both are necessary.", 
                                    drug1, drug2));
                }

                if (duplicateDrugDetector.areTherapeuticEquivalents(drug1, drug2)) {
                    response.addGeneralWarning(
                            String.format("THERAPEUTIC OVERLAP: %s and %s have similar therapeutic effects.", 
                                    drug1, drug2));
                }
            }
        }
    }

    /**
     * Determine overall status based on all alerts
     */
    private void determineOverallStatus(OrderValidationResponse response) {
        boolean hasCriticalAlerts = response.hasCriticalAlerts();
        boolean hasLifeThreateningAllergy = response.getAllergyAlerts().stream()
                .anyMatch(a -> "LIFE_THREATENING".equals(a.getSeverity()) || "SEVERE".equals(a.getSeverity()));
        boolean hasCriticalDose = response.getDoseValidations().stream()
                .anyMatch(v -> "CRITICAL".equals(v.getSeverity()) && !v.getIsValid());

        if (hasLifeThreateningAllergy || hasCriticalDose) {
            response.setCanProceed(false);
            response.setRequiresOverride(true);
            response.setOverallSeverity("CRITICAL");
        } else if (hasCriticalAlerts) {
            response.setCanProceed(true);
            response.setRequiresOverride(true);
            response.setOverallSeverity("WARNING");
        } else if (response.hasAlerts()) {
            response.setCanProceed(true);
            response.setRequiresOverride(false);
            response.setOverallSeverity("WARNING");
        } else {
            response.setCanProceed(true);
            response.setRequiresOverride(false);
            response.setOverallSeverity("SAFE");
        }
    }

    /**
     * Generate human-readable summary
     */
    private String generateSummary(OrderValidationResponse response, Patient patient, 
                                   String drugName, Double dose, String unit) {
        StringBuilder summary = new StringBuilder();
        summary.append(String.format("Validation for %s %s%s - Patient: %s %s\n", 
                drugName, dose, unit, 
                patient.getFirstName(), patient.getLastName()));

        if (!response.hasAlerts()) {
            summary.append("✓ No contraindications found. Safe to prescribe.");
            return summary.toString();
        }

        if (!response.getAllergyAlerts().isEmpty()) {
            summary.append(String.format("⚠ %d allergy alert(s)\n", response.getAllergyAlerts().size()));
        }
        if (!response.getDuplicateDrugAlerts().isEmpty()) {
            summary.append(String.format("⚠ %d duplicate drug alert(s)\n", response.getDuplicateDrugAlerts().size()));
        }
        if (!response.getDoseValidations().isEmpty()) {
            summary.append(String.format("ℹ %d dose validation(s)\n", response.getDoseValidations().size()));
        }
        if (!response.getGeneralWarnings().isEmpty()) {
            summary.append(String.format("ℹ %d general warning(s)\n", response.getGeneralWarnings().size()));
        }

        if (response.getRequiresOverride()) {
            summary.append("\n⛔ REQUIRES PHYSICIAN OVERRIDE TO PROCEED");
        } else if ("WARNING".equals(response.getOverallSeverity())) {
            summary.append("\n⚠ Review alerts before confirming order");
        }

        return summary.toString();
    }
}
