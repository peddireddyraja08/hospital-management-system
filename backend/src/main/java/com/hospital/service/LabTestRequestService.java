package com.hospital.service;

import com.hospital.entity.LabTestRequest;
import com.hospital.entity.LabTestResult;
import com.hospital.enums.TestStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.LabTestRequestRepository;
import com.hospital.repository.LabTestResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LabTestRequestService {

    private final LabTestRequestRepository labTestRequestRepository;
    private final LabTestResultRepository labTestResultRepository;

    public LabTestRequest createLabTestRequest(LabTestRequest request) {
        request.setRequestDate(LocalDateTime.now());
        request.setStatus(TestStatus.REQUESTED);
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
        
        // Update request status
        request.setStatus(TestStatus.COMPLETED);
        labTestRequestRepository.save(request);
        
        return labTestResultRepository.save(result);
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
