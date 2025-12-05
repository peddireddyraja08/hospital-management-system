package com.hospital.repository;

import com.hospital.entity.QCRun;
import com.hospital.enums.QCStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QCRunRepository extends JpaRepository<QCRun, Long> {
    
    List<QCRun> findByQcMaterialId(Long qcMaterialId);
    
    List<QCRun> findByStatus(QCStatus status);
    
    @Query("SELECT qr FROM QCRun qr WHERE qr.runDate BETWEEN :startDate AND :endDate ORDER BY qr.runDate DESC")
    List<QCRun> findByRunDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT qr FROM QCRun qr WHERE qr.qcMaterial.id = :materialId AND qr.runDate BETWEEN :startDate AND :endDate ORDER BY qr.runDate ASC")
    List<QCRun> findByMaterialAndDateRange(@Param("materialId") Long materialId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT qr FROM QCRun qr WHERE qr.qcMaterial.labTest.id = :labTestId ORDER BY qr.runDate DESC")
    List<QCRun> findByLabTestId(@Param("labTestId") Long labTestId);
    
    @Query("SELECT qr FROM QCRun qr WHERE qr.status = :status AND qr.runDate BETWEEN :startDate AND :endDate")
    List<QCRun> findByStatusAndDateRange(@Param("status") QCStatus status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT qr FROM QCRun qr WHERE qr.qcMaterial.id = :materialId ORDER BY qr.runDate DESC")
    List<QCRun> findRecentRunsByMaterial(@Param("materialId") Long materialId);
    
    @Query("SELECT COUNT(qr) FROM QCRun qr WHERE qr.qcMaterial.id = :materialId AND qr.runDate >= :date")
    Long countRunsSinceDate(@Param("materialId") Long materialId, @Param("date") LocalDateTime date);
}
