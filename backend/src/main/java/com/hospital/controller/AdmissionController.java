package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.Admission;
import com.hospital.enums.AdmissionStatus;
import com.hospital.service.AdmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admissions")
@RequiredArgsConstructor
@Tag(name = "Admission Management", description = "APIs for managing patient admissions and IPD operations")
public class AdmissionController {

    private final AdmissionService admissionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    @Operation(summary = "Create new admission", description = "Admit a patient and assign bed")
    public ResponseEntity<ApiResponse<Admission>> createAdmission(@RequestBody Admission admission) {
        Admission createdAdmission = admissionService.createAdmission(admission);
        return ResponseEntity.ok(ApiResponse.success("Admission created successfully", createdAdmission));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get admission by ID")
    public ResponseEntity<ApiResponse<Admission>> getAdmissionById(@PathVariable Long id) {
        Admission admission = admissionService.getAdmissionById(id);
        return ResponseEntity.ok(ApiResponse.success(admission));
    }

    @GetMapping("/number/{admissionNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get admission by admission number")
    public ResponseEntity<ApiResponse<Admission>> getAdmissionByNumber(@PathVariable String admissionNumber) {
        Admission admission = admissionService.getAdmissionByNumber(admissionNumber);
        return ResponseEntity.ok(ApiResponse.success(admission));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get all admissions", description = "Retrieves all admissions (active and discharged)")
    public ResponseEntity<ApiResponse<List<Admission>>> getAllAdmissions() {
        List<Admission> admissions = admissionService.getAllAdmissions();
        return ResponseEntity.ok(ApiResponse.success(admissions));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get all active admissions")
    public ResponseEntity<ApiResponse<List<Admission>>> getAllActiveAdmissions() {
        List<Admission> admissions = admissionService.getAllActiveAdmissions();
        return ResponseEntity.ok(ApiResponse.success(admissions));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get admissions by patient ID")
    public ResponseEntity<ApiResponse<List<Admission>>> getAdmissionsByPatient(@PathVariable Long patientId) {
        List<Admission> admissions = admissionService.getAdmissionsByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success(admissions));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    @Operation(summary = "Get admissions by doctor ID")
    public ResponseEntity<ApiResponse<List<Admission>>> getAdmissionsByDoctor(@PathVariable Long doctorId) {
        List<Admission> admissions = admissionService.getAdmissionsByDoctor(doctorId);
        return ResponseEntity.ok(ApiResponse.success(admissions));
    }

    @GetMapping("/ward/{ward}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get admissions by ward")
    public ResponseEntity<ApiResponse<List<Admission>>> getAdmissionsByWard(@PathVariable String ward) {
        List<Admission> admissions = admissionService.getAdmissionsByWard(ward);
        return ResponseEntity.ok(ApiResponse.success(admissions));
    }

    @GetMapping("/icu")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Get all ICU admissions")
    public ResponseEntity<ApiResponse<List<Admission>>> getICUAdmissions() {
        List<Admission> admissions = admissionService.getICUAdmissions();
        return ResponseEntity.ok(ApiResponse.success(admissions));
    }

    @GetMapping("/isolation")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Get all isolation admissions")
    public ResponseEntity<ApiResponse<List<Admission>>> getIsolationAdmissions() {
        List<Admission> admissions = admissionService.getIsolationAdmissions();
        return ResponseEntity.ok(ApiResponse.success(admissions));
    }

    @GetMapping("/predicted-discharge")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get predicted discharges", description = "Get patients expected to be discharged within specified days")
    public ResponseEntity<ApiResponse<List<Admission>>> getPredictedDischarges(
            @RequestParam(defaultValue = "7") Integer daysAhead) {
        List<Admission> admissions = admissionService.getPredictedDischarges(daysAhead);
        return ResponseEntity.ok(ApiResponse.success(admissions));
    }

    @GetMapping("/overstay")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    @Operation(summary = "Get overstay admissions", description = "Get patients who have exceeded expected discharge date")
    public ResponseEntity<ApiResponse<List<Admission>>> getOverstayAdmissions() {
        List<Admission> admissions = admissionService.getOverstayAdmissions();
        return ResponseEntity.ok(ApiResponse.success(admissions));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Update admission details")
    public ResponseEntity<ApiResponse<Admission>> updateAdmission(
            @PathVariable Long id,
            @RequestBody Admission admissionDetails) {
        Admission updatedAdmission = admissionService.updateAdmission(id, admissionDetails);
        return ResponseEntity.ok(ApiResponse.success("Admission updated successfully", updatedAdmission));
    }

    @PutMapping("/{admissionId}/transfer-bed/{newBedId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Transfer patient to different bed")
    public ResponseEntity<ApiResponse<Admission>> transferBed(
            @PathVariable Long admissionId,
            @PathVariable Long newBedId) {
        Admission admission = admissionService.transferBed(admissionId, newBedId);
        return ResponseEntity.ok(ApiResponse.success("Patient transferred successfully", admission));
    }

    @PutMapping("/{id}/discharge")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Discharge patient")
    public ResponseEntity<ApiResponse<Admission>> dischargePatient(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "DISCHARGED") AdmissionStatus dischargeStatus) {
        Admission admission = admissionService.dischargePatient(id, dischargeStatus);
        return ResponseEntity.ok(ApiResponse.success("Patient discharged successfully", admission));
    }

    @GetMapping("/count/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    @Operation(summary = "Get active admission count")
    public ResponseEntity<ApiResponse<Long>> getActiveAdmissionCount() {
        Long count = admissionService.getActiveAdmissionCount();
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @GetMapping("/count/by-ward")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    @Operation(summary = "Get admission count grouped by ward")
    public ResponseEntity<ApiResponse<List<Object[]>>> getAdmissionCountByWard() {
        List<Object[]> counts = admissionService.getAdmissionCountByWard();
        return ResponseEntity.ok(ApiResponse.success(counts));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    @Operation(summary = "Get admissions by date range")
    public ResponseEntity<ApiResponse<List<Admission>>> getAdmissionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Admission> admissions = admissionService.getAdmissionsByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(admissions));
    }
}
