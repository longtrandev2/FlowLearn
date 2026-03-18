package com.example.backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StreakDataDto {
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer percentile;
    private List<WeekDayStatusDto> weekDays;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeekDayStatusDto {
        private String day; // "Mon"
        private boolean completed;
    }
}