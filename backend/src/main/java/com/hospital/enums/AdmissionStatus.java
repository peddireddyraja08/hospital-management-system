package com.hospital.enums;

public enum AdmissionStatus {
    ADMITTED,           // Patient is currently admitted
    UNDER_TREATMENT,    // Active treatment ongoing
    CRITICAL,           // Patient in critical condition
    STABLE,             // Patient stable
    READY_FOR_DISCHARGE,// Medically cleared for discharge
    DISCHARGED,         // Discharged from hospital
    TRANSFERRED,        // Transferred to another facility
    ABSCONDED,          // Left against medical advice
    DECEASED            // Patient deceased during admission
}
