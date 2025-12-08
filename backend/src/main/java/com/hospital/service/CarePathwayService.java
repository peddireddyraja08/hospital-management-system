package com.hospital.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.entity.Admission;
import com.hospital.entity.CarePathway;
import com.hospital.entity.NurseTask;
import com.hospital.enums.TaskPriority;
import com.hospital.enums.TaskStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AdmissionRepository;
import com.hospital.repository.CarePathwayRepository;
import com.hospital.repository.NurseTaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CarePathwayService {

    private final CarePathwayRepository carePathwayRepository;
    private final AdmissionRepository admissionRepository;
    private final NurseTaskRepository nurseTaskRepository;
    private final ObjectMapper objectMapper;

    public CarePathway createCarePathway(CarePathway carePathway) {
        if (carePathway.getIsActive() == null) {
            carePathway.setIsActive(true);
        }
        if (carePathway.getVersionNumber() == null) {
            carePathway.setVersionNumber(1);
        }
        if (carePathway.getUsageCount() == null) {
            carePathway.setUsageCount(0);
        }

        log.info("Creating care pathway: {}", carePathway.getName());
        return carePathwayRepository.save(carePathway);
    }

    public CarePathway getCarePathwayById(Long id) {
        return carePathwayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CarePathway", "id", id));
    }

    public CarePathway getCarePathwayByName(String name) {
        return carePathwayRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("CarePathway", "name", name));
    }

    public List<CarePathway> getAllCarePathways() {
        return carePathwayRepository.findAll();
    }

    public List<CarePathway> getActiveCarePathways() {
        return carePathwayRepository.findByIsActive(true);
    }

    public List<CarePathway> getCarePathwaysBySpecialty(String specialty) {
        return carePathwayRepository.findActivePathwaysBySpecialty(specialty);
    }

    public List<CarePathway> getCarePathwaysByDiagnosis(String diagnosis) {
        return carePathwayRepository.findByDiagnosis(diagnosis);
    }

    public List<CarePathway> getMostUsedPathways() {
        return carePathwayRepository.findMostUsedPathways();
    }

    public CarePathway updateCarePathway(Long id, CarePathway pathwayDetails) {
        CarePathway pathway = getCarePathwayById(id);

        if (pathwayDetails.getName() != null) {
            pathway.setName(pathwayDetails.getName());
        }
        if (pathwayDetails.getDiagnosis() != null) {
            pathway.setDiagnosis(pathwayDetails.getDiagnosis());
        }
        if (pathwayDetails.getSpecialty() != null) {
            pathway.setSpecialty(pathwayDetails.getSpecialty());
        }
        if (pathwayDetails.getDescription() != null) {
            pathway.setDescription(pathwayDetails.getDescription());
        }
        if (pathwayDetails.getEstimatedLOS() != null) {
            pathway.setEstimatedLOS(pathwayDetails.getEstimatedLOS());
        }
        if (pathwayDetails.getTaskTemplates() != null) {
            pathway.setTaskTemplates(pathwayDetails.getTaskTemplates());
        }
        if (pathwayDetails.getMilestones() != null) {
            pathway.setMilestones(pathwayDetails.getMilestones());
        }
        if (pathwayDetails.getVitalSignSchedule() != null) {
            pathway.setVitalSignSchedule(pathwayDetails.getVitalSignSchedule());
        }
        if (pathwayDetails.getMedicationGuidelines() != null) {
            pathway.setMedicationGuidelines(pathwayDetails.getMedicationGuidelines());
        }
        if (pathwayDetails.getLabTestSchedule() != null) {
            pathway.setLabTestSchedule(pathwayDetails.getLabTestSchedule());
        }
        if (pathwayDetails.getIsActive() != null) {
            pathway.setIsActive(pathwayDetails.getIsActive());
        }

        log.info("Updating care pathway: {}", pathway.getName());
        return carePathwayRepository.save(pathway);
    }

    /**
     * Auto-generate nursing tasks based on care pathway template
     */
    @SuppressWarnings("unchecked")
    public List<NurseTask> generateTasksForAdmission(Long admissionId) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Admission", "id", admissionId));

        if (admission.getCarePathway() == null) {
            log.warn("No care pathway assigned to admission {}", admission.getAdmissionNumber());
            return new ArrayList<>();
        }

        CarePathway pathway = admission.getCarePathway();
        String taskTemplatesJson = pathway.getTaskTemplates();

        if (taskTemplatesJson == null || taskTemplatesJson.isEmpty()) {
            log.warn("No task templates defined for care pathway {}", pathway.getName());
            return new ArrayList<>();
        }

        List<NurseTask> generatedTasks = new ArrayList<>();

        try {
            // Parse task templates JSON
            List<Map<String, Object>> taskTemplates = objectMapper.readValue(taskTemplatesJson, List.class);

            for (Map<String, Object> template : taskTemplates) {
                String taskType = (String) template.get("taskType");
                String description = (String) template.get("description");
                Integer hoursAfterAdmission = (Integer) template.get("hoursAfterAdmission");
                String priorityStr = (String) template.get("priority");
                Boolean isRecurring = (Boolean) template.getOrDefault("isRecurring", false);
                String recurrencePattern = (String) template.get("recurrencePattern");

                // Calculate scheduled time
                LocalDateTime scheduledTime = admission.getAdmissionDate().plusHours(hoursAfterAdmission != null ? hoursAfterAdmission : 0);

                // Create task
                NurseTask task = NurseTask.builder()
                        .admission(admission)
                        .taskType(taskType)
                        .taskDescription(description)
                        .priority(parsePriority(priorityStr))
                        .status(TaskStatus.PENDING)
                        .scheduledTime(scheduledTime)
                        .dueTime(scheduledTime.plusMinutes(30)) // 30 min window
                        .isRecurring(isRecurring)
                        .recurrencePattern(recurrencePattern)
                        .requiresDocumentation(true)
                        .build();

                generatedTasks.add(task);
            }

            // Save all generated tasks
            generatedTasks = nurseTaskRepository.saveAll(generatedTasks);
            log.info("Generated {} tasks for admission {} from pathway {}", 
                    generatedTasks.size(), admission.getAdmissionNumber(), pathway.getName());

        } catch (JsonProcessingException e) {
            log.error("Error parsing task templates JSON for pathway {}: {}", pathway.getName(), e.getMessage());
        }

        return generatedTasks;
    }

    /**
     * Generate recurring tasks (vitals, medications) for next period
     */
    public List<NurseTask> generateRecurringTasks(Long admissionId) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Admission", "id", admissionId));

        List<NurseTask> completedRecurringTasks = nurseTaskRepository.findByAdmissionId(admissionId).stream()
                .filter(t -> t.getIsRecurring() && t.getStatus() == TaskStatus.COMPLETED)
                .filter(t -> t.getNextScheduledTime() != null)
                .toList();

        List<NurseTask> newTasks = new ArrayList<>();

        for (NurseTask completedTask : completedRecurringTasks) {
            LocalDateTime nextTime = completedTask.getNextScheduledTime();

            // Only generate if next time is in future and not already generated
            if (nextTime.isAfter(LocalDateTime.now().minusHours(1))) {
                boolean alreadyGenerated = nurseTaskRepository.findByAdmissionId(admissionId).stream()
                        .anyMatch(t -> t.getTaskType().equals(completedTask.getTaskType()) && 
                                      t.getScheduledTime().equals(nextTime));

                if (!alreadyGenerated) {
                    NurseTask newTask = NurseTask.builder()
                            .admission(admission)
                            .taskType(completedTask.getTaskType())
                            .taskDescription(completedTask.getTaskDescription())
                            .priority(completedTask.getPriority())
                            .status(TaskStatus.PENDING)
                            .scheduledTime(nextTime)
                            .dueTime(nextTime.plusMinutes(30))
                            .isRecurring(true)
                            .recurrencePattern(completedTask.getRecurrencePattern())
                            .requiresDocumentation(completedTask.getRequiresDocumentation())
                            .build();

                    // Calculate next occurrence based on pattern
                    LocalDateTime nextOccurrence = calculateNextOccurrence(nextTime, completedTask.getRecurrencePattern());
                    newTask.setNextScheduledTime(nextOccurrence);

                    newTasks.add(newTask);
                }
            }
        }

        if (!newTasks.isEmpty()) {
            newTasks = nurseTaskRepository.saveAll(newTasks);
            log.info("Generated {} recurring tasks for admission {}", newTasks.size(), admission.getAdmissionNumber());
        }

        return newTasks;
    }

    private TaskPriority parsePriority(String priorityStr) {
        if (priorityStr == null) return TaskPriority.ROUTINE;
        try {
            return TaskPriority.valueOf(priorityStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return TaskPriority.ROUTINE;
        }
    }

    private LocalDateTime calculateNextOccurrence(LocalDateTime currentTime, String pattern) {
        if (pattern == null) return currentTime.plusHours(24);

        return switch (pattern.toUpperCase()) {
            case "EVERY_1H", "HOURLY" -> currentTime.plusHours(1);
            case "EVERY_2H" -> currentTime.plusHours(2);
            case "EVERY_4H" -> currentTime.plusHours(4);
            case "EVERY_6H" -> currentTime.plusHours(6);
            case "EVERY_8H" -> currentTime.plusHours(8);
            case "EVERY_12H" -> currentTime.plusHours(12);
            case "DAILY" -> currentTime.plusDays(1);
            case "BID" -> currentTime.plusHours(12); // Twice daily
            case "TID" -> currentTime.plusHours(8);  // Three times daily
            case "QID" -> currentTime.plusHours(6);  // Four times daily
            default -> currentTime.plusHours(24);
        };
    }
}
