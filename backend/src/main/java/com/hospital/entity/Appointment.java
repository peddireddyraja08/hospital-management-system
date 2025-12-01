package com.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Appointment extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "appointment_date")
    private LocalDateTime appointmentDate;

    @Column(name = "duration")
    private Integer duration; // in minutes

    @Column(name = "status")
    private String status; // SCHEDULED, COMPLETED, CANCELLED, NO_SHOW

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "appointment_type")
    private String appointmentType; // CONSULTATION, FOLLOW_UP, EMERGENCY
}
