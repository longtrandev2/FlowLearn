package com.example.backend.service.study;

import com.example.backend.dto.study.CreateStudySessionRequest;
import com.example.backend.dto.study.StudySessionDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudySessionService {
    StudySessionDto createSession(String userEmail, CreateStudySessionRequest request);
    StudySessionDto getSession(String userEmail, String sessionId);
    StudySessionDto endSession(String userEmail, String sessionId);
    Page<StudySessionDto> getUserSessions(String userEmail, Pageable pageable);
    
}
