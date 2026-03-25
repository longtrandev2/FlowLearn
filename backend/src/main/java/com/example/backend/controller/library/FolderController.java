package com.example.backend.controller.library;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.folder.CreateFolderRequest;
import com.example.backend.dto.folder.FolderDto;
import com.example.backend.dto.folder.UpdateFolderRequest;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.library.FolderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/folders")
@RequiredArgsConstructor
public class FolderController {

    private final FolderService folderService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<FolderDto>> createFolder(
            @Valid @RequestBody CreateFolderRequest request,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        FolderDto folder = folderService.createFolder(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(folder));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FolderDto>>> getRootFolders(Authentication authentication) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(folderService.getRootFolders(userId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FolderDto>> getFolder(
            @PathVariable String id,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(folderService.getFolder(userId, id)));
    }

    @GetMapping("/{id}/contents")
    public ResponseEntity<ApiResponse<com.example.backend.dto.folder.FolderContentsDto>> getFolderContents(
            @PathVariable String id,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(folderService.getFolderContents(userId, id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FolderDto>> updateFolder(
            @PathVariable String id,
            @Valid @RequestBody UpdateFolderRequest request,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(folderService.updateFolder(userId, id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(
            @PathVariable String id,
            Authentication authentication
    ) {
        String userId = getUserId(authentication);
        folderService.deleteFolder(userId, id);
        return ResponseEntity.noContent().build();
    }

    private String getUserId(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"))
                .getId();
    }
}
