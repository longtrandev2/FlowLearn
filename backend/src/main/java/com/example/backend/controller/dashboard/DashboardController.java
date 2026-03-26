package com.example.backend.controller.dashboard;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.dashboard.DashboardStatsDto;
import com.example.backend.dto.dashboard.RecentActivityItemDto;
import com.example.backend.dto.dashboard.StreakDataDto;
import com.example.backend.dto.dashboard.WeeklyActivityDto;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.dashboard.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard Statistics and User Data APIs")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    @Operation(summary = "Get overview statistics", description = "Retrieves count of documents, flashcards, and storage usage")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats(Authentication authentication) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboardStats(userId)));
    }

    @Operation(summary = "Get weekly activity", description = "Retrieves study activity grouped by days of the week")
    @GetMapping("/activity/weekly")
    public ResponseEntity<ApiResponse<WeeklyActivityDto>> getWeeklyActivity(Authentication authentication) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getWeeklyActivity(userId)));
    }

    @Operation(summary = "Get streak data", description = "Retrieves current and longest study streak details")
    @GetMapping("/streak")
    public ResponseEntity<ApiResponse<StreakDataDto>> getStreakData(Authentication authentication) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStreakData(userId)));
    }

    @Operation(summary = "Get recent activities", description = "Retrieves a timeline of recent user actions")
    @GetMapping("/recent-activity")
    public ResponseEntity<ApiResponse<List<RecentActivityItemDto>>> getRecentActivities(Authentication authentication) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getRecentActivities(userId)));
    }

    private String getUserId(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"))
                .getId();
    }
}