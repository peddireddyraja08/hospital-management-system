package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.Bed;
import com.hospital.enums.BedStatus;
import com.hospital.service.BedService;
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
@RequestMapping("/beds")
@RequiredArgsConstructor
@Tag(name = "Bed Management", description = "APIs for managing hospital beds and ADT (Admission, Discharge, Transfer)")
public class BedController {

    private final BedService bedService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Create a new bed", description = "Creates a new bed record")
    public ResponseEntity<ApiResponse<Bed>> createBed(@RequestBody Bed bed) {
        Bed createdBed = bedService.createBed(bed);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bed created successfully", createdBed));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get bed by ID", description = "Retrieves a bed by its database ID")
    public ResponseEntity<ApiResponse<Bed>> getBedById(@PathVariable Long id) {
        Bed bed = bedService.getBedById(id);
        return ResponseEntity.ok(ApiResponse.success(bed));
    }

    @GetMapping("/bedNumber/{bedNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get bed by bed number", description = "Retrieves a bed by its unique bed number")
    public ResponseEntity<ApiResponse<Bed>> getBedByBedNumber(@PathVariable String bedNumber) {
        Bed bed = bedService.getBedByBedNumber(bedNumber);
        return ResponseEntity.ok(ApiResponse.success(bed));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get all beds", description = "Retrieves all beds")
    public ResponseEntity<ApiResponse<List<Bed>>> getAllBeds() {
        List<Bed> beds = bedService.getAllBeds();
        return ResponseEntity.ok(ApiResponse.success(beds));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get beds by status", description = "Retrieves all beds with a specific status")
    public ResponseEntity<ApiResponse<List<Bed>>> getBedsByStatus(@PathVariable BedStatus status) {
        List<Bed> beds = bedService.getBedsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(beds));
    }

    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get available beds", description = "Retrieves all available beds")
    public ResponseEntity<ApiResponse<List<Bed>>> getAvailableBeds() {
        List<Bed> beds = bedService.getAvailableBeds();
        return ResponseEntity.ok(ApiResponse.success(beds));
    }

    @GetMapping("/ward/{wardName}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get beds by ward", description = "Retrieves all beds in a specific ward")
    public ResponseEntity<ApiResponse<List<Bed>>> getBedsByWard(@PathVariable String wardName) {
        List<Bed> beds = bedService.getBedsByWard(wardName);
        return ResponseEntity.ok(ApiResponse.success(beds));
    }

    @GetMapping("/type/{bedType}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get beds by type", description = "Retrieves all beds of a specific type")
    public ResponseEntity<ApiResponse<List<Bed>>> getBedsByType(@PathVariable String bedType) {
        List<Bed> beds = bedService.getBedsByType(bedType);
        return ResponseEntity.ok(ApiResponse.success(beds));
    }

    @GetMapping("/ward/{wardName}/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get available beds by ward", description = "Retrieves all available beds in a specific ward")
    public ResponseEntity<ApiResponse<List<Bed>>> getAvailableBedsByWard(@PathVariable String wardName) {
        List<Bed> beds = bedService.getAvailableBedsByWard(wardName);
        return ResponseEntity.ok(ApiResponse.success(beds));
    }

    @GetMapping("/available/ward/{ward}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get available beds in specific ward")
    public ResponseEntity<ApiResponse<List<Bed>>> getAvailableBedsInWard(@PathVariable String ward) {
        List<Bed> beds = bedService.getAvailableBedsInWard(ward);
        return ResponseEntity.ok(ApiResponse.success(beds));
    }

    @GetMapping("/available/type/{bedType}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    @Operation(summary = "Get available beds by type")
    public ResponseEntity<ApiResponse<List<Bed>>> getAvailableBedsByType(@PathVariable String bedType) {
        List<Bed> beds = bedService.getAvailableBedsByType(bedType);
        return ResponseEntity.ok(ApiResponse.success(beds));
    }

    @GetMapping("/available/isolation")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get available isolation beds")
    public ResponseEntity<ApiResponse<List<Bed>>> getAvailableIsolationBeds() {
        List<Bed> beds = bedService.getAvailableIsolationBeds();
        return ResponseEntity.ok(ApiResponse.success(beds));
    }

    @GetMapping("/available/ventilator")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Get available beds with ventilator")
    public ResponseEntity<ApiResponse<List<Bed>>> getAvailableBedsWithVentilator() {
        List<Bed> beds = bedService.getAvailableBedsWithVentilator();
        return ResponseEntity.ok(ApiResponse.success(beds));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Update bed", description = "Updates an existing bed record")
    public ResponseEntity<ApiResponse<Bed>> updateBed(
            @PathVariable Long id,
            @RequestBody Bed bed) {
        Bed updatedBed = bedService.updateBed(id, bed);
        return ResponseEntity.ok(ApiResponse.success("Bed updated successfully", updatedBed));
    }

    // ADT Operations

    @PostMapping("/{bedId}/admit/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Admit patient to bed", description = "Admits a patient to a specific bed (ADT operation)")
    public ResponseEntity<ApiResponse<Bed>> admitPatient(
            @PathVariable Long bedId,
            @PathVariable Long patientId) {
        Bed bed = bedService.admitPatient(bedId, patientId);
        return ResponseEntity.ok(ApiResponse.success("Patient admitted successfully", bed));
    }

    @PostMapping("/{bedId}/discharge")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Discharge patient from bed", description = "Discharges a patient from a bed (ADT operation)")
    public ResponseEntity<ApiResponse<Bed>> dischargePatient(@PathVariable Long bedId) {
        Bed bed = bedService.dischargePatient(bedId);
        return ResponseEntity.ok(ApiResponse.success("Patient discharged successfully", bed));
    }

    @PostMapping("/transfer")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Transfer patient between beds", description = "Transfers a patient from one bed to another (ADT operation)")
    public ResponseEntity<ApiResponse<Bed>> transferPatient(
            @RequestParam Long fromBedId,
            @RequestParam Long toBedId) {
        Bed bed = bedService.transferPatient(fromBedId, toBedId);
        return ResponseEntity.ok(ApiResponse.success("Patient transferred successfully", bed));
    }

    @PostMapping("/{bedId}/maintenance")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Mark bed for maintenance", description = "Marks a bed as under maintenance")
    public ResponseEntity<ApiResponse<Bed>> markBedForMaintenance(@PathVariable Long bedId) {
        Bed bed = bedService.markBedForMaintenance(bedId);
        return ResponseEntity.ok(ApiResponse.success("Bed marked for maintenance", bed));
    }

    @PostMapping("/{bedId}/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Mark bed as available", description = "Marks a bed as available (e.g., after maintenance)")
    public ResponseEntity<ApiResponse<Bed>> markBedAsAvailable(@PathVariable Long bedId) {
        Bed bed = bedService.markBedAsAvailable(bedId);
        return ResponseEntity.ok(ApiResponse.success("Bed marked as available", bed));
    }

    // Block/Unblock Operations

    @PostMapping("/{bedId}/block")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @Operation(summary = "Block bed", description = "Block bed for surgery or special purpose")
    public ResponseEntity<ApiResponse<Bed>> blockBed(
            @PathVariable Long bedId,
            @RequestParam String reason,
            @RequestParam String blockedBy,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime blockedUntil) {
        Bed bed = bedService.blockBed(bedId, reason, blockedBy, blockedUntil);
        return ResponseEntity.ok(ApiResponse.success("Bed blocked successfully", bed));
    }

    @PostMapping("/{bedId}/unblock")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @Operation(summary = "Unblock bed")
    public ResponseEntity<ApiResponse<Bed>> unblockBed(@PathVariable Long bedId) {
        Bed bed = bedService.unblockBed(bedId);
        return ResponseEntity.ok(ApiResponse.success("Bed unblocked successfully", bed));
    }

    @PostMapping("/{bedId}/mark-cleaned")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Mark bed as cleaned")
    public ResponseEntity<ApiResponse<Bed>> markBedCleaned(
            @PathVariable Long bedId,
            @RequestParam String cleanedBy) {
        Bed bed = bedService.markBedCleaned(bedId, cleanedBy);
        return ResponseEntity.ok(ApiResponse.success("Bed marked as cleaned", bed));
    }

    @PostMapping("/{bedId}/schedule-maintenance")
    @PreAuthorize("hasAnyRole('ADMIN')")
    @Operation(summary = "Schedule bed maintenance with details")
    public ResponseEntity<ApiResponse<Bed>> sendBedForMaintenance(
            @PathVariable Long bedId,
            @RequestParam String notes,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime nextMaintenanceDate) {
        Bed bed = bedService.sendBedForMaintenance(bedId, notes, nextMaintenanceDate);
        return ResponseEntity.ok(ApiResponse.success("Bed maintenance scheduled", bed));
    }

    @PostMapping("/{bedId}/complete-maintenance")
    @PreAuthorize("hasAnyRole('ADMIN')")
    @Operation(summary = "Complete bed maintenance")
    public ResponseEntity<ApiResponse<Bed>> completeBedMaintenance(@PathVariable Long bedId) {
        Bed bed = bedService.completeBedMaintenance(bedId);
        return ResponseEntity.ok(ApiResponse.success("Bed maintenance completed", bed));
    }

    @GetMapping("/maintenance/required")
    @PreAuthorize("hasAnyRole('ADMIN')")
    @Operation(summary = "Get beds requiring maintenance")
    public ResponseEntity<ApiResponse<List<Bed>>> getBedsRequiringMaintenance() {
        List<Bed> beds = bedService.getBedsRequiringMaintenance();
        return ResponseEntity.ok(ApiResponse.success(beds));
    }

    // Analytics Operations

    @GetMapping("/analytics/real-time-map")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get real-time bed map data", description = "Get comprehensive bed status for real-time bed map visualization")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRealTimeBedMapData() {
        Map<String, Object> bedMapData = bedService.getRealTimeBedMapData();
        return ResponseEntity.ok(ApiResponse.success(bedMapData));
    }

    @GetMapping("/analytics/occupancy")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    @Operation(summary = "Get bed occupancy analytics", description = "Get ward-wise bed occupancy rates and statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBedOccupancyAnalytics() {
        Map<String, Object> analytics = bedService.getBedOccupancyAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @GetMapping("/predicted-discharge")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    @Operation(summary = "Get predicted discharge bed list", description = "Get beds expected to become available soon")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPredictedDischargeBeds(
            @RequestParam(defaultValue = "7") Integer daysAhead) {
        List<Map<String, Object>> beds = bedService.getPredictedDischargeBeds(daysAhead);
        return ResponseEntity.ok(ApiResponse.success(beds));
    }

    @GetMapping("/overstay-alerts")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    @Operation(summary = "Get overstay alerts", description = "Get alerts for patients who have exceeded expected discharge date")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getOverstayAlerts() {
        List<Map<String, Object>> alerts = bedService.getOverstayAlerts();
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @GetMapping("/analytics/alos")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Calculate Average Length of Stay")
    public ResponseEntity<ApiResponse<Map<String, Object>>> calculateALOS(
            @RequestParam(required = false) String ward,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Map<String, Object> alos = bedService.calculateALOS(ward, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(alos));
    }

    @GetMapping("/analytics/icu-utilization")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Get ICU utilization statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getICUUtilization() {
        Map<String, Object> utilization = bedService.getICUUtilization();
        return ResponseEntity.ok(ApiResponse.success(utilization));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete bed", description = "Soft deletes a bed record (Admin only, cannot delete occupied beds)")
    public ResponseEntity<ApiResponse<Void>> deleteBed(@PathVariable Long id) {
        bedService.deleteBed(id);
        return ResponseEntity.ok(ApiResponse.success("Bed deleted successfully", null));
    }
}
