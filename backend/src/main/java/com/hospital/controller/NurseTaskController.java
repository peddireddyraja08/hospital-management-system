package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.NurseTask;
import com.hospital.enums.TaskPriority;
import com.hospital.service.NurseTaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/nurse-tasks")
@RequiredArgsConstructor
@Tag(name = "Nurse Tasks", description = "APIs for managing nursing tasks and task board")
public class NurseTaskController {

    private final NurseTaskService nurseTaskService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'DOCTOR')")
    @Operation(summary = "Get all active nurse tasks")
    public ResponseEntity<ApiResponse<List<NurseTask>>> getAllTasks() {
        List<NurseTask> tasks = nurseTaskService.getActiveTasks();
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'DOCTOR')")
    @Operation(summary = "Get nurse task by ID")
    public ResponseEntity<ApiResponse<NurseTask>> getTaskById(@PathVariable Long id) {
        NurseTask task = nurseTaskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    @GetMapping("/admission/{admissionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'DOCTOR')")
    @Operation(summary = "Get tasks by admission")
    public ResponseEntity<ApiResponse<List<NurseTask>>> getTasksByAdmission(@PathVariable Long admissionId) {
        List<NurseTask> tasks = nurseTaskService.getTasksByAdmission(admissionId);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/nurse/{nurseName}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Get tasks assigned to a nurse")
    public ResponseEntity<ApiResponse<List<NurseTask>>> getTasksByNurse(@PathVariable String nurseName) {
        List<NurseTask> tasks = nurseTaskService.getTasksByNurse(nurseName);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/ward/{ward}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'DOCTOR')")
    @Operation(summary = "Get tasks by ward")
    public ResponseEntity<ApiResponse<List<NurseTask>>> getTasksByWard(@PathVariable String ward) {
        List<NurseTask> tasks = nurseTaskService.getTasksByWard(ward);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/priority/{priority}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'DOCTOR')")
    @Operation(summary = "Get tasks by priority")
    public ResponseEntity<ApiResponse<List<NurseTask>>> getTasksByPriority(@PathVariable TaskPriority priority) {
        List<NurseTask> tasks = nurseTaskService.getTasksByPriority(priority);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/type/{taskType}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'DOCTOR')")
    @Operation(summary = "Get tasks by type")
    public ResponseEntity<ApiResponse<List<NurseTask>>> getTasksByType(@PathVariable String taskType) {
        List<NurseTask> tasks = nurseTaskService.getTasksByType(taskType);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/due")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Get due tasks")
    public ResponseEntity<ApiResponse<List<NurseTask>>> getDueTasks() {
        List<NurseTask> tasks = nurseTaskService.getDueTasks();
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Get overdue tasks")
    public ResponseEntity<ApiResponse<List<NurseTask>>> getOverdueTasks() {
        List<NurseTask> tasks = nurseTaskService.getOverdueTasks();
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/task-board")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Get tasks organized for task board view")
    public ResponseEntity<ApiResponse<Map<String, List<NurseTask>>>> getTaskBoard(
            @RequestParam(required = false) String ward,
            @RequestParam(required = false) String nurse) {
        Map<String, List<NurseTask>> boardTasks = nurseTaskService.getTasksForBoard(ward, nurse);
        return ResponseEntity.ok(ApiResponse.success(boardTasks));
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'DOCTOR')")
    @Operation(summary = "Get task board statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTaskStatistics() {
        Map<String, Object> statistics = nurseTaskService.getTaskBoardStatistics();
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE', 'DOCTOR')")
    @Operation(summary = "Create a new nurse task")
    public ResponseEntity<ApiResponse<NurseTask>> createTask(@RequestBody NurseTask task) {
        NurseTask createdTask = nurseTaskService.createTask(task);
        return ResponseEntity.ok(ApiResponse.success("Task created successfully", createdTask));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Update a nurse task")
    public ResponseEntity<ApiResponse<NurseTask>> updateTask(
            @PathVariable Long id,
            @RequestBody NurseTask taskDetails) {
        NurseTask updatedTask = nurseTaskService.updateTask(id, taskDetails);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updatedTask));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Mark task as completed")
    public ResponseEntity<ApiResponse<NurseTask>> completeTask(
            @PathVariable Long id,
            @RequestParam String completedBy,
            @RequestParam(required = false) String notes) {
        NurseTask completedTask = nurseTaskService.markTaskCompleted(id, completedBy, notes);
        
        // Generate next task if recurring
        if (completedTask.shouldGenerateNext()) {
            nurseTaskService.generateNextRecurringTask(completedTask);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Task marked as completed", completedTask));
    }

    @PutMapping("/{id}/defer")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Defer/postpone a task")
    public ResponseEntity<ApiResponse<NurseTask>> deferTask(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newDueDate,
            @RequestParam String reason) {
        // Update the task with new due date
        NurseTask task = nurseTaskService.getTaskById(id);
        task.setDueTime(newDueDate);
        task.setNotes((task.getNotes() != null ? task.getNotes() + "\n" : "") + 
                      "Deferred: " + reason + " - New due: " + newDueDate);
        NurseTask deferredTask = nurseTaskService.updateTask(id, task);
        return ResponseEntity.ok(ApiResponse.success("Task deferred successfully", deferredTask));
    }

    @PutMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Start working on a task (move to IN_PROGRESS)")
    public ResponseEntity<ApiResponse<NurseTask>> startTask(@PathVariable Long id) {
        NurseTask task = nurseTaskService.getTaskById(id);
        task.startTask();
        NurseTask updatedTask = nurseTaskService.updateTask(id, task);
        return ResponseEntity.ok(ApiResponse.success("Task started", updatedTask));
    }

    @PutMapping("/{id}/missed")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Mark task as missed")
    public ResponseEntity<ApiResponse<NurseTask>> markTaskMissed(
            @PathVariable Long id,
            @RequestParam String missedBy,
            @RequestParam String reason) {
        NurseTask task = nurseTaskService.getTaskById(id);
        task.markMissed(missedBy, reason);
        NurseTask updatedTask = nurseTaskService.updateTask(id, task);
        
        // Generate next task if recurring
        if (task.shouldGenerateNext()) {
            nurseTaskService.generateNextRecurringTask(task);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Task marked as missed", updatedTask));
    }

    @PutMapping("/{id}/refused")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Mark task as refused by patient")
    public ResponseEntity<ApiResponse<NurseTask>> markTaskRefused(
            @PathVariable Long id,
            @RequestParam String reason) {
        NurseTask task = nurseTaskService.getTaskById(id);
        task.markRefused(reason);
        NurseTask updatedTask = nurseTaskService.updateTask(id, task);
        return ResponseEntity.ok(ApiResponse.success("Task marked as refused", updatedTask));
    }

    @PutMapping("/{id}/skip")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Skip/cancel a task")
    public ResponseEntity<ApiResponse<NurseTask>> skipTask(
            @PathVariable Long id,
            @RequestParam String skippedBy,
            @RequestParam String reason) {
        NurseTask skippedTask = nurseTaskService.skipTask(id, skippedBy, reason);
        return ResponseEntity.ok(ApiResponse.success("Task cancelled", skippedTask));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a nurse task")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        nurseTaskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }

    @PostMapping("/update-statuses")
    @PreAuthorize("hasAnyRole('ADMIN', 'NURSE')")
    @Operation(summary = "Update task statuses based on time")
    public ResponseEntity<ApiResponse<Void>> updateTaskStatuses() {
        nurseTaskService.updateTaskStatuses();
        return ResponseEntity.ok(ApiResponse.success("Task statuses updated", null));
    }
}
