package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.QCRun;
import com.hospital.enums.QCStatus;
import com.hospital.service.QCRunService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/qc-runs")
@RequiredArgsConstructor
@Tag(name = "QC Runs", description = "Quality Control Data Entry and Management")
public class QCRunController {

    private final QCRunService qcRunService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN', 'DOCTOR')")
    @Operation(summary = "Get all QC runs")
    public ResponseEntity<ApiResponse<List<QCRun>>> getAllRuns() {
        List<QCRun> runs = qcRunService.getAllRuns();
        return ResponseEntity.ok(ApiResponse.success(runs));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN', 'DOCTOR')")
    @Operation(summary = "Get QC run by ID")
    public ResponseEntity<ApiResponse<QCRun>> getRunById(@PathVariable Long id) {
        QCRun run = qcRunService.getRunById(id);
        return ResponseEntity.ok(ApiResponse.success(run));
    }

    @GetMapping("/material/{materialId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN', 'DOCTOR')")
    @Operation(summary = "Get QC runs by material")
    public ResponseEntity<ApiResponse<List<QCRun>>> getRunsByMaterial(@PathVariable Long materialId) {
        List<QCRun> runs = qcRunService.getRunsByMaterial(materialId);
        return ResponseEntity.ok(ApiResponse.success(runs));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN', 'DOCTOR')")
    @Operation(summary = "Get QC runs by status")
    public ResponseEntity<ApiResponse<List<QCRun>>> getRunsByStatus(@PathVariable QCStatus status) {
        List<QCRun> runs = qcRunService.getRunsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(runs));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN', 'DOCTOR')")
    @Operation(summary = "Get QC runs by date range")
    public ResponseEntity<ApiResponse<List<QCRun>>> getRunsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<QCRun> runs = qcRunService.getRunsByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(runs));
    }

    @GetMapping("/material/{materialId}/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN', 'DOCTOR')")
    @Operation(summary = "Get QC runs by material and date range")
    public ResponseEntity<ApiResponse<List<QCRun>>> getRunsByMaterialAndDateRange(
            @PathVariable Long materialId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<QCRun> runs = qcRunService.getRunsByMaterialAndDateRange(materialId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(runs));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN')")
    @Operation(summary = "Create new QC run")
    public ResponseEntity<ApiResponse<QCRun>> createRun(@RequestBody QCRun run) {
        QCRun createdRun = qcRunService.createRun(run);
        return ResponseEntity.ok(ApiResponse.success("QC Run recorded successfully", createdRun));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN')")
    @Operation(summary = "Update QC run")
    public ResponseEntity<ApiResponse<QCRun>> updateRun(
            @PathVariable Long id,
            @RequestBody QCRun run) {
        QCRun updatedRun = qcRunService.updateRun(id, run);
        return ResponseEntity.ok(ApiResponse.success("QC Run updated successfully", updatedRun));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete QC run")
    public ResponseEntity<ApiResponse<String>> deleteRun(@PathVariable Long id) {
        qcRunService.deleteRun(id);
        return ResponseEntity.ok(ApiResponse.success("QC Run deleted successfully"));
    }

    @GetMapping("/material/{materialId}/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN', 'DOCTOR')")
    @Operation(summary = "Get statistics for QC material")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMaterialStatistics(
            @PathVariable Long materialId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<QCRun> runs = qcRunService.getRunsByMaterialAndDateRange(materialId, startDate, endDate);
        BigDecimal cv = qcRunService.calculateCV(runs);
        Long totalRuns = (long) runs.size();
        Long inControlCount = runs.stream().filter(r -> r.getStatus() == QCStatus.IN_CONTROL).count();
        Long outOfControlCount = runs.stream().filter(r -> r.getStatus() == QCStatus.OUT_OF_CONTROL).count();
        Long warningCount = runs.stream().filter(r -> r.getStatus() == QCStatus.WARNING).count();
        
        Map<String, Object> statistics = Map.of(
                "totalRuns", totalRuns,
                "inControlCount", inControlCount,
                "outOfControlCount", outOfControlCount,
                "warningCount", warningCount,
                "coefficientOfVariation", cv,
                "runs", runs
        );
        
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }
}
