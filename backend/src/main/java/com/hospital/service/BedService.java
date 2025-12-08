package com.hospital.service;

import com.hospital.entity.Admission;
import com.hospital.entity.Bed;
import com.hospital.entity.Patient;
import com.hospital.enums.BedStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AdmissionRepository;
import com.hospital.repository.BedRepository;
import com.hospital.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BedService {

    private final BedRepository bedRepository;
    private final PatientRepository patientRepository;
    private final AdmissionRepository admissionRepository;

    public Bed createBed(Bed bed) {
        if (bedRepository.existsByBedNumber(bed.getBedNumber())) {
            throw new IllegalArgumentException("Bed with number " + bed.getBedNumber() + " already exists");
        }
        
        if (bed.getStatus() == null) {
            bed.setStatus(BedStatus.AVAILABLE);
        }
        bed.setIsActive(true);
        
        log.info("Creating new bed: {}", bed.getBedNumber());
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
        return bedRepository.findAvailableBedsForAdmission();
    }

    public List<Bed> getAvailableBedsInWard(String ward) {
        return bedRepository.findAvailableBedsInWard(ward);
    }

    public List<Bed> getAvailableBedsByType(String bedType) {
        return bedRepository.findAvailableBedsByType(bedType);
    }

    public List<Bed> getAvailableIsolationBeds() {
        return bedRepository.findAvailableIsolationBeds();
    }

    public List<Bed> getAvailableBedsWithVentilator() {
        return bedRepository.findAvailableBedsWithVentilator();
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
        
        if (bedDetails.getBedNumber() != null) {
            bed.setBedNumber(bedDetails.getBedNumber());
        }
        if (bedDetails.getWardName() != null) {
            bed.setWardName(bedDetails.getWardName());
        }
        if (bedDetails.getBedType() != null) {
            bed.setBedType(bedDetails.getBedType());
        }
        if (bedDetails.getFloorNumber() != null) {
            bed.setFloorNumber(bedDetails.getFloorNumber());
        }
        if (bedDetails.getRoomNumber() != null) {
            bed.setRoomNumber(bedDetails.getRoomNumber());
        }
        if (bedDetails.getDailyCharge() != null) {
            bed.setDailyCharge(bedDetails.getDailyCharge());
        }
        if (bedDetails.getIsIsolationBed() != null) {
            bed.setIsIsolationBed(bedDetails.getIsIsolationBed());
        }
        if (bedDetails.getIsolationType() != null) {
            bed.setIsolationType(bedDetails.getIsolationType());
        }
        if (bedDetails.getHasVentilator() != null) {
            bed.setHasVentilator(bedDetails.getHasVentilator());
        }
        if (bedDetails.getHasOxygenSupport() != null) {
            bed.setHasOxygenSupport(bedDetails.getHasOxygenSupport());
        }
        
        log.info("Updating bed: {}", bed.getBedNumber());
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

    // ========== Block/Unblock Operations ==========

    public Bed blockBed(Long bedId, String reason, String blockedBy, LocalDateTime blockedUntil) {
        Bed bed = getBedById(bedId);

        if (bed.getStatus() == BedStatus.OCCUPIED) {
            throw new IllegalStateException("Cannot block an occupied bed");
        }

        bed.block(reason, blockedBy, blockedUntil);
        log.info("Bed {} blocked by {} until {}: {}", bed.getBedNumber(), blockedBy, blockedUntil, reason);
        
        return bedRepository.save(bed);
    }

    public Bed unblockBed(Long bedId) {
        Bed bed = getBedById(bedId);
        bed.unblock();
        log.info("Bed {} unblocked", bed.getBedNumber());
        
        return bedRepository.save(bed);
    }

    public Bed markBedCleaned(Long bedId, String cleanedBy) {
        Bed bed = getBedById(bedId);
        bed.markCleaned(cleanedBy);
        log.info("Bed {} marked as cleaned by {}", bed.getBedNumber(), cleanedBy);
        
        return bedRepository.save(bed);
    }

    // ========== Maintenance Operations ==========

    public Bed sendBedForMaintenance(Long bedId, String notes, LocalDateTime nextMaintenanceDate) {
        Bed bed = getBedById(bedId);

        if (bed.getStatus() == BedStatus.OCCUPIED) {
            throw new IllegalStateException("Cannot send occupied bed for maintenance");
        }

        bed.setStatus(BedStatus.UNDER_MAINTENANCE);
        bed.setMaintenanceNotes(notes);
        bed.setLastMaintenanceDate(LocalDateTime.now());
        bed.setNextMaintenanceDate(nextMaintenanceDate);
        log.info("Bed {} sent for maintenance", bed.getBedNumber());
        
        return bedRepository.save(bed);
    }

    public Bed completeBedMaintenance(Long bedId) {
        Bed bed = getBedById(bedId);
        bed.setStatus(BedStatus.CLEANING);
        log.info("Bed {} maintenance completed, ready for cleaning", bed.getBedNumber());
        
        return bedRepository.save(bed);
    }

    public List<Bed> getBedsRequiringMaintenance() {
        return bedRepository.findBedsRequiringMaintenance(LocalDateTime.now());
    }

    // ========== Analytics Operations ==========

    public Map<String, Object> getRealTimeBedMapData() {
        List<Bed> allBeds = bedRepository.findAll();
        Map<String, List<Bed>> bedsByWard = allBeds.stream()
                .collect(Collectors.groupingBy(Bed::getWardName));

        Map<String, Object> bedMapData = new HashMap<>();
        bedMapData.put("bedsByWard", bedsByWard);
        bedMapData.put("totalBeds", allBeds.size());
        bedMapData.put("availableBeds", allBeds.stream().filter(Bed::isAvailableForAdmission).count());
        bedMapData.put("occupiedBeds", allBeds.stream().filter(b -> b.getStatus() == BedStatus.OCCUPIED).count());
        bedMapData.put("blockedBeds", allBeds.stream().filter(Bed::getIsBlocked).count());
        bedMapData.put("cleaningBeds", allBeds.stream().filter(b -> b.getStatus() == BedStatus.CLEANING).count());
        bedMapData.put("maintenanceBeds", allBeds.stream().filter(b -> b.getStatus() == BedStatus.UNDER_MAINTENANCE).count());

        return bedMapData;
    }

    public Map<String, Object> getBedOccupancyAnalytics() {
        List<Object[]> occupancyData = bedRepository.getBedOccupancyByWard();
        List<Map<String, Object>> wardOccupancy = new ArrayList<>();

        for (Object[] data : occupancyData) {
            Map<String, Object> wardData = new HashMap<>();
            wardData.put("ward", data[0]);
            Long totalBeds = (Long) data[1];
            Long occupiedBeds = (Long) data[2];
            wardData.put("totalBeds", totalBeds);
            wardData.put("occupiedBeds", occupiedBeds);
            wardData.put("availableBeds", totalBeds - occupiedBeds);
            wardData.put("occupancyRate", totalBeds > 0 ? (occupiedBeds * 100.0 / totalBeds) : 0);
            wardOccupancy.add(wardData);
        }

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("wardOccupancy", wardOccupancy);
        analytics.put("timestamp", LocalDateTime.now());
        
        return analytics;
    }

    public List<Map<String, Object>> getPredictedDischargeBeds(Integer daysAhead) {
        LocalDateTime futureDate = LocalDateTime.now().plusDays(daysAhead);
        List<Admission> predictedDischarges = admissionRepository.findPredictedDischarges(futureDate);

        return predictedDischarges.stream().map(admission -> {
            Map<String, Object> bedInfo = new HashMap<>();
            if (admission.getCurrentBed() != null) {
                Bed bed = admission.getCurrentBed();
                bedInfo.put("bedId", bed.getId());
                bedInfo.put("bedNumber", bed.getBedNumber());
                bedInfo.put("ward", bed.getWardName());
                bedInfo.put("roomNumber", bed.getRoomNumber());
                bedInfo.put("bedType", bed.getBedType());
                bedInfo.put("expectedVacantAt", admission.getExpectedDischargeDate());
                bedInfo.put("patientName", admission.getPatient().getFirstName() + " " + admission.getPatient().getLastName());
                bedInfo.put("patientId", admission.getPatient().getPatientId());
                bedInfo.put("admissionNumber", admission.getAdmissionNumber());
                bedInfo.put("lengthOfStay", admission.getLengthOfStay());
            }
            return bedInfo;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getOverstayAlerts() {
        List<Admission> overstayAdmissions = admissionRepository.findOverstayAdmissions(LocalDateTime.now());

        return overstayAdmissions.stream().map(admission -> {
            Map<String, Object> alert = new HashMap<>();
            alert.put("admissionId", admission.getId());
            alert.put("admissionNumber", admission.getAdmissionNumber());
            alert.put("patientName", admission.getPatient().getFirstName() + " " + admission.getPatient().getLastName());
            alert.put("patientId", admission.getPatient().getPatientId());
            
            if (admission.getCurrentBed() != null) {
                alert.put("bedNumber", admission.getCurrentBed().getBedNumber());
                alert.put("ward", admission.getCurrentBed().getWardName());
            }
            
            alert.put("expectedDischargeDate", admission.getExpectedDischargeDate());
            alert.put("overstayDays", admission.getOverstayDays());
            alert.put("lengthOfStay", admission.getLengthOfStay());
            alert.put("doctorName", admission.getAdmittingDoctor().getUser().getFirstName() + " " + 
                                   admission.getAdmittingDoctor().getUser().getLastName());
            
            return alert;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> calculateALOS(String ward, LocalDateTime startDate, LocalDateTime endDate) {
        List<Admission> admissions = admissionRepository.findByAdmissionDateBetween(startDate, endDate);
        
        if (ward != null) {
            admissions = admissions.stream()
                    .filter(a -> ward.equals(a.getWard()))
                    .collect(Collectors.toList());
        }

        List<Admission> dischargedAdmissions = admissions.stream()
                .filter(a -> a.getActualDischargeDate() != null)
                .collect(Collectors.toList());

        if (dischargedAdmissions.isEmpty()) {
            Map<String, Object> result = new HashMap<>();
            result.put("alos", 0.0);
            result.put("totalAdmissions", 0);
            result.put("message", "No discharged admissions found in the specified period");
            return result;
        }

        double totalLOS = dischargedAdmissions.stream()
                .mapToInt(Admission::getLengthOfStay)
                .sum();

        double alos = totalLOS / dischargedAdmissions.size();

        Map<String, Object> result = new HashMap<>();
        result.put("alos", Math.round(alos * 10.0) / 10.0);
        result.put("totalAdmissions", dischargedAdmissions.size());
        result.put("totalLOS", (int) totalLOS);
        result.put("ward", ward != null ? ward : "All Wards");
        result.put("startDate", startDate);
        result.put("endDate", endDate);

        return result;
    }

    public Map<String, Object> getICUUtilization() {
        List<Bed> icuBeds = bedRepository.findByBedType("ICU");
        long totalICUBeds = icuBeds.size();
        long occupiedICUBeds = icuBeds.stream()
                .filter(b -> b.getStatus() == BedStatus.OCCUPIED)
                .count();

        Map<String, Object> utilization = new HashMap<>();
        utilization.put("totalICUBeds", totalICUBeds);
        utilization.put("occupiedICUBeds", occupiedICUBeds);
        utilization.put("availableICUBeds", totalICUBeds - occupiedICUBeds);
        utilization.put("utilizationRate", totalICUBeds > 0 ? (occupiedICUBeds * 100.0 / totalICUBeds) : 0);
        utilization.put("timestamp", LocalDateTime.now());

        return utilization;
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
