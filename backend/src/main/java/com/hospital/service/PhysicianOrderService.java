package com.hospital.service;

import com.hospital.entity.PhysicianOrder;
import com.hospital.enums.OrderStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.PhysicianOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PhysicianOrderService {

    private final PhysicianOrderRepository physicianOrderRepository;

    public PhysicianOrder createOrder(PhysicianOrder order) {
        order.setOrderedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setIsActive(true);
        return physicianOrderRepository.save(order);
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
