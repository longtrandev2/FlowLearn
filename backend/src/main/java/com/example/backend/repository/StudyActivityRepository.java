package com.example.backend.repository;

import com.example.backend.entity.StudyActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudyActivityRepository extends JpaRepository<StudyActivity, Long> {
    Optional<StudyActivity> findByUserIdAndActivityDate(String userId, LocalDate activityDate);
    
    // For building heatmaps and checking streaks
    List<StudyActivity> findByUserIdAndActivityDateBetweenOrderByActivityDateAsc(String userId, LocalDate startDate, LocalDate endDate);
}
