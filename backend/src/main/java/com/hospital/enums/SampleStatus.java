package com.hospital.enums;

public enum SampleStatus {
    COLLECTED,       // Sample collected from patient
    RECEIVED,        // Sample received in lab
    PROCESSING,      // Sample being processed/tested
    STORED,          // Sample stored for future reference
    DISPOSED,        // Sample disposed after retention period
    REJECTED,        // Sample rejected due to quality issues
    INSUFFICIENT     // Insufficient sample quantity
}
