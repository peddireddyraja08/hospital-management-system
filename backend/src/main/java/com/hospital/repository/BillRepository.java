package com.hospital.repository;

import com.hospital.entity.Bill;
import com.hospital.enums.BillStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    Optional<Bill> findByBillNumber(String billNumber);
    List<Bill> findByPatientId(Long patientId);
    List<Bill> findByStatus(BillStatus status);
    Boolean existsByBillNumber(String billNumber);
}
