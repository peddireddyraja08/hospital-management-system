package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.dto.LabTestRequestWithPatientDTO;
import com.hospital.entity.LabTestRequest;
import com.hospital.entity.LabTestResult;
import com.hospital.enums.TestStatus;
import com.hospital.service.LabTestRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lab-test-requests")
@RequiredArgsConstructor
@Tag(name = "Lab Test Request Management", description = "APIs for managing lab test requests and results")
public class LabTestRequestController {

    private final LabTestRequestService labTestRequestService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Create a new lab test request")
    public ResponseEntity<ApiResponse<LabTestRequest>> createLabTestRequest(@Valid @RequestBody LabTestRequest request) {
        LabTestRequest createdRequest = labTestRequestService.createLabTestRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lab test request created successfully", createdRequest));
    }

    @PostMapping("/with-patient")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Create lab test request with patient registration (for walk-in patients)")
    public ResponseEntity<ApiResponse<LabTestRequest>> createLabTestRequestWithPatient(
            @Valid @RequestBody LabTestRequestWithPatientDTO dto) {
        LabTestRequest createdRequest = labTestRequestService.createLabTestRequestWithPatient(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lab test request created with patient registration", createdRequest));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get lab test request by ID")
    public ResponseEntity<ApiResponse<LabTestRequest>> getLabTestRequestById(@PathVariable Long id) {
        LabTestRequest request = labTestRequestService.getLabTestRequestById(id);
        return ResponseEntity.ok(ApiResponse.success(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get all lab test requests")
    public ResponseEntity<ApiResponse<List<LabTestRequest>>> getAllLabTestRequests() {
        List<LabTestRequest> requests = labTestRequestService.getAllLabTestRequests();
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get lab test requests by patient ID")
    public ResponseEntity<ApiResponse<List<LabTestRequest>>> getLabTestRequestsByPatientId(@PathVariable Long patientId) {
        List<LabTestRequest> requests = labTestRequestService.getLabTestRequestsByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get lab test requests by doctor ID")
    public ResponseEntity<ApiResponse<List<LabTestRequest>>> getLabTestRequestsByDoctorId(@PathVariable Long doctorId) {
        List<LabTestRequest> requests = labTestRequestService.getLabTestRequestsByDoctorId(doctorId);
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get lab test requests by status")
    public ResponseEntity<ApiResponse<List<LabTestRequest>>> getLabTestRequestsByStatus(@PathVariable TestStatus status) {
        List<LabTestRequest> requests = labTestRequestService.getLabTestRequestsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN', 'NURSE')")
    @Operation(summary = "Update lab test request status")
    public ResponseEntity<ApiResponse<LabTestRequest>> updateLabTestRequestStatus(
            @PathVariable Long id,
            @RequestParam TestStatus status) {
        LabTestRequest request = labTestRequestService.updateLabTestRequestStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'LAB_TECHNICIAN')")
    @Operation(summary = "Update lab test request")
    public ResponseEntity<ApiResponse<LabTestRequest>> updateLabTestRequest(
            @PathVariable Long id,
            @Valid @RequestBody LabTestRequest request) {
        LabTestRequest updatedRequest = labTestRequestService.updateLabTestRequest(id, request);
        return ResponseEntity.ok(ApiResponse.success("Lab test request updated successfully", updatedRequest));
    }

    @PostMapping("/{requestId}/result")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN')")
    @Operation(summary = "Add lab test result")
    public ResponseEntity<ApiResponse<LabTestResult>> addLabTestResult(
            @PathVariable Long requestId,
            @Valid @RequestBody LabTestResult result) {
        LabTestResult createdResult = labTestRequestService.addLabTestResult(requestId, result);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lab test result added successfully", createdResult));
    }

    @GetMapping("/{requestId}/result")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get lab test result by request ID")
    public ResponseEntity<ApiResponse<LabTestResult>> getLabTestResultByRequestId(@PathVariable Long requestId) {
        LabTestResult result = labTestRequestService.getLabTestResultByRequestId(requestId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PatchMapping("/result/{resultId}/verify")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Verify lab test result")
    public ResponseEntity<ApiResponse<LabTestResult>> verifyLabTestResult(
            @PathVariable Long resultId,
            @RequestParam String verifiedBy) {
        LabTestResult result = labTestRequestService.verifyLabTestResult(resultId, verifiedBy);
        return ResponseEntity.ok(ApiResponse.success("Lab test result verified successfully", result));
    }

    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Cancel lab test request")
    public ResponseEntity<ApiResponse<Void>> cancelLabTestRequest(@PathVariable Long id) {
        labTestRequestService.cancelLabTestRequest(id);
        return ResponseEntity.ok(ApiResponse.success("Lab test request cancelled successfully", null));
    }
}
