package com.hospital.service;

import com.hospital.dto.SampleDTO;
import com.hospital.entity.LabTestRequest;
import com.hospital.entity.Patient;
import com.hospital.entity.Sample;
import com.hospital.enums.SampleStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.LabTestRequestRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.SampleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class SampleService {

    private final SampleRepository sampleRepository;
    private final PatientRepository patientRepository;
    private final LabTestRequestRepository labTestRequestRepository;

    /**
     * Convert Sample entity to SampleDTO to avoid serialization issues
     */
    private SampleDTO convertToDTO(Sample sample) {
        SampleDTO dto = new SampleDTO();
        dto.setId(sample.getId());
        dto.setAccessionNumber(sample.getAccessionNumber());
        
        if (sample.getPatient() != null) {
            dto.setPatientId(sample.getPatient().getId());
            dto.setPatientName(sample.getPatient().getFirstName() + " " + sample.getPatient().getLastName());
            dto.setPatientPatientId(sample.getPatient().getPatientId());
        }
        
        if (sample.getLabTestRequest() != null) {
            dto.setLabTestRequestId(sample.getLabTestRequest().getId());
            if (sample.getLabTestRequest().getLabTest() != null) {
                dto.setTestName(sample.getLabTestRequest().getLabTest().getTestName());
            }
        }
        
        dto.setSampleType(sample.getSampleType());
        dto.setStatus(sample.getStatus());
        dto.setCollectionDateTime(sample.getCollectionDateTime());
        dto.setCollectedBy(sample.getCollectedBy());
        dto.setReceivedDateTime(sample.getReceivedDateTime());
        dto.setReceivedBy(sample.getReceivedBy());
        dto.setVolume(sample.getVolume());
        dto.setContainerType(sample.getContainerType());
        dto.setCondition(sample.getCondition());
        dto.setStorageLocation(sample.getStorageLocation());
        dto.setRejectionReason(sample.getRejectionReason());
        dto.setRemarks(sample.getRemarks());
        dto.setBarcodeImageUrl(sample.getBarcodeImageUrl());
        dto.setProcessingStartedAt(sample.getProcessingStartedAt());
        dto.setProcessingCompletedAt(sample.getProcessingCompletedAt());
        dto.setDisposedAt(sample.getDisposedAt());
        dto.setCreatedAt(sample.getCreatedAt());
        dto.setUpdatedAt(sample.getUpdatedAt());
        dto.setIsActive(sample.getIsActive());
        
        return dto;
    }

    /**
     * Generate unique lab accession number in format: YYYYMMDD-XXXX
     * Example: 20251203-0001
     */
    public String generateAccessionNumber() {
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomSuffix = String.format("%04d", new Random().nextInt(10000));
        String accessionNumber = datePrefix + "-" + randomSuffix;
        
        // Ensure uniqueness
        while (sampleRepository.findByAccessionNumber(accessionNumber).isPresent()) {
            randomSuffix = String.format("%04d", new Random().nextInt(10000));
            accessionNumber = datePrefix + "-" + randomSuffix;
        }
        
        return accessionNumber;
    }

    public SampleDTO createSample(Sample sample) {
        // Validate patient exists
        Patient patient = patientRepository.findById(sample.getPatient().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", sample.getPatient().getId()));

        // Validate lab test request exists
        LabTestRequest labTestRequest = labTestRequestRepository.findById(sample.getLabTestRequest().getId())
                .orElseThrow(() -> new ResourceNotFoundException("LabTestRequest", "id", sample.getLabTestRequest().getId()));

        // Generate accession number if not provided
        if (sample.getAccessionNumber() == null || sample.getAccessionNumber().isEmpty()) {
            sample.setAccessionNumber(generateAccessionNumber());
        }

        // Set default values
        if (sample.getStatus() == null) {
            sample.setStatus(SampleStatus.COLLECTED);
        }
        
        if (sample.getCollectionDateTime() == null) {
            sample.setCollectionDateTime(LocalDateTime.now());
        }

        sample.setPatient(patient);
        sample.setLabTestRequest(labTestRequest);
        sample.setIsActive(true);
        sample.setIsDeleted(false);

        Sample savedSample = sampleRepository.save(sample);
        return convertToDTO(savedSample);
    }

    public SampleDTO getSampleById(Long id) {
        Sample sample = sampleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sample", "id", id));
        return convertToDTO(sample);
    }

    public SampleDTO getSampleByAccessionNumber(String accessionNumber) {
        Sample sample = sampleRepository.findByAccessionNumber(accessionNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Sample", "accessionNumber", accessionNumber));
        return convertToDTO(sample);
    }

    public List<SampleDTO> getAllSamples() {
        return sampleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SampleDTO> getSamplesByPatient(Long patientId) {
        return sampleRepository.findByPatientId(patientId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SampleDTO> getSamplesByStatus(SampleStatus status) {
        return sampleRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SampleDTO> getSamplesByCollectedBy(String collectedBy) {
        return sampleRepository.findByCollectedBy(collectedBy).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SampleDTO> getSamplesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return sampleRepository.findByCollectionDateTimeBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SampleDTO updateSampleStatus(Long id, SampleStatus newStatus, String updatedBy) {
        Sample sample = sampleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sample", "id", id));
        SampleStatus oldStatus = sample.getStatus();
        sample.setStatus(newStatus);

        // Update timestamps based on status
        switch (newStatus) {
            case RECEIVED:
                sample.setReceivedDateTime(LocalDateTime.now());
                sample.setReceivedBy(updatedBy);
                break;
            case PROCESSING:
                sample.setProcessingStartedAt(LocalDateTime.now());
                break;
            case STORED:
                sample.setProcessingCompletedAt(LocalDateTime.now());
                break;
            case DISPOSED:
                sample.setDisposedAt(LocalDateTime.now());
                break;
        }

        Sample savedSample = sampleRepository.save(sample);
        return convertToDTO(savedSample);
    }

    public SampleDTO receiveSample(Long id, String receivedBy, String condition, String storageLocation) {
        Sample sample = sampleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sample", "id", id));
        
        if (sample.getStatus() != SampleStatus.COLLECTED) {
            throw new IllegalStateException("Sample must be in COLLECTED status to be received");
        }

        sample.setStatus(SampleStatus.RECEIVED);
        sample.setReceivedDateTime(LocalDateTime.now());
        sample.setReceivedBy(receivedBy);
        sample.setCondition(condition);
        sample.setStorageLocation(storageLocation);

        Sample savedSample = sampleRepository.save(sample);
        return convertToDTO(savedSample);
    }

    public SampleDTO rejectSample(Long id, String rejectionReason, String rejectedBy) {
        Sample sample = sampleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sample", "id", id));
        sample.setStatus(SampleStatus.REJECTED);
        sample.setRejectionReason(rejectionReason);
        sample.setRemarks("Rejected by: " + rejectedBy + " at " + LocalDateTime.now());
        
        Sample savedSample = sampleRepository.save(sample);
        return convertToDTO(savedSample);
    }

    public SampleDTO startProcessing(Long id) {
        Sample sample = sampleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sample", "id", id));
        
        if (sample.getStatus() != SampleStatus.RECEIVED) {
            throw new IllegalStateException("Sample must be in RECEIVED status to start processing");
        }

        sample.setStatus(SampleStatus.PROCESSING);
        sample.setProcessingStartedAt(LocalDateTime.now());

        Sample savedSample = sampleRepository.save(sample);
        return convertToDTO(savedSample);
    }

    public SampleDTO completeSample(Long id, String storageLocation) {
        Sample sample = sampleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sample", "id", id));
        
        if (sample.getStatus() != SampleStatus.PROCESSING) {
            throw new IllegalStateException("Sample must be in PROCESSING status to complete");
        }

        sample.setStatus(SampleStatus.STORED);
        sample.setProcessingCompletedAt(LocalDateTime.now());
        sample.setStorageLocation(storageLocation);

        Sample savedSample = sampleRepository.save(sample);
        return convertToDTO(savedSample);
    }

    public SampleDTO updateSample(Long id, Sample sampleDetails) {
        Sample sample = sampleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sample", "id", id));

        if (sampleDetails.getSampleType() != null) {
            sample.setSampleType(sampleDetails.getSampleType());
        }
        if (sampleDetails.getVolume() != null) {
            sample.setVolume(sampleDetails.getVolume());
        }
        if (sampleDetails.getContainerType() != null) {
            sample.setContainerType(sampleDetails.getContainerType());
        }
        if (sampleDetails.getCondition() != null) {
            sample.setCondition(sampleDetails.getCondition());
        }
        if (sampleDetails.getStorageLocation() != null) {
            sample.setStorageLocation(sampleDetails.getStorageLocation());
        }
        if (sampleDetails.getRemarks() != null) {
            sample.setRemarks(sampleDetails.getRemarks());
        }

        Sample savedSample = sampleRepository.save(sample);
        return convertToDTO(savedSample);
    }

    public void deleteSample(Long id) {
        Sample sample = sampleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sample", "id", id));
        sample.setIsDeleted(true);
        sample.setIsActive(false);
        sampleRepository.save(sample);
    }

    public Long countSamplesByStatus(SampleStatus status) {
        return sampleRepository.countByStatus(status);
    }
}
