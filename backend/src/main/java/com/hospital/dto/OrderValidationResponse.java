package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderValidationResponse {
    private Boolean canProceed;
    private Boolean requiresOverride;
    private String overallSeverity;        // SAFE, WARNING, CRITICAL
    
    @Builder.Default
    private List<DrugAllergyAlert> allergyAlerts = new ArrayList<>();
    
    @Builder.Default
    private List<DuplicateDrugAlert> duplicateDrugAlerts = new ArrayList<>();
    
    @Builder.Default
    private List<DoseValidationResult> doseValidations = new ArrayList<>();
    
    @Builder.Default
    private List<String> generalWarnings = new ArrayList<>();
    
    private String summary;
    
    public void addAllergyAlert(DrugAllergyAlert alert) {
        this.allergyAlerts.add(alert);
    }
    
    public void addDuplicateAlert(DuplicateDrugAlert alert) {
        this.duplicateDrugAlerts.add(alert);
    }
    
    public void addDoseValidation(DoseValidationResult validation) {
        this.doseValidations.add(validation);
    }
    
    public void addGeneralWarning(String warning) {
        this.generalWarnings.add(warning);
    }
    
    public Boolean hasAlerts() {
        return !allergyAlerts.isEmpty() || !duplicateDrugAlerts.isEmpty() || 
               !doseValidations.isEmpty() || !generalWarnings.isEmpty();
    }
    
    public Boolean hasCriticalAlerts() {
        return allergyAlerts.stream().anyMatch(a -> "LIFE_THREATENING".equals(a.getSeverity()) || "SEVERE".equals(a.getSeverity())) ||
               duplicateDrugAlerts.stream().anyMatch(a -> "HIGH".equals(a.getSeverity())) ||
               doseValidations.stream().anyMatch(v -> "CRITICAL".equals(v.getSeverity()));
    }
}
