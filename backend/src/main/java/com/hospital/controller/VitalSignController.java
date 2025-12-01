package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.VitalSign;
import com.hospital.service.VitalSignService;
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
@RequestMapping("/vital-signs")
@RequiredArgsConstructor
@Tag(name = "Vital Signs", description = "APIs for recording and managing patient vital signs")
public class VitalSignController {

    private final VitalSignService vitalSignService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Record vital signs")
    public ResponseEntity<ApiResponse<VitalSign>> recordVitalSign(@Valid @RequestBody VitalSign vitalSign) {
        VitalSign recordedVitalSign = vitalSignService.recordVitalSign(vitalSign);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Vital signs recorded successfully", recordedVitalSign));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Get vital sign by ID")
    public ResponseEntity<ApiResponse<VitalSign>> getVitalSignById(@PathVariable Long id) {
        VitalSign vitalSign = vitalSignService.getVitalSignById(id);
        return ResponseEntity.ok(ApiResponse.success(vitalSign));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'PATIENT')")
    @Operation(summary = "Get vital signs by patient ID")
    public ResponseEntity<ApiResponse<List<VitalSign>>> getVitalSignsByPatientId(@PathVariable Long patientId) {
        List<VitalSign> vitalSigns = vitalSignService.getVitalSignsByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(vitalSigns));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Update vital signs")
    public ResponseEntity<ApiResponse<VitalSign>> updateVitalSign(
            @PathVariable Long id,
            @Valid @RequestBody VitalSign vitalSign) {
        VitalSign updatedVitalSign = vitalSignService.updateVitalSign(id, vitalSign);
        return ResponseEntity.ok(ApiResponse.success("Vital signs updated successfully", updatedVitalSign));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete vital sign record")
    public ResponseEntity<ApiResponse<Void>> deleteVitalSign(@PathVariable Long id) {
        vitalSignService.deleteVitalSign(id);
        return ResponseEntity.ok(ApiResponse.success("Vital sign record deleted successfully", null));
    }
}
