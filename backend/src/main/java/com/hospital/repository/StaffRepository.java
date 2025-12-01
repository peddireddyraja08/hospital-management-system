package com.hospital.repository;

import com.hospital.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByStaffId(String staffId);
    Optional<Staff> findByEmail(String email);
    List<Staff> findByDepartment(String department);
    List<Staff> findByDesignation(String designation);
    Boolean existsByStaffId(String staffId);
    Boolean existsByEmail(String email);
}
