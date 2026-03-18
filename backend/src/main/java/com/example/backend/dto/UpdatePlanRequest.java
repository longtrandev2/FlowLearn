package com.example.backend.dto;

import com.example.backend.entity.UserPlan;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePlanRequest {
    private UserPlan plan;
}
