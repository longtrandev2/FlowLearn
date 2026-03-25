package com.example.backend.controller;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.CurrentUserResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Authentication", description = "Operations for user registration, login, and current user info.")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Register a new user", description = "Register a new user account returning a JWT token.")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(authService.register(request));
    }

    @Operation(summary = "User login", description = "Login as a normal user to get a JWT token.")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Admin login", description = "Login as an admin user to get a JWT token.")
    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> adminLogin(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.adminLogin(request));
    }

    @Operation(summary = "Get current user", description = "Retrieve details about the currently authenticated user.")
    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> me(@Parameter(hidden = true) Authentication authentication) {
        final String email = authentication.getName();
        return ResponseEntity.ok(authService.getCurrentUser(email));
    }
}
