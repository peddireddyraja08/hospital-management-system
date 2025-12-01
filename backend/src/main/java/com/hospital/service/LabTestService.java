package com.hospital.service;

import com.hospital.entity.LabTest;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.LabTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class LabTestService {

    private final LabTestRepository labTestRepository;

    public LabTest createLabTest(LabTest labTest) {
        // Generate unique test code if not provided
        if (labTest.getTestCode() == null || labTest.getTestCode().isEmpty()) {
            labTest.setTestCode("LAB" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        labTest.setIsActive(true);
        return labTestRepository.save(labTest);
    }

    public LabTest getLabTestById(Long id) {
        return labTestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LabTest", "id", id));
    }

    public LabTest getLabTestByTestCode(String testCode) {
        return labTestRepository.findByTestCode(testCode)
                .orElseThrow(() -> new ResourceNotFoundException("LabTest", "testCode", testCode));
    }

    public List<LabTest> getAllLabTests() {
        return labTestRepository.findAll();
    }

    public List<LabTest> getLabTestsByCategory(String category) {
        return labTestRepository.findByTestCategory(category);
    }

    public LabTest updateLabTest(Long id, LabTest labTestDetails) {
        LabTest labTest = getLabTestById(id);
        
        labTest.setTestName(labTestDetails.getTestName());
        labTest.setDescription(labTestDetails.getDescription());
        labTest.setTestCategory(labTestDetails.getTestCategory());
        labTest.setPrice(labTestDetails.getPrice());
        labTest.setNormalRange(labTestDetails.getNormalRange());
        labTest.setUnit(labTestDetails.getUnit());
        labTest.setPreparationInstructions(labTestDetails.getPreparationInstructions());
        labTest.setTurnaroundTime(labTestDetails.getTurnaroundTime());
        
        return labTestRepository.save(labTest);
    }

    public void deleteLabTest(Long id) {
        LabTest labTest = getLabTestById(id);
        labTest.setIsDeleted(true);
        labTest.setIsActive(false);
        labTestRepository.save(labTest);
    }
}
