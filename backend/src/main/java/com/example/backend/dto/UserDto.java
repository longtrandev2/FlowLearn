package com.example.backend.dto;

import com.example.backend.entity.UserRole;
import com.example.backend.entity.UserStatus;
import com.example.backend.entity.UserPlan;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;
    private String email;
    private String fullName;
    private String avatarUrl;
    private UserRole role;
    private UserStatus status;
    private UserPlan plan;
    private Long storageUsedMb;
    private Integer storageLimitMb;
    private Integer warningCount;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
