package com.example.backend.controller.admin;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.admin.UpdateUserRoleRequest;
import com.example.backend.dto.admin.UpdateUserStatusRequest;
import com.example.backend.dto.admin.UserAdminDto;
import com.example.backend.service.admin.AdminUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin Users", description = "Operations for admin user management.")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @Operation(summary = "Get all users (Admin)", description = "Retrieves a paginated list of users. Requires MODERATOR or SUPER_ADMIN role.")
    @GetMapping
    @PreAuthorize("hasAnyRole('MODERATOR', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserAdminDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success(adminUserService.getAllUsers(PageRequest.of(page, size))));
    }

    @Operation(summary = "Update User Status", description = "Ban, Suspend or Activate a user. Requires MODERATOR or SUPER_ADMIN role.")
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('MODERATOR', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserAdminDto>> updateUserStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(adminUserService.updateUserStatus(id, request)));
    }

    @Operation(summary = "Warn User", description = "Increments user warning count. Suspends user at 3 warnings. Requires MODERATOR or SUPER_ADMIN role.")
    @PostMapping("/{id}/warn")
    @PreAuthorize("hasAnyRole('MODERATOR', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserAdminDto>> warnUser(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(adminUserService.warnUser(id)));
    }

    @Operation(summary = "Update User Role", description = "Change a user's role. Requires SUPER_ADMIN role.")
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserAdminDto>> updateUserRole(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(adminUserService.updateUserRole(id, request)));
    }
}