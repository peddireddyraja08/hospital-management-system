package com.hospital.service;

import com.hospital.dto.MedicineDTO;
import com.hospital.entity.Medicine;
import com.hospital.entity.MedicineBatch;
import com.hospital.repository.MedicineBatchRepository;
import com.hospital.repository.MedicineRepository;
import com.hospital.repository.MedicationInventoryRepository;
import com.hospital.repository.MedicationRepository;
import com.hospital.repository.PrescriptionRepository;
import com.hospital.repository.PharmacyBillRepository;
import com.hospital.entity.PharmacyBill;
import com.hospital.entity.PharmacyBillItem;
import com.hospital.exception.InsufficientStockException;
import com.hospital.entity.MedicationInventory;
import com.hospital.entity.Medication;
import com.hospital.entity.Prescription;
import com.hospital.enums.PrescriptionStatus;
import lombok.RequiredArgsConstructor;
import com.hospital.service.BillService;
import com.hospital.service.AdmissionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PharmacyService {
    private final MedicineRepository medicineRepository;
    private final MedicineBatchRepository batchRepository;
    private final MedicationInventoryRepository medicationInventoryRepository;
    private final MedicationRepository medicationRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PharmacyBillRepository pharmacyBillRepository;
    private final BillService billService;
    private final AdmissionService admissionService;
    private final com.hospital.service.AppointmentService appointmentService;

    public Medicine createMedicine(Medicine m) {
        return medicineRepository.save(m);
    }

    public Medicine updateMedicine(Long id, Medicine updated) {
        Medicine m = medicineRepository.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found"));
        m.setName(updated.getName());
        m.setCategory(updated.getCategory());
        m.setStrength(updated.getStrength());
        m.setUnit(updated.getUnit());
        m.setManufacturer(updated.getManufacturer());
        m.setPrice(updated.getPrice());
        m.setReorderLevel(updated.getReorderLevel());
        return medicineRepository.save(m);
    }

    public List<Medicine> listAll() {
        return medicineRepository.findAll();
    }

    public Medicine getById(Long id) {
        return medicineRepository.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }

    public MedicineBatch addBatch(Long medicineId, MedicineBatch batch) {
        Medicine m = getById(medicineId);
        batch.setMedicine(m);
        MedicineBatch saved = batchRepository.save(batch);
        // update aggregated stock
        int total = batchRepository.findByMedicineId(medicineId).stream().mapToInt(b -> b.getQuantity() != null ? b.getQuantity() : 0).sum();
        m.setStockQty(total);
        medicineRepository.save(m);
        return saved;
    }

    public List<MedicineBatch> getBatches(Long medicineId) {
        return batchRepository.findByMedicineId(medicineId);
    }

    public List<MedicineBatch> getExpiringBefore(LocalDate date) {
        return batchRepository.findByExpiryDateBefore(date);
    }

    public List<Medicine> getLowStock() {
        return medicineRepository.findAll().stream().filter(m -> m.getStockQty() != null && m.getReorderLevel() != null && m.getStockQty() <= m.getReorderLevel()).collect(Collectors.toList());
    }

    public void dispense(Long medicineId, Integer qty) {
        // naive FIFO: deduct from earliest non-expired batches
        List<MedicineBatch> batches = batchRepository.findByMedicineId(medicineId).stream().filter(b -> b.getExpiryDate() == null || b.getExpiryDate().isAfter(LocalDate.now())).sorted((a,b)->a.getExpiryDate().compareTo(b.getExpiryDate())).collect(Collectors.toList());
        int remaining = qty;
        for (MedicineBatch b : batches) {
            int avail = b.getQuantity() != null ? b.getQuantity() : 0;
            if (avail <= 0) continue;
            int take = Math.min(avail, remaining);
            b.setQuantity(avail - take);
            remaining -= take;
            batchRepository.save(b);
            if (remaining <= 0) break;
        }
        if (remaining > 0) throw new RuntimeException("Insufficient stock to dispense");
        // update aggregated stock
        Medicine m = getById(medicineId);
        int total = batchRepository.findByMedicineId(medicineId).stream().mapToInt(b -> b.getQuantity() != null ? b.getQuantity() : 0).sum();
        m.setStockQty(total);
        medicineRepository.save(m);
    }

    public PharmacyBill dispensePrescription(Long prescriptionId, String dispensedBy) {
        // Full-dispense: delegate to partialDispense with full remaining quantity
        Prescription prescription = prescriptionRepository.findById(prescriptionId).orElseThrow(() -> new RuntimeException("Prescription not found"));
        int already = prescription.getDispensedQuantity() != null ? prescription.getDispensedQuantity() : 0;
        int totalQty = prescription.getQuantity() != null ? prescription.getQuantity() : 0;
        int remaining = totalQty - already;
        if (remaining <= 0) throw new IllegalStateException("Prescription already fully dispensed");
        return partialDispensePrescription(prescriptionId, remaining, null, null, dispensedBy);
    }

    /**
     * Partially dispense a prescription (supports repeated dispenses for IPD).
     */
    public PharmacyBill partialDispensePrescription(Long prescriptionId, Integer dispenseQty, Long admissionId, Long visitId, String dispensedBy) {
        if (dispenseQty == null || dispenseQty <= 0) throw new IllegalArgumentException("dispenseQty must be > 0");
        Prescription prescription = prescriptionRepository.findById(prescriptionId).orElseThrow(() -> new RuntimeException("Prescription not found"));
        if (prescription.getStatus() == PrescriptionStatus.CANCELLED) throw new IllegalStateException("Cannot dispense cancelled prescription");

        Medication med = prescription.getMedication();
        int already = prescription.getDispensedQuantity() != null ? prescription.getDispensedQuantity() : 0;
        int totalQty = prescription.getQuantity() != null ? prescription.getQuantity() : 0;
        int remaining = totalQty - already;
        if (dispenseQty > remaining) throw new IllegalArgumentException("dispenseQty exceeds remaining prescription quantity");

        // get batches for medication (use MedicationInventory)
        java.util.List<MedicationInventory> batches = medicationInventoryRepository.findByMedicationId(med.getId()).stream()
                .filter(b -> b.getExpiryDate() == null || b.getExpiryDate().isAfter(java.time.LocalDate.now()))
                .sorted((a,b)-> a.getExpiryDate().compareTo(b.getExpiryDate()))
                .collect(Collectors.toList());

        int needed = dispenseQty;
        java.util.List<PharmacyBillItem> billItems = new java.util.ArrayList<>();

        for (MedicationInventory b : batches) {
            int avail = b.getQuantity() != null ? b.getQuantity() : 0;
            if (avail <= 0) continue;
            int take = Math.min(avail, needed);
            b.setQuantity(avail - take);
            medicationInventoryRepository.save(b);

            PharmacyBillItem item = new PharmacyBillItem();
            item.setMedicineName(med.getMedicationName());
            item.setBatchNo(b.getBatchNumber());
            item.setQuantity(take);
            item.setUnitPrice(java.math.BigDecimal.valueOf(med.getUnitPrice()!=null?med.getUnitPrice():0.0));
            item.setLineTotal(item.getUnitPrice().multiply(java.math.BigDecimal.valueOf(take)));
            billItems.add(item);

            needed -= take;
            if (needed <= 0) break;
        }

        if (needed > 0) throw new InsufficientStockException("Insufficient stock to dispense requested quantity");

        // update aggregated medication stock
        int total = medicationInventoryRepository.findByMedicationId(med.getId()).stream().mapToInt(b -> b.getQuantity() != null ? b.getQuantity() : 0).sum();
        med.setStockQuantity(total);
        medicationRepository.save(med);

        // update prescription dispensed quantity and status
        int newDispensed = already + dispenseQty;
        prescription.setDispensedQuantity(newDispensed);
        prescription.setDispensedBy(dispensedBy);
        if (newDispensed >= totalQty) {
            prescription.setStatus(PrescriptionStatus.DISPENSED);
            prescription.setDispensedDate(java.time.LocalDateTime.now());
        } else {
            prescription.setStatus(PrescriptionStatus.PARTIALLY_DISPENSED);
        }
        prescriptionRepository.save(prescription);

        // build and persist bill
        PharmacyBill bill = new PharmacyBill();
        bill.setPatient(prescription.getPatient());
        bill.setPrescription(prescription);
        bill.setItems(billItems);
        java.math.BigDecimal totalAmount = billItems.stream().map(i->i.getLineTotal()).reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        bill.setTotalAmount(totalAmount);
        PharmacyBill saved = pharmacyBillRepository.save(bill);

        // If visitId provided, link PharmacyBill to the OPD Appointment
        if (visitId != null) {
            try {
                com.hospital.entity.Appointment apt = appointmentService.getAppointmentById(visitId);
                saved.setVisit(apt);
                pharmacyBillRepository.save(saved);
            } catch (Exception ex) {
                // ignore if appointment not found
            }
        }

        // If admissionId provided, add medication charges to the patient's active IPD bill
        if (admissionId != null) {
            if (saved.getPatient() != null) {
                Long patientId = saved.getPatient().getId();
                java.util.List<com.hospital.entity.Bill> bills = billService.getBillsByPatientId(patientId);
                com.hospital.entity.Bill target = bills.stream().filter(b->b.getStatus()!=null && b.getStatus().name().equals("PENDING")).findFirst().orElse(null);
                if (target == null) {
                    com.hospital.entity.Bill newBill = new com.hospital.entity.Bill();
                    newBill.setPatient(saved.getPatient());
                    newBill.setMedicationCharges(saved.getTotalAmount()!=null?saved.getTotalAmount().doubleValue():0.0);
                    target = billService.createBill(newBill);
                } else {
                    Double medCharges = target.getMedicationCharges()!=null?target.getMedicationCharges():0.0;
                    medCharges += saved.getTotalAmount()!=null?saved.getTotalAmount().doubleValue():0.0;
                    target.setMedicationCharges(medCharges);
                    billService.updateBill(target.getId(), target);
                }
            }
        }

        return saved;
    }

    /**
     * Simple partial dispense that only updates stock and prescription without creating bills.
     */
    public Prescription partialDispensePrescriptionSimple(Long prescriptionId, Integer dispenseQty, String dispensedBy) {
        if (dispenseQty == null || dispenseQty <= 0) throw new IllegalArgumentException("dispenseQty must be > 0");
        Prescription prescription = prescriptionRepository.findById(prescriptionId).orElseThrow(() -> new RuntimeException("Prescription not found"));
        if (prescription.getStatus() == PrescriptionStatus.CANCELLED) throw new IllegalStateException("Cannot dispense cancelled prescription");

        Medication med = prescription.getMedication();
        int already = prescription.getDispensedQuantity() != null ? prescription.getDispensedQuantity() : 0;
        int totalQty = prescription.getQuantity() != null ? prescription.getQuantity() : 0;
        int remaining = totalQty - already;
        if (dispenseQty > remaining) throw new IllegalArgumentException("dispenseQty exceeds remaining prescription quantity");

        // get inventory batches for medication
        java.util.List<MedicationInventory> batches = medicationInventoryRepository.findByMedicationId(med.getId()).stream()
                .filter(b -> b.getExpiryDate() == null || b.getExpiryDate().isAfter(java.time.LocalDate.now()))
                .sorted((a,b)-> a.getExpiryDate().compareTo(b.getExpiryDate()))
                .collect(java.util.stream.Collectors.toList());

        int needed = dispenseQty;

        for (MedicationInventory b : batches) {
            int avail = b.getQuantity() != null ? b.getQuantity() : 0;
            if (avail <= 0) continue;
            int take = Math.min(avail, needed);
            b.setQuantity(avail - take);
            medicationInventoryRepository.save(b);
            needed -= take;
            if (needed <= 0) break;
        }

        if (needed > 0) throw new InsufficientStockException("Insufficient stock to dispense requested quantity");

        // update aggregated medication stock
        int total = medicationInventoryRepository.findByMedicationId(med.getId()).stream().mapToInt(b -> b.getQuantity() != null ? b.getQuantity() : 0).sum();
        med.setStockQuantity(total);
        medicationRepository.save(med);

        // update prescription dispensed quantity and status
        int newDispensed = already + dispenseQty;
        prescription.setDispensedQuantity(newDispensed);
        prescription.setDispensedBy(dispensedBy);
        if (newDispensed >= totalQty) {
            prescription.setStatus(PrescriptionStatus.DISPENSED);
            prescription.setDispensedDate(java.time.LocalDateTime.now());
        } else {
            prescription.setStatus(PrescriptionStatus.PARTIALLY_DISPENSED);
        }
        return prescriptionRepository.save(prescription);
    }

    public Prescription dispensePrescriptionSimple(Long prescriptionId, String dispensedBy) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId).orElseThrow(() -> new RuntimeException("Prescription not found"));
        int already = prescription.getDispensedQuantity() != null ? prescription.getDispensedQuantity() : 0;
        int totalQty = prescription.getQuantity() != null ? prescription.getQuantity() : 0;
        int remaining = totalQty - already;
        if (remaining <= 0) throw new IllegalStateException("Prescription already fully dispensed");
        return partialDispensePrescriptionSimple(prescriptionId, remaining, dispensedBy);
    }

    /**
     * Dispense prescription and optionally attach charges to IPD admission or OPD visit.
     */
    public PharmacyBill dispensePrescription(Long prescriptionId, Long admissionId, Long visitId, String dispensedBy) {
        PharmacyBill bill = dispensePrescription(prescriptionId, dispensedBy);

        // If visitId provided, link PharmacyBill to the OPD Appointment
        if (visitId != null) {
            try {
                com.hospital.entity.Appointment apt = appointmentService.getAppointmentById(visitId);
                bill.setVisit(apt);
                pharmacyBillRepository.save(bill);
            } catch (Exception ex) {
                // ignore if appointment not found; preserve existing behavior
            }
        }

        // If admissionId provided, add medication charges to the patient's active IPD bill
        if (admissionId != null) {
            // find admission and patient
            com.hospital.entity.Admission admission = null;
            try {
                admission = admissionService.getAdmissionById(admissionId);
            } catch (Exception ex) {
                // ignore if not found
            }
            // Fallback: add medication amount to patient's bill via BillService for the patient
            if (bill.getPatient() != null) {
                Long patientId = bill.getPatient().getId();
                // find existing pending bill or create new
                java.util.List<com.hospital.entity.Bill> bills = billService.getBillsByPatientId(patientId);
                com.hospital.entity.Bill target = bills.stream().filter(b->b.getStatus()!=null && b.getStatus().name().equals("PENDING")).findFirst().orElse(null);
                if (target == null) {
                    com.hospital.entity.Bill newBill = new com.hospital.entity.Bill();
                    newBill.setPatient(bill.getPatient());
                    newBill.setMedicationCharges(bill.getTotalAmount()!=null?bill.getTotalAmount().doubleValue():0.0);
                    target = billService.createBill(newBill);
                } else {
                    Double medCharges = target.getMedicationCharges()!=null?target.getMedicationCharges():0.0;
                    medCharges += bill.getTotalAmount()!=null?bill.getTotalAmount().doubleValue():0.0;
                    target.setMedicationCharges(medCharges);
                    billService.updateBill(target.getId(), target);
                }
            }
        }

        // For OPD (visitId) we currently link bill to prescription and patient already; if visitId required, front-end can use visitId to show linkage
        return bill;
    }
}
