package com.hospital.repository;

import com.hospital.entity.QCMaterial;
import com.hospital.enums.QCLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface QCMaterialRepository extends JpaRepository<QCMaterial, Long> {
    
    List<QCMaterial> findByLabTestId(Long labTestId);
    
    List<QCMaterial> findByLevel(QCLevel level);
    
    List<QCMaterial> findByLotNumber(String lotNumber);
    
    @Query("SELECT qc FROM QCMaterial qc WHERE qc.expiryDate < :date AND qc.isActive = true")
    List<QCMaterial> findExpiredMaterials(@Param("date") LocalDate date);
    
    @Query("SELECT qc FROM QCMaterial qc WHERE qc.expiryDate BETWEEN :startDate AND :endDate AND qc.isActive = true")
    List<QCMaterial> findMaterialsExpiringBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT qc FROM QCMaterial qc WHERE qc.labTest.id = :labTestId AND qc.level = :level AND qc.isActive = true")
    List<QCMaterial> findByLabTestAndLevel(@Param("labTestId") Long labTestId, @Param("level") QCLevel level);
    
    @Query("SELECT qc FROM QCMaterial qc WHERE qc.isActive = true ORDER BY qc.createdAt DESC")
    List<QCMaterial> findAllActive();
}
