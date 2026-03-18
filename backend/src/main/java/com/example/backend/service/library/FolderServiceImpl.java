package com.example.backend.service.library;

import com.example.backend.dto.folder.CreateFolderRequest;
import com.example.backend.dto.folder.FolderDto;
import com.example.backend.dto.folder.UpdateFolderRequest;
import com.example.backend.entity.Folder;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.repository.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderServiceImpl implements FolderService {

    private final FolderRepository folderRepository;
    private final DocumentRepository documentRepository;

    @Override
    @Transactional
    public FolderDto createFolder(String userId, CreateFolderRequest request) {
        if (request.getParentId() != null) {
            folderRepository.findByIdAndUserId(request.getParentId(), userId)
                    .orElseThrow(() -> new IllegalArgumentException("Parent folder not found or doesn't belong to you"));
        }

        // Generate ID
        String folderId = UUID.randomUUID().toString();
        
        Folder folder = Folder.builder()
                .id(folderId)
                .userId(userId)
                .parentId(request.getParentId())
                .name(request.getName())
                .description(request.getDescription())
                .color(request.getColor())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Folder savedFolder = folderRepository.save(folder);
        return mapToDto(savedFolder);
    }

    @Override
    @Transactional
    public FolderDto updateFolder(String userId, String folderId, UpdateFolderRequest request) {
        Folder folder = folderRepository.findByIdAndUserId(folderId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Folder not found"));

        if (request.getName() != null) {
            folder.setName(request.getName());
        }
        if (request.getDescription() != null) {
            folder.setDescription(request.getDescription());
        }
        if (request.getColor() != null) {
            folder.setColor(request.getColor());
        }

        Folder updatedFolder = folderRepository.save(folder);
        return mapToDto(updatedFolder);
    }

    @Override
    public FolderDto getFolder(String userId, String folderId) {
        Folder folder = folderRepository.findByIdAndUserId(folderId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Folder not found"));
        return mapToDto(folder);
    }

    @Override
    public List<FolderDto> getRootFolders(String userId) {
        List<Folder> folders = folderRepository.findByUserIdAndParentIdIsNullOrderByCreatedAtDesc(userId);
        return folders.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<FolderDto> getSubFolders(String userId, String parentId) {
        // Verify parent belongs to user
        folderRepository.findByIdAndUserId(parentId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Parent folder not found"));
                
        List<Folder> folders = folderRepository.findByUserIdAndParentIdOrderByCreatedAtDesc(userId, parentId);
        return folders.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteFolder(String userId, String folderId) {
        Folder folder = folderRepository.findByIdAndUserId(folderId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Folder not found"));
        
        // Recursive deletion handled either in DB or needs to be implemented.
        // For now, let's keep it simple - delete just this folder assuming no foreign key constraints error 
        // or let JPA cascade if configured. Actually, manual validation is better before delete.
        
        // Note: Realistically, you should check for subfolders/documents or recursively delete them.
        long subfolderCount = folderRepository.countByParentId(folderId);
        long docCount = documentRepository.countByFolderId(folderId);
        
        if (subfolderCount > 0 || docCount > 0) {
            throw new IllegalArgumentException("Folder is not empty. Please empty it first or implement cascade delete.");
        }
        
        folderRepository.delete(folder);
    }

    private FolderDto mapToDto(Folder folder) {
        int subfolderCount = (int) folderRepository.countByParentId(folder.getId());
        int fileCount = (int) documentRepository.countByFolderId(folder.getId());
        
        return FolderDto.builder()
                .id(folder.getId())
                .parentId(folder.getParentId())
                .name(folder.getName())
                .description(folder.getDescription())
                .coverImageUrl(folder.getCoverImageUrl())
                .color(folder.getColor() != null ? folder.getColor().name() : null)
                .createdAt(folder.getCreatedAt())
                .updatedAt(folder.getUpdatedAt())
                .stats(FolderDto.FolderStats.builder()
                        .subfolderCount(subfolderCount)
                        .fileCount(fileCount)
                        .build())
                .build();
    }
}
