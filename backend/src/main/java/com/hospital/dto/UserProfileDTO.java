package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    @NotBlank
    private String username;

    @Email
    private String email;

    private String firstName;
    private String lastName;
    private String phoneNumber;
}
