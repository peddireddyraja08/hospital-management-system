package com.hospital.service;

import com.hospital.dto.LabTestRequestWithPatientDTO;
import com.hospital.entity.Doctor;
import com.hospital.entity.LabTest;
import com.hospital.entity.LabTestRequest;
import com.hospital.entity.LabTestResult;
import com.hospital.entity.Patient;
import com.hospital.enums.AlertPriority;
import com.hospital.enums.PatientType;
import com.hospital.enums.TestStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.LabTestRepository;
import com.hospital.repository.LabTestRequestRepository;
import com.hospital.repository.LabTestResultRepository;
import com.hospital.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class LabTestRequestService {

    private final LabTestRequestRepository labTestRequestRepository;
    private final LabTestResultRepository labTestResultRepository;
    private final PatientService patientService;
    private final PatientRepository patientRepository;
    private final LabTestRepository labTestRepository;
    private final DoctorRepository doctorRepository;
    private final CriticalAlertService criticalAlertService;

    public LabTestRequest createLabTestRequest(LabTestRequest request) {
        request.setRequestDate(LocalDateTime.now());
        request.setStatus(TestStatus.REQUESTED);
        request.setIsActive(true);
        return labTestRequestRepository.save(request);
    }

    /**
     * Create lab test request with patient registration for walk-in patients
     * If patient already exists, use existing patient ID
     * If new patient, register as OUTPATIENT with OUT prefix
     */
    public LabTestRequest createLabTestRequestWithPatient(LabTestRequestWithPatientDTO dto) {
        Patient patient;
        
        // Check if using existing patient
        if (dto.getExistingPatientId() != null) {
            patient = patientRepository.findById(dto.getExistingPatientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", dto.getExistingPatientId()));
        } else {
            // Create new outpatient
            patient = new Patient();
            patient.setPatientType(PatientType.OUTPATIENT);
            patient.setFirstName(dto.getFirstName());
            patient.setLastName(dto.getLastName());
            patient.setDateOfBirth(dto.getDateOfBirth());
            patient.setGender(dto.getGender());
            patient.setBloodGroup(dto.getBloodGroup());
            patient.setPhoneNumber(dto.getPhoneNumber());
            patient.setEmail(dto.getEmail());
            patient.setAddress(dto.getAddress());
            patient.setEmergencyContactName(dto.getEmergencyContactName());
            patient.setEmergencyContactNumber(dto.getEmergencyContactNumber());
            
            // Save patient (will generate OUT-prefixed ID)
            patient = patientService.createPatient(patient);
        }
        
        // Get lab test
        LabTest labTest = labTestRepository.findById(dto.getLabTestId())
                .orElseThrow(() -> new ResourceNotFoundException("LabTest", "id", dto.getLabTestId()));
        
        // Get doctor if provided (optional for walk-in patients)
        Doctor doctor = null;
        if (dto.getDoctorId() != null) {
            doctor = doctorRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", dto.getDoctorId()));
        }
        
        // Create lab test request
        LabTestRequest request = new LabTestRequest();
        request.setPatient(patient);
        request.setDoctor(doctor);
        request.setLabTest(labTest);
        request.setRequestDate(dto.getRequestedDate());
        request.setStatus(dto.getStatus());
        request.setPriority(dto.getPriority());
        request.setClinicalNotes(dto.getClinicalNotes());
        request.setIsActive(true);
        
        return labTestRequestRepository.save(request);
    }

    public LabTestRequest getLabTestRequestById(Long id) {
        return labTestRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LabTestRequest", "id", id));
    }

    public List<LabTestRequest> getAllLabTestRequests() {
        return labTestRequestRepository.findAll();
    }

    public List<LabTestRequest> getLabTestRequestsByPatientId(Long patientId) {
        return labTestRequestRepository.findByPatientId(patientId);
    }

    public List<LabTestRequest> getLabTestRequestsByDoctorId(Long doctorId) {
        return labTestRequestRepository.findByDoctorId(doctorId);
    }

    public List<LabTestRequest> getLabTestRequestsByStatus(TestStatus status) {
        return labTestRequestRepository.findByStatus(status);
    }

    public LabTestRequest updateLabTestRequestStatus(Long id, TestStatus status) {
        LabTestRequest request = getLabTestRequestById(id);
        request.setStatus(status);
        
        if (status == TestStatus.SAMPLE_COLLECTED) {
            request.setSampleCollectedDate(LocalDateTime.now());
        }
        
        return labTestRequestRepository.save(request);
    }

    public LabTestRequest updateLabTestRequest(Long id, LabTestRequest requestDetails) {
        LabTestRequest request = getLabTestRequestById(id);
        
        request.setPriority(requestDetails.getPriority());
        request.setClinicalNotes(requestDetails.getClinicalNotes());
        request.setSampleType(requestDetails.getSampleType());
        
        return labTestRequestRepository.save(request);
    }

    public LabTestResult addLabTestResult(Long requestId, LabTestResult result) {
        LabTestRequest request = getLabTestRequestById(requestId);
        result.setTestRequest(request);
        result.setResultDate(LocalDateTime.now());
        result.setIsActive(true);
        
        // Save result first
        LabTestResult savedResult = labTestResultRepository.save(result);
        
        // Check for critical values and create alert if needed
        checkCriticalValue(savedResult, request.getLabTest());
        
        // Update request status
        request.setStatus(TestStatus.COMPLETED);
        labTestRequestRepository.save(request);
        
        return savedResult;
    }
    
    /**
     * Check if lab test result exceeds critical thresholds and create alert
     */
    private void checkCriticalValue(LabTestResult result, LabTest labTest) {
        try {
            // Parse result value as double for comparison
            double resultValue = Double.parseDouble(result.getResultValue());
            String criticalLowStr = labTest.getCriticalLow();
            String criticalHighStr = labTest.getCriticalHigh();
            
            // Check critical high
            if (criticalHighStr != null && !criticalHighStr.isEmpty()) {
                double criticalHigh = Double.parseDouble(criticalHighStr);
                if (resultValue > criticalHigh) {
                    AlertPriority priority = determinePriority(resultValue, criticalHigh, true);
                    String threshold = ">" + criticalHigh;
                    criticalAlertService.createAlert(result, "Critical High", priority, threshold);
                    log.warn("Critical HIGH value detected: {} = {} (Threshold: {})", 
                            labTest.getTestName(), resultValue, criticalHigh);
                }
            }
            // Check critical low
            if (criticalLowStr != null && !criticalLowStr.isEmpty()) {
                double criticalLow = Double.parseDouble(criticalLowStr);
                if (resultValue < criticalLow) {
                    AlertPriority priority = determinePriority(resultValue, criticalLow, false);
                    String threshold = "<" + criticalLow;
                    criticalAlertService.createAlert(result, "Critical Low", priority, threshold);
                    log.warn("Critical LOW value detected: {} = {} (Threshold: {})", 
                            labTest.getTestName(), resultValue, criticalLow);
                }
            }
        } catch (NumberFormatException e) {
            // Result value is not numeric, skip critical value checking
            log.debug("Result value '{}' is not numeric, skipping critical value check", 
                    result.getResultValue());
        }
    }
    
    /**
     * Determine alert priority based on how far the value deviates from threshold
     */
    private AlertPriority determinePriority(double value, double threshold, boolean isHigh) {
        double deviation;
        if (isHigh) {
            deviation = (value - threshold) / threshold * 100; // % above threshold
        } else {
            deviation = (threshold - value) / threshold * 100; // % below threshold
        }
        
        // Priority based on deviation percentage
        if (deviation >= 50) {
            return AlertPriority.URGENT;  // 50%+ deviation = life-threatening
        } else if (deviation >= 25) {
            return AlertPriority.HIGH;    // 25-50% deviation = critical
        } else if (deviation >= 10) {
            return AlertPriority.MEDIUM;  // 10-25% deviation = significant
        } else {
            return AlertPriority.LOW;     // <10% deviation = minor
        }
    }

    public LabTestResult getLabTestResultByRequestId(Long requestId) {
        return labTestResultRepository.findByTestRequestId(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("LabTestResult", "requestId", requestId));
    }

    public LabTestResult verifyLabTestResult(Long resultId, String verifiedBy) {
        LabTestResult result = labTestResultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("LabTestResult", "id", resultId));
        
        result.setVerifiedBy(verifiedBy);
        result.setVerifiedAt(LocalDateTime.now());
        
        // Update request status to verified
        LabTestRequest request = result.getTestRequest();
        request.setStatus(TestStatus.VERIFIED);
        labTestRequestRepository.save(request);
        
        return labTestResultRepository.save(result);
    }

    public void cancelLabTestRequest(Long id) {
        LabTestRequest request = getLabTestRequestById(id);
        request.setStatus(TestStatus.CANCELLED);
        labTestRequestRepository.save(request);
    }
}
