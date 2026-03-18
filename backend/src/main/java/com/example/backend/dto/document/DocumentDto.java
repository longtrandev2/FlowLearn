package com.example.backend.dto.document;

import com.example.backend.enums.DocumentStatus;
import com.example.backend.enums.FileType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDto {
    private String id;
    private String folderId;
    private String name;
    private FileType type;
    private String size;
    private Long fileSizeBytes;
    private DocumentStatus status;
    private String errorMessage;
    private Integer pageCount;
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
}
