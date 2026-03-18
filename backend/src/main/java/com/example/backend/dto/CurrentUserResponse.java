package com.example.backend.dto;

import com.example.backend.enums.UserPlan;
import com.example.backend.enums.UserRole;
import com.example.backend.enums.UserStatus;

import java.time.LocalDateTime;

public record CurrentUserResponse(
        String id,
        String email,
        String fullName,
        String avatarUrl,
        UserRole role,
        UserStatus status,
        UserPlan plan,
        LocalDateTime lastLoginAt,
        LocalDateTime createdAt
) {
}
