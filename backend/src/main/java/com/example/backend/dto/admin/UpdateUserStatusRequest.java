package com.example.backend.dto.admin;

import com.example.backend.enums.UserStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(
        @NotNull(message = "Status cannot be null")
        UserStatus status,
        String reason // Optional reason for ban/suspension
) {
}