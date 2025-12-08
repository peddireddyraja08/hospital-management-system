package com.hospital.repository;

import com.hospital.entity.Admission;
import com.hospital.enums.AdmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Long> {

    Optional<Admission> findByAdmissionNumber(String admissionNumber);

    List<Admission> findByPatientId(Long patientId);

    List<Admission> findByStatus(AdmissionStatus status);

    List<Admission> findByWard(String ward);

    @Query("SELECT a FROM Admission a JOIN a.patient p WHERE a.admittingDoctor.id = :doctorId AND a.status IN :statuses AND p.patientType = 'INPATIENT'")
    List<Admission> findByDoctorIdAndStatusIn(@Param("doctorId") Long doctorId, @Param("statuses") List<AdmissionStatus> statuses);

    @Query("SELECT a FROM Admission a JOIN a.patient p WHERE (a.status = 'ADMITTED' OR a.status = 'UNDER_TREATMENT') AND p.patientType = 'INPATIENT'")
    List<Admission> findAllActiveAdmissions();

    @Query("SELECT a FROM Admission a JOIN a.patient p WHERE a.isICUAdmission = true AND (a.status = 'ADMITTED' OR a.status = 'UNDER_TREATMENT' OR a.status = 'CRITICAL') AND p.patientType = 'INPATIENT'")
    List<Admission> findAllICUAdmissions();

    @Query("SELECT a FROM Admission a JOIN a.patient p WHERE a.expectedDischargeDate <= :date AND (a.status = 'ADMITTED' OR a.status = 'UNDER_TREATMENT' OR a.status = 'STABLE') AND p.patientType = 'INPATIENT'")
    List<Admission> findPredictedDischarges(@Param("date") LocalDateTime date);

    @Query("SELECT a FROM Admission a JOIN a.patient p WHERE a.expectedDischargeDate < :now AND a.actualDischargeDate IS NULL AND p.patientType = 'INPATIENT'")
    List<Admission> findOverstayAdmissions(@Param("now") LocalDateTime now);

    @Query("SELECT a FROM Admission a JOIN a.patient p WHERE a.isIsolationRequired = true AND (a.status = 'ADMITTED' OR a.status = 'UNDER_TREATMENT') AND p.patientType = 'INPATIENT'")
    List<Admission> findIsolationAdmissions();

    @Query("SELECT COUNT(a) FROM Admission a JOIN a.patient p WHERE (a.status = 'ADMITTED' OR a.status = 'UNDER_TREATMENT') AND p.patientType = 'INPATIENT'")
    Long countActiveAdmissions();

    @Query("SELECT a.ward, COUNT(a) FROM Admission a JOIN a.patient p WHERE (a.status = 'ADMITTED' OR a.status = 'UNDER_TREATMENT') AND p.patientType = 'INPATIENT' GROUP BY a.ward")
    List<Object[]> getAdmissionCountByWard();

    @Query("SELECT a FROM Admission a WHERE a.admissionDate BETWEEN :startDate AND :endDate")
    List<Admission> findByAdmissionDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a FROM Admission a WHERE a.currentBed.id = :bedId")
    Optional<Admission> findByBedId(@Param("bedId") Long bedId);
}
