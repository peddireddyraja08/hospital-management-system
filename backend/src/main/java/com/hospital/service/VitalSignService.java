package com.hospital.service;

import com.hospital.entity.VitalSign;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.VitalSignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VitalSignService {

    private final VitalSignRepository vitalSignRepository;

    public VitalSign recordVitalSign(VitalSign vitalSign) {
        // Calculate BMI if height and weight are provided
        if (vitalSign.getHeight() != null && vitalSign.getWeight() != null && vitalSign.getHeight() > 0) {
            double heightInMeters = vitalSign.getHeight() / 100.0;
            double bmi = vitalSign.getWeight() / (heightInMeters * heightInMeters);
            vitalSign.setBmi(Math.round(bmi * 100.0) / 100.0);
        }
        
        vitalSign.setIsActive(true);
        return vitalSignRepository.save(vitalSign);
    }

    public VitalSign getVitalSignById(Long id) {
        return vitalSignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VitalSign", "id", id));
    }

    public List<VitalSign> getVitalSignsByPatientId(Long patientId) {
        return vitalSignRepository.findByPatientIdOrderByRecordedAtDesc(patientId);
    }

    public VitalSign updateVitalSign(Long id, VitalSign vitalSignDetails) {
        VitalSign vitalSign = getVitalSignById(id);
        
        vitalSign.setRecordedAt(vitalSignDetails.getRecordedAt());
        vitalSign.setTemperature(vitalSignDetails.getTemperature());
        vitalSign.setBloodPressureSystolic(vitalSignDetails.getBloodPressureSystolic());
        vitalSign.setBloodPressureDiastolic(vitalSignDetails.getBloodPressureDiastolic());
        vitalSign.setHeartRate(vitalSignDetails.getHeartRate());
        vitalSign.setRespiratoryRate(vitalSignDetails.getRespiratoryRate());
        vitalSign.setOxygenSaturation(vitalSignDetails.getOxygenSaturation());
        vitalSign.setWeight(vitalSignDetails.getWeight());
        vitalSign.setHeight(vitalSignDetails.getHeight());
        vitalSign.setNotes(vitalSignDetails.getNotes());
        
        // Recalculate BMI
        if (vitalSign.getHeight() != null && vitalSign.getWeight() != null && vitalSign.getHeight() > 0) {
            double heightInMeters = vitalSign.getHeight() / 100.0;
            double bmi = vitalSign.getWeight() / (heightInMeters * heightInMeters);
            vitalSign.setBmi(Math.round(bmi * 100.0) / 100.0);
        }
        
        return vitalSignRepository.save(vitalSign);
    }

    public void deleteVitalSign(Long id) {
        VitalSign vitalSign = getVitalSignById(id);
        vitalSign.setIsDeleted(true);
        vitalSignRepository.save(vitalSign);
    }
}
