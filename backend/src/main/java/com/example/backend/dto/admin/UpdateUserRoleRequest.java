package com.example.backend.dto.admin;

import com.example.backend.enums.UserRole;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(
        @NotNull(message = "Role cannot be null")
        UserRole role
) {
}