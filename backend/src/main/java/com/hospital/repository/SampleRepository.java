package com.hospital.repository;

import com.hospital.entity.Sample;
import com.hospital.enums.SampleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SampleRepository extends JpaRepository<Sample, Long> {
    
    Optional<Sample> findByAccessionNumber(String accessionNumber);
    
    List<Sample> findByPatientId(Long patientId);
    
    List<Sample> findByLabTestRequestId(Long labTestRequestId);
    
    List<Sample> findByStatus(SampleStatus status);
    
    List<Sample> findByCollectionDateTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Sample> findByCollectedBy(String collectedBy);
    
    List<Sample> findByReceivedBy(String receivedBy);
    
    Long countByStatus(SampleStatus status);
    
    List<Sample> findByStatusAndCollectionDateTimeBetween(
        SampleStatus status, 
        LocalDateTime startDate, 
        LocalDateTime endDate
    );
}
