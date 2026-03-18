package com.example.backend.dto;

import com.example.backend.entity.UserRole;
import com.example.backend.entity.UserStatus;
import com.example.backend.entity.UserPlan;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String fullName;
    private UserRole role;
    private UserStatus status;
    private UserPlan plan;
    private Integer storageLimitMb;
    private Integer warningCount;
}
