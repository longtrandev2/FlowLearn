package com.example.backend.dto.dashboard;

import java.util.List;

public record WeeklyActivityDto(
        List<DailyActivityDto> activities
) {
    public record DailyActivityDto(
            String day,
            int hours,
            String label
    ) {
    }
}