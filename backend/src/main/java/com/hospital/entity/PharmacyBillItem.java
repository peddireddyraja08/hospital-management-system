package com.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "pharmacy_bill_items")
@Data
@NoArgsConstructor
public class PharmacyBillItem extends BaseEntity {
    private String medicineName;
    private String batchNo;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
}
