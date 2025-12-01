package com.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "medications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Medication extends BaseEntity {

    @Column(name = "medication_code", unique = true, nullable = false)
    private String medicationCode;

    @Column(name = "medication_name", nullable = false)
    private String medicationName;

    @Column(name = "generic_name")
    private String genericName;

    @Column(name = "brand_name")
    private String brandName;

    @Column(name = "category")
    private String category;

    @Column(name = "dosage_form")
    private String dosageForm; // Tablet, Capsule, Syrup, Injection, etc.

    @Column(name = "strength")
    private String strength;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "reorder_level")
    private Integer reorderLevel;

    @Column(name = "manufacturer")
    private String manufacturer;

    @Column(name = "expiry_alert_days")
    private Integer expiryAlertDays;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "storage_instructions")
    private String storageInstructions;
}
