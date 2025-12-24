package com.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "medicine_batches")
@Data
@NoArgsConstructor
public class MedicineBatch extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    private String batchNo;
    private LocalDate expiryDate;
    private Integer quantity;
}
