package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.Bill;
import com.hospital.enums.BillStatus;
import com.hospital.service.BillService;
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
@RequestMapping("/bills")
@RequiredArgsConstructor
@Tag(name = "Billing Management", description = "APIs for managing bills and payments")
public class BillController {

    private final BillService billService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT', 'RECEPTIONIST')")
    @Operation(summary = "Create a new bill")
    public ResponseEntity<ApiResponse<Bill>> createBill(@Valid @RequestBody Bill bill) {
        Bill createdBill = billService.createBill(bill);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bill created successfully", createdBill));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT', 'RECEPTIONIST', 'DOCTOR')")
    @Operation(summary = "Get bill by ID")
    public ResponseEntity<ApiResponse<Bill>> getBillById(@PathVariable Long id) {
        Bill bill = billService.getBillById(id);
        return ResponseEntity.ok(ApiResponse.success(bill));
    }

    @GetMapping("/number/{billNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT', 'RECEPTIONIST')")
    @Operation(summary = "Get bill by bill number")
    public ResponseEntity<ApiResponse<Bill>> getBillByBillNumber(@PathVariable String billNumber) {
        Bill bill = billService.getBillByBillNumber(billNumber);
        return ResponseEntity.ok(ApiResponse.success(bill));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @Operation(summary = "Get all bills")
    public ResponseEntity<ApiResponse<List<Bill>>> getAllBills() {
        List<Bill> bills = billService.getAllBills();
        return ResponseEntity.ok(ApiResponse.success(bills));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT', 'RECEPTIONIST', 'DOCTOR')")
    @Operation(summary = "Get bills by patient ID")
    public ResponseEntity<ApiResponse<List<Bill>>> getBillsByPatientId(@PathVariable Long patientId) {
        List<Bill> bills = billService.getBillsByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(bills));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @Operation(summary = "Get bills by status")
    public ResponseEntity<ApiResponse<List<Bill>>> getBillsByStatus(@PathVariable BillStatus status) {
        List<Bill> bills = billService.getBillsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(bills));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @Operation(summary = "Update bill")
    public ResponseEntity<ApiResponse<Bill>> updateBill(
            @PathVariable Long id,
            @Valid @RequestBody Bill bill) {
        Bill updatedBill = billService.updateBill(id, bill);
        return ResponseEntity.ok(ApiResponse.success("Bill updated successfully", updatedBill));
    }

    @PatchMapping("/{id}/payment")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT', 'RECEPTIONIST')")
    @Operation(summary = "Add payment to bill")
    public ResponseEntity<ApiResponse<Bill>> addPayment(
            @PathVariable Long id,
            @RequestParam Double paymentAmount) {
        Bill bill = billService.addPayment(id, paymentAmount);
        return ResponseEntity.ok(ApiResponse.success("Payment added successfully", bill));
    }

    @PatchMapping("/{id}/insurance/claim")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @Operation(summary = "Process insurance claim")
    public ResponseEntity<ApiResponse<Bill>> processInsuranceClaim(
            @PathVariable Long id,
            @RequestParam Double claimAmount) {
        Bill bill = billService.processInsuranceClaim(id, claimAmount);
        return ResponseEntity.ok(ApiResponse.success("Insurance claim processed successfully", bill));
    }

    @PatchMapping("/{id}/insurance/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @Operation(summary = "Approve insurance claim")
    public ResponseEntity<ApiResponse<Bill>> approveInsuranceClaim(
            @PathVariable Long id,
            @RequestParam Double approvedAmount) {
        Bill bill = billService.approveInsuranceClaim(id, approvedAmount);
        return ResponseEntity.ok(ApiResponse.success("Insurance claim approved successfully", bill));
    }

    @PatchMapping("/{id}/insurance/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    @Operation(summary = "Reject insurance claim")
    public ResponseEntity<ApiResponse<Bill>> rejectInsuranceClaim(@PathVariable Long id) {
        Bill bill = billService.rejectInsuranceClaim(id);
        return ResponseEntity.ok(ApiResponse.success("Insurance claim rejected", bill));
    }

    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cancel bill")
    public ResponseEntity<ApiResponse<Void>> cancelBill(@PathVariable Long id) {
        billService.cancelBill(id);
        return ResponseEntity.ok(ApiResponse.success("Bill cancelled successfully", null));
    }
}
