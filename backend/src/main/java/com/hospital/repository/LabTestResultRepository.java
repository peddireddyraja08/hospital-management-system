package com.hospital.repository;

import com.hospital.entity.LabTestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LabTestResultRepository extends JpaRepository<LabTestResult, Long> {
    Optional<LabTestResult> findByTestRequestId(Long testRequestId);
}
