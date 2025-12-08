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
public class DoseValidationResult {
    private Boolean isValid;
    private String validationType;         // AGE_BASED, WEIGHT_BASED, MAX_DOSE, RENAL_FUNCTION
    private String severity;               // INFO, WARNING, CRITICAL
    private Double prescribedDose;
    private String prescribedUnit;
    private Double recommendedMinDose;
    private Double recommendedMaxDose;
    private String recommendedUnit;
    private String patientFactor;          // Age, Weight, Renal function, etc.
    private String message;
    private String recommendation;
    
    @Builder.Default
    private List<String> warnings = new ArrayList<>();
    
    public void addWarning(String warning) {
        this.warnings.add(warning);
    }
}
