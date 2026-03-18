package com.example.backend.dto.study;

import com.example.backend.enums.FlashcardImportance;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FlashcardDto {
    private String id;
    private String documentId;
    private String studySessionId;
    private String front;
    private String back;
    private FlashcardImportance importance;
}