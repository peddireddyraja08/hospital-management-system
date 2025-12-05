package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.QCMaterial;
import com.hospital.enums.QCLevel;
import com.hospital.service.QCMaterialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/qc-materials")
@RequiredArgsConstructor
@Tag(name = "QC Materials", description = "Quality Control Materials Management")
public class QCMaterialController {

    private final QCMaterialService qcMaterialService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN', 'DOCTOR')")
    @Operation(summary = "Get all QC materials")
    public ResponseEntity<ApiResponse<List<QCMaterial>>> getAllMaterials() {
        List<QCMaterial> materials = qcMaterialService.getAllMaterials();
        return ResponseEntity.ok(ApiResponse.success(materials));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN', 'DOCTOR')")
    @Operation(summary = "Get QC material by ID")
    public ResponseEntity<ApiResponse<QCMaterial>> getMaterialById(@PathVariable Long id) {
        QCMaterial material = qcMaterialService.getMaterialById(id);
        return ResponseEntity.ok(ApiResponse.success(material));
    }

    @GetMapping("/lab-test/{labTestId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN', 'DOCTOR')")
    @Operation(summary = "Get QC materials by lab test")
    public ResponseEntity<ApiResponse<List<QCMaterial>>> getMaterialsByLabTest(@PathVariable Long labTestId) {
        List<QCMaterial> materials = qcMaterialService.getMaterialsByLabTest(labTestId);
        return ResponseEntity.ok(ApiResponse.success(materials));
    }

    @GetMapping("/level/{level}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get QC materials by level")
    public ResponseEntity<ApiResponse<List<QCMaterial>>> getMaterialsByLevel(@PathVariable QCLevel level) {
        List<QCMaterial> materials = qcMaterialService.getMaterialsByLevel(level);
        return ResponseEntity.ok(ApiResponse.success(materials));
    }

    @GetMapping("/expired")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get expired QC materials")
    public ResponseEntity<ApiResponse<List<QCMaterial>>> getExpiredMaterials() {
        List<QCMaterial> materials = qcMaterialService.getExpiredMaterials();
        return ResponseEntity.ok(ApiResponse.success(materials));
    }

    @GetMapping("/expiring-soon")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get QC materials expiring soon")
    public ResponseEntity<ApiResponse<List<QCMaterial>>> getMaterialsExpiringSoon(
            @RequestParam(defaultValue = "30") int days) {
        List<QCMaterial> materials = qcMaterialService.getMaterialsExpiringSoon(days);
        return ResponseEntity.ok(ApiResponse.success(materials));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN')")
    @Operation(summary = "Create new QC material")
    public ResponseEntity<ApiResponse<QCMaterial>> createMaterial(@RequestBody QCMaterial material) {
        QCMaterial createdMaterial = qcMaterialService.createMaterial(material);
        return ResponseEntity.ok(ApiResponse.success("QC Material created successfully", createdMaterial));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN')")
    @Operation(summary = "Update QC material")
    public ResponseEntity<ApiResponse<QCMaterial>> updateMaterial(
            @PathVariable Long id,
            @RequestBody QCMaterial material) {
        QCMaterial updatedMaterial = qcMaterialService.updateMaterial(id, material);
        return ResponseEntity.ok(ApiResponse.success("QC Material updated successfully", updatedMaterial));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete QC material")
    public ResponseEntity<ApiResponse<String>> deleteMaterial(@PathVariable Long id) {
        qcMaterialService.deleteMaterial(id);
        return ResponseEntity.ok(ApiResponse.success("QC Material deleted successfully"));
    }
}
