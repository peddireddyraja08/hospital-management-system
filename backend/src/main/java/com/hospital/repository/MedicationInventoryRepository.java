package com.hospital.repository;

import com.hospital.entity.MedicationInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicationInventoryRepository extends JpaRepository<MedicationInventory, Long> {
    List<MedicationInventoryRepository> findByMedicationId(Long medicationId);
    List<MedicationInventory> findByExpiryDateBefore(LocalDate date);
    List<MedicationInventory> findByIsExpired(Boolean isExpired);
}
