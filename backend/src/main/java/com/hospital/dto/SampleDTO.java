package com.hospital.dto;

import com.hospital.enums.SampleStatus;
import com.hospital.enums.SampleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SampleDTO {
    private Long id;
    private String accessionNumber;
    private Long patientId;
    private String patientName;
    private String patientPatientId;
    private Long labTestRequestId;
    private String testName;
    private SampleType sampleType;
    private SampleStatus status;
    private LocalDateTime collectionDateTime;
    private String collectedBy;
    private LocalDateTime receivedDateTime;
    private String receivedBy;
    private String volume;
    private String containerType;
    private String condition;
    private String storageLocation;
    private String rejectionReason;
    private String remarks;
    private String barcodeImageUrl;
    private LocalDateTime processingStartedAt;
    private LocalDateTime processingCompletedAt;
    private LocalDateTime disposedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
}
