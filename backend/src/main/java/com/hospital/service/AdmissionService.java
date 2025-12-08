package com.hospital.service;

import com.hospital.entity.*;
import com.hospital.enums.AdmissionStatus;
import com.hospital.enums.BedStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.*;
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
public class AdmissionService {

    private final AdmissionRepository admissionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final BedRepository bedRepository;
    private final CarePathwayRepository carePathwayRepository;
    private final IdGeneratorService idGeneratorService;

    public Admission createAdmission(Admission admission) {
        // Generate admission number
        String admissionNumber = idGeneratorService.generateId("ADM");
        admission.setAdmissionNumber(admissionNumber);
        
        // Set admission date if not provided
        if (admission.getAdmissionDate() == null) {
            admission.setAdmissionDate(LocalDateTime.now());
        }

        // Set initial status
        if (admission.getStatus() == null) {
            admission.setStatus(AdmissionStatus.ADMITTED);
        }

        // Validate and fetch patient
        Patient patient = patientRepository.findById(admission.getPatient().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", admission.getPatient().getId()));
        
        // Automatically set patient type to INPATIENT when admitted
        if (patient.getPatientType() != com.hospital.enums.PatientType.INPATIENT) {
            patient.setPatientType(com.hospital.enums.PatientType.INPATIENT);
            patientRepository.save(patient);
            log.info("Updated patient {} to INPATIENT type", patient.getPatientId());
        }
        
        admission.setPatient(patient);

        // Validate and fetch doctor
        Doctor doctor = doctorRepository.findById(admission.getAdmittingDoctor().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", admission.getAdmittingDoctor().getId()));
        admission.setAdmittingDoctor(doctor);

        // Handle bed assignment
        if (admission.getCurrentBed() != null && admission.getCurrentBed().getId() != null) {
            Bed bed = bedRepository.findById(admission.getCurrentBed().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Bed", "id", admission.getCurrentBed().getId()));
            
            if (!bed.isAvailableForAdmission()) {
                throw new IllegalStateException("Bed " + bed.getBedNumber() + " is not available for admission");
            }
            
            bed.occupy(patient);
            bedRepository.save(bed);
            admission.setCurrentBed(bed);
            admission.setWard(bed.getWardName());
            admission.setRoomNumber(bed.getRoomNumber());
            admission.setDailyCharge(bed.getDailyCharge() != null ? 
                    java.math.BigDecimal.valueOf(bed.getDailyCharge()) : null);
        }

        // Link care pathway if provided
        if (admission.getCarePathway() != null && admission.getCarePathway().getId() != null) {
            CarePathway pathway = carePathwayRepository.findById(admission.getCarePathway().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("CarePathway", "id", admission.getCarePathway().getId()));
            admission.setCarePathway(pathway);
            pathway.incrementUsageCount();
            carePathwayRepository.save(pathway);
        }

        log.info("Creating new admission: {} for patient: {}", admissionNumber, patient.getPatientId());
        return admissionRepository.save(admission);
    }

    public Admission getAdmissionById(Long id) {
        return admissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admission", "id", id));
    }

    public Admission getAdmissionByNumber(String admissionNumber) {
        return admissionRepository.findByAdmissionNumber(admissionNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Admission", "admissionNumber", admissionNumber));
    }

    public List<Admission> getAllAdmissions() {
        return admissionRepository.findAll();
    }

    public List<Admission> getAllActiveAdmissions() {
        return admissionRepository.findAllActiveAdmissions();
    }

    public List<Admission> getAdmissionsByPatient(Long patientId) {
        return admissionRepository.findByPatientId(patientId);
    }

    public List<Admission> getAdmissionsByDoctor(Long doctorId) {
        List<AdmissionStatus> activeStatuses = List.of(
                AdmissionStatus.ADMITTED,
                AdmissionStatus.UNDER_TREATMENT,
                AdmissionStatus.CRITICAL,
                AdmissionStatus.STABLE,
                AdmissionStatus.READY_FOR_DISCHARGE
        );
        return admissionRepository.findByDoctorIdAndStatusIn(doctorId, activeStatuses);
    }

    public List<Admission> getAdmissionsByWard(String ward) {
        return admissionRepository.findByWard(ward);
    }

    public List<Admission> getICUAdmissions() {
        return admissionRepository.findAllICUAdmissions();
    }

    public List<Admission> getIsolationAdmissions() {
        return admissionRepository.findIsolationAdmissions();
    }

    public List<Admission> getPredictedDischarges(Integer daysAhead) {
        LocalDateTime futureDate = LocalDateTime.now().plusDays(daysAhead);
        return admissionRepository.findPredictedDischarges(futureDate);
    }

    public List<Admission> getOverstayAdmissions() {
        return admissionRepository.findOverstayAdmissions(LocalDateTime.now());
    }

    public Admission updateAdmission(Long id, Admission admissionDetails) {
        Admission admission = getAdmissionById(id);

        if (admissionDetails.getStatus() != null) {
            admission.setStatus(admissionDetails.getStatus());
        }
        if (admissionDetails.getProvisionalDiagnosis() != null) {
            admission.setProvisionalDiagnosis(admissionDetails.getProvisionalDiagnosis());
        }
        if (admissionDetails.getExpectedDischargeDate() != null) {
            admission.setExpectedDischargeDate(admissionDetails.getExpectedDischargeDate());
        }
        if (admissionDetails.getSpecialInstructions() != null) {
            admission.setSpecialInstructions(admissionDetails.getSpecialInstructions());
        }
        if (admissionDetails.getPrimaryNurse() != null) {
            admission.setPrimaryNurse(admissionDetails.getPrimaryNurse());
        }

        log.info("Updating admission: {}", admission.getAdmissionNumber());
        return admissionRepository.save(admission);
    }

    public Admission transferBed(Long admissionId, Long newBedId) {
        Admission admission = getAdmissionById(admissionId);
        Bed newBed = bedRepository.findById(newBedId)
                .orElseThrow(() -> new ResourceNotFoundException("Bed", "id", newBedId));

        if (!newBed.isAvailableForAdmission()) {
            throw new IllegalStateException("New bed " + newBed.getBedNumber() + " is not available");
        }

        // Vacate old bed
        if (admission.getCurrentBed() != null) {
            Bed oldBed = admission.getCurrentBed();
            oldBed.vacate();
            bedRepository.save(oldBed);
        }

        // Occupy new bed
        newBed.occupy(admission.getPatient());
        bedRepository.save(newBed);

        // Update admission
        admission.setCurrentBed(newBed);
        admission.setWard(newBed.getWardName());
        admission.setRoomNumber(newBed.getRoomNumber());

        log.info("Transferred admission {} to bed {}", admission.getAdmissionNumber(), newBed.getBedNumber());
        return admissionRepository.save(admission);
    }

    public Admission dischargePatient(Long admissionId, AdmissionStatus dischargeStatus) {
        Admission admission = getAdmissionById(admissionId);

        if (admission.getActualDischargeDate() != null) {
            throw new IllegalStateException("Patient already discharged");
        }

        admission.setActualDischargeDate(LocalDateTime.now());
        admission.setStatus(dischargeStatus);

        // Vacate bed
        if (admission.getCurrentBed() != null) {
            Bed bed = admission.getCurrentBed();
            bed.vacate();
            bedRepository.save(bed);
        }

        log.info("Discharged admission: {} with status: {}", admission.getAdmissionNumber(), dischargeStatus);
        return admissionRepository.save(admission);
    }

    public Long getActiveAdmissionCount() {
        return admissionRepository.countActiveAdmissions();
    }

    public List<Object[]> getAdmissionCountByWard() {
        return admissionRepository.getAdmissionCountByWard();
    }

    public List<Admission> getAdmissionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return admissionRepository.findByAdmissionDateBetween(startDate, endDate);
    }
}
