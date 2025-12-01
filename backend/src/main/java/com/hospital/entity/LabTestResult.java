package com.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_test_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LabTestResult extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "test_request_id", nullable = false)
    private LabTestRequest testRequest;

    @Column(name = "result_value")
    private String resultValue;

    @Column(name = "result_date")
    private LocalDateTime resultDate;

    @Column(name = "is_abnormal")
    private Boolean isAbnormal;

    @Column(columnDefinition = "TEXT")
    private String interpretation;

    @Column(columnDefinition = "TEXT")
    private String technician_notes;

    @Column(name = "tested_by")
    private String testedBy;

    @Column(name = "verified_by")
    private String verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "report_url")
    private String reportUrl;
}
