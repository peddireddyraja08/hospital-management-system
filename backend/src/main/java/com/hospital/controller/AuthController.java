package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.dto.AuthResponse;
import com.hospital.dto.LoginRequest;
import com.hospital.dto.RegisterRequest;
import com.hospital.service.AuthService;
import com.hospital.repository.UserRepository;
import com.hospital.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import com.hospital.dto.ChangePasswordRequest;
import com.hospital.dto.UserProfileDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "APIs for user authentication and registration")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    @Operation(summary = "User login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "User registration")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestParam String refreshToken) {
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfileDTO dto = new UserProfileDTO(user.getUsername(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getPhoneNumber());
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateProfile(Authentication authentication, @Valid @RequestBody UserProfileDTO profile) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (profile.getEmail() != null && !profile.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(profile.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("Email already in use"));
            }
            user.setEmail(profile.getEmail());
        }

        if (profile.getFirstName() != null) user.setFirstName(profile.getFirstName());
        if (profile.getLastName() != null) user.setLastName(profile.getLastName());
        if (profile.getPhoneNumber() != null) user.setPhoneNumber(profile.getPhoneNumber());

        userRepository.save(user);

        UserProfileDTO dto = new UserProfileDTO(user.getUsername(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getPhoneNumber());
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", dto));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest req) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("Current password is incorrect"));
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }
}
