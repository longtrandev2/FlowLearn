package com.example.backend.dto.folder;

import com.example.backend.dto.document.DocumentDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FolderContentsDto {
    private FolderDto folder;
    private List<FolderDto> subfolders;
    private List<DocumentDto> documents;
    private List<BreadcrumbDto> breadcrumbs;
}