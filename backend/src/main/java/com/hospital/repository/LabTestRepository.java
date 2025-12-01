package com.hospital.repository;

import com.hospital.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, Long> {
    Optional<LabTest> findByTestCode(String testCode);
    List<LabTest> findByTestCategory(String testCategory);
    Boolean existsByTestCode(String testCode);
}
