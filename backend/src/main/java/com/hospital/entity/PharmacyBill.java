package com.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import com.hospital.entity.Appointment;

@Entity
@Table(name = "pharmacy_bills")
@Data
@NoArgsConstructor
public class PharmacyBill extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "bill_id")
    private List<PharmacyBillItem> items;

    private BigDecimal totalAmount;

    @ManyToOne
    @JoinColumn(name = "visit_id")
    private Appointment visit;
}
