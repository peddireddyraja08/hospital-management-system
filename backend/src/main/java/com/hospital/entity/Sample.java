package com.hospital.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hospital.enums.SampleStatus;
import com.hospital.enums.SampleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "samples")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Sample extends BaseEntity {

    @Column(name = "accession_number", unique = true, nullable = false)
    private String accessionNumber; // Lab accession number (barcode)

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "user", "medicalRecords"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lab_test_request_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "patient", "doctor", "labTest"})
    private LabTestRequest labTestRequest;

    @Enumerated(EnumType.STRING)
    @Column(name = "sample_type", nullable = false)
    private SampleType sampleType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SampleStatus status = SampleStatus.COLLECTED;

    @Column(name = "collection_date_time")
    private LocalDateTime collectionDateTime;

    @Column(name = "collected_by")
    private String collectedBy; // Phlebotomist/Nurse name

    @Column(name = "received_date_time")
    private LocalDateTime receivedDateTime;

    @Column(name = "received_by")
    private String receivedBy; // Lab technician name

    @Column(name = "volume")
    private String volume; // Sample volume collected

    @Column(name = "container_type")
    private String containerType; // Type of collection container

    @Column(name = "condition")
    private String condition; // Sample condition (Good, Hemolyzed, Clotted, etc.)

    @Column(name = "storage_location")
    private String storageLocation; // Freezer/Rack location

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason; // If status is REJECTED

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "barcode_image_url")
    private String barcodeImageUrl; // Path to barcode image

    @Column(name = "processing_started_at")
    private LocalDateTime processingStartedAt;

    @Column(name = "processing_completed_at")
    private LocalDateTime processingCompletedAt;

    @Column(name = "disposed_at")
    private LocalDateTime disposedAt;
}
