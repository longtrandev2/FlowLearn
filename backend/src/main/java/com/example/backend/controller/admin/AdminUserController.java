package com.example.backend.controller.admin;

import com.example.backend.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    @GetMapping
    @PreAuthorize("hasAnyRole('MODERATOR', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<String>>> getAllUsers() {
        // Mock method to prove RBAC role checking works
        return ResponseEntity.ok(ApiResponse.success(List.of("user1", "user2", "user3")));
    }
    
    @GetMapping("/super")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> superAdminOnly() {
        return ResponseEntity.ok(ApiResponse.success("Only SUPER_ADMIN can see this"));
    }
}