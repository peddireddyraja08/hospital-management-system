package com.hospital.entity;

import com.hospital.enums.DischargeType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "discharge_summaries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DischargeSummary extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_id", nullable = false, unique = true)
    private Admission admission;

    @Column(nullable = false, unique = true, length = 50)
    private String summaryNumber;  // DS-XXXX-XXXX

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discharging_doctor_id", nullable = false)
    private Doctor dischargingDoctor;

    @Column(nullable = false)
    private LocalDateTime dischargeDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private DischargeType dischargeType = DischargeType.REGULAR;

    @Column(nullable = false, length = 200)
    private String finalDiagnosis;

    @Column(length = 500)
    private String secondaryDiagnoses;  // Comma-separated or JSON

    @Column(length = 200)
    private String icdCodes;  // ICD-10 codes

    @Column(columnDefinition = "TEXT")
    private String admissionSummary;  // Brief history of present illness

    @Column(columnDefinition = "TEXT")
    private String clinicalCourse;  // What happened during admission

    @Column(columnDefinition = "TEXT")
    private String investigationsPerformed;  // Labs, imaging, procedures

    @Column(columnDefinition = "TEXT")
    private String proceduresPerformed;  // Surgeries, interventions

    @Column(columnDefinition = "TEXT")
    private String treatmentGiven;  // Summary of treatment

    @Column(columnDefinition = "TEXT")
    private String conditionAtDischarge;  // Stable, improved, critical, etc.

    // Discharge medications
    @Column(columnDefinition = "TEXT")
    private String dischargeMedications;  // JSON array of medications with dosage, duration

    // Follow-up instructions
    @Column(columnDefinition = "TEXT")
    private String followUpInstructions;

    @Column
    private LocalDateTime followUpDate;

    @Column(length = 100)
    private String followUpWithDoctor;

    @Column(length = 100)
    private String followUpSpecialty;

    @Column(columnDefinition = "TEXT")
    private String dietaryInstructions;

    @Column(columnDefinition = "TEXT")
    private String activityRestrictions;

    @Column(columnDefinition = "TEXT")
    private String warningSignsToWatch;

    @Column(columnDefinition = "TEXT")
    private String specialInstructions;

    // Referrals
    @Column(length = 200)
    private String referredTo;  // Specialist, facility name

    @Column(length = 500)
    private String referralReason;

    // PDF generation
    @Column(length = 500)
    private String pdfFilePath;

    @Column
    private LocalDateTime pdfGeneratedAt;

    @Column(length = 100)
    private String templateUsed;  // Specialty-specific template name

    // Discharge clearance
    @Column
    private Boolean billingCleared = false;

    @Column
    private LocalDateTime billingClearedAt;

    @Column
    private Boolean pharmacyCleared = false;

    @Column
    private LocalDateTime pharmacyClearedAt;

    @Column
    private Boolean nursingCleared = false;

    @Column
    private LocalDateTime nursingClearedAt;

    @Column
    private Boolean isFinalized = false;

    @Column
    private LocalDateTime finalizedAt;

    @Column(length = 100)
    private String finalizedBy;

    @Column(length = 500)
    private String additionalNotes;

    @Transient
    public Boolean isFullyCleared() {
        return billingCleared && pharmacyCleared && nursingCleared;
    }

    public void finalize(String finalizedBy) {
        this.isFinalized = true;
        this.finalizedAt = LocalDateTime.now();
        this.finalizedBy = finalizedBy;
    }
}
