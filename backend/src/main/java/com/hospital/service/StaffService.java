package com.hospital.service;

import com.hospital.entity.Staff;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StaffService {

    private final StaffRepository staffRepository;
    private final IdGeneratorService idGeneratorService;

    public Staff createStaff(Staff staff) {
        // Generate unique staff ID if not provided
        if (staff.getStaffId() == null || staff.getStaffId().isEmpty()) {
            staff.setStaffId(idGeneratorService.generateId("STF"));
        }
        staff.setIsActive(true);
        return staffRepository.save(staff);
    }

    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "id", id));
    }

    public Staff getStaffByStaffId(String staffId) {
        return staffRepository.findByStaffId(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "staffId", staffId));
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public List<Staff> getStaffByDepartment(String department) {
        return staffRepository.findByDepartment(department);
    }

    public List<Staff> getStaffByDesignation(String designation) {
        return staffRepository.findByDesignation(designation);
    }

    public Staff updateStaff(Long id, Staff staffDetails) {
        Staff staff = getStaffById(id);
        
        staff.setFirstName(staffDetails.getFirstName());
        staff.setLastName(staffDetails.getLastName());
        staff.setGender(staffDetails.getGender());
        staff.setDateOfBirth(staffDetails.getDateOfBirth());
        staff.setPhoneNumber(staffDetails.getPhoneNumber());
        staff.setEmail(staffDetails.getEmail());
        staff.setDepartment(staffDetails.getDepartment());
        staff.setDesignation(staffDetails.getDesignation());
        staff.setQualification(staffDetails.getQualification());
        staff.setJoiningDate(staffDetails.getJoiningDate());
        staff.setSalary(staffDetails.getSalary());
        staff.setAddress(staffDetails.getAddress());
        
        return staffRepository.save(staff);
    }

    public void deleteStaff(Long id) {
        Staff staff = getStaffById(id);
        staff.setIsDeleted(true);
        staff.setIsActive(false);
        staffRepository.save(staff);
    }

    public Staff searchByEmail(String email) {
        return staffRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "email", email));
    }
}
