package com.hospital.entity;

import com.hospital.enums.ClinicalScoreType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "clinical_scores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicalScore extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_id", nullable = false)
    private Admission admission;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ClinicalScoreType scoreType;

    @Column(nullable = false)
    private Integer calculatedScore;

    @Column(nullable = false, length = 20)
    private String riskLevel;  // LOW, MEDIUM, HIGH, CRITICAL

    @Column(nullable = false)
    private LocalDateTime recordedAt;

    @Column(nullable = false, length = 100)
    private String recordedBy;

    // Vital sign values used for calculation (stored as JSON or individual fields)
    @Column(columnDefinition = "TEXT")
    private String vitalSignValues;  // JSON: {"respiratoryRate": 18, "oxygenSat": 98, ...}

    @Column(length = 500)
    private String interpretation;

    @Column(length = 500)
    private String recommendedAction;

    @Column
    private Boolean alertTriggered = false;

    @Column
    private LocalDateTime alertTriggeredAt;

    @Column(length = 100)
    private String alertAcknowledgedBy;

    @Column
    private LocalDateTime alertAcknowledgedAt;

    // Individual score components for NEWS calculation
    @Column
    private Integer respiratoryRateScore;

    @Column
    private Integer oxygenSaturationScore;

    @Column
    private Integer supplementalOxygenScore;

    @Column
    private Integer temperatureScore;

    @Column
    private Integer systolicBPScore;

    @Column
    private Integer heartRateScore;

    @Column
    private Integer consciousnessScore;

    @Column(length = 500)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vital_sign_id")
    private VitalSign relatedVitalSign;

    public void acknowledgeAlert(String acknowledgedBy) {
        this.alertAcknowledgedBy = acknowledgedBy;
        this.alertAcknowledgedAt = LocalDateTime.now();
    }

    @Transient
    public Boolean requiresEscalation() {
        return "HIGH".equals(riskLevel) || "CRITICAL".equals(riskLevel);
    }

    @Transient
    public Boolean requiresImmediateAction() {
        return "CRITICAL".equals(riskLevel) || calculatedScore >= 7; // NEWS >= 7
    }
}
