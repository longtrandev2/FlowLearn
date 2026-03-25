package com.example.backend.controller.admin;

import com.example.backend.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Admin Users", description = "Operations for admin user management.")
@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    @Operation(summary = "Get all users (Admin)", description = "Requires MODERATOR or SUPER_ADMIN role.")
    @GetMapping
    @PreAuthorize("hasAnyRole('MODERATOR', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<String>>> getAllUsers() {
        // Mock method to prove RBAC role checking works
        return ResponseEntity.ok(ApiResponse.success(List.of("user1", "user2", "user3")));
    }
    
    @Operation(summary = "Super Admin Only", description = "Requires SUPER_ADMIN role.")
    @GetMapping("/super")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<String>> superAdminOnly() {
        return ResponseEntity.ok(ApiResponse.success("Only SUPER_ADMIN can see this"));
    }
}