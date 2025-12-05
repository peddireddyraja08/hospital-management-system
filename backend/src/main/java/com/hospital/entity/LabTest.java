package com.hospital.entity;

import com.hospital.enums.SampleType;
import com.hospital.enums.TestCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lab_tests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LabTest extends BaseEntity {

    @Column(name = "test_code", unique = true, nullable = false)
    private String testCode;

    @Column(name = "test_name", nullable = false)
    private String testName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "test_category")
    private TestCategory testCategory;

    @Column(name = "price")
    private Double price;

    @Column(name = "normal_range")
    private String normalRange;

    @Column(name = "normal_range_male")
    private String normalRangeMale;

    @Column(name = "normal_range_female")
    private String normalRangeFemale;

    @Column(name = "normal_range_child")
    private String normalRangeChild;

    @Column(name = "unit")
    private String unit;

    @Enumerated(EnumType.STRING)
    @Column(name = "sample_type")
    private SampleType sampleType;

    @Column(name = "sample_volume")
    private String sampleVolume; // e.g., "5 ml", "10 ml"

    @Column(name = "sample_container")
    private String sampleContainer; // e.g., "EDTA tube", "Plain tube"

    @Column(name = "preparation_instructions", columnDefinition = "TEXT")
    private String preparationInstructions;

    @Column(name = "turnaround_time")
    private Integer turnaroundTime; // in hours

    @Column(name = "critical_low")
    private String criticalLow; // Critical low value threshold

    @Column(name = "critical_high")
    private String criticalHigh; // Critical high value threshold

    @Column(name = "is_profile")
    private Boolean isProfile = false; // Whether this is a test profile/panel

    @Column(name = "profile_tests", columnDefinition = "TEXT")
    private String profileTests; // Comma-separated test codes if profile

    @Column(name = "department")
    private String department; // Lab department handling this test

    @Column(name = "method")
    private String method; // Testing methodology

    @Column(name = "requires_fasting")
    private Boolean requiresFasting = false;
}
