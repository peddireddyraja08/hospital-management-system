package com.hospital.repository;

import com.hospital.entity.CriticalAlert;
import com.hospital.enums.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CriticalAlertRepository extends JpaRepository<CriticalAlert, Long> {

    List<CriticalAlert> findByStatusOrderByCreatedAtDesc(AlertStatus status);

    List<CriticalAlert> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    List<CriticalAlert> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);

    @Query("SELECT ca FROM CriticalAlert ca WHERE ca.status = 'ACTIVE' ORDER BY ca.priority DESC, ca.createdAt DESC")
    List<CriticalAlert> findAllActiveAlerts();

    @Query("SELECT ca FROM CriticalAlert ca WHERE ca.status IN ('ACTIVE', 'ESCALATED') ORDER BY ca.priority DESC, ca.createdAt DESC")
    List<CriticalAlert> findAllUnacknowledgedAlerts();

    @Query("SELECT COUNT(ca) FROM CriticalAlert ca WHERE ca.status IN ('ACTIVE', 'ESCALATED')")
    Long countUnacknowledgedAlerts();

    @Query("SELECT ca FROM CriticalAlert ca WHERE ca.createdAt < :thresholdTime AND ca.status = 'ACTIVE'")
    List<CriticalAlert> findAlertsRequiringEscalation(@Param("thresholdTime") LocalDateTime thresholdTime);

    List<CriticalAlert> findByLabTestResultId(Long labTestResultId);
}
