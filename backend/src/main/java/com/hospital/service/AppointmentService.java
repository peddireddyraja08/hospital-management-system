package com.hospital.service;

import com.hospital.entity.Appointment;
import com.hospital.entity.Doctor;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;

    public Appointment createAppointment(Appointment appointment) {
        // Check for conflicts
        if (hasConflict(appointment.getDoctor().getId(), appointment.getAppointmentDate(), appointment.getDuration())) {
            throw new IllegalStateException("Doctor is not available at the requested time");
        }
        
        appointment.setStatus("SCHEDULED");
        appointment.setIsActive(true);
        return appointmentRepository.save(appointment);
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }

    public List<Appointment> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentDateBetween(start, end);
    }

    public List<Appointment> getDoctorAppointmentsByDate(Long doctorId, LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByDoctorIdAndAppointmentDateBetween(doctorId, start, end);
    }

    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        Appointment appointment = getAppointmentById(id);
        
        // If rescheduling, check for conflicts
        if (!appointment.getAppointmentDate().equals(appointmentDetails.getAppointmentDate())) {
            if (hasConflict(appointment.getDoctor().getId(), appointmentDetails.getAppointmentDate(), appointmentDetails.getDuration())) {
                throw new IllegalStateException("Doctor is not available at the requested time");
            }
        }
        
        appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
        appointment.setDuration(appointmentDetails.getDuration());
        appointment.setReason(appointmentDetails.getReason());
        appointment.setNotes(appointmentDetails.getNotes());
        appointment.setAppointmentType(appointmentDetails.getAppointmentType());
        
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointmentStatus(Long id, String status) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public void cancelAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus("CANCELLED");
        appointmentRepository.save(appointment);
    }

    public void completeAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus("COMPLETED");
        appointmentRepository.save(appointment);
    }

    private boolean hasConflict(Long doctorId, LocalDateTime appointmentDate, Integer duration) {
        if (duration == null) {
            duration = 30; // default 30 minutes
        }
        
        LocalDateTime endTime = appointmentDate.plusMinutes(duration);
        LocalDateTime startCheck = appointmentDate.minusMinutes(duration);
        
        List<Appointment> existingAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentDateBetween(doctorId, startCheck, endTime);
        
        return existingAppointments.stream()
                .anyMatch(apt -> "SCHEDULED".equals(apt.getStatus()) && !apt.getIsDeleted());
    }
}
