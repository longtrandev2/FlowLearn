package com.example.backend.dto.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentStatusResponse {
    private String id;
    private String status;
    private Integer progress;
    private String errorMessage;
}