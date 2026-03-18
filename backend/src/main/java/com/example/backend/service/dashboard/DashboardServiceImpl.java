package com.example.backend.service.dashboard;

import com.example.backend.dto.dashboard.DashboardStatsDto;
import com.example.backend.dto.dashboard.DailyActivityDto;
import com.example.backend.dto.dashboard.RecentActivityDto;
import com.example.backend.dto.dashboard.StreakDataDto;
import com.example.backend.dto.dashboard.WeeklyActivityDto;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final UserStatsRepository userStatsRepository;
    private final StudyActivityRepository studyActivityRepository;
    private final DocumentRepository documentRepository;
    private final FolderRepository folderRepository;
    private final StudySessionRepository studySessionRepository;
    private final FlashcardRepository flashcardRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    @Override
    @Transactional
    public DashboardStatsDto getDashboardStats(String userEmail) {
        User user = getUserByEmail(userEmail);
        
        // Retrieve or initialize stats
        UserStats stats = userStatsRepository.findByUserId(user.getId())
                .orElseGet(() -> initializeUserStats(user));

        // Let's ensure counts are up to date right now as a fallback
        // In a heavily loaded system, these would be updated via events when items are created
        stats.setDocumentsCount((int) documentRepository.countByUserId(user.getId()));
        stats.setFoldersCount((int) folderRepository.countByUserId(user.getId()));
        stats.setStudySessionsCount((int) studySessionRepository.countByUserId(user.getId()));
        stats.setFlashcardsCount((int) flashcardRepository.countByStudySessionUserId(user.getId()));
        userStatsRepository.save(stats);

        long storageUsed = user.getStorageUsedMb() != null ? user.getStorageUsedMb() : 0L;
        int storageLimit = user.getStorageLimitMb() != null ? user.getStorageLimitMb() : 500;
        
        BigDecimal storagePercent = storageLimit > 0 
                ? BigDecimal.valueOf((double) storageUsed / storageLimit * 100).setScale(1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return DashboardStatsDto.builder()
                .documentsCount(stats.getDocumentsCount())
                .foldersCount(stats.getFoldersCount())
                .flashcardsCount(stats.getFlashcardsCount())
                .studySessionsCount(stats.getStudySessionsCount())
                .totalStudyHours(stats.getTotalStudyHours())
                .currentStreak(stats.getCurrentStreak())
                .longestStreak(stats.getLongestStreak())
                .storageUsed(storageUsed)
                .storageLimit(storageLimit)
                .storagePercent(storagePercent)
                .plan(user.getPlan().name())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public WeeklyActivityDto getWeeklyActivity(String userEmail) {
        User user = getUserByEmail(userEmail);
        
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(6);
        
        List<StudyActivity> activities = studyActivityRepository
                .findByUserIdAndActivityDateBetweenOrderByActivityDateAsc(user.getId(), sevenDaysAgo, today);
                
        Map<LocalDate, BigDecimal> activityMap = activities.stream()
                .collect(Collectors.toMap(StudyActivity::getActivityDate, StudyActivity::getHoursStudied));
                
        List<DailyActivityDto> dailyList = new ArrayList<>();
        BigDecimal totalHours = BigDecimal.ZERO;
        
        for (int i = 0; i < 7; i++) {
            LocalDate date = sevenDaysAgo.plusDays(i);
            BigDecimal hours = activityMap.getOrDefault(date, BigDecimal.ZERO);
            totalHours = totalHours.add(hours);
            
            String dayName = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            
            dailyList.add(DailyActivityDto.builder()
                    .day(dayName)
                    .hours(hours.doubleValue())
                    .label(String.format("%.1fh", hours.doubleValue()))
                    .build());
        }
        
        double avg = totalHours.doubleValue() / 7.0;
        
        return WeeklyActivityDto.builder()
                .data(dailyList)
                .totalHours(totalHours.doubleValue())
                .averageHours(Math.round(avg * 10.0) / 10.0)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public StreakDataDto getStreakData(String userEmail) {
        User user = getUserByEmail(userEmail);
        
        UserStats stats = userStatsRepository.findByUserId(user.getId())
                .orElse(UserStats.builder().currentStreak(0).longestStreak(0).build());
                
        // Calculate weekday completions for current week (Mon-Sun)
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);
        
        List<StudyActivity> weekActivities = studyActivityRepository
                .findByUserIdAndActivityDateBetweenOrderByActivityDateAsc(user.getId(), startOfWeek, endOfWeek);
                
        Map<DayOfWeek, Boolean> completionMap = weekActivities.stream()
                .filter(a -> a.getHoursStudied().compareTo(BigDecimal.ZERO) > 0)
                .collect(Collectors.toMap(
                        a -> a.getActivityDate().getDayOfWeek(), 
                        a -> true,
                        (e1, e2) -> e1
                ));
                
        List<StreakDataDto.WeekDayStatusDto> weekDays = new ArrayList<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            String dayName = day.getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            weekDays.add(new StreakDataDto.WeekDayStatusDto(dayName, completionMap.getOrDefault(day, false)));
        }

        // Mock percentile for now
        int percentile = stats.getCurrentStreak() > 5 ? 85 : (stats.getCurrentStreak() > 2 ? 60 : 30);

        return StreakDataDto.builder()
                .currentStreak(stats.getCurrentStreak())
                .longestStreak(stats.getLongestStreak())
                .percentile(percentile)
                .weekDays(weekDays)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecentActivityDto> getRecentActivity(String userEmail, int limit) {
        User user = getUserByEmail(userEmail);
        
        Page<StudySession> recentSessions = studySessionRepository.findByUserId(
                user.getId(), 
                PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "startedAt"))
        );
        
        return recentSessions.stream().map(session -> {
            String timeAgo = "recently";
            if (session.getStartedAt() != null) {
                long minutes = ChronoUnit.MINUTES.between(session.getStartedAt(), LocalDate.now().atStartOfDay());
                if (minutes < 60) timeAgo = Math.max(1, minutes) + " mins ago";
                else if (minutes < 1440) timeAgo = (minutes / 60) + " hours ago";
                else timeAgo = (minutes / 1440) + " days ago";
            }
            
            return RecentActivityDto.builder()
                    .type("study_session")
                    .id(session.getId())
                    .title("Study Session (" + session.getScope().name() + ")")
                    .goal(session.getGoalId().name())
                    .timeSpentSeconds(session.getTotalTimeSeconds())
                    .score(100L) // Mocking progress
                    .timeAgo(timeAgo)
                    .build();
        }).collect(Collectors.toList());
    }

    private UserStats initializeUserStats(User user) {
        UserStats stats = UserStats.builder()
                .userId(user.getId())
                .documentsCount(0)
                .foldersCount(0)
                .flashcardsCount(0)
                .studySessionsCount(0)
                .currentStreak(0)
                .longestStreak(0)
                .totalStudyHours(BigDecimal.ZERO)
                .build();
        return userStatsRepository.save(stats);
    }
}