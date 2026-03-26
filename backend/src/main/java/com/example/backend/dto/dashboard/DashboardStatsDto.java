package com.example.backend.dto.dashboard;

import com.example.backend.enums.UserPlan;

public record DashboardStatsDto(
        long documentsCount,
        long foldersCount,
        long flashcardsCount,
        long studySessionsCount,
        int totalStudyHours,
        int currentStreak,
        int longestStreak,
        long storageUsedMb,
        int storageLimitMb,
        double storagePercent,
        UserPlan plan
) {
}