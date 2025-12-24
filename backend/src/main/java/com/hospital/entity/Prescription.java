package com.hospital.entity;

import com.hospital.enums.PrescriptionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Prescription extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "medication_id", nullable = false)
    private Medication medication;

    @Column(name = "dosage")
    private String dosage;

    @Column(name = "frequency")
    private String frequency;

    @Column(name = "duration")
    private String duration;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "dispensed_quantity")
    private Integer dispensedQuantity = 0;

    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "prescribed_date")
    private LocalDateTime prescribedDate;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private PrescriptionStatus status;

    @Column(name = "dispensed_date")
    private LocalDateTime dispensedDate;

    @Column(name = "dispensed_by")
    private String dispensedBy;
}
