package com.hospital.service;

import com.hospital.entity.Bill;
import com.hospital.enums.BillStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.BillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BillService {

    private final BillRepository billRepository;

    public Bill createBill(Bill bill) {
        // Generate unique bill number if not provided
        if (bill.getBillNumber() == null || bill.getBillNumber().isEmpty()) {
            bill.setBillNumber("BILL" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        
        bill.setBillDate(LocalDateTime.now());
        bill.setStatus(BillStatus.PENDING);
        bill.setIsActive(true);
        
        // Calculate totals
        calculateBillAmounts(bill);
        
        return billRepository.save(bill);
    }

    public Bill getBillById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", id));
    }

    public Bill getBillByBillNumber(String billNumber) {
        return billRepository.findByBillNumber(billNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "billNumber", billNumber));
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public List<Bill> getBillsByPatientId(Long patientId) {
        return billRepository.findByPatientId(patientId);
    }

    public List<Bill> getBillsByStatus(BillStatus status) {
        return billRepository.findByStatus(status);
    }

    public Bill updateBill(Long id, Bill billDetails) {
        Bill bill = getBillById(id);
        
        bill.setConsultationCharges(billDetails.getConsultationCharges());
        bill.setLabCharges(billDetails.getLabCharges());
        bill.setMedicationCharges(billDetails.getMedicationCharges());
        bill.setRoomCharges(billDetails.getRoomCharges());
        bill.setProcedureCharges(billDetails.getProcedureCharges());
        bill.setOtherCharges(billDetails.getOtherCharges());
        bill.setTaxAmount(billDetails.getTaxAmount());
        bill.setDiscountAmount(billDetails.getDiscountAmount());
        bill.setPaymentMethod(billDetails.getPaymentMethod());
        bill.setNotes(billDetails.getNotes());
        
        // Recalculate totals
        calculateBillAmounts(bill);
        
        return billRepository.save(bill);
    }

    public Bill addPayment(Long id, Double paymentAmount) {
        Bill bill = getBillById(id);
        
        Double currentPaid = bill.getPaidAmount() != null ? bill.getPaidAmount() : 0.0;
        Double newPaidAmount = currentPaid + paymentAmount;
        
        bill.setPaidAmount(newPaidAmount);
        bill.setDueAmount(bill.getTotalAmount() - newPaidAmount);
        
        // Update status based on payment
        if (bill.getDueAmount() <= 0) {
            bill.setStatus(BillStatus.PAID);
        } else if (newPaidAmount > 0) {
            bill.setStatus(BillStatus.PARTIALLY_PAID);
        }
        
        return billRepository.save(bill);
    }

    public Bill processInsuranceClaim(Long id, Double claimAmount) {
        Bill bill = getBillById(id);
        bill.setInsuranceClaimAmount(claimAmount);
        bill.setStatus(BillStatus.INSURANCE_PENDING);
        return billRepository.save(bill);
    }

    public Bill approveInsuranceClaim(Long id, Double approvedAmount) {
        Bill bill = getBillById(id);
        bill.setInsuranceApprovedAmount(approvedAmount);
        bill.setStatus(BillStatus.INSURANCE_APPROVED);
        
        // Add approved amount to paid
        return addPayment(id, approvedAmount);
    }

    public Bill rejectInsuranceClaim(Long id) {
        Bill bill = getBillById(id);
        bill.setStatus(BillStatus.INSURANCE_REJECTED);
        return billRepository.save(bill);
    }

    public void cancelBill(Long id) {
        Bill bill = getBillById(id);
        bill.setStatus(BillStatus.CANCELLED);
        billRepository.save(bill);
    }

    private void calculateBillAmounts(Bill bill) {
        // Calculate subtotal
        Double subtotal = 0.0;
        subtotal += (bill.getConsultationCharges() != null ? bill.getConsultationCharges() : 0.0);
        subtotal += (bill.getLabCharges() != null ? bill.getLabCharges() : 0.0);
        subtotal += (bill.getMedicationCharges() != null ? bill.getMedicationCharges() : 0.0);
        subtotal += (bill.getRoomCharges() != null ? bill.getRoomCharges() : 0.0);
        subtotal += (bill.getProcedureCharges() != null ? bill.getProcedureCharges() : 0.0);
        subtotal += (bill.getOtherCharges() != null ? bill.getOtherCharges() : 0.0);
        
        bill.setSubtotal(subtotal);
        
        // Calculate total
        Double taxAmount = bill.getTaxAmount() != null ? bill.getTaxAmount() : 0.0;
        Double discountAmount = bill.getDiscountAmount() != null ? bill.getDiscountAmount() : 0.0;
        Double totalAmount = subtotal + taxAmount - discountAmount;
        
        bill.setTotalAmount(totalAmount);
        
        // Calculate due amount
        Double paidAmount = bill.getPaidAmount() != null ? bill.getPaidAmount() : 0.0;
        bill.setDueAmount(totalAmount - paidAmount);
    }
}
