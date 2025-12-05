package com.hospital.service;

import com.hospital.entity.CriticalAlert;
import com.hospital.entity.LabTestResult;
import com.hospital.enums.AlertPriority;
import com.hospital.enums.AlertStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.CriticalAlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CriticalAlertService {

    private final CriticalAlertRepository criticalAlertRepository;

    /**
     * Create a critical alert for a lab test result
     */
    public CriticalAlert createAlert(LabTestResult labTestResult, String alertType, 
                                     AlertPriority priority, String criticalThreshold) {
        CriticalAlert alert = new CriticalAlert();
        alert.setLabTestResult(labTestResult);
        alert.setPatient(labTestResult.getTestRequest().getPatient());
        alert.setDoctor(labTestResult.getTestRequest().getDoctor());
        alert.setAlertType(alertType);
        alert.setPriority(priority);
        alert.setStatus(AlertStatus.ACTIVE);
        alert.setTestName(labTestResult.getTestRequest().getLabTest().getTestName());
        alert.setResultValue(labTestResult.getResultValue());
        alert.setCriticalThreshold(criticalThreshold);
        
        // Generate alert message
        String message = String.format(
            "Critical %s result for patient %s %s: %s is %s (Threshold: %s)",
            labTestResult.getTestRequest().getLabTest().getTestName(),
            labTestResult.getTestRequest().getPatient().getFirstName(),
            labTestResult.getTestRequest().getPatient().getLastName(),
            labTestResult.getTestRequest().getLabTest().getTestName(),
            labTestResult.getResultValue(),
            criticalThreshold
        );
        alert.setMessage(message);
        
        alert.setIsActive(true);
        alert.setIsDeleted(false);
        
        CriticalAlert savedAlert = criticalAlertRepository.save(alert);
        log.info("Critical alert created: ID={}, Type={}, Priority={}", 
                savedAlert.getId(), alertType, priority);
        
        return savedAlert;
    }

    /**
     * Get all alerts
     */
    public List<CriticalAlert> getAllAlerts() {
        return criticalAlertRepository.findAll();
    }

    /**
     * Get active alerts
     */
    public List<CriticalAlert> getActiveAlerts() {
        return criticalAlertRepository.findAllActiveAlerts();
    }

    /**
     * Get unacknowledged alerts (ACTIVE or ESCALATED)
     */
    public List<CriticalAlert> getUnacknowledgedAlerts() {
        return criticalAlertRepository.findAllUnacknowledgedAlerts();
    }

    /**
     * Get alert count for badge
     */
    public Long getUnacknowledgedAlertCount() {
        return criticalAlertRepository.countUnacknowledgedAlerts();
    }

    /**
     * Get alerts by patient
     */
    public List<CriticalAlert> getAlertsByPatient(Long patientId) {
        return criticalAlertRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    /**
     * Get alerts by doctor
     */
    public List<CriticalAlert> getAlertsByDoctor(Long doctorId) {
        return criticalAlertRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
    }

    /**
     * Get alert by ID
     */
    public CriticalAlert getAlertById(Long id) {
        return criticalAlertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CriticalAlert", "id", id));
    }

    /**
     * Acknowledge an alert
     */
    public CriticalAlert acknowledgeAlert(Long alertId, String acknowledgedBy, String notes) {
        CriticalAlert alert = getAlertById(alertId);
        
        if (alert.getStatus() != AlertStatus.ACTIVE && alert.getStatus() != AlertStatus.ESCALATED) {
            throw new IllegalStateException("Only ACTIVE or ESCALATED alerts can be acknowledged");
        }
        
        alert.setStatus(AlertStatus.ACKNOWLEDGED);
        alert.setAcknowledgedAt(LocalDateTime.now());
        alert.setAcknowledgedBy(acknowledgedBy);
        alert.setAcknowledgmentNotes(notes);
        
        CriticalAlert savedAlert = criticalAlertRepository.save(alert);
        log.info("Alert acknowledged: ID={}, By={}", alertId, acknowledgedBy);
        
        return savedAlert;
    }

    /**
     * Escalate an alert
     */
    public CriticalAlert escalateAlert(Long alertId, String escalatedTo) {
        CriticalAlert alert = getAlertById(alertId);
        
        if (alert.getStatus() != AlertStatus.ACTIVE) {
            throw new IllegalStateException("Only ACTIVE alerts can be escalated");
        }
        
        alert.setStatus(AlertStatus.ESCALATED);
        alert.setEscalatedAt(LocalDateTime.now());
        alert.setEscalatedTo(escalatedTo);
        alert.setPriority(AlertPriority.URGENT); // Escalated alerts are always URGENT
        
        CriticalAlert savedAlert = criticalAlertRepository.save(alert);
        log.warn("Alert escalated: ID={}, To={}", alertId, escalatedTo);
        
        return savedAlert;
    }

    /**
     * Resolve an alert
     */
    public CriticalAlert resolveAlert(Long alertId, String resolutionNotes) {
        CriticalAlert alert = getAlertById(alertId);
        
        if (alert.getStatus() == AlertStatus.RESOLVED || alert.getStatus() == AlertStatus.CANCELLED) {
            throw new IllegalStateException("Alert is already closed");
        }
        
        alert.setStatus(AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());
        alert.setResolutionNotes(resolutionNotes);
        
        CriticalAlert savedAlert = criticalAlertRepository.save(alert);
        log.info("Alert resolved: ID={}", alertId);
        
        return savedAlert;
    }

    /**
     * Cancel an alert (false positive)
     */
    public CriticalAlert cancelAlert(Long alertId, String reason) {
        CriticalAlert alert = getAlertById(alertId);
        
        alert.setStatus(AlertStatus.CANCELLED);
        alert.setResolvedAt(LocalDateTime.now());
        alert.setResolutionNotes("Cancelled: " + reason);
        
        CriticalAlert savedAlert = criticalAlertRepository.save(alert);
        log.info("Alert cancelled: ID={}, Reason={}", alertId, reason);
        
        return savedAlert;
    }

    /**
     * Auto-escalate alerts that have been active for too long (>30 minutes)
     */
    public void autoEscalateStaleAlerts() {
        LocalDateTime thresholdTime = LocalDateTime.now().minusMinutes(30);
        List<CriticalAlert> staleAlerts = criticalAlertRepository.findAlertsRequiringEscalation(thresholdTime);
        
        for (CriticalAlert alert : staleAlerts) {
            escalateAlert(alert.getId(), "AUTO-ESCALATED");
        }
        
        if (!staleAlerts.isEmpty()) {
            log.warn("Auto-escalated {} stale alerts", staleAlerts.size());
        }
    }
}
