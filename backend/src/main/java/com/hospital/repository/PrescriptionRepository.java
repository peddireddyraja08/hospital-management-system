package com.hospital.repository;

import com.hospital.entity.Prescription;
import com.hospital.enums.PrescriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientId(Long patientId);
    List<Prescription> findByDoctorId(Long doctorId);
    List<Prescription> findByStatus(PrescriptionStatus status);
    List<Prescription> findByPatientIdAndStatus(Long patientId, PrescriptionStatus status);
}
