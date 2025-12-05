package com.hospital.enums;

public enum AlertStatus {
    ACTIVE,           // Alert is active and requires attention
    ACKNOWLEDGED,     // Alert has been acknowledged by staff
    RESOLVED,         // Issue resolved, alert closed
    ESCALATED,        // Alert escalated to higher authority
    CANCELLED         // Alert cancelled (false positive)
}
