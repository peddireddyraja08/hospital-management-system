package com.hospital.service;

import com.hospital.entity.NurseTask;
import com.hospital.enums.TaskPriority;
import com.hospital.enums.TaskStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.NurseTaskRepository;
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
public class NurseTaskService {

    private final NurseTaskRepository nurseTaskRepository;

    public NurseTask createTask(NurseTask task) {
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.PENDING);
        }
        if (task.getPriority() == null) {
            task.setPriority(TaskPriority.ROUTINE);
        }

        log.info("Creating nurse task: {} for admission {}", task.getTaskType(), task.getAdmission().getAdmissionNumber());
        return nurseTaskRepository.save(task);
    }

    public NurseTask getTaskById(Long id) {
        return nurseTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NurseTask", "id", id));
    }

    public List<NurseTask> getTasksByAdmission(Long admissionId) {
        return nurseTaskRepository.findByAdmissionId(admissionId);
    }

    public List<NurseTask> getTasksByNurse(String nurseName) {
        return nurseTaskRepository.findActiveTasksByNurse(nurseName);
    }

    public List<NurseTask> getTasksByWard(String ward) {
        return nurseTaskRepository.findActiveTasksByWard(ward);
    }

    public List<NurseTask> getActiveTasks() {
        // Return all tasks including completed ones for the task board
        List<NurseTask> allTasks = nurseTaskRepository.findAllTasks();
        log.info("Retrieved {} total tasks for task board", allTasks.size());
        
        // Log status breakdown
        Map<TaskStatus, Long> statusCounts = allTasks.stream()
                .collect(java.util.stream.Collectors.groupingBy(NurseTask::getStatus, java.util.stream.Collectors.counting()));
        log.info("Task status breakdown: {}", statusCounts);
        
        return allTasks;
    }

    public List<NurseTask> getDueTasks() {
        return nurseTaskRepository.findDueTasks(LocalDateTime.now());
    }

    public List<NurseTask> getOverdueTasks() {
        return nurseTaskRepository.findOverdueTasks(LocalDateTime.now());
    }

    public List<NurseTask> getTasksByPriority(TaskPriority priority) {
        return nurseTaskRepository.findActiveTasksByPriority(priority);
    }

    public List<NurseTask> getTasksByType(String taskType) {
        return nurseTaskRepository.findActiveTasksByType(taskType);
    }

    public NurseTask markTaskCompleted(Long taskId, String completedBy, String notes) {
        NurseTask task = getTaskById(taskId);
        task.markCompleted(completedBy, notes);
        
        log.info("Task {} marked completed by {}", taskId, completedBy);
        return nurseTaskRepository.save(task);
    }

    public NurseTask skipTask(Long taskId, String skippedBy, String reason) {
        NurseTask task = getTaskById(taskId);
        task.skip(skippedBy, reason);
        
        log.info("Task {} skipped by {}: {}", taskId, skippedBy, reason);
        return nurseTaskRepository.save(task);
    }

    public NurseTask updateTask(Long taskId, NurseTask taskDetails) {
        NurseTask task = getTaskById(taskId);

        if (taskDetails.getTaskDescription() != null) {
            task.setTaskDescription(taskDetails.getTaskDescription());
        }
        if (taskDetails.getPriority() != null) {
            task.setPriority(taskDetails.getPriority());
        }
        if (taskDetails.getStatus() != null) {
            task.setStatus(taskDetails.getStatus());
        }
        if (taskDetails.getScheduledTime() != null) {
            task.setScheduledTime(taskDetails.getScheduledTime());
        }
        if (taskDetails.getDueTime() != null) {
            task.setDueTime(taskDetails.getDueTime());
        }
        if (taskDetails.getAssignedToNurse() != null) {
            task.setAssignedToNurse(taskDetails.getAssignedToNurse());
        }
        if (taskDetails.getNotes() != null) {
            task.setNotes(taskDetails.getNotes());
        }

        log.info("Updating task {}", taskId);
        return nurseTaskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        NurseTask task = getTaskById(taskId);
        nurseTaskRepository.delete(task);
        log.info("Deleted task {}", taskId);
    }

    // Task board statistics
    public Map<String, Object> getTaskBoardStatistics() {
        Map<String, Object> stats = new HashMap<>();

        Long totalActive = nurseTaskRepository.countActiveTasks();
        Long overdue = nurseTaskRepository.countOverdueTasks(LocalDateTime.now());
        List<Object[]> countByType = nurseTaskRepository.getTaskCountByType();

        stats.put("totalActiveTasks", totalActive);
        stats.put("overdueTasks", overdue);
        stats.put("tasksByType", countByType);
        stats.put("timestamp", LocalDateTime.now());

        return stats;
    }

    // Get tasks for task board (grouped by status)
    public Map<String, List<NurseTask>> getTasksForBoard(String ward, String nurse) {
        List<NurseTask> tasks;
        
        if (nurse != null && !nurse.isEmpty()) {
            tasks = nurseTaskRepository.findActiveTasksByNurse(nurse);
        } else if (ward != null && !ward.isEmpty()) {
            tasks = nurseTaskRepository.findActiveTasksByWard(ward);
        } else {
            tasks = nurseTaskRepository.findActiveTasks();
        }

        Map<String, List<NurseTask>> boardTasks = new HashMap<>();
        boardTasks.put("pending", tasks.stream().filter(t -> t.getStatus() == TaskStatus.PENDING).toList());
        boardTasks.put("due", tasks.stream().filter(t -> t.getStatus() == TaskStatus.DUE).toList());
        boardTasks.put("overdue", tasks.stream().filter(NurseTask::isOverdue).toList());
        boardTasks.put("inProgress", tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).toList());
        boardTasks.put("completed", tasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).toList());

        return boardTasks;
    }

    // Auto-update task status based on time
    public void updateTaskStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<NurseTask> pendingTasks = nurseTaskRepository.findByStatus(TaskStatus.PENDING);

        int updated = 0;
        for (NurseTask task : pendingTasks) {
            LocalDateTime compareTime = task.getDueTime() != null ? task.getDueTime() : task.getScheduledTime();
            
            if (compareTime != null && compareTime.isBefore(now)) {
                task.markDue();
                nurseTaskRepository.save(task);
                updated++;
            }
        }

        if (updated > 0) {
            log.info("Updated {} tasks to DUE status", updated);
        }
    }

    // Generate next occurrence for recurring tasks
    public NurseTask generateNextRecurringTask(NurseTask completedTask) {
        if (!completedTask.getIsRecurring() || completedTask.getRecurrencePattern() == null) {
            return null;
        }

        NurseTask nextTask = NurseTask.builder()
                .admission(completedTask.getAdmission())
                .taskType(completedTask.getTaskType())
                .taskDescription(completedTask.getTaskDescription())
                .priority(completedTask.getPriority())
                .status(TaskStatus.PENDING)
                .assignedToNurse(completedTask.getAssignedToNurse())
                .isRecurring(true)
                .recurrencePattern(completedTask.getRecurrencePattern())
                .prescription(completedTask.getPrescription())
                .relatedOrder(completedTask.getRelatedOrder())
                .requiresDocumentation(completedTask.getRequiresDocumentation())
                .build();

        // Calculate next scheduled time based on recurrence pattern
        LocalDateTime nextScheduledTime = calculateNextScheduledTime(
                completedTask.getScheduledTime(), 
                completedTask.getRecurrencePattern()
        );
        
        nextTask.setScheduledTime(nextScheduledTime);
        nextTask.setDueTime(nextScheduledTime.plusMinutes(30)); // 30-minute window

        log.info("Generated next recurring task for {}: scheduled at {}", 
                nextTask.getTaskType(), nextScheduledTime);
        
        return nurseTaskRepository.save(nextTask);
    }

    private LocalDateTime calculateNextScheduledTime(LocalDateTime currentTime, String pattern) {
        if (pattern == null) return currentTime.plusDays(1);
        
        return switch (pattern.toUpperCase()) {
            case "EVERY_2H", "Q2H" -> currentTime.plusHours(2);
            case "EVERY_4H", "Q4H" -> currentTime.plusHours(4);
            case "EVERY_6H", "Q6H" -> currentTime.plusHours(6);
            case "EVERY_8H", "Q8H" -> currentTime.plusHours(8);
            case "EVERY_12H", "Q12H" -> currentTime.plusHours(12);
            case "DAILY", "QD" -> currentTime.plusDays(1);
            case "BID" -> currentTime.plusHours(12); // Twice daily
            case "TID" -> currentTime.plusHours(8);  // Three times daily
            case "QID" -> currentTime.plusHours(6);  // Four times daily
            default -> currentTime.plusDays(1);
        };
    }
}
