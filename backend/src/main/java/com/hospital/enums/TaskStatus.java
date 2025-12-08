package com.hospital.enums;

public enum TaskStatus {
    PENDING,        // Task created, scheduled but not yet due
    DUE,            // Task has reached due time, needs attention
    IN_PROGRESS,    // Nurse has started working on the task
    COMPLETED,      // Task successfully completed
    MISSED,         // Task was not performed within required timeframe
    REFUSED,        // Patient refused the task/treatment
    DEFERRED,       // Task postponed to later time
    CANCELLED       // Task cancelled/no longer needed
}
