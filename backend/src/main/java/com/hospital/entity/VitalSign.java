package com.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vital_signs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class VitalSign extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    @Column(name = "temperature")
    private Double temperature; // in Celsius

    @Column(name = "blood_pressure_systolic")
    private Integer bloodPressureSystolic;

    @Column(name = "blood_pressure_diastolic")
    private Integer bloodPressureDiastolic;

    @Column(name = "heart_rate")
    private Integer heartRate; // beats per minute

    @Column(name = "respiratory_rate")
    private Integer respiratoryRate; // breaths per minute

    @Column(name = "oxygen_saturation")
    private Double oxygenSaturation; // percentage

    @Column(name = "weight")
    private Double weight; // in kg

    @Column(name = "height")
    private Double height; // in cm

    @Column(name = "bmi")
    private Double bmi;

    @Column(name = "recorded_by")
    private String recordedBy;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
