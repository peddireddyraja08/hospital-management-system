package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.CriticalAlert;
import com.hospital.service.CriticalAlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/critical-alerts")
@RequiredArgsConstructor
@Tag(name = "Critical Alerts", description = "Critical lab value alert management APIs")
public class CriticalAlertController {

    private final CriticalAlertService criticalAlertService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get all critical alerts")
    public ResponseEntity<ApiResponse<List<CriticalAlert>>> getAllAlerts() {
        List<CriticalAlert> alerts = criticalAlertService.getAllAlerts();
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get active critical alerts")
    public ResponseEntity<ApiResponse<List<CriticalAlert>>> getActiveAlerts() {
        List<CriticalAlert> alerts = criticalAlertService.getActiveAlerts();
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @GetMapping("/unacknowledged")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get unacknowledged critical alerts")
    public ResponseEntity<ApiResponse<List<CriticalAlert>>> getUnacknowledgedAlerts() {
        List<CriticalAlert> alerts = criticalAlertService.getUnacknowledgedAlerts();
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get unacknowledged alert count for badge")
    public ResponseEntity<ApiResponse<Long>> getUnacknowledgedAlertCount() {
        Long count = criticalAlertService.getUnacknowledgedAlertCount();
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get alert by ID")
    public ResponseEntity<ApiResponse<CriticalAlert>> getAlertById(@PathVariable Long id) {
        CriticalAlert alert = criticalAlertService.getAlertById(id);
        return ResponseEntity.ok(ApiResponse.success(alert));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get alerts by patient ID")
    public ResponseEntity<ApiResponse<List<CriticalAlert>>> getAlertsByPatient(@PathVariable Long patientId) {
        List<CriticalAlert> alerts = criticalAlertService.getAlertsByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Get alerts by doctor ID")
    public ResponseEntity<ApiResponse<List<CriticalAlert>>> getAlertsByDoctor(@PathVariable Long doctorId) {
        List<CriticalAlert> alerts = criticalAlertService.getAlertsByDoctor(doctorId);
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @PutMapping("/{id}/acknowledge")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Acknowledge a critical alert")
    public ResponseEntity<ApiResponse<CriticalAlert>> acknowledgeAlert(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String acknowledgedBy = request.get("acknowledgedBy");
        String notes = request.get("notes");
        CriticalAlert alert = criticalAlertService.acknowledgeAlert(id, acknowledgedBy, notes);
        return ResponseEntity.ok(ApiResponse.success("Alert acknowledged successfully", alert));
    }

    @PutMapping("/{id}/escalate")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Escalate a critical alert")
    public ResponseEntity<ApiResponse<CriticalAlert>> escalateAlert(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String escalatedTo = request.get("escalatedTo");
        CriticalAlert alert = criticalAlertService.escalateAlert(id, escalatedTo);
        return ResponseEntity.ok(ApiResponse.success("Alert escalated successfully", alert));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Resolve a critical alert")
    public ResponseEntity<ApiResponse<CriticalAlert>> resolveAlert(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String resolutionNotes = request.get("resolutionNotes");
        CriticalAlert alert = criticalAlertService.resolveAlert(id, resolutionNotes);
        return ResponseEntity.ok(ApiResponse.success("Alert resolved successfully", alert));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'LAB_TECHNICIAN')")
    @Operation(summary = "Cancel a critical alert (false positive)")
    public ResponseEntity<ApiResponse<CriticalAlert>> cancelAlert(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String reason = request.get("reason");
        CriticalAlert alert = criticalAlertService.cancelAlert(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Alert cancelled successfully", alert));
    }
}
