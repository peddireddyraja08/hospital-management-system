package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.dto.SampleDTO;
import com.hospital.entity.Sample;
import com.hospital.enums.SampleStatus;
import com.hospital.service.SampleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/samples")
@RequiredArgsConstructor
@Tag(name = "Sample Management", description = "APIs for managing laboratory samples with barcode tracking")
public class SampleController {

    private final SampleService sampleService;

    @PostMapping
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'NURSE', 'ADMIN')")
    @Operation(summary = "Create new sample", description = "Create a new sample with auto-generated accession number")
    public ResponseEntity<ApiResponse<SampleDTO>> createSample(@RequestBody Sample sample) {
        SampleDTO createdSample = sampleService.createSample(sample);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Sample created successfully with accession number: " + 
                        createdSample.getAccessionNumber(), createdSample));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'DOCTOR', 'NURSE', 'ADMIN')")
    @Operation(summary = "Get sample by ID")
    public ResponseEntity<ApiResponse<SampleDTO>> getSampleById(@PathVariable Long id) {
        SampleDTO sample = sampleService.getSampleById(id);
        return ResponseEntity.ok(ApiResponse.success(sample));
    }

    @GetMapping("/accession/{accessionNumber}")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'DOCTOR', 'NURSE', 'ADMIN')")
    @Operation(summary = "Get sample by accession number", description = "Retrieve sample using barcode/accession number")
    public ResponseEntity<ApiResponse<SampleDTO>> getSampleByAccessionNumber(@PathVariable String accessionNumber) {
        SampleDTO sample = sampleService.getSampleByAccessionNumber(accessionNumber);
        return ResponseEntity.ok(ApiResponse.success(sample));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'DOCTOR', 'NURSE', 'ADMIN')")
    @Operation(summary = "Get all samples")
    public ResponseEntity<ApiResponse<List<SampleDTO>>> getAllSamples() {
        List<SampleDTO> samples = sampleService.getAllSamples();
        return ResponseEntity.ok(ApiResponse.success(samples));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'DOCTOR', 'NURSE', 'ADMIN')")
    @Operation(summary = "Get samples by patient")
    public ResponseEntity<ApiResponse<List<SampleDTO>>> getSamplesByPatient(@PathVariable Long patientId) {
        List<SampleDTO> samples = sampleService.getSamplesByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success(samples));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    @Operation(summary = "Get samples by status")
    public ResponseEntity<ApiResponse<List<SampleDTO>>> getSamplesByStatus(@PathVariable SampleStatus status) {
        List<SampleDTO> samples = sampleService.getSamplesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(samples));
    }

    @GetMapping("/collected-by/{collectedBy}")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    @Operation(summary = "Get samples by collector")
    public ResponseEntity<ApiResponse<List<SampleDTO>>> getSamplesByCollectedBy(@PathVariable String collectedBy) {
        List<SampleDTO> samples = sampleService.getSamplesByCollectedBy(collectedBy);
        return ResponseEntity.ok(ApiResponse.success(samples));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    @Operation(summary = "Get samples by date range")
    public ResponseEntity<ApiResponse<List<SampleDTO>>> getSamplesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<SampleDTO> samples = sampleService.getSamplesByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(samples));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    @Operation(summary = "Update sample status")
    public ResponseEntity<ApiResponse<SampleDTO>> updateSampleStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        SampleStatus newStatus = SampleStatus.valueOf(statusUpdate.get("status"));
        String updatedBy = statusUpdate.get("updatedBy");
        SampleDTO updatedSample = sampleService.updateSampleStatus(id, newStatus, updatedBy);
        return ResponseEntity.ok(ApiResponse.success("Sample status updated successfully", updatedSample));
    }

    @PutMapping("/{id}/receive")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    @Operation(summary = "Receive sample in lab", description = "Update sample status to RECEIVED with condition and storage location")
    public ResponseEntity<ApiResponse<SampleDTO>> receiveSample(
            @PathVariable Long id,
            @RequestBody Map<String, String> receiveData) {
        SampleDTO receivedSample = sampleService.receiveSample(
                id,
                receiveData.get("receivedBy"),
                receiveData.get("condition"),
                receiveData.get("storageLocation")
        );
        return ResponseEntity.ok(ApiResponse.success("Sample received successfully", receivedSample));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    @Operation(summary = "Reject sample", description = "Mark sample as rejected with reason")
    public ResponseEntity<ApiResponse<SampleDTO>> rejectSample(
            @PathVariable Long id,
            @RequestBody Map<String, String> rejectData) {
        SampleDTO rejectedSample = sampleService.rejectSample(
                id,
                rejectData.get("rejectionReason"),
                rejectData.get("rejectedBy")
        );
        return ResponseEntity.ok(ApiResponse.success("Sample rejected", rejectedSample));
    }

    @PutMapping("/{id}/start-processing")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    @Operation(summary = "Start sample processing")
    public ResponseEntity<ApiResponse<SampleDTO>> startProcessing(@PathVariable Long id) {
        SampleDTO sample = sampleService.startProcessing(id);
        return ResponseEntity.ok(ApiResponse.success("Sample processing started", sample));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    @Operation(summary = "Complete sample processing")
    public ResponseEntity<ApiResponse<SampleDTO>> completeSample(
            @PathVariable Long id,
            @RequestBody Map<String, String> completeData) {
        SampleDTO sample = sampleService.completeSample(id, completeData.get("storageLocation"));
        return ResponseEntity.ok(ApiResponse.success("Sample processing completed", sample));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    @Operation(summary = "Update sample details")
    public ResponseEntity<ApiResponse<SampleDTO>> updateSample(
            @PathVariable Long id,
            @RequestBody Sample sampleDetails) {
        SampleDTO updatedSample = sampleService.updateSample(id, sampleDetails);
        return ResponseEntity.ok(ApiResponse.success("Sample updated successfully", updatedSample));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete sample (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteSample(@PathVariable Long id) {
        sampleService.deleteSample(id);
        return ResponseEntity.ok(ApiResponse.success("Sample deleted successfully", null));
    }

    @GetMapping("/statistics/count-by-status/{status}")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'ADMIN')")
    @Operation(summary = "Count samples by status")
    public ResponseEntity<ApiResponse<Long>> countSamplesByStatus(@PathVariable SampleStatus status) {
        Long count = sampleService.countSamplesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @GetMapping("/generate-accession-number")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN', 'NURSE', 'ADMIN')")
    @Operation(summary = "Generate new accession number", description = "Generate a unique accession number for barcode printing")
    public ResponseEntity<ApiResponse<String>> generateAccessionNumber() {
        String accessionNumber = sampleService.generateAccessionNumber();
        return ResponseEntity.ok(ApiResponse.success("Accession number generated", accessionNumber));
    }
}
