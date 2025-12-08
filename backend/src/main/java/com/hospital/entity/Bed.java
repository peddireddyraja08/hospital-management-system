package com.hospital.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hospital.enums.BedStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "beds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Bed extends BaseEntity {

    @Column(name = "bed_number", unique = true, nullable = false)
    private String bedNumber;

    @Column(name = "ward_name")
    private String wardName;

    @Column(name = "bed_type")
    private String bedType; // ICU, General, Private, etc.

    @Enumerated(EnumType.STRING)
    private BedStatus status;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "room_number")
    private String roomNumber;

    @Column(name = "daily_charge")
    private Double dailyCharge;

    @ManyToOne
    @JoinColumn(name = "current_patient_id")
    private Patient currentPatient;

    // Enhanced IPD features
    @Column
    private Boolean isIsolationBed = false;

    @Column(length = 50)
    private String isolationType;  // AIRBORNE, DROPLET, CONTACT

    @Column
    private Boolean requiresMonitoring = false;  // Continuous monitoring equipment

    @Column
    private Boolean hasVentilator = false;

    @Column
    private Boolean hasOxygenSupport = false;

    @Column
    private LocalDateTime occupiedSince;

    @Column
    private LocalDateTime expectedVacantAt;

    @Column
    private LocalDateTime lastCleanedAt;

    @Column(length = 100)
    private String cleanedBy;

    @Column
    private Boolean isBlocked = false;

    @Column(length = 200)
    private String blockReason;  // e.g., "Reserved for surgery patient"

    @Column
    private LocalDateTime blockedUntil;

    @Column(length = 100)
    private String blockedBy;

    @Column(length = 500)
    private String specialEquipment;  // JSON or comma-separated list

    @Column(length = 500)
    private String maintenanceNotes;

    @Column
    private LocalDateTime lastMaintenanceDate;

    @Column
    private LocalDateTime nextMaintenanceDate;

    @Column
    private String gender;  // MALE, FEMALE, ANY - for ward allocation

    // Methods for bed management
    public void occupy(Patient patient) {
        this.currentPatient = patient;
        this.status = BedStatus.OCCUPIED;
        this.occupiedSince = LocalDateTime.now();
    }

    public void vacate() {
        this.currentPatient = null;
        this.status = BedStatus.CLEANING;
        this.expectedVacantAt = LocalDateTime.now();
    }

    public void markCleaned(String cleanedBy) {
        this.status = BedStatus.AVAILABLE;
        this.lastCleanedAt = LocalDateTime.now();
        this.cleanedBy = cleanedBy;
    }

    public void block(String reason, String blockedBy, LocalDateTime blockedUntil) {
        this.isBlocked = true;
        this.blockReason = reason;
        this.blockedBy = blockedBy;
        this.blockedUntil = blockedUntil;
    }

    public void unblock() {
        this.isBlocked = false;
        this.blockReason = null;
        this.blockedBy = null;
        this.blockedUntil = null;
    }

    @Transient
    public Boolean isAvailableForAdmission() {
        return status == BedStatus.AVAILABLE && !isBlocked;
    }

    @Transient
    public Integer getOccupancyDays() {
        if (occupiedSince == null) return 0;
        return (int) java.time.Duration.between(occupiedSince, LocalDateTime.now()).toDays();
    }
}
