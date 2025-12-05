package com.hospital.service;

import com.hospital.entity.LabTest;
import com.hospital.enums.TestCategory;
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
        
        // Set default values
        if (labTest.getIsProfile() == null) {
            labTest.setIsProfile(false);
        }
        if (labTest.getRequiresFasting() == null) {
            labTest.setRequiresFasting(false);
        }
        
        labTest.setIsActive(true);
        labTest.setIsDeleted(false);
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

    public List<LabTest> getLabTestsByCategory(TestCategory category) {
        return labTestRepository.findByTestCategory(category);
    }

    public List<LabTest> getLabTestsByDepartment(String department) {
        return labTestRepository.findByDepartment(department);
    }

    public List<LabTest> getTestProfiles() {
        return labTestRepository.findByIsProfile(true);
    }

    public List<LabTest> searchLabTestsByName(String testName) {
        return labTestRepository.findByTestNameContainingIgnoreCase(testName);
    }

    public LabTest updateLabTest(Long id, LabTest labTestDetails) {
        LabTest labTest = getLabTestById(id);
        
        if (labTestDetails.getTestName() != null) {
            labTest.setTestName(labTestDetails.getTestName());
        }
        if (labTestDetails.getDescription() != null) {
            labTest.setDescription(labTestDetails.getDescription());
        }
        if (labTestDetails.getTestCategory() != null) {
            labTest.setTestCategory(labTestDetails.getTestCategory());
        }
        if (labTestDetails.getPrice() != null) {
            labTest.setPrice(labTestDetails.getPrice());
        }
        if (labTestDetails.getNormalRange() != null) {
            labTest.setNormalRange(labTestDetails.getNormalRange());
        }
        if (labTestDetails.getNormalRangeMale() != null) {
            labTest.setNormalRangeMale(labTestDetails.getNormalRangeMale());
        }
        if (labTestDetails.getNormalRangeFemale() != null) {
            labTest.setNormalRangeFemale(labTestDetails.getNormalRangeFemale());
        }
        if (labTestDetails.getNormalRangeChild() != null) {
            labTest.setNormalRangeChild(labTestDetails.getNormalRangeChild());
        }
        if (labTestDetails.getUnit() != null) {
            labTest.setUnit(labTestDetails.getUnit());
        }
        if (labTestDetails.getSampleType() != null) {
            labTest.setSampleType(labTestDetails.getSampleType());
        }
        if (labTestDetails.getSampleVolume() != null) {
            labTest.setSampleVolume(labTestDetails.getSampleVolume());
        }
        if (labTestDetails.getSampleContainer() != null) {
            labTest.setSampleContainer(labTestDetails.getSampleContainer());
        }
        if (labTestDetails.getPreparationInstructions() != null) {
            labTest.setPreparationInstructions(labTestDetails.getPreparationInstructions());
        }
        if (labTestDetails.getTurnaroundTime() != null) {
            labTest.setTurnaroundTime(labTestDetails.getTurnaroundTime());
        }
        if (labTestDetails.getCriticalLow() != null) {
            labTest.setCriticalLow(labTestDetails.getCriticalLow());
        }
        if (labTestDetails.getCriticalHigh() != null) {
            labTest.setCriticalHigh(labTestDetails.getCriticalHigh());
        }
        if (labTestDetails.getIsProfile() != null) {
            labTest.setIsProfile(labTestDetails.getIsProfile());
        }
        if (labTestDetails.getProfileTests() != null) {
            labTest.setProfileTests(labTestDetails.getProfileTests());
        }
        if (labTestDetails.getDepartment() != null) {
            labTest.setDepartment(labTestDetails.getDepartment());
        }
        if (labTestDetails.getMethod() != null) {
            labTest.setMethod(labTestDetails.getMethod());
        }
        if (labTestDetails.getRequiresFasting() != null) {
            labTest.setRequiresFasting(labTestDetails.getRequiresFasting());
        }
        
        return labTestRepository.save(labTest);
    }

    public void deleteLabTest(Long id) {
        LabTest labTest = getLabTestById(id);
        labTest.setIsDeleted(true);
        labTest.setIsActive(false);
        labTestRepository.save(labTest);
    }
}
