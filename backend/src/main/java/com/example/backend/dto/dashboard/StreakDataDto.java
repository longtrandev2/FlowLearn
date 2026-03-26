package com.example.backend.dto.dashboard;

import java.util.List;

public record StreakDataDto(
        int currentStreak,
        int longestStreak,
        int percentile,
        List<Boolean> weeklyCompletion // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
) {
}