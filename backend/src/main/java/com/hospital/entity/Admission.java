package com.hospital.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hospital.enums.AdmissionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "admissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Admission extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String admissionNumber;  // ADM-XXXX-XXXX

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "admitting_doctor_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Doctor admittingDoctor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "current_bed_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Bed currentBed;

    @Column(nullable = false)
    private String ward;  // ICU, General Ward, Private Room, etc.

    @Column
    private String roomNumber;

    @Column(nullable = false)
    private LocalDateTime admissionDate;

    @Column
    private LocalDateTime expectedDischargeDate;

    @Column
    private LocalDateTime actualDischargeDate;

    @Column(length = 50)
    private String admissionType;  // EMERGENCY, PLANNED, REFERRAL, TRANSFER

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AdmissionStatus status = AdmissionStatus.ADMITTED;

    @Column(length = 100)
    private String chiefComplaint;

    @Column(length = 500)
    private String provisionalDiagnosis;

    @Column(length = 1000)
    private String medicalHistory;

    @Column
    private Boolean isIsolationRequired = false;

    @Column(length = 100)
    private String isolationType;  // AIRBORNE, DROPLET, CONTACT, etc.

    @Column
    private Boolean isICUAdmission = false;

    @Column
    private Boolean isEmergencyAdmission = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "care_pathway_id")
    private CarePathway carePathway;

    @Column(precision = 10, scale = 2)
    private BigDecimal estimatedCost;

    @Column(precision = 10, scale = 2)
    private BigDecimal dailyCharge;

    @Column(length = 500)
    private String specialInstructions;

    @Column(length = 100)
    private String primaryNurse;

    @Column(length = 500)
    private String admissionNotes;

    // Calculated fields
    @Transient
    public Integer getLengthOfStay() {
        if (admissionDate == null) return 0;
        LocalDateTime endDate = actualDischargeDate != null ? actualDischargeDate : LocalDateTime.now();
        return (int) java.time.Duration.between(admissionDate, endDate).toDays();
    }

    @Transient
    public Boolean isOverstay() {
        if (expectedDischargeDate == null) return false;
        LocalDateTime compareDate = actualDischargeDate != null ? actualDischargeDate : LocalDateTime.now();
        return compareDate.isAfter(expectedDischargeDate);
    }

    @Transient
    public Integer getOverstayDays() {
        if (!isOverstay()) return 0;
        LocalDateTime compareDate = actualDischargeDate != null ? actualDischargeDate : LocalDateTime.now();
        return (int) java.time.Duration.between(expectedDischargeDate, compareDate).toDays();
    }
}
