package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.dto.OrderValidationResponse;
import com.hospital.service.OrderValidationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order-validation")
@RequiredArgsConstructor
@Tag(name = "Order Validation & Decision Support", description = "APIs for medication order validation with allergy, duplicate, and dose checking")
public class OrderValidationController {

    private final OrderValidationService orderValidationService;

    @PostMapping("/validate-medication")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Validate medication order", 
               description = "Comprehensive validation including allergy check, duplicate detection, and dose validation")
    public ResponseEntity<ApiResponse<OrderValidationResponse>> validateMedicationOrder(
            @RequestParam Long patientId,
            @RequestParam String drugName,
            @RequestParam Double dose,
            @RequestParam String unit,
            @RequestParam(required = false) String frequency) {
        
        OrderValidationResponse validation = orderValidationService.validateMedicationOrder(
                patientId, drugName, dose, unit, frequency);
        
        return ResponseEntity.ok(ApiResponse.success("Validation complete", validation));
    }

    @GetMapping("/quick-check")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'PHARMACIST')")
    @Operation(summary = "Quick allergy and duplicate check", 
               description = "Fast validation for allergy and exact duplicate checking only")
    public ResponseEntity<ApiResponse<OrderValidationResponse>> quickCheck(
            @RequestParam Long patientId,
            @RequestParam String drugName) {
        
        OrderValidationResponse validation = orderValidationService.quickValidate(patientId, drugName);
        
        return ResponseEntity.ok(ApiResponse.success("Quick check complete", validation));
    }

    @PostMapping("/validate-multiple")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Validate multiple drugs", 
               description = "Check allergies and interactions for multiple medications")
    public ResponseEntity<ApiResponse<OrderValidationResponse>> validateMultipleDrugs(
            @RequestParam Long patientId,
            @RequestBody List<String> drugNames) {
        
        OrderValidationResponse validation = orderValidationService.validateMultipleDrugs(
                patientId, drugNames);
        
        return ResponseEntity.ok(ApiResponse.success("Multi-drug validation complete", validation));
    }

    @GetMapping("/validation-summary/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PHARMACIST')")
    @Operation(summary = "Get patient allergy summary", 
               description = "Get summary of patient allergies and contraindications")
    public ResponseEntity<ApiResponse<String>> getPatientAllergySummary(@PathVariable Long patientId) {
        // This would return formatted allergy information
        String summary = "Patient allergy information retrieved";
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
