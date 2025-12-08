package com.hospital.service;

import com.hospital.dto.OrderValidationResponse;
import com.hospital.entity.PhysicianOrder;
import com.hospital.enums.OrderStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.PhysicianOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PhysicianOrderService {

    private final PhysicianOrderRepository physicianOrderRepository;
    private final OrderValidationService orderValidationService;

    /**
     * Create order with automatic decision support validation
     */
    public PhysicianOrder createOrder(PhysicianOrder order) {
        return createOrder(order, false);
    }

    /**
     * Create order with optional override flag
     * @param order The physician order to create
     * @param overrideValidation If true, bypasses validation alerts (for physician override)
     */
    public PhysicianOrder createOrder(PhysicianOrder order, boolean overrideValidation) {
        order.setOrderedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setIsActive(true);

        // Perform decision support validation for MEDICATION orders
        if ("MEDICATION".equalsIgnoreCase(order.getOrderType()) && !overrideValidation) {
            OrderValidationResponse validation = validateMedicationOrder(order);
            
            if (!validation.getCanProceed() && !overrideValidation) {
                log.error("Order validation FAILED for patient {}: {}", 
                        order.getPatient().getId(), validation.getSummary());
                throw new IllegalStateException(
                        "Order cannot proceed due to critical alerts: " + validation.getSummary());
            }

            if (validation.getRequiresOverride()) {
                log.warn("Order requires physician override: {}", validation.getSummary());
                // Store validation warnings in notes
                String existingNotes = order.getNotes() != null ? order.getNotes() : "";
                order.setNotes(existingNotes + "\n[VALIDATION ALERTS]\n" + validation.getSummary());
            }
        }

        return physicianOrderRepository.save(order);
    }

    /**
     * Validate medication order before creation
     */
    public OrderValidationResponse validateMedicationOrder(PhysicianOrder order) {
        if (!"MEDICATION".equalsIgnoreCase(order.getOrderType())) {
            throw new IllegalArgumentException("Validation only applicable for MEDICATION orders");
        }

        // Extract drug details from order
        String drugName = extractDrugName(order.getOrderDetails());
        Double dose = extractDose(order.getOrderDetails());
        String unit = extractUnit(order.getOrderDetails());
        String frequency = order.getInstructions();

        return orderValidationService.validateMedicationOrder(
                order.getPatient().getId(),
                drugName,
                dose,
                unit,
                frequency
        );
    }

    /**
     * Quick allergy check (can be called from UI before full order creation)
     */
    public OrderValidationResponse quickAllergyCheck(Long patientId, String drugName) {
        return orderValidationService.quickValidate(patientId, drugName);
    }

    // Helper methods to extract drug details from order details string
    private String extractDrugName(String orderDetails) {
        if (orderDetails == null) return "Unknown";
        if (orderDetails.toLowerCase().contains("drug:")) {
            String[] parts = orderDetails.split(",");
            for (String part : parts) {
                if (part.toLowerCase().contains("drug:")) {
                    return part.split(":")[1].trim();
                }
            }
        }
        return "Unknown";
    }

    private Double extractDose(String orderDetails) {
        if (orderDetails == null) return 0.0;
        if (orderDetails.toLowerCase().contains("dose:")) {
            String[] parts = orderDetails.split(",");
            for (String part : parts) {
                if (part.toLowerCase().contains("dose:")) {
                    String doseStr = part.split(":")[1].trim().replaceAll("[^0-9.]", "");
                    try {
                        return Double.parseDouble(doseStr);
                    } catch (NumberFormatException e) {
                        return 0.0;
                    }
                }
            }
        }
        return 0.0;
    }

    private String extractUnit(String orderDetails) {
        if (orderDetails == null) return "mg";
        if (orderDetails.toLowerCase().contains("dose:")) {
            String[] parts = orderDetails.split(",");
            for (String part : parts) {
                if (part.toLowerCase().contains("dose:")) {
                    String doseStr = part.split(":")[1].trim();
                    String unit = doseStr.replaceAll("[0-9.]", "").trim();
                    return unit.isEmpty() ? "mg" : unit;
                }
            }
        }
        return "mg";
    }

    public PhysicianOrder getOrderById(Long id) {
        return physicianOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PhysicianOrder", "id", id));
    }

    public List<PhysicianOrder> getAllOrders() {
        return physicianOrderRepository.findAll();
    }

    public List<PhysicianOrder> getOrdersByPatientId(Long patientId) {
        return physicianOrderRepository.findByPatientId(patientId);
    }

    public List<PhysicianOrder> getOrdersByDoctorId(Long doctorId) {
        return physicianOrderRepository.findByDoctorId(doctorId);
    }

    public List<PhysicianOrder> getOrdersByStatus(OrderStatus status) {
        return physicianOrderRepository.findByStatus(status);
    }

    public PhysicianOrder updateOrderStatus(Long id, OrderStatus status) {
        PhysicianOrder order = getOrderById(id);
        order.setStatus(status);
        
        if (status == OrderStatus.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
        }
        
        return physicianOrderRepository.save(order);
    }

    public PhysicianOrder updateOrder(Long id, PhysicianOrder orderDetails) {
        PhysicianOrder order = getOrderById(id);
        
        order.setOrderType(orderDetails.getOrderType());
        order.setOrderDetails(orderDetails.getOrderDetails());
        order.setPriority(orderDetails.getPriority());
        order.setScheduledFor(orderDetails.getScheduledFor());
        order.setInstructions(orderDetails.getInstructions());
        order.setNotes(orderDetails.getNotes());
        
        return physicianOrderRepository.save(order);
    }

    public void cancelOrder(Long id) {
        PhysicianOrder order = getOrderById(id);
        order.setStatus(OrderStatus.CANCELLED);
        physicianOrderRepository.save(order);
    }
}
