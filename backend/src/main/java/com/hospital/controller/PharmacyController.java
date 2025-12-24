package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.dto.MedicineDTO;
import com.hospital.entity.Medicine;
import com.hospital.entity.MedicineBatch;
import com.hospital.entity.PharmacyBill;
import com.hospital.service.PharmacyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/pharmacy")
@RequiredArgsConstructor
@Tag(name = "Pharmacy", description = "Pharmacy management APIs")
public class PharmacyController {
    private final PharmacyService pharmacyService;

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @PostMapping("/medicines")
    public ResponseEntity<ApiResponse<Medicine>> createMedicine(@Valid @RequestBody Medicine m) {
        Medicine created = pharmacyService.createMedicine(m);
        return ResponseEntity.ok(ApiResponse.success("Medicine created", created));
    }

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @PutMapping("/medicines/{id}")
    public ResponseEntity<ApiResponse<Medicine>> updateMedicine(@PathVariable Long id, @Valid @RequestBody Medicine m) {
        Medicine updated = pharmacyService.updateMedicine(id, m);
        return ResponseEntity.ok(ApiResponse.success("Medicine updated", updated));
    }

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @GetMapping("/medicines")
    public ResponseEntity<ApiResponse<List<Medicine>>> listMedicines() {
        return ResponseEntity.ok(ApiResponse.success(pharmacyService.listAll()));
    }

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @GetMapping("/medicines/{id}")
    public ResponseEntity<ApiResponse<Medicine>> getMedicine(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(pharmacyService.getById(id)));
    }

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<ApiResponse<String>> deleteMedicine(@PathVariable Long id) {
        pharmacyService.deleteMedicine(id);
        return ResponseEntity.ok(ApiResponse.success("Medicine deleted", null));
    }

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @PostMapping("/medicines/{id}/batches")
    public ResponseEntity<ApiResponse<MedicineBatch>> addBatch(@PathVariable Long id, @RequestBody MedicineBatch batch) {
        MedicineBatch saved = pharmacyService.addBatch(id, batch);
        return ResponseEntity.ok(ApiResponse.success("Batch added", saved));
    }

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @GetMapping("/medicines/{id}/batches")
    public ResponseEntity<ApiResponse<List<MedicineBatch>>> getBatches(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(pharmacyService.getBatches(id)));
    }

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @GetMapping("/reports/expiring")
    public ResponseEntity<ApiResponse<List<MedicineBatch>>> expiringSoon(@RequestParam(defaultValue = "7") int days) {
        LocalDate cutoff = LocalDate.now().plusDays(days);
        return ResponseEntity.ok(ApiResponse.success(pharmacyService.getExpiringBefore(cutoff)));
    }

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @GetMapping("/reports/low-stock")
    public ResponseEntity<ApiResponse<List<Medicine>>> lowStockReport() {
        return ResponseEntity.ok(ApiResponse.success(pharmacyService.getLowStock()));
    }

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @PostMapping("/medicines/{id}/dispense")
    public ResponseEntity<ApiResponse<String>> dispense(@PathVariable Long id, @RequestParam Integer qty) {
        pharmacyService.dispense(id, qty);
        return ResponseEntity.ok(ApiResponse.success("Dispensed", null));
    }

    @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
    @PostMapping("/prescriptions/{id}/dispense")
    public ResponseEntity<ApiResponse<PharmacyBill>> dispensePrescription(
            @PathVariable Long id,
            @RequestParam(required = false) String dispensedBy,
            @RequestParam(required = false) Long admissionId,
            @RequestParam(required = false) Long visitId) {

        PharmacyBill bill = pharmacyService.dispensePrescription(id,
                admissionId != null ? admissionId : null,
                visitId != null ? visitId : null,
                dispensedBy != null ? dispensedBy : "pharmacist");
        return ResponseEntity.ok(ApiResponse.success("Dispensed prescription and created bill", bill));
    }

    @PostMapping("/prescriptions/{id}/dispense-simple")
    public ResponseEntity<ApiResponse<?>> dispensePrescriptionSimple(
            @PathVariable Long id,
            @RequestParam(required = false) String dispensedBy) {
        // Simple dispense: update stock and prescription only (no billing)
        com.hospital.entity.Prescription p = pharmacyService.dispensePrescriptionSimple(id, dispensedBy != null ? dispensedBy : "pharmacist");
        return ResponseEntity.ok(ApiResponse.success("Prescription dispensed", p));
    }

        @PreAuthorize("hasAnyRole('PHARMACIST','ADMIN')")
        @PostMapping("/prescriptions/{id}/partial-dispense")
        public ResponseEntity<ApiResponse<PharmacyBill>> partialDispensePrescription(
            @PathVariable Long id,
            @RequestParam Integer dispensedQuantity,
            @RequestParam(required = false) Long admissionId,
            @RequestParam(required = false) Long visitId,
            @RequestParam(required = false) String dispensedBy) {

        PharmacyBill bill = pharmacyService.partialDispensePrescription(id, dispensedQuantity,
            admissionId != null ? admissionId : null,
            visitId != null ? visitId : null,
            dispensedBy != null ? dispensedBy : "pharmacist");
        return ResponseEntity.ok(ApiResponse.success("Partially dispensed prescription and created bill", bill));
        }

    @PostMapping("/prescriptions/{id}/partial-dispense-simple")
    public ResponseEntity<ApiResponse<?>> partialDispensePrescriptionSimple(
            @PathVariable Long id,
            @RequestParam Integer dispensedQuantity,
            @RequestParam(required = false) String dispensedBy) {
        com.hospital.entity.Prescription p = pharmacyService.partialDispensePrescriptionSimple(id, dispensedQuantity, dispensedBy != null ? dispensedBy : "pharmacist");
        return ResponseEntity.ok(ApiResponse.success("Prescription partially dispensed", p));
    }
}
