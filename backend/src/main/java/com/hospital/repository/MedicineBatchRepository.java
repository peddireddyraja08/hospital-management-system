package com.hospital.repository;

import com.hospital.entity.MedicineBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineBatchRepository extends JpaRepository<MedicineBatch, Long> {
    List<MedicineBatch> findByMedicineId(Long medicineId);
    List<MedicineBatch> findByExpiryDateBefore(LocalDate date);
}
