package com.example.backend.controller.dashboard;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.dashboard.DashboardStatsDto;
import com.example.backend.dto.dashboard.RecentActivityDto;
import com.example.backend.dto.dashboard.StreakDataDto;
import com.example.backend.dto.dashboard.WeeklyActivityDto;
import com.example.backend.service.dashboard.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStats(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getDashboardStats(authentication.getName())
        ));
    }

    @GetMapping("/activity/weekly")
    public ResponseEntity<ApiResponse<WeeklyActivityDto>> getWeeklyActivity(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getWeeklyActivity(authentication.getName())
        ));
    }

    @GetMapping("/streak")
    public ResponseEntity<ApiResponse<StreakDataDto>> getStreakData(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getStreakData(authentication.getName())
        ));
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<ApiResponse<List<RecentActivityDto>>> getRecentActivity(
            Authentication authentication,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getRecentActivity(authentication.getName(), limit)
        ));
    }
}