package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.PhysicianOrder;
import com.hospital.enums.OrderStatus;
import com.hospital.service.PhysicianOrderService;
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
@RequestMapping("/physician-orders")
@RequiredArgsConstructor
@Tag(name = "Physician Orders (CPOE)", description = "APIs for Computerized Physician Order Entry system")
public class PhysicianOrderController {

    private final PhysicianOrderService physicianOrderService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Create a new physician order")
    public ResponseEntity<ApiResponse<PhysicianOrder>> createOrder(@Valid @RequestBody PhysicianOrder order) {
        PhysicianOrder createdOrder = physicianOrderService.createOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created successfully", createdOrder));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN', 'PHARMACIST')")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<ApiResponse<PhysicianOrder>> getOrderById(@PathVariable Long id) {
        PhysicianOrder order = physicianOrderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    @Operation(summary = "Get all orders")
    public ResponseEntity<ApiResponse<List<PhysicianOrder>>> getAllOrders() {
        List<PhysicianOrder> orders = physicianOrderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'PATIENT')")
    @Operation(summary = "Get orders by patient ID")
    public ResponseEntity<ApiResponse<List<PhysicianOrder>>> getOrdersByPatientId(@PathVariable Long patientId) {
        List<PhysicianOrder> orders = physicianOrderService.getOrdersByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Get orders by doctor ID")
    public ResponseEntity<ApiResponse<List<PhysicianOrder>>> getOrdersByDoctorId(@PathVariable Long doctorId) {
        List<PhysicianOrder> orders = physicianOrderService.getOrdersByDoctorId(doctorId);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN', 'PHARMACIST')")
    @Operation(summary = "Get orders by status")
    public ResponseEntity<ApiResponse<List<PhysicianOrder>>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<PhysicianOrder> orders = physicianOrderService.getOrdersByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN', 'PHARMACIST')")
    @Operation(summary = "Update order status")
    public ResponseEntity<ApiResponse<PhysicianOrder>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        PhysicianOrder updatedOrder = physicianOrderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", updatedOrder));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Update order")
    public ResponseEntity<ApiResponse<PhysicianOrder>> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody PhysicianOrder order) {
        PhysicianOrder updatedOrder = physicianOrderService.updateOrder(id, order);
        return ResponseEntity.ok(ApiResponse.success("Order updated successfully", updatedOrder));
    }

    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Cancel order")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(@PathVariable Long id) {
        physicianOrderService.cancelOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", null));
    }
}
