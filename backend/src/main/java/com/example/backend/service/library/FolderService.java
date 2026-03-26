package com.example.backend.service.library;

import com.example.backend.dto.folder.CreateFolderRequest;
import com.example.backend.dto.folder.FolderDto;
import com.example.backend.dto.folder.UpdateFolderRequest;

import java.util.List;

public interface FolderService {
    FolderDto createFolder(String userId, CreateFolderRequest request);
    
    FolderDto updateFolder(String userId, String folderId, UpdateFolderRequest request);
    
    FolderDto getFolder(String userId, String folderId);
    
    org.springframework.data.domain.Page<FolderDto> getRootFolders(String userId, org.springframework.data.domain.Pageable pageable);
    
    com.example.backend.dto.folder.FolderContentsDto getFolderContents(String userId, String folderId);
    
    void deleteFolder(String userId, String folderId);
}

