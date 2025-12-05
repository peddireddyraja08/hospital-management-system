package com.hospital.service;

import com.hospital.entity.QCRun;
import com.hospital.enums.QCStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.QCRunRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class QCRunService {

    private final QCRunRepository qcRunRepository;

    public List<QCRun> getAllRuns() {
        return qcRunRepository.findAll();
    }

    public QCRun getRunById(Long id) {
        return qcRunRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("QC Run", "id", id));
    }

    public List<QCRun> getRunsByMaterial(Long materialId) {
        return qcRunRepository.findByQcMaterialId(materialId);
    }

    public List<QCRun> getRunsByStatus(QCStatus status) {
        return qcRunRepository.findByStatus(status);
    }

    public List<QCRun> getRunsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return qcRunRepository.findByRunDateBetween(startDate, endDate);
    }

    public List<QCRun> getRunsByMaterialAndDateRange(Long materialId, LocalDateTime startDate, LocalDateTime endDate) {
        return qcRunRepository.findByMaterialAndDateRange(materialId, startDate, endDate);
    }

    public QCRun createRun(QCRun run) {
        // Calculate Z-score
        run.calculateZScore();
        
        // Determine status
        run.determineStatus();
        
        // Set defaults
        if (run.getRunDate() == null) {
            run.setRunDate(LocalDateTime.now());
        }
        if (run.getRepeatRun() == null) {
            run.setRepeatRun(false);
        }
        
        run.setIsActive(true);
        run.setIsDeleted(false);
        
        return qcRunRepository.save(run);
    }

    public QCRun updateRun(Long id, QCRun runDetails) {
        QCRun run = getRunById(id);
        
        if (runDetails.getQcMaterial() != null) {
            run.setQcMaterial(runDetails.getQcMaterial());
        }
        if (runDetails.getRunDate() != null) {
            run.setRunDate(runDetails.getRunDate());
        }
        if (runDetails.getMeasuredValue() != null) {
            run.setMeasuredValue(runDetails.getMeasuredValue());
            // Recalculate Z-score and status
            run.calculateZScore();
            run.determineStatus();
        }
        if (runDetails.getTechnicianName() != null) {
            run.setTechnicianName(runDetails.getTechnicianName());
        }
        if (runDetails.getComments() != null) {
            run.setComments(runDetails.getComments());
        }
        if (runDetails.getShift() != null) {
            run.setShift(runDetails.getShift());
        }
        if (runDetails.getInstrumentId() != null) {
            run.setInstrumentId(runDetails.getInstrumentId());
        }
        if (runDetails.getRepeatRun() != null) {
            run.setRepeatRun(runDetails.getRepeatRun());
        }
        if (runDetails.getCorrectiveAction() != null) {
            run.setCorrectiveAction(runDetails.getCorrectiveAction());
        }
        
        return qcRunRepository.save(run);
    }

    public void deleteRun(Long id) {
        QCRun run = getRunById(id);
        run.setIsDeleted(true);
        run.setIsActive(false);
        qcRunRepository.save(run);
    }

    public Long getRunCountForMaterial(Long materialId, LocalDateTime sinceDate) {
        return qcRunRepository.countRunsSinceDate(materialId, sinceDate);
    }

    // Calculate CV (Coefficient of Variation) for a set of runs
    public BigDecimal calculateCV(List<QCRun> runs) {
        if (runs == null || runs.isEmpty()) {
            return BigDecimal.ZERO;
        }

        // Calculate mean
        BigDecimal sum = runs.stream()
                .map(QCRun::getMeasuredValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal mean = sum.divide(new BigDecimal(runs.size()), 4, RoundingMode.HALF_UP);

        // Calculate standard deviation
        BigDecimal variance = runs.stream()
                .map(run -> run.getMeasuredValue().subtract(mean).pow(2))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(new BigDecimal(runs.size()), 4, RoundingMode.HALF_UP);
        BigDecimal stdDev = BigDecimal.valueOf(Math.sqrt(variance.doubleValue()));

        // Calculate CV = (SD / Mean) * 100
        if (mean.compareTo(BigDecimal.ZERO) != 0) {
            return stdDev.divide(mean, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }
        
        return BigDecimal.ZERO;
    }
}
