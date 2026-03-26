package com.example.backend.service.dashboard;

import com.example.backend.dto.dashboard.DashboardStatsDto;
import com.example.backend.dto.dashboard.RecentActivityItemDto;
import com.example.backend.dto.dashboard.StreakDataDto;
import com.example.backend.dto.dashboard.WeeklyActivityDto;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.repository.FolderRepository;
import com.example.backend.repository.FlashcardRepository;
import com.example.backend.repository.StudyActivityRepository;
import com.example.backend.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final FolderRepository folderRepository;
    private final FlashcardRepository flashcardRepository;
    private final StudySessionRepository studySessionRepository;
    private final StudyActivityRepository studyActivityRepository;

    public DashboardStatsDto getDashboardStats(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        long documentsCount = documentRepository.countByUserId(userId);
        long foldersCount = folderRepository.countByUserId(userId);
        long flashcardsCount = flashcardRepository.countByStudySessionUserId(userId);
        long studySessionsCount = studySessionRepository.countByUserId(userId);
        
        // TODO: Aggregate total study hours from StudyActivity
        int totalStudyHours = 0;
        
        // TODO: Get real streak data
        int currentStreak = 0;
        int longestStreak = 0;

        double storagePercent = user.getStorageLimitMb() > 0 
                ? (double) user.getStorageUsedMb() / user.getStorageLimitMb() * 100 
                : 0.0;

        return new DashboardStatsDto(
                documentsCount,
                foldersCount,
                flashcardsCount,
                studySessionsCount,
                totalStudyHours,
                currentStreak,
                longestStreak,
                user.getStorageUsedMb(),
                user.getStorageLimitMb(),
                storagePercent,
                user.getPlan()
        );
    }
    
    public WeeklyActivityDto getWeeklyActivity(String userId) {
        // TODO: Implement actual data aggregation from StudyActivity mapping to last 7 days
        return new WeeklyActivityDto(List.of(
                new WeeklyActivityDto.DailyActivityDto("Mon", 2, "2h"),
                new WeeklyActivityDto.DailyActivityDto("Tue", 3, "3h"),
                new WeeklyActivityDto.DailyActivityDto("Wed", 1, "1h"),
                new WeeklyActivityDto.DailyActivityDto("Thu", 4, "4h"),
                new WeeklyActivityDto.DailyActivityDto("Fri", 2, "2h"),
                new WeeklyActivityDto.DailyActivityDto("Sat", 0, "0h"),
                new WeeklyActivityDto.DailyActivityDto("Sun", 1, "1h")
        ));
    }
    
    public StreakDataDto getStreakData(String userId) {
        // TODO: Implement actual logic
        return new StreakDataDto(
                5,
                12,
                80,
                List.of(true, true, true, true, true, false, false)
        );
    }
    
    public List<RecentActivityItemDto> getRecentActivities(String userId) {
        // TODO: Merge data from Document, StudySession, etc.
        return List.of();
    }
}