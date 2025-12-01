package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.Staff;
import com.hospital.service.StaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
@Tag(name = "Staff Management", description = "APIs for managing hospital staff")
public class StaffController {

    private final StaffService staffService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new staff member", description = "Creates a new staff record (Admin only)")
    public ResponseEntity<ApiResponse<Staff>> createStaff(@RequestBody Staff staff) {
        Staff createdStaff = staffService.createStaff(staff);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Staff created successfully", createdStaff));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get staff by ID", description = "Retrieves a staff member by their database ID")
    public ResponseEntity<ApiResponse<Staff>> getStaffById(@PathVariable Long id) {
        Staff staff = staffService.getStaffById(id);
        return ResponseEntity.ok(ApiResponse.success(staff));
    }

    @GetMapping("/staffId/{staffId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get staff by staff ID", description = "Retrieves a staff member by their unique staff ID")
    public ResponseEntity<ApiResponse<Staff>> getStaffByStaffId(@PathVariable String staffId) {
        Staff staff = staffService.getStaffByStaffId(staffId);
        return ResponseEntity.ok(ApiResponse.success(staff));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all staff", description = "Retrieves all staff members")
    public ResponseEntity<ApiResponse<List<Staff>>> getAllStaff() {
        List<Staff> staffList = staffService.getAllStaff();
        return ResponseEntity.ok(ApiResponse.success(staffList));
    }

    @GetMapping("/department/{department}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get staff by department", description = "Retrieves all staff members in a specific department")
    public ResponseEntity<ApiResponse<List<Staff>>> getStaffByDepartment(@PathVariable String department) {
        List<Staff> staffList = staffService.getStaffByDepartment(department);
        return ResponseEntity.ok(ApiResponse.success(staffList));
    }

    @GetMapping("/designation/{designation}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get staff by designation", description = "Retrieves all staff members with a specific designation")
    public ResponseEntity<ApiResponse<List<Staff>>> getStaffByDesignation(@PathVariable String designation) {
        List<Staff> staffList = staffService.getStaffByDesignation(designation);
        return ResponseEntity.ok(ApiResponse.success(staffList));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update staff", description = "Updates an existing staff record (Admin only)")
    public ResponseEntity<ApiResponse<Staff>> updateStaff(
            @PathVariable Long id,
            @RequestBody Staff staff) {
        Staff updatedStaff = staffService.updateStaff(id, staff);
        return ResponseEntity.ok(ApiResponse.success("Staff updated successfully", updatedStaff));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete staff", description = "Soft deletes a staff record (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok(ApiResponse.success("Staff deleted successfully", null));
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search staff by email", description = "Finds a staff member by email address")
    public ResponseEntity<ApiResponse<Staff>> searchByEmail(@PathVariable String email) {
        Staff staff = staffService.searchByEmail(email);
        return ResponseEntity.ok(ApiResponse.success(staff));
    }
}
