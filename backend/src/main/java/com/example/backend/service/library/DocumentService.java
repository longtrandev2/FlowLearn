package com.example.backend.service.library;

import com.example.backend.dto.document.DocumentDto;
import com.example.backend.dto.document.UpdateDocumentRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    DocumentDto uploadDocument(String userId, String folderId, MultipartFile file);
    
    DocumentDto updateDocument(String userId, String documentId, UpdateDocumentRequest request);
    
    DocumentDto getDocument(String userId, String documentId);
    
    List<DocumentDto> getDocumentsInFolder(String userId, String folderId);
    
    void deleteDocument(String userId, String documentId);
}
