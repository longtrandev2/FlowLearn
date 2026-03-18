package com.example.backend.service.library;

import com.example.backend.dto.folder.CreateFolderRequest;
import com.example.backend.dto.folder.FolderDto;
import com.example.backend.dto.folder.UpdateFolderRequest;

import java.util.List;

public interface FolderService {
    FolderDto createFolder(String userId, CreateFolderRequest request);
    
    FolderDto updateFolder(String userId, String folderId, UpdateFolderRequest request);
    
    FolderDto getFolder(String userId, String folderId);
    
    List<FolderDto> getRootFolders(String userId);
    
    List<FolderDto> getSubFolders(String userId, String parentId);
    
    void deleteFolder(String userId, String folderId);
}
