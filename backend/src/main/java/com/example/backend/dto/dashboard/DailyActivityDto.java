package com.example.backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyActivityDto {
    private String day; // "Mon", "Tue", etc.
    private Double hours;
    private String label; // "2.5h"
}