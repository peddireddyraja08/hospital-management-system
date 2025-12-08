package com.hospital.entity;

import com.hospital.enums.TaskPriority;
import com.hospital.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "nurse_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NurseTask extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_id", nullable = false)
    private Admission admission;

    @Column(nullable = false, length = 100)
    private String taskType;  // MEDICATION, VITALS, PROCEDURE, ASSESSMENT, HYGIENE, FEEDING, etc.

    @Column(nullable = false, length = 200)
    private String taskDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TaskPriority priority = TaskPriority.ROUTINE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TaskStatus status = TaskStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime scheduledTime;

    @Column
    private LocalDateTime dueTime;

    @Column
    private LocalDateTime completedTime;

    @Column(length = 100)
    private String assignedToNurse;

    @Column(length = 100)
    private String completedBy;

    @Column(length = 500)
    private String notes;

    @Column(length = 500)
    private String completionNotes;

    // For medication tasks
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    // For vital sign tasks
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vital_sign_id")
    private VitalSign recordedVitalSign;

    // For procedure tasks
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "physician_order_id")
    private PhysicianOrder relatedOrder;

    @Column
    private Boolean isRecurring = false;

    @Column(length = 50)
    private String recurrencePattern;  // DAILY, EVERY_4H, EVERY_6H, etc.

    @Column
    private LocalDateTime nextScheduledTime;

    @Column(length = 100)
    private String skipReason;

    @Column
    private LocalDateTime skippedAt;

    @Column(length = 100)
    private String skippedBy;

    @Column(length = 500)
    private String refusedReason;  // Reason why patient refused

    @Column
    private LocalDateTime refusedAt;

    @Column(length = 100)
    private String missedBy;  // Who documented the missed task

    @Column(length = 500)
    private String missedReason;  // Reason task was missed

    @Column
    private LocalDateTime missedAt;

    @Column
    private LocalDateTime startedAt;  // When task moved to IN_PROGRESS

    @Column
    private Boolean requiresDocumentation = false;

    @Column
    private Boolean isUrgent = false;

    // Calculated fields
    @Transient
    public Boolean isOverdue() {
        if (status == TaskStatus.COMPLETED || status == TaskStatus.MISSED || 
            status == TaskStatus.REFUSED || status == TaskStatus.CANCELLED) {
            return false;
        }
        LocalDateTime compareTime = dueTime != null ? dueTime : scheduledTime;
        return compareTime != null && LocalDateTime.now().isAfter(compareTime);
    }

    @Transient
    public Integer getMinutesOverdue() {
        if (!isOverdue()) return 0;
        LocalDateTime compareTime = dueTime != null ? dueTime : scheduledTime;
        return (int) java.time.Duration.between(compareTime, LocalDateTime.now()).toMinutes();
    }

    @Transient
    public Boolean isDue() {
        if (status != TaskStatus.PENDING) return false;
        LocalDateTime compareTime = dueTime != null ? dueTime : scheduledTime;
        return compareTime != null && LocalDateTime.now().isAfter(compareTime);
    }

    // Status transition methods
    public void markDue() {
        if (this.status == TaskStatus.PENDING) {
            this.status = TaskStatus.DUE;
        }
    }

    public void startTask() {
        if (this.status == TaskStatus.PENDING || this.status == TaskStatus.DUE) {
            this.status = TaskStatus.IN_PROGRESS;
            this.startedAt = LocalDateTime.now();
        }
    }

    public void markCompleted(String completedBy, String notes) {
        // Allow completion from PENDING, DUE, or IN_PROGRESS
        if (this.status == TaskStatus.PENDING || this.status == TaskStatus.DUE || this.status == TaskStatus.IN_PROGRESS) {
            this.status = TaskStatus.COMPLETED;
            this.completedTime = LocalDateTime.now();
            this.completedBy = completedBy;
            this.completionNotes = notes;
        }
    }

    public void markMissed(String missedBy, String reason) {
        this.status = TaskStatus.MISSED;
        this.missedAt = LocalDateTime.now();
        this.missedBy = missedBy;
        this.missedReason = reason;
    }

    public void markRefused(String refusedReason) {
        if (this.status == TaskStatus.IN_PROGRESS || this.status == TaskStatus.DUE) {
            this.status = TaskStatus.REFUSED;
            this.refusedAt = LocalDateTime.now();
            this.refusedReason = refusedReason;
        }
    }

    public void defer(LocalDateTime newDueTime, String reason) {
        this.status = TaskStatus.DEFERRED;
        this.dueTime = newDueTime;
        this.notes = (this.notes != null ? this.notes + "\n" : "") + 
                     "Deferred: " + reason + " at " + LocalDateTime.now();
    }

    public void cancel(String reason) {
        this.status = TaskStatus.CANCELLED;
        this.skipReason = reason;
        this.skippedAt = LocalDateTime.now();
    }

    public void skip(String skippedBy, String reason) {
        this.status = TaskStatus.CANCELLED;
        this.skippedAt = LocalDateTime.now();
        this.skippedBy = skippedBy;
        this.skipReason = reason;
    }

    // Check if task should generate next occurrence
    public Boolean shouldGenerateNext() {
        return this.isRecurring && 
               (this.status == TaskStatus.COMPLETED || this.status == TaskStatus.MISSED);
    }
}
