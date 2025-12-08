package com.hospital.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "care_pathways")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CarePathway extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name;  // e.g., "Pneumonia Care Pathway", "Post-Surgery Recovery"

    @Column(nullable = false, length = 100)
    private String diagnosis;

    @Column(length = 50)
    private String specialty;  // CARDIOLOGY, SURGERY, PEDIATRICS, etc.

    @Column(length = 2000)
    private String description;

    @Column
    private Integer estimatedLOS;  // Estimated Length of Stay in days

    @Column
    private Boolean isActive = true;

    @Column(length = 500)
    private String targetConditions;  // ICD codes or condition names

    // JSON field for task templates
    @Column(columnDefinition = "TEXT")
    private String taskTemplates;  // JSON array of task definitions

    // JSON field for milestone definitions
    @Column(columnDefinition = "TEXT")
    private String milestones;  // JSON array of milestones

    // JSON field for vital sign monitoring schedule
    @Column(columnDefinition = "TEXT")
    private String vitalSignSchedule;  // JSON: { "frequency": "4h", "vitals": ["BP", "HR", "Temp"] }

    // JSON field for medication guidelines
    @Column(columnDefinition = "TEXT")
    private String medicationGuidelines;

    // JSON field for lab test schedule
    @Column(columnDefinition = "TEXT")
    private String labTestSchedule;

    @Column(length = 500)
    private String dischargeExitCriteria;

    @Column(length = 500)
    private String specialInstructions;

    @Column
    private Integer versionNumber = 1;

    @Column(length = 100)
    private String createdByDepartment;

    @Column
    private Integer usageCount = 0;  // Track how many times this pathway has been used

    @OneToMany(mappedBy = "carePathway", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Admission> admissions = new ArrayList<>();

    public void incrementUsageCount() {
        this.usageCount++;
    }
}
