package com.hospital.entity;

import com.hospital.enums.QCLevel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "qc_materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class QCMaterial extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lab_test_id", nullable = false)
    private LabTest labTest;

    @Column(name = "material_name", nullable = false)
    private String materialName;

    @Column(name = "lot_number", nullable = false, length = 100)
    private String lotNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "level", nullable = false, length = 50)
    private QCLevel level;

    @Column(name = "manufacturer")
    private String manufacturer;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "target_value", precision = 10, scale = 4)
    private BigDecimal targetValue;

    @Column(name = "mean_value", precision = 10, scale = 4)
    private BigDecimal meanValue;

    @Column(name = "std_deviation", precision = 10, scale = 4)
    private BigDecimal stdDeviation;

    @Column(name = "unit", length = 50)
    private String unit;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "storage_conditions")
    private String storageConditions;

    @Column(name = "preparation_instructions", columnDefinition = "TEXT")
    private String preparationInstructions;

    // Calculated ranges (for UI display)
    @Transient
    public BigDecimal getRange1SD() {
        if (stdDeviation != null) {
            return stdDeviation;
        }
        return null;
    }

    @Transient
    public BigDecimal getRange2SD() {
        if (stdDeviation != null) {
            return stdDeviation.multiply(new BigDecimal("2"));
        }
        return null;
    }

    @Transient
    public BigDecimal getRange3SD() {
        if (stdDeviation != null) {
            return stdDeviation.multiply(new BigDecimal("3"));
        }
        return null;
    }

    @Transient
    public BigDecimal getLowerLimit1SD() {
        if (meanValue != null && stdDeviation != null) {
            return meanValue.subtract(stdDeviation);
        }
        return null;
    }

    @Transient
    public BigDecimal getUpperLimit1SD() {
        if (meanValue != null && stdDeviation != null) {
            return meanValue.add(stdDeviation);
        }
        return null;
    }

    @Transient
    public BigDecimal getLowerLimit2SD() {
        if (meanValue != null && stdDeviation != null) {
            return meanValue.subtract(stdDeviation.multiply(new BigDecimal("2")));
        }
        return null;
    }

    @Transient
    public BigDecimal getUpperLimit2SD() {
        if (meanValue != null && stdDeviation != null) {
            return meanValue.add(stdDeviation.multiply(new BigDecimal("2")));
        }
        return null;
    }

    @Transient
    public BigDecimal getLowerLimit3SD() {
        if (meanValue != null && stdDeviation != null) {
            return meanValue.subtract(stdDeviation.multiply(new BigDecimal("3")));
        }
        return null;
    }

    @Transient
    public BigDecimal getUpperLimit3SD() {
        if (meanValue != null && stdDeviation != null) {
            return meanValue.add(stdDeviation.multiply(new BigDecimal("3")));
        }
        return null;
    }

    @Transient
    public boolean isExpired() {
        if (expiryDate != null) {
            return LocalDate.now().isAfter(expiryDate);
        }
        return false;
    }
}
