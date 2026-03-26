package com.example.backend.service.dashboard;

import com.example.backend.dto.dashboard.DashboardStatsDto;
import com.example.backend.dto.dashboard.RecentActivityItemDto;
import com.example.backend.dto.dashboard.StreakDataDto;
import com.example.backend.dto.dashboard.WeeklyActivityDto;
import com.example.backend.entity.Document;
import com.example.backend.entity.StudyActivity;
import com.example.backend.entity.StudySession;
import com.example.backend.entity.User;
import com.example.backend.entity.UserStats;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.repository.FlashcardRepository;
import com.example.backend.repository.FolderRepository;
import com.example.backend.repository.StudyActivityRepository;
import com.example.backend.repository.StudySessionRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.UserStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final UserStatsRepository userStatsRepository;
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

        Optional<UserStats> statsOpt = userStatsRepository.findByUserId(userId);
        
        int totalStudyHours = statsOpt.map(s -> s.getTotalStudyHours().intValue()).orElse(0);
        int currentStreak = statsOpt.map(UserStats::getCurrentStreak).orElse(0);
        int longestStreak = statsOpt.map(UserStats::getLongestStreak).orElse(0);

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
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);

        List<StudyActivity> activities = studyActivityRepository.findByUserIdAndActivityDateBetweenOrderByActivityDateAsc(
                userId, startDate, endDate);

        Map<LocalDate, BigDecimal> hoursByDate = activities.stream()
                .collect(Collectors.groupingBy(
                        StudyActivity::getActivityDate,
                        Collectors.reducing(BigDecimal.ZERO, StudyActivity::getHoursStudied, BigDecimal::add)
                ));

        List<WeeklyActivityDto.DailyActivityDto> dailyActivities = new ArrayList<>();
        
        for (int i = 0; i <= 6; i++) {
            LocalDate currDate = startDate.plusDays(i);
            BigDecimal hours = hoursByDate.getOrDefault(currDate, BigDecimal.ZERO);
            String dayLabel = currDate.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            
            // Format labels like "Mon", "Tue" mapped to 2h etc
            int roundedHours = Math.max(0, hours.setScale(0, java.math.RoundingMode.HALF_UP).intValue());
            
            dailyActivities.add(new WeeklyActivityDto.DailyActivityDto(
                    dayLabel,
                    roundedHours,
                    roundedHours + "h"
            ));
        }

        return new WeeklyActivityDto(dailyActivities);
    }

    public StreakDataDto getStreakData(String userId) {
        Optional<UserStats> statsOpt = userStatsRepository.findByUserId(userId);
        int currentStreak = statsOpt.map(UserStats::getCurrentStreak).orElse(0);
        int longestStreak = statsOpt.map(UserStats::getLongestStreak).orElse(0);
        
        int percentile = 80; // Placeholder for percentile logic if needed

        // Weekly completion logic (Mon - Sun)
        LocalDate today = LocalDate.now();
        LocalDate mondayThisWeek = today.with(DayOfWeek.MONDAY);
        LocalDate sundayThisWeek = today.with(DayOfWeek.SUNDAY);

        List<StudyActivity> thisWeekActivities = studyActivityRepository.findByUserIdAndActivityDateBetweenOrderByActivityDateAsc(
                userId, mondayThisWeek, sundayThisWeek);

        List<Boolean> weeklyCompletion = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate currDate = mondayThisWeek.plusDays(i);
            boolean completed = thisWeekActivities.stream()
                    .anyMatch(a -> a.getActivityDate().equals(currDate) && Boolean.TRUE.equals(a.getIsStreakDay()));
            weeklyCompletion.add(completed);
        }

        return new StreakDataDto(currentStreak, longestStreak, percentile, weeklyCompletion);
    }

    public List<RecentActivityItemDto> getRecentActivities(String userId) {
        List<RecentActivityItemDto> results = new ArrayList<>();

        // 1. Fetch recent documents
        List<Document> documents = documentRepository.findByUserId(userId, PageRequest.of(0, 5, Sort.by("uploadedAt").descending())).getContent();
        documents.forEach(doc -> results.add(new RecentActivityItemDto(
                doc.getId(),
                "document_upload",
                doc.getName(),
                null,
                null,
                doc.getUploadedAt()
        )));

        // 2. Fetch recent study sessions
        List<StudySession> sessions = studySessionRepository.findByUserId(userId, PageRequest.of(0, 5, Sort.by("startedAt").descending())).getContent();
        sessions.forEach(sess -> results.add(new RecentActivityItemDto(
                sess.getId(),
                "study_session",
                "Studied Phase",
                sess.getTotalTimeSeconds() != null && sess.getTotalTimeSeconds() > 0 ? sess.getTotalTimeSeconds() / 60 : 0,
                "mins",
                sess.getCompletedAt() != null ? sess.getCompletedAt() : sess.getStartedAt()
        )));

        // Combine and sort by date descending, limit top 10
        results.sort(Comparator.comparing(RecentActivityItemDto::completedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        return results.size() > 10 ? results.subList(0, 10) : results;
    }
}