package com.hospital.service;

import com.hospital.entity.MedicalRecord;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;

    public MedicalRecord createMedicalRecord(MedicalRecord medicalRecord) {
        medicalRecord.setIsActive(true);
        return medicalRecordRepository.save(medicalRecord);
    }

    public MedicalRecord getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalRecord", "id", id));
    }

    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    public List<MedicalRecord> getMedicalRecordsByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientIdOrderByVisitDateDesc(patientId);
    }

    public List<MedicalRecord> getMedicalRecordsByDoctorId(Long doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId);
    }

    public MedicalRecord updateMedicalRecord(Long id, MedicalRecord recordDetails) {
        MedicalRecord record = getMedicalRecordById(id);
        
        record.setVisitDate(recordDetails.getVisitDate());
        record.setChiefComplaint(recordDetails.getChiefComplaint());
        record.setPresentIllness(recordDetails.getPresentIllness());
        record.setExaminationFindings(recordDetails.getExaminationFindings());
        record.setDiagnosis(recordDetails.getDiagnosis());
        record.setTreatmentPlan(recordDetails.getTreatmentPlan());
        record.setPrescriptions(recordDetails.getPrescriptions());
        record.setNotes(recordDetails.getNotes());
        record.setFollowUpDate(recordDetails.getFollowUpDate());
        
        return medicalRecordRepository.save(record);
    }

    public void deleteMedicalRecord(Long id) {
        MedicalRecord record = getMedicalRecordById(id);
        record.setIsDeleted(true);
        medicalRecordRepository.save(record);
    }
}
