package com.hospital.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.entity.Admission;
import com.hospital.entity.ClinicalScore;
import com.hospital.entity.VitalSign;
import com.hospital.enums.ClinicalScoreType;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AdmissionRepository;
import com.hospital.repository.ClinicalScoreRepository;
import com.hospital.repository.VitalSignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ClinicalScoringService {

    private final ClinicalScoreRepository clinicalScoreRepository;
    private final AdmissionRepository admissionRepository;
    private final VitalSignRepository vitalSignRepository;
    private final ObjectMapper objectMapper;

    /**
     * Calculate National Early Warning Score (NEWS)
     * Used for adult patients to detect clinical deterioration
     */
    public ClinicalScore calculateNEWS(Long admissionId, VitalSign vitalSign, String recordedBy) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Admission", "id", admissionId));

        // Extract vital sign values
        Integer respiratoryRate = vitalSign.getRespiratoryRate();
        Double oxygenSaturationDouble = vitalSign.getOxygenSaturation();
        Integer oxygenSaturation = oxygenSaturationDouble != null ? oxygenSaturationDouble.intValue() : null;
        Double temperature = vitalSign.getTemperature();
        Integer systolicBP = vitalSign.getBloodPressureSystolic();
        Integer heartRate = vitalSign.getHeartRate();
        String consciousness = vitalSign.getConsciousnessLevel(); // ALERT, CVPU

        // Calculate individual component scores
        int respRateScore = scoreRespiratoryRate(respiratoryRate);
        int o2SatScore = scoreOxygenSaturation(oxygenSaturation);
        int o2SupplementScore = vitalSign.getIsOnOxygen() != null && vitalSign.getIsOnOxygen() ? 2 : 0;
        int tempScore = scoreTemperature(temperature);
        int bpScore = scoreSystolicBP(systolicBP);
        int hrScore = scoreHeartRate(heartRate);
        int consciousnessScore = scoreConsciousness(consciousness);

        // Calculate total NEWS
        int totalScore = respRateScore + o2SatScore + o2SupplementScore + 
                        tempScore + bpScore + hrScore + consciousnessScore;

        // Determine risk level
        String riskLevel = determineNEWSRiskLevel(totalScore, respRateScore, o2SatScore, tempScore, 
                                                   bpScore, hrScore, consciousnessScore);

        // Determine recommended action
        String recommendedAction = getRecommendedAction(totalScore, riskLevel);

        // Create vital signs map
        Map<String, Object> vitalSignsMap = new HashMap<>();
        vitalSignsMap.put("respiratoryRate", respiratoryRate);
        vitalSignsMap.put("oxygenSaturation", oxygenSaturation);
        vitalSignsMap.put("isOnOxygen", vitalSign.getIsOnOxygen());
        vitalSignsMap.put("temperature", temperature);
        vitalSignsMap.put("systolicBP", systolicBP);
        vitalSignsMap.put("heartRate", heartRate);
        vitalSignsMap.put("consciousness", consciousness);

        String vitalSignsJson = null;
        try {
            vitalSignsJson = objectMapper.writeValueAsString(vitalSignsMap);
        } catch (JsonProcessingException e) {
            log.error("Error serializing vital signs: {}", e.getMessage());
        }

        // Create clinical score
        ClinicalScore clinicalScore = ClinicalScore.builder()
                .admission(admission)
                .scoreType(ClinicalScoreType.NEWS)
                .calculatedScore(totalScore)
                .riskLevel(riskLevel)
                .recordedAt(LocalDateTime.now())
                .recordedBy(recordedBy)
                .vitalSignValues(vitalSignsJson)
                .interpretation(String.format("NEWS Score: %d - %s Risk", totalScore, riskLevel))
                .recommendedAction(recommendedAction)
                .respiratoryRateScore(respRateScore)
                .oxygenSaturationScore(o2SatScore)
                .supplementalOxygenScore(o2SupplementScore)
                .temperatureScore(tempScore)
                .systolicBPScore(bpScore)
                .heartRateScore(hrScore)
                .consciousnessScore(consciousnessScore)
                .relatedVitalSign(vitalSign)
                .build();

        // Trigger alert for high/critical risk
        if ("HIGH".equals(riskLevel) || "CRITICAL".equals(riskLevel)) {
            clinicalScore.setAlertTriggered(true);
            clinicalScore.setAlertTriggeredAt(LocalDateTime.now());
        }

        clinicalScore = clinicalScoreRepository.save(clinicalScore);
        log.info("Calculated NEWS score {} for admission {}: {} Risk", 
                totalScore, admission.getAdmissionNumber(), riskLevel);

        return clinicalScore;
    }

    /**
     * Calculate Modified Early Warning Score (MEWS)
     */
    public ClinicalScore calculateMEWS(Long admissionId, VitalSign vitalSign, String recordedBy) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Admission", "id", admissionId));

        // Extract vital sign values
        Integer respiratoryRate = vitalSign.getRespiratoryRate();
        Integer heartRate = vitalSign.getHeartRate();
        Integer systolicBP = vitalSign.getBloodPressureSystolic();
        Double temperature = vitalSign.getTemperature();
        String consciousness = vitalSign.getConsciousnessLevel();

        // Calculate MEWS component scores
        int respRateScore = scoreMEWSRespiratoryRate(respiratoryRate);
        int hrScore = scoreMEWSHeartRate(heartRate);
        int bpScore = scoreMEWSSystolicBP(systolicBP);
        int tempScore = scoreMEWSTemperature(temperature);
        int consciousnessScore = scoreMEWSConsciousness(consciousness);

        int totalScore = respRateScore + hrScore + bpScore + tempScore + consciousnessScore;

        // Determine risk level for MEWS
        String riskLevel;
        if (totalScore >= 5) {
            riskLevel = "CRITICAL";
        } else if (totalScore >= 4) {
            riskLevel = "HIGH";
        } else if (totalScore >= 3) {
            riskLevel = "MEDIUM";
        } else {
            riskLevel = "LOW";
        }

        String recommendedAction = getMEWSRecommendedAction(totalScore);

        // Create vital signs map
        Map<String, Object> vitalSignsMap = Map.of(
                "respiratoryRate", respiratoryRate,
                "heartRate", heartRate,
                "systolicBP", systolicBP,
                "temperature", temperature,
                "consciousness", consciousness
        );

        String vitalSignsJson = null;
        try {
            vitalSignsJson = objectMapper.writeValueAsString(vitalSignsMap);
        } catch (JsonProcessingException e) {
            log.error("Error serializing vital signs: {}", e.getMessage());
        }

        ClinicalScore clinicalScore = ClinicalScore.builder()
                .admission(admission)
                .scoreType(ClinicalScoreType.MEWS)
                .calculatedScore(totalScore)
                .riskLevel(riskLevel)
                .recordedAt(LocalDateTime.now())
                .recordedBy(recordedBy)
                .vitalSignValues(vitalSignsJson)
                .interpretation(String.format("MEWS Score: %d - %s Risk", totalScore, riskLevel))
                .recommendedAction(recommendedAction)
                .respiratoryRateScore(respRateScore)
                .heartRateScore(hrScore)
                .systolicBPScore(bpScore)
                .temperatureScore(tempScore)
                .consciousnessScore(consciousnessScore)
                .relatedVitalSign(vitalSign)
                .build();

        if ("HIGH".equals(riskLevel) || "CRITICAL".equals(riskLevel)) {
            clinicalScore.setAlertTriggered(true);
            clinicalScore.setAlertTriggeredAt(LocalDateTime.now());
        }

        clinicalScore = clinicalScoreRepository.save(clinicalScore);
        log.info("Calculated MEWS score {} for admission {}: {} Risk", 
                totalScore, admission.getAdmissionNumber(), riskLevel);

        return clinicalScore;
    }

    // NEWS Scoring Methods
    private int scoreRespiratoryRate(Integer rr) {
        if (rr == null) return 0;
        if (rr <= 8) return 3;
        if (rr <= 11) return 1;
        if (rr <= 20) return 0;
        if (rr <= 24) return 2;
        return 3; // ≥25
    }

    private int scoreOxygenSaturation(Integer o2Sat) {
        if (o2Sat == null) return 0;
        if (o2Sat <= 91) return 3;
        if (o2Sat <= 93) return 2;
        if (o2Sat <= 95) return 1;
        return 0; // ≥96
    }

    private int scoreTemperature(Double temp) {
        if (temp == null) return 0;
        if (temp <= 35.0) return 3;
        if (temp <= 36.0) return 1;
        if (temp <= 38.0) return 0;
        if (temp <= 39.0) return 1;
        return 2; // ≥39.1
    }

    private int scoreSystolicBP(Integer sbp) {
        if (sbp == null) return 0;
        if (sbp <= 90) return 3;
        if (sbp <= 100) return 2;
        if (sbp <= 110) return 1;
        if (sbp <= 219) return 0;
        return 3; // ≥220
    }

    private int scoreHeartRate(Integer hr) {
        if (hr == null) return 0;
        if (hr <= 40) return 3;
        if (hr <= 50) return 1;
        if (hr <= 90) return 0;
        if (hr <= 110) return 1;
        if (hr <= 130) return 2;
        return 3; // ≥131
    }

    private int scoreConsciousness(String consciousness) {
        if (consciousness == null) return 0;
        // ALERT = 0, any confusion/reduced consciousness = 3
        return consciousness.toUpperCase().contains("ALERT") ? 0 : 3;
    }

    private String determineNEWSRiskLevel(int totalScore, int... componentScores) {
        // Red score (3) in any parameter or total ≥7 = HIGH
        boolean hasRedScore = false;
        for (int score : componentScores) {
            if (score == 3) {
                hasRedScore = true;
                break;
            }
        }

        if (totalScore >= 7 || hasRedScore) {
            return "CRITICAL";
        } else if (totalScore >= 5) {
            return "HIGH";
        } else if (totalScore >= 3) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }

    private String getRecommendedAction(int newsScore, String riskLevel) {
        if ("CRITICAL".equals(riskLevel)) {
            return "URGENT: Emergency assessment by critical care team. Consider ICU admission.";
        } else if ("HIGH".equals(riskLevel)) {
            return "Alert doctor immediately. Increase monitoring frequency to hourly.";
        } else if ("MEDIUM".equals(riskLevel)) {
            return "Inform nurse in charge. Monitor vitals every 4-6 hours.";
        } else {
            return "Continue routine monitoring.";
        }
    }

    // MEWS Scoring Methods
    private int scoreMEWSRespiratoryRate(Integer rr) {
        if (rr == null) return 0;
        if (rr < 9) return 2;
        if (rr <= 14) return 0;
        if (rr <= 20) return 1;
        if (rr <= 29) return 2;
        return 3; // ≥30
    }

    private int scoreMEWSHeartRate(Integer hr) {
        if (hr == null) return 0;
        if (hr < 40) return 2;
        if (hr <= 50) return 1;
        if (hr <= 100) return 0;
        if (hr <= 110) return 1;
        if (hr <= 129) return 2;
        return 3; // ≥130
    }

    private int scoreMEWSSystolicBP(Integer sbp) {
        if (sbp == null) return 0;
        if (sbp < 70) return 3;
        if (sbp <= 80) return 2;
        if (sbp <= 100) return 1;
        if (sbp <= 199) return 0;
        return 2; // ≥200
    }

    private int scoreMEWSTemperature(Double temp) {
        if (temp == null) return 0;
        if (temp < 35.0) return 2;
        if (temp <= 38.4) return 0;
        return 2; // ≥38.5
    }

    private int scoreMEWSConsciousness(String consciousness) {
        if (consciousness == null) return 0;
        // ALERT = 0, any impairment = 3
        return consciousness.toUpperCase().contains("ALERT") ? 0 : 3;
    }

    private String getMEWSRecommendedAction(int mewsScore) {
        if (mewsScore >= 5) {
            return "URGENT: Immediate medical review. Consider ICU referral.";
        } else if (mewsScore >= 4) {
            return "Urgent medical review within 30 minutes. Increase monitoring frequency.";
        } else if (mewsScore >= 3) {
            return "Medical review within 1 hour. Monitor closely.";
        } else {
            return "Continue routine care and monitoring.";
        }
    }

    // Service methods
    public ClinicalScore getClinicalScoreById(Long id) {
        return clinicalScoreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ClinicalScore", "id", id));
    }

    public List<ClinicalScore> getClinicalScoresByAdmission(Long admissionId) {
        return clinicalScoreRepository.findByAdmissionIdOrderByRecordedAtDesc(admissionId);
    }

    public List<ClinicalScore> getUnacknowledgedHighRiskScores() {
        return clinicalScoreRepository.findUnacknowledgedHighRiskScores();
    }

    public ClinicalScore acknowledgeAlert(Long scoreId, String acknowledgedBy) {
        ClinicalScore score = getClinicalScoreById(scoreId);
        score.acknowledgeAlert(acknowledgedBy);
        log.info("Clinical score {} acknowledged by {}", scoreId, acknowledgedBy);
        return clinicalScoreRepository.save(score);
    }

    public List<ClinicalScore> getHighRiskScoresByWard(String ward) {
        return clinicalScoreRepository.findHighRiskScoresByWard(ward);
    }
}
