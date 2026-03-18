package com.example.backend.service.dashboard;

import com.example.backend.dto.dashboard.DashboardStatsDto;
import com.example.backend.dto.dashboard.RecentActivityDto;
import com.example.backend.dto.dashboard.StreakDataDto;
import com.example.backend.dto.dashboard.WeeklyActivityDto;

import java.util.List;

public interface DashboardService {
    DashboardStatsDto getDashboardStats(String userEmail);
    WeeklyActivityDto getWeeklyActivity(String userEmail);
    StreakDataDto getStreakData(String userEmail);
    List<RecentActivityDto> getRecentActivity(String userEmail, int limit);
}