package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private String username;
    private String email;

    public AuthResponse(String token, String refreshToken, String username, String email) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.username = username;
        this.email = email;
    }
}
