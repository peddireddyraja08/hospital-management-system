package com.hospital.service;

import com.hospital.entity.Doctor;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final IdGeneratorService idGeneratorService;

    public Doctor createDoctor(Doctor doctor) {
        // Check if email already exists (excluding deleted records)
        if (doctorRepository.existsByEmailAndIsDeletedFalse(doctor.getEmail())) {
            throw new IllegalArgumentException("Email already exists. Please use a different email.");
        }
        
        // Check if license number already exists (excluding deleted records)
        if (doctor.getLicenseNumber() != null && 
            doctorRepository.existsByLicenseNumberAndIsDeletedFalse(doctor.getLicenseNumber())) {
            throw new IllegalArgumentException("License number already exists. Please use a different license number.");
        }
        
        // Generate unique doctor ID if not provided
        if (doctor.getDoctorId() == null || doctor.getDoctorId().isEmpty()) {
            doctor.setDoctorId(idGeneratorService.generateId("DOC"));
        }
        doctor.setIsActive(true);
        return doctorRepository.save(doctor);
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
    }

    public Doctor getDoctorByDoctorId(String doctorId) {
        return doctorRepository.findByDoctorId(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "doctorId", doctorId));
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findByIsDeletedFalse();
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationAndIsDeletedFalse(specialization);
    }

    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        Doctor doctor = getDoctorById(id);
        
        doctor.setFirstName(doctorDetails.getFirstName());
        doctor.setLastName(doctorDetails.getLastName());
        doctor.setGender(doctorDetails.getGender());
        doctor.setDateOfBirth(doctorDetails.getDateOfBirth());
        doctor.setPhoneNumber(doctorDetails.getPhoneNumber());
        doctor.setEmail(doctorDetails.getEmail());
        doctor.setSpecialization(doctorDetails.getSpecialization());
        doctor.setLicenseNumber(doctorDetails.getLicenseNumber());
        doctor.setQualification(doctorDetails.getQualification());
        doctor.setYearsOfExperience(doctorDetails.getYearsOfExperience());
        doctor.setConsultationFee(doctorDetails.getConsultationFee());
        doctor.setAddress(doctorDetails.getAddress());
        
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctor.setIsDeleted(true);
        doctor.setIsActive(false);
        doctorRepository.save(doctor);
    }

    public Doctor searchByEmail(String email) {
        return doctorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "email", email));
    }
}
