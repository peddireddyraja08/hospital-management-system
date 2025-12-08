package com.hospital.enums;

public enum DischargeType {
    REGULAR,                    // Normal discharge
    DISCHARGE_AGAINST_ADVICE,   // Left against medical advice (LAMA)
    TRANSFER_TO_FACILITY,       // Transferred to another facility
    DECEASED,                   // Patient deceased
    ABSCONDED,                  // Left without permission
    REFER_TO_HIGHER_CENTER      // Referred to specialized center
}
