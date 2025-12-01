package com.hospital.entity;

import com.hospital.enums.BillStatus;
import com.hospital.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Bill extends BaseEntity {

    @Column(name = "bill_number", unique = true, nullable = false)
    private String billNumber;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "bill_date")
    private LocalDateTime billDate;

    @Column(name = "consultation_charges")
    private Double consultationCharges;

    @Column(name = "lab_charges")
    private Double labCharges;

    @Column(name = "medication_charges")
    private Double medicationCharges;

    @Column(name = "room_charges")
    private Double roomCharges;

    @Column(name = "procedure_charges")
    private Double procedureCharges;

    @Column(name = "other_charges")
    private Double otherCharges;

    @Column(name = "subtotal")
    private Double subtotal;

    @Column(name = "tax_amount")
    private Double taxAmount;

    @Column(name = "discount_amount")
    private Double discountAmount;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "paid_amount")
    private Double paidAmount;

    @Column(name = "due_amount")
    private Double dueAmount;

    @Enumerated(EnumType.STRING)
    private BillStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Column(name = "insurance_claim_amount")
    private Double insuranceClaimAmount;

    @Column(name = "insurance_approved_amount")
    private Double insuranceApprovedAmount;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
