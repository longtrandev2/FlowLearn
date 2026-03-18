package com.example.backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private Integer documentsCount;
    private Integer foldersCount;
    private Integer flashcardsCount;
    private Integer studySessionsCount;
    private BigDecimal totalStudyHours;
    private Integer currentStreak;
    private Integer longestStreak;
    private Long storageUsed;
    private Integer storageLimit;
    private BigDecimal storagePercent;
    private String plan;
}
