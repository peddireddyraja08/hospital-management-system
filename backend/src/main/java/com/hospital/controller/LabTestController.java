package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.LabTest;
import com.hospital.service.LabTestService;
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
@RequestMapping("/lab-tests")
@RequiredArgsConstructor
@Tag(name = "Lab Test Management", description = "APIs for managing lab test catalog")
public class LabTestController {

    private final LabTestService labTestService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN')")
    @Operation(summary = "Create a new lab test")
    public ResponseEntity<ApiResponse<LabTest>> createLabTest(@Valid @RequestBody LabTest labTest) {
        LabTest createdLabTest = labTestService.createLabTest(labTest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lab test created successfully", createdLabTest));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get lab test by ID")
    public ResponseEntity<ApiResponse<LabTest>> getLabTestById(@PathVariable Long id) {
        LabTest labTest = labTestService.getLabTestById(id);
        return ResponseEntity.ok(ApiResponse.success(labTest));
    }

    @GetMapping("/code/{testCode}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get lab test by test code")
    public ResponseEntity<ApiResponse<LabTest>> getLabTestByTestCode(@PathVariable String testCode) {
        LabTest labTest = labTestService.getLabTestByTestCode(testCode);
        return ResponseEntity.ok(ApiResponse.success(labTest));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get all lab tests")
    public ResponseEntity<ApiResponse<List<LabTest>>> getAllLabTests() {
        List<LabTest> labTests = labTestService.getAllLabTests();
        return ResponseEntity.ok(ApiResponse.success(labTests));
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get lab tests by category")
    public ResponseEntity<ApiResponse<List<LabTest>>> getLabTestsByCategory(@PathVariable String category) {
        List<LabTest> labTests = labTestService.getLabTestsByCategory(com.hospital.enums.TestCategory.valueOf(category));
        return ResponseEntity.ok(ApiResponse.success(labTests));
    }

    @GetMapping("/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get lab tests by department")
    public ResponseEntity<ApiResponse<List<LabTest>>> getLabTestsByDepartment(@PathVariable String department) {
        List<LabTest> labTests = labTestService.getLabTestsByDepartment(department);
        return ResponseEntity.ok(ApiResponse.success(labTests));
    }

    @GetMapping("/profiles")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Get all test profiles/panels")
    public ResponseEntity<ApiResponse<List<LabTest>>> getTestProfiles() {
        List<LabTest> profiles = labTestService.getTestProfiles();
        return ResponseEntity.ok(ApiResponse.success(profiles));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN')")
    @Operation(summary = "Search lab tests by name")
    public ResponseEntity<ApiResponse<List<LabTest>>> searchLabTestsByName(@RequestParam String testName) {
        List<LabTest> labTests = labTestService.searchLabTestsByName(testName);
        return ResponseEntity.ok(ApiResponse.success(labTests));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_TECHNICIAN')")
    @Operation(summary = "Update lab test")
    public ResponseEntity<ApiResponse<LabTest>> updateLabTest(
            @PathVariable Long id,
            @Valid @RequestBody LabTest labTest) {
        LabTest updatedLabTest = labTestService.updateLabTest(id, labTest);
        return ResponseEntity.ok(ApiResponse.success("Lab test updated successfully", updatedLabTest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete lab test")
    public ResponseEntity<ApiResponse<Void>> deleteLabTest(@PathVariable Long id) {
        labTestService.deleteLabTest(id);
        return ResponseEntity.ok(ApiResponse.success("Lab test deleted successfully", null));
    }
}
