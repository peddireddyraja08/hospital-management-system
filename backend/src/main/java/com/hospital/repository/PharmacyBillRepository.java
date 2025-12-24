package com.hospital.repository;

import com.hospital.entity.PharmacyBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PharmacyBillRepository extends JpaRepository<PharmacyBill, Long> {
    List<PharmacyBill> findByPrescriptionId(Long prescriptionId);
    List<PharmacyBill> findByPatientId(Long patientId);
}
