package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineDTO {
    private Long id;
    private String name;
    private String category;
    private String strength;
    private String unit;
    private String manufacturer;
    private String batchNo;
    private LocalDate expiryDate;
    private BigDecimal price;
    private Integer stockQty;
    private Integer reorderLevel;
}
