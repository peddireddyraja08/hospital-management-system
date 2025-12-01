package com.hospital.entity;

import com.hospital.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "physician_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PhysicianOrder extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "order_type")
    private String orderType; // MEDICATION, LAB_TEST, RADIOLOGY, PROCEDURE, etc.

    @Column(name = "order_details", columnDefinition = "TEXT")
    private String orderDetails;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(name = "priority")
    private String priority; // ROUTINE, URGENT, STAT

    @Column(name = "ordered_at")
    private LocalDateTime orderedAt;

    @Column(name = "scheduled_for")
    private LocalDateTime scheduledFor;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
