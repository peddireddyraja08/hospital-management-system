package com.hospital.entity;

import com.hospital.enums.BedStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "beds")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Bed extends BaseEntity {

    @Column(name = "bed_number", unique = true, nullable = false)
    private String bedNumber;

    @Column(name = "ward_name")
    private String wardName;

    @Column(name = "bed_type")
    private String bedType; // ICU, General, Private, etc.

    @Enumerated(EnumType.STRING)
    private BedStatus status;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "room_number")
    private String roomNumber;

    @Column(name = "daily_charge")
    private Double dailyCharge;

    @ManyToOne
    @JoinColumn(name = "current_patient_id")
    private Patient currentPatient;
}
