package com.example.backend.service.study;

import com.example.backend.dto.study.SessionFeedbackDto;

public interface SessionFeedbackService {
    SessionFeedbackDto getOrGenerateFeedback(String userId, String studySessionId);
}