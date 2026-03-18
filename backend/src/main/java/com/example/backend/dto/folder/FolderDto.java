package com.example.backend.dto.folder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FolderDto {
    private String id;
    private String parentId;
    private String name;
    private String description;
    private String coverImageUrl;
    private String color;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private FolderStats stats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FolderStats {
        private Integer subfolderCount;
        private Integer fileCount;
    }
}
