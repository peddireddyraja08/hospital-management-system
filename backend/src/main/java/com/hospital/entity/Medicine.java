package com.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "medicines")
@Data
@NoArgsConstructor
public class Medicine extends BaseEntity {
    @Column(nullable = false)
    private String name;

    private String category;
    private String strength;
    private String unit;
    private String manufacturer;

    // aggregated fields (not batch-specific)
    private java.math.BigDecimal price;
    private Integer stockQty = 0;
    private Integer reorderLevel = 0;
}
