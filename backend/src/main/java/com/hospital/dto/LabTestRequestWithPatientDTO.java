package com.hospital.dto;

import com.hospital.enums.BloodGroup;
import com.hospital.enums.Gender;
import com.hospital.enums.TestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabTestRequestWithPatientDTO {
    
    // Patient Information
    private Long existingPatientId; // If patient already exists
    
    // New Patient Registration (for walk-in lab patients)
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private BloodGroup bloodGroup;
    private String phoneNumber;
    private String email;
    private String address;
    private String emergencyContactName;
    private String emergencyContactNumber;
    
    // Lab Test Request Information
    @NotNull(message = "Lab test ID is required")
    private Long labTestId;
    
    private Long doctorId; // Optional - may be null for walk-in patients
    
    private TestStatus status = TestStatus.REQUESTED;
    
    private String priority = "ROUTINE"; // STAT, URGENT, ROUTINE
    
    private String clinicalNotes;
    
    private LocalDateTime requestedDate = LocalDateTime.now();
    
    private Boolean requiresFasting = false;
    
    private String specialInstructions;
}
