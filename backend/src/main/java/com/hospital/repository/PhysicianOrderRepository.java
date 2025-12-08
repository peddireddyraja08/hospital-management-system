package com.hospital.repository;

import com.hospital.entity.PhysicianOrder;
import com.hospital.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhysicianOrderRepository extends JpaRepository<PhysicianOrder, Long> {
    List<PhysicianOrder> findByPatientId(Long patientId);
    List<PhysicianOrder> findByDoctorId(Long doctorId);
    List<PhysicianOrder> findByStatus(OrderStatus status);
    List<PhysicianOrder> findByPatientIdAndStatus(Long patientId, OrderStatus status);
    List<PhysicianOrder> findByPatientIdAndOrderType(Long patientId, String orderType);
}
