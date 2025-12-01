package com.hospital.entity;

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

    @Column(name = "test_category")
    private String testCategory;

    @Column(name = "price")
    private Double price;

    @Column(name = "normal_range")
    private String normalRange;

    @Column(name = "unit")
    private String unit;

    @Column(name = "preparation_instructions", columnDefinition = "TEXT")
    private String preparationInstructions;

    @Column(name = "turnaround_time")
    private Integer turnaroundTime; // in hours
}
