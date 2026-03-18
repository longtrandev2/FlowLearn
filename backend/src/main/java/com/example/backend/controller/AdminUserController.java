package com.example.backend.controller;

import com.example.backend.dto.UserDto;
import com.example.backend.dto.UpdateRoleRequest;
import com.example.backend.dto.UpdatePlanRequest;
import com.example.backend.entity.UserRole;
import com.example.backend.entity.UserStatus;
import com.example.backend.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) UserStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(adminUserService.getAllUsers(search, role, status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(adminUserService.getUserById(id));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserDto> updateRole(
            @PathVariable String id,
            @RequestBody UpdateRoleRequest request
    ) {
        return ResponseEntity.ok(adminUserService.updateRole(id, request));
    }

    @PostMapping("/{id}/warn")
    public ResponseEntity<UserDto> warnUser(@PathVariable String id) {
        return ResponseEntity.ok(adminUserService.warnUser(id));
    }

    @PostMapping("/{id}/ban")
    public ResponseEntity<UserDto> banUser(@PathVariable String id) {
        return ResponseEntity.ok(adminUserService.banUser(id));
    }

    @PostMapping("/{id}/unban")
    public ResponseEntity<UserDto> unbanUser(@PathVariable String id) {
        return ResponseEntity.ok(adminUserService.unbanUser(id));
    }

    @PostMapping("/{id}/suspend")
    public ResponseEntity<UserDto> suspendUser(@PathVariable String id) {
        return ResponseEntity.ok(adminUserService.suspendUser(id));
    }

    @PutMapping("/{id}/plan")
    public ResponseEntity<UserDto> updatePlan(
            @PathVariable String id,
            @RequestBody UpdatePlanRequest request
    ) {
        return ResponseEntity.ok(adminUserService.updatePlan(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
