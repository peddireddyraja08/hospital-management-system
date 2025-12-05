package com.hospital.entity;

import com.hospital.enums.AlertPriority;
import com.hospital.enums.AlertStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "critical_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CriticalAlert extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "lab_test_result_id", nullable = false)
    private LabTestResult labTestResult;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(nullable = false)
    private String alertType; // e.g., "Critical High", "Critical Low", "Panic Value"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertStatus status;

    @Column(nullable = false)
    private String testName;

    @Column(nullable = false)
    private String resultValue;

    @Column(nullable = false)
    private String criticalThreshold; // e.g., ">200" or "<50"

    @Column(length = 1000)
    private String message;

    @Column(name = "acknowledged_at")
    private LocalDateTime acknowledgedAt;

    @Column(name = "acknowledged_by")
    private String acknowledgedBy;

    @Column(length = 500)
    private String acknowledgmentNotes;

    @Column(name = "escalated_at")
    private LocalDateTime escalatedAt;

    @Column(name = "escalated_to")
    private String escalatedTo;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(length = 1000)
    private String resolutionNotes;
}
