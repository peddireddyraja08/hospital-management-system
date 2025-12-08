package com.hospital.repository;

import com.hospital.entity.ClinicalScore;
import com.hospital.enums.ClinicalScoreType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClinicalScoreRepository extends JpaRepository<ClinicalScore, Long> {

    List<ClinicalScore> findByAdmissionId(Long admissionId);

    List<ClinicalScore> findByScoreType(ClinicalScoreType scoreType);

    @Query("SELECT c FROM ClinicalScore c WHERE c.admission.id = :admissionId ORDER BY c.recordedAt DESC")
    List<ClinicalScore> findByAdmissionIdOrderByRecordedAtDesc(@Param("admissionId") Long admissionId);

    @Query("SELECT c FROM ClinicalScore c WHERE c.admission.id = :admissionId AND c.scoreType = :scoreType ORDER BY c.recordedAt DESC")
    List<ClinicalScore> findByAdmissionIdAndScoreTypeOrderByRecordedAtDesc(
        @Param("admissionId") Long admissionId, 
        @Param("scoreType") ClinicalScoreType scoreType
    );

    @Query("SELECT c FROM ClinicalScore c WHERE c.riskLevel IN ('HIGH', 'CRITICAL') AND c.alertAcknowledgedBy IS NULL")
    List<ClinicalScore> findUnacknowledgedHighRiskScores();

    @Query("SELECT c FROM ClinicalScore c WHERE c.calculatedScore >= :threshold AND c.recordedAt >= :since")
    List<ClinicalScore> findHighScoresSince(@Param("threshold") Integer threshold, @Param("since") LocalDateTime since);

    @Query("SELECT c FROM ClinicalScore c WHERE c.admission.ward = :ward AND c.riskLevel IN ('HIGH', 'CRITICAL')")
    List<ClinicalScore> findHighRiskScoresByWard(@Param("ward") String ward);

    @Query("SELECT c FROM ClinicalScore c WHERE c.admission.isICUAdmission = true AND c.recordedAt >= :since ORDER BY c.calculatedScore DESC")
    List<ClinicalScore> findRecentICUScores(@Param("since") LocalDateTime since);

    @Query("SELECT c.scoreType, AVG(c.calculatedScore) FROM ClinicalScore c WHERE c.recordedAt BETWEEN :start AND :end GROUP BY c.scoreType")
    List<Object[]> getAverageScoresByType(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
