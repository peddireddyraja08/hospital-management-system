package com.hospital.repository;

import com.hospital.entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    Optional<Medication> findByMedicationCode(String medicationCode);
    List<Medication> findByCategory(String category);
    List<Medication> findByStockQuantityLessThanReorderLevel();
    Boolean existsByMedicationCode(String medicationCode);
}
