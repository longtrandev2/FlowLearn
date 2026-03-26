package com.example.backend.dto.admin;

import com.example.backend.enums.UserPlan;
import com.example.backend.enums.UserRole;
import com.example.backend.enums.UserStatus;

import java.time.LocalDateTime;

public record UserAdminDto(
        String id,
        String email,
        String fullName,
        UserRole role,
        UserStatus status,
        UserPlan plan,
        Long storageUsedMb,
        Integer storageLimitMb,
        Integer warningCount,
        LocalDateTime lastLoginAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}