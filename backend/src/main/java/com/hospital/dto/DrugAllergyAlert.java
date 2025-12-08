package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DrugAllergyAlert {
    private String allergyType;        // KNOWN_ALLERGY, CROSS_ALLERGY, POTENTIAL_ALLERGY
    private String severity;           // MILD, MODERATE, SEVERE, LIFE_THREATENING
    private String drugName;
    private String allergen;
    private String reaction;
    private String recommendation;
    private Boolean requiresOverride;  // Needs physician override to proceed
}
