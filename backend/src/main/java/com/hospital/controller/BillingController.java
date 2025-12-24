package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.PharmacyBill;
import com.hospital.service.BillingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pharmacy/bills")
@RequiredArgsConstructor
@Tag(name = "Pharmacy Billing", description = "Billing APIs for pharmacy")
public class BillingController {
    private final BillingService billingService;

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<PharmacyBill>> createBill(@RequestBody PharmacyBill bill) {
        PharmacyBill saved = billingService.createBill(bill);
        return ResponseEntity.ok(ApiResponse.success("Bill created", saved));
    }

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @GetMapping("/prescription/{id}")
    public ResponseEntity<ApiResponse<List<PharmacyBill>>> getByPrescription(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(billingService.getByPrescription(id)));
    }

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @GetMapping("/patient/{id}")
    public ResponseEntity<ApiResponse<List<PharmacyBill>>> getByPatient(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(billingService.getByPatient(id)));
    }
}
