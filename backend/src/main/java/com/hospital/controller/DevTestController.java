package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.*;
import com.hospital.enums.PrescriptionStatus;
import com.hospital.repository.*;
import com.hospital.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;

@RestController
@RequestMapping("/dev")
@RequiredArgsConstructor
public class DevTestController {

    private final MedicationRepository medicationRepository;
    private final MedicationInventoryRepository medicationInventoryRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PharmacyService pharmacyService;

    @PostMapping("/test-dispense")
    public ApiResponse<Object> testDispense() {
        // create medication
        Medication med = medicationRepository.findByMedicationCode("TEST-MED-001").orElseGet(() -> {
            Medication m = new Medication();
            m.setMedicationCode("TEST-MED-001");
            m.setMedicationName("TestMed");
            m.setUnitPrice(10.0);
            m.setStockQuantity(0);
            m.setReorderLevel(5);
            m.setManufacturer("TestPharma");
            return medicationRepository.save(m);
        });

        // add inventory batch
        MedicationInventory batch = new MedicationInventory();
        batch.setMedication(med);
        batch.setBatchNumber("BATCH-001");
        batch.setQuantity(100);
        batch.setManufacturingDate(LocalDate.now().minusMonths(1));
        batch.setExpiryDate(LocalDate.now().plusYears(1));
        batch.setPurchaseDate(LocalDate.now().minusDays(10));
        batch.setPurchasePrice(5.0);
        batch.setSupplierName("TestSupplier");
        medicationInventoryRepository.save(batch);

        // update aggregated stock
        int total = medicationInventoryRepository.findByMedicationId(med.getId()).stream().mapToInt(b -> b.getQuantity()!=null?b.getQuantity():0).sum();
        med.setStockQuantity(total);
        medicationRepository.save(med);

        // create patient
        Patient patient = new Patient();
        patient.setPatientId("TEST-PAT-001");
        patient.setFirstName("Test");
        patient.setLastName("Patient");
        patient.setPhoneNumber("+1000000000");
        patientRepository.save(patient);

        // create doctor
        Doctor doctor = new Doctor();
        doctor.setDoctorId("TEST-DOC-001");
        doctor.setFirstName("Doc");
        doctor.setLastName("Tester");
        doctor.setEmail("doc@test.local");
        doctorRepository.save(doctor);

        // create prescription
        Prescription p = new Prescription();
        p.setPatient(patient);
        p.setDoctor(doctor);
        p.setMedication(med);
        p.setQuantity(5);
        p.setPrescribedDate(LocalDateTime.now());
        p.setStatus(PrescriptionStatus.PENDING);
        prescriptionRepository.save(p);

        // perform dispense (should create bill and deduct inventory)
        PharmacyBill bill = pharmacyService.dispensePrescription(p.getId(), "dev-tester");

        // re-fetch medication to report stock
        Medication updatedMed = medicationRepository.findById(med.getId()).orElse(med);

        return ApiResponse.success("Dispense completed", Collections.singletonMap("result", new Object[] { bill, updatedMed }));
    }
}
