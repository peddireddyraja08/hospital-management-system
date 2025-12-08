package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DuplicateDrugAlert {
    private String alertType;              // EXACT_DUPLICATE, THERAPEUTIC_DUPLICATE, SAME_CLASS
    private String severity;               // LOW, MEDIUM, HIGH
    private String drugName;
    private String existingDrug;
    private String drugClass;
    private String therapeuticCategory;
    private LocalDateTime existingOrderDate;
    private String recommendation;
    private Boolean requiresReview;
}
