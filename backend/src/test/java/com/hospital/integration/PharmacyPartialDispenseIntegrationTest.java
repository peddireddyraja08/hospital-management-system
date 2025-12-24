package com.hospital.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.entity.*;
import com.hospital.enums.PrescriptionStatus;
import com.hospital.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class PharmacyPartialDispenseIntegrationTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private MedicationInventoryRepository inventoryRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PharmacyBillRepository pharmacyBillRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = {"PHARMACIST"})
    public void partialDispense_createsBill_and_deductsInventory() throws Exception {
        Medication med = new Medication();
        med.setMedicationCode("ITEST-001");
        med.setMedicationName("ITest");
        med.setUnitPrice(10.0);
        medicationRepository.save(med);

        MedicationInventory batch = new MedicationInventory();
        batch.setMedication(med);
        batch.setBatchNumber("B-1");
        batch.setQuantity(20);
        batch.setExpiryDate(LocalDate.now().plusMonths(6));
        inventoryRepository.save(batch);

        // update aggregated
        med.setStockQuantity(inventoryRepository.findByMedicationId(med.getId()).stream().mapToInt(b->b.getQuantity()!=null?b.getQuantity():0).sum());
        medicationRepository.save(med);

        Patient p = new Patient();
        p.setPatientId("IPD-TEST-1");
        p.setFirstName("T");
        p.setLastName("User");
        patientRepository.save(p);

        Doctor d = new Doctor();
        d.setDoctorId("DOC-IT");
        d.setFirstName("Doc");
        d.setLastName("One");
        doctorRepository.save(d);

        Prescription presc = new Prescription();
        presc.setPatient(p);
        presc.setDoctor(d);
        presc.setMedication(med);
        presc.setQuantity(10);
        presc.setStatus(PrescriptionStatus.PENDING);
        presc.setPrescribedDate(LocalDateTime.now());
        prescriptionRepository.save(presc);

        // perform partial dispense of 4 units
        mvc.perform(post("/pharmacy/prescriptions/" + presc.getId() + "/partial-dispense")
                .contentType(MediaType.APPLICATION_JSON)
                .param("dispensedQuantity", "4")
        ).andExpect(status().isOk());

        // reload inventory and prescription and bill
        MedicationInventory updated = inventoryRepository.findById(batch.getId()).orElseThrow();
        assertThat(updated.getQuantity()).isEqualTo(16);

        Prescription updatedPresc = prescriptionRepository.findById(presc.getId()).orElseThrow();
        assertThat(updatedPresc.getDispensedQuantity()).isEqualTo(4);
        assertThat(updatedPresc.getStatus()).isEqualTo(PrescriptionStatus.PARTIALLY_DISPENSED);

        // bill should exist
        assertThat(pharmacyBillRepository.findByPrescriptionId(presc.getId())).isNotEmpty();
    }
}
