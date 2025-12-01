package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.Prescription;
import com.hospital.enums.PrescriptionStatus;
import com.hospital.service.PrescriptionService;
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
@RequestMapping("/prescriptions")
@RequiredArgsConstructor
@Tag(name = "Prescription Management", description = "APIs for managing prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Create a new prescription")
    public ResponseEntity<ApiResponse<Prescription>> createPrescription(@Valid @RequestBody Prescription prescription) {
        Prescription createdPrescription = prescriptionService.createPrescription(prescription);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Prescription created successfully", createdPrescription));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PHARMACIST')")
    @Operation(summary = "Get prescription by ID")
    public ResponseEntity<ApiResponse<Prescription>> getPrescriptionById(@PathVariable Long id) {
        Prescription prescription = prescriptionService.getPrescriptionById(id);
        return ResponseEntity.ok(ApiResponse.success(prescription));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Get all prescriptions")
    public ResponseEntity<ApiResponse<List<Prescription>>> getAllPrescriptions() {
        List<Prescription> prescriptions = prescriptionService.getAllPrescriptions();
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PHARMACIST')")
    @Operation(summary = "Get prescriptions by patient ID")
    public ResponseEntity<ApiResponse<List<Prescription>>> getPrescriptionsByPatientId(@PathVariable Long patientId) {
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PHARMACIST')")
    @Operation(summary = "Get prescriptions by doctor ID")
    public ResponseEntity<ApiResponse<List<Prescription>>> getPrescriptionsByDoctorId(@PathVariable Long doctorId) {
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByDoctorId(doctorId);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Get prescriptions by status")
    public ResponseEntity<ApiResponse<List<Prescription>>> getPrescriptionsByStatus(@PathVariable PrescriptionStatus status) {
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }

    @PatchMapping("/{id}/dispense")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Dispense prescription")
    public ResponseEntity<ApiResponse<Prescription>> dispensePrescription(
            @PathVariable Long id,
            @RequestParam String dispensedBy) {
        Prescription prescription = prescriptionService.dispensePrescription(id, dispensedBy);
        return ResponseEntity.ok(ApiResponse.success("Prescription dispensed successfully", prescription));
    }

    @PatchMapping("/{id}/partial-dispense")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Partially dispense prescription")
    public ResponseEntity<ApiResponse<Prescription>> partiallyDispensePrescription(
            @PathVariable Long id,
            @RequestParam Integer dispensedQuantity,
            @RequestParam String dispensedBy) {
        Prescription prescription = prescriptionService.partiallyDispensePrescription(id, dispensedQuantity, dispensedBy);
        return ResponseEntity.ok(ApiResponse.success("Prescription partially dispensed successfully", prescription));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Update prescription")
    public ResponseEntity<ApiResponse<Prescription>> updatePrescription(
            @PathVariable Long id,
            @Valid @RequestBody Prescription prescription) {
        Prescription updatedPrescription = prescriptionService.updatePrescription(id, prescription);
        return ResponseEntity.ok(ApiResponse.success("Prescription updated successfully", updatedPrescription));
    }

    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Cancel prescription")
    public ResponseEntity<ApiResponse<Void>> cancelPrescription(@PathVariable Long id) {
        prescriptionService.cancelPrescription(id);
        return ResponseEntity.ok(ApiResponse.success("Prescription cancelled successfully", null));
    }
}
