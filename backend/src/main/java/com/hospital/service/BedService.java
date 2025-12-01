package com.hospital.service;

import com.hospital.entity.Bed;
import com.hospital.entity.Patient;
import com.hospital.enums.BedStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.BedRepository;
import com.hospital.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BedService {

    private final BedRepository bedRepository;
    private final PatientRepository patientRepository;

    public Bed createBed(Bed bed) {
        bed.setStatus(BedStatus.AVAILABLE);
        bed.setIsActive(true);
        return bedRepository.save(bed);
    }

    public Bed getBedById(Long id) {
        return bedRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bed", "id", id));
    }

    public Bed getBedByBedNumber(String bedNumber) {
        return bedRepository.findByBedNumber(bedNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bed", "bedNumber", bedNumber));
    }

    public List<Bed> getAllBeds() {
        return bedRepository.findAll();
    }

    public List<Bed> getBedsByStatus(BedStatus status) {
        return bedRepository.findByStatus(status);
    }

    public List<Bed> getAvailableBeds() {
        return bedRepository.findByStatus(BedStatus.AVAILABLE);
    }

    public List<Bed> getBedsByWard(String wardName) {
        return bedRepository.findByWardName(wardName);
    }

    public List<Bed> getBedsByType(String bedType) {
        return bedRepository.findByBedType(bedType);
    }

    public List<Bed> getAvailableBedsByWard(String wardName) {
        return bedRepository.findByWardNameAndStatus(wardName, BedStatus.AVAILABLE);
    }

    public Bed updateBed(Long id, Bed bedDetails) {
        Bed bed = getBedById(id);
        
        bed.setBedNumber(bedDetails.getBedNumber());
        bed.setWardName(bedDetails.getWardName());
        bed.setBedType(bedDetails.getBedType());
        bed.setFloorNumber(bedDetails.getFloorNumber());
        bed.setRoomNumber(bedDetails.getRoomNumber());
        bed.setDailyCharge(bedDetails.getDailyCharge());
        
        return bedRepository.save(bed);
    }

    // ADT Operations: Admission, Discharge, Transfer

    public Bed admitPatient(Long bedId, Long patientId) {
        Bed bed = getBedById(bedId);
        
        if (bed.getStatus() != BedStatus.AVAILABLE) {
            throw new IllegalStateException("Bed is not available for admission");
        }
        
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));
        
        bed.setCurrentPatient(patient);
        bed.setStatus(BedStatus.OCCUPIED);
        
        return bedRepository.save(bed);
    }

    public Bed dischargePatient(Long bedId) {
        Bed bed = getBedById(bedId);
        
        if (bed.getStatus() != BedStatus.OCCUPIED) {
            throw new IllegalStateException("Bed is not occupied");
        }
        
        bed.setCurrentPatient(null);
        bed.setStatus(BedStatus.AVAILABLE);
        
        return bedRepository.save(bed);
    }

    public Bed transferPatient(Long fromBedId, Long toBedId) {
        Bed fromBed = getBedById(fromBedId);
        Bed toBed = getBedById(toBedId);
        
        if (fromBed.getStatus() != BedStatus.OCCUPIED) {
            throw new IllegalStateException("Source bed is not occupied");
        }
        
        if (toBed.getStatus() != BedStatus.AVAILABLE) {
            throw new IllegalStateException("Target bed is not available");
        }
        
        Patient patient = fromBed.getCurrentPatient();
        
        // Discharge from old bed
        fromBed.setCurrentPatient(null);
        fromBed.setStatus(BedStatus.AVAILABLE);
        bedRepository.save(fromBed);
        
        // Admit to new bed
        toBed.setCurrentPatient(patient);
        toBed.setStatus(BedStatus.OCCUPIED);
        
        return bedRepository.save(toBed);
    }

    public Bed markBedForMaintenance(Long bedId) {
        Bed bed = getBedById(bedId);
        
        if (bed.getStatus() == BedStatus.OCCUPIED) {
            throw new IllegalStateException("Cannot mark occupied bed for maintenance");
        }
        
        bed.setStatus(BedStatus.UNDER_MAINTENANCE);
        return bedRepository.save(bed);
    }

    public Bed markBedAsAvailable(Long bedId) {
        Bed bed = getBedById(bedId);
        bed.setStatus(BedStatus.AVAILABLE);
        return bedRepository.save(bed);
    }

    public void deleteBed(Long id) {
        Bed bed = getBedById(id);
        
        if (bed.getStatus() == BedStatus.OCCUPIED) {
            throw new IllegalStateException("Cannot delete occupied bed");
        }
        
        bed.setIsDeleted(true);
        bed.setIsActive(false);
        bedRepository.save(bed);
    }
}
