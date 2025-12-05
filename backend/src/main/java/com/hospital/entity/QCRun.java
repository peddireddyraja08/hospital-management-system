package com.hospital.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hospital.enums.QCStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "qc_runs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class QCRun extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "qc_material_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private QCMaterial qcMaterial;

    @Column(name = "run_date", nullable = false)
    private LocalDateTime runDate;

    @Column(name = "measured_value", nullable = false, precision = 10, scale = 4)
    private BigDecimal measuredValue;

    @Column(name = "z_score", precision = 10, scale = 4)
    private BigDecimal zScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private QCStatus status;

    @Column(name = "violated_rules", columnDefinition = "TEXT")
    private String violatedRules; // JSON array of violated Westgard rules

    @Column(name = "technician_name")
    private String technicianName;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Column(name = "shift")
    private String shift; // MORNING, AFTERNOON, NIGHT

    @Column(name = "instrument_id")
    private String instrumentId;

    @Column(name = "repeat_run")
    private Boolean repeatRun = false;

    @Column(name = "corrective_action", columnDefinition = "TEXT")
    private String correctiveAction;

    // Calculate Z-score
    public void calculateZScore() {
        if (this.measuredValue != null && 
            this.qcMaterial != null && 
            this.qcMaterial.getMeanValue() != null && 
            this.qcMaterial.getStdDeviation() != null &&
            this.qcMaterial.getStdDeviation().compareTo(BigDecimal.ZERO) != 0) {
            
            BigDecimal diff = this.measuredValue.subtract(this.qcMaterial.getMeanValue());
            this.zScore = diff.divide(this.qcMaterial.getStdDeviation(), 4, BigDecimal.ROUND_HALF_UP);
        }
    }

    // Determine status based on Z-score
    public void determineStatus() {
        if (this.zScore != null) {
            BigDecimal absZScore = this.zScore.abs();
            
            if (absZScore.compareTo(new BigDecimal("3")) > 0) {
                this.status = QCStatus.OUT_OF_CONTROL;
            } else if (absZScore.compareTo(new BigDecimal("2")) > 0) {
                this.status = QCStatus.WARNING;
            } else {
                this.status = QCStatus.IN_CONTROL;
            }
        }
    }
}
