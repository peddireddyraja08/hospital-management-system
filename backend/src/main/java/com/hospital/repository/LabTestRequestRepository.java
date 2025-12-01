package com.hospital.repository;

import com.hospital.entity.LabTestRequest;
import com.hospital.enums.TestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabTestRequestRepository extends JpaRepository<LabTestRequest, Long> {
    List<LabTestRequest> findByPatientId(Long patientId);
    List<LabTestRequest> findByDoctorId(Long doctorId);
    List<LabTestRequest> findByStatus(TestStatus status);
    List<LabTestRequest> findByPatientIdAndStatus(Long patientId, TestStatus status);
}
