package com.hospital.service;

import com.hospital.entity.PharmacyBill;
import com.hospital.repository.PharmacyBillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BillingService {
    private final PharmacyBillRepository pharmacyBillRepository;

    public PharmacyBill createBill(PharmacyBill bill) {
        return pharmacyBillRepository.save(bill);
    }

    public List<PharmacyBill> getByPrescription(Long prescriptionId) {
        return pharmacyBillRepository.findByPrescriptionId(prescriptionId);
    }

    public List<PharmacyBill> getByPatient(Long patientId) {
        return pharmacyBillRepository.findByPatientId(patientId);
    }
}
