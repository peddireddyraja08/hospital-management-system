package com.hospital.repository;

import com.hospital.entity.DischargeSummary;
import com.hospital.enums.DischargeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DischargeSummaryRepository extends JpaRepository<DischargeSummary, Long> {

    Optional<DischargeSummary> findBySummaryNumber(String summaryNumber);

    Optional<DischargeSummary> findByAdmissionId(Long admissionId);

    List<DischargeSummary> findByDischargeType(DischargeType dischargeType);

    List<DischargeSummary> findByDischargingDoctorId(Long doctorId);

    @Query("SELECT d FROM DischargeSummary d WHERE d.isFinalized = false")
    List<DischargeSummary> findPendingFinalization();

    @Query("SELECT d FROM DischargeSummary d WHERE d.billingCleared = false OR d.pharmacyCleared = false OR d.nursingCleared = false")
    List<DischargeSummary> findPendingClearances();

    @Query("SELECT d FROM DischargeSummary d WHERE d.followUpDate BETWEEN :start AND :end")
    List<DischargeSummary> findByFollowUpDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT d FROM DischargeSummary d WHERE d.dischargeDate BETWEEN :start AND :end")
    List<DischargeSummary> findByDischargeDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT d FROM DischargeSummary d WHERE d.admission.patient.id = :patientId ORDER BY d.dischargeDate DESC")
    List<DischargeSummary> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT COUNT(d) FROM DischargeSummary d WHERE d.dischargeDate BETWEEN :start AND :end")
    Long countDischargesBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT d.dischargeType, COUNT(d) FROM DischargeSummary d WHERE d.dischargeDate BETWEEN :start AND :end GROUP BY d.dischargeType")
    List<Object[]> getDischargeCountByType(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
