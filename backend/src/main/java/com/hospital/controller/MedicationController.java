package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.Medication;
import com.hospital.service.MedicationService;
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
@RequestMapping("/medications")
@RequiredArgsConstructor
@Tag(name = "Medication Management", description = "APIs for managing medication catalog and inventory")
public class MedicationController {

    private final MedicationService medicationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Create a new medication")
    public ResponseEntity<ApiResponse<Medication>> createMedication(@Valid @RequestBody Medication medication) {
        Medication createdMedication = medicationService.createMedication(medication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Medication created successfully", createdMedication));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PHARMACIST')")
    @Operation(summary = "Get medication by ID")
    public ResponseEntity<ApiResponse<Medication>> getMedicationById(@PathVariable Long id) {
        Medication medication = medicationService.getMedicationById(id);
        return ResponseEntity.ok(ApiResponse.success(medication));
    }

    @GetMapping("/code/{medicationCode}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PHARMACIST')")
    @Operation(summary = "Get medication by code")
    public ResponseEntity<ApiResponse<Medication>> getMedicationByCode(@PathVariable String medicationCode) {
        Medication medication = medicationService.getMedicationByCode(medicationCode);
        return ResponseEntity.ok(ApiResponse.success(medication));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PHARMACIST')")
    @Operation(summary = "Get all medications")
    public ResponseEntity<ApiResponse<List<Medication>>> getAllMedications() {
        List<Medication> medications = medicationService.getAllMedications();
        return ResponseEntity.ok(ApiResponse.success(medications));
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PHARMACIST')")
    @Operation(summary = "Get medications by category")
    public ResponseEntity<ApiResponse<List<Medication>>> getMedicationsByCategory(@PathVariable String category) {
        List<Medication> medications = medicationService.getMedicationsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(medications));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Get low stock medications")
    public ResponseEntity<ApiResponse<List<Medication>>> getLowStockMedications() {
        List<Medication> medications = medicationService.getLowStockMedications();
        return ResponseEntity.ok(ApiResponse.success(medications));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Update medication")
    public ResponseEntity<ApiResponse<Medication>> updateMedication(
            @PathVariable Long id,
            @Valid @RequestBody Medication medication) {
        Medication updatedMedication = medicationService.updateMedication(id, medication);
        return ResponseEntity.ok(ApiResponse.success("Medication updated successfully", updatedMedication));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Update medication stock")
    public ResponseEntity<ApiResponse<Medication>> updateStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        Medication medication = medicationService.updateStock(id, quantity);
        return ResponseEntity.ok(ApiResponse.success("Stock updated successfully", medication));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete medication")
    public ResponseEntity<ApiResponse<Void>> deleteMedication(@PathVariable Long id) {
        medicationService.deleteMedication(id);
        return ResponseEntity.ok(ApiResponse.success("Medication deleted successfully", null));
    }
}
