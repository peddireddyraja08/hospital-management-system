package com.hospital.service;

import com.hospital.entity.QCMaterial;
import com.hospital.enums.QCLevel;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.QCMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class QCMaterialService {

    private final QCMaterialRepository qcMaterialRepository;

    public List<QCMaterial> getAllMaterials() {
        return qcMaterialRepository.findAllActive();
    }

    public QCMaterial getMaterialById(Long id) {
        return qcMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("QC Material", "id", id));
    }

    public List<QCMaterial> getMaterialsByLabTest(Long labTestId) {
        return qcMaterialRepository.findByLabTestId(labTestId);
    }

    public List<QCMaterial> getMaterialsByLevel(QCLevel level) {
        return qcMaterialRepository.findByLevel(level);
    }

    public List<QCMaterial> getExpiredMaterials() {
        return qcMaterialRepository.findExpiredMaterials(LocalDate.now());
    }

    public List<QCMaterial> getMaterialsExpiringSoon(int days) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(days);
        return qcMaterialRepository.findMaterialsExpiringBetween(today, futureDate);
    }

    public QCMaterial createMaterial(QCMaterial material) {
        material.setIsActive(true);
        material.setIsDeleted(false);
        return qcMaterialRepository.save(material);
    }

    public QCMaterial updateMaterial(Long id, QCMaterial materialDetails) {
        QCMaterial material = getMaterialById(id);
        
        if (materialDetails.getLabTest() != null) {
            material.setLabTest(materialDetails.getLabTest());
        }
        if (materialDetails.getMaterialName() != null) {
            material.setMaterialName(materialDetails.getMaterialName());
        }
        if (materialDetails.getLotNumber() != null) {
            material.setLotNumber(materialDetails.getLotNumber());
        }
        if (materialDetails.getLevel() != null) {
            material.setLevel(materialDetails.getLevel());
        }
        if (materialDetails.getManufacturer() != null) {
            material.setManufacturer(materialDetails.getManufacturer());
        }
        if (materialDetails.getExpiryDate() != null) {
            material.setExpiryDate(materialDetails.getExpiryDate());
        }
        if (materialDetails.getTargetValue() != null) {
            material.setTargetValue(materialDetails.getTargetValue());
        }
        if (materialDetails.getMeanValue() != null) {
            material.setMeanValue(materialDetails.getMeanValue());
        }
        if (materialDetails.getStdDeviation() != null) {
            material.setStdDeviation(materialDetails.getStdDeviation());
        }
        if (materialDetails.getUnit() != null) {
            material.setUnit(materialDetails.getUnit());
        }
        if (materialDetails.getDescription() != null) {
            material.setDescription(materialDetails.getDescription());
        }
        if (materialDetails.getStorageConditions() != null) {
            material.setStorageConditions(materialDetails.getStorageConditions());
        }
        if (materialDetails.getPreparationInstructions() != null) {
            material.setPreparationInstructions(materialDetails.getPreparationInstructions());
        }
        
        return qcMaterialRepository.save(material);
    }

    public void deleteMaterial(Long id) {
        QCMaterial material = getMaterialById(id);
        material.setIsDeleted(true);
        material.setIsActive(false);
        qcMaterialRepository.save(material);
    }

    public List<QCMaterial> getMaterialsByLabTestAndLevel(Long labTestId, QCLevel level) {
        return qcMaterialRepository.findByLabTestAndLevel(labTestId, level);
    }
}
