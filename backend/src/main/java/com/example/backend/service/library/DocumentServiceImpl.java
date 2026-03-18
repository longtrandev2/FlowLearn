package com.example.backend.service.library;

import com.example.backend.dto.document.DocumentDto;
import com.example.backend.dto.document.UpdateDocumentRequest;
import com.example.backend.entity.Document;
import com.example.backend.enums.DocumentStatus;
import com.example.backend.enums.FileType;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.repository.FolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final FolderRepository folderRepository;

    @Override
    @Transactional
    public DocumentDto uploadDocument(String userId, String folderId, MultipartFile file) {
        if (folderId != null && !folderId.isEmpty()) {
            folderRepository.findByIdAndUserId(folderId, userId)
                    .orElseThrow(() -> new IllegalArgumentException("Folder not found"));
        } else {
            folderId = null;
        }

        // Mocking the upload process since there is no actual R2 service right now
        // Determine file type simply
        FileType type = FileType.PDF;
        if (file.getOriginalFilename() != null && file.getOriginalFilename().toLowerCase().endsWith(".docx")) {
            type = FileType.DOCX;
        }

        Document document = Document.builder()
                .id(UUID.randomUUID().toString())
                .userId(userId)
                .folderId(folderId)
                .name(file.getOriginalFilename() != null ? file.getOriginalFilename() : "Untitled")
                .fileType(type)
                .fileSizeBytes(file.getSize())
                .r2Key(UUID.randomUUID().toString() + "-" + file.getOriginalFilename())
                .r2Bucket("flowlearn-documents")
                .status(DocumentStatus.PROCESSING)
                .uploadedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Document savedDoc = documentRepository.save(document);
        return mapToDto(savedDoc);
    }

    @Override
    @Transactional
    public DocumentDto updateDocument(String userId, String documentId, UpdateDocumentRequest request) {
        Document document = documentRepository.findByIdAndUserId(documentId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        if (request.getName() != null) {
            document.setName(request.getName());
        }
        
        if (request.getFolderId() != null) {
             folderRepository.findByIdAndUserId(request.getFolderId(), userId)
                    .orElseThrow(() -> new IllegalArgumentException("Target folder not found"));
             document.setFolderId(request.getFolderId());
        }

        Document updatedDoc = documentRepository.save(document);
        return mapToDto(updatedDoc);
    }

    @Override
    public DocumentDto getDocument(String userId, String documentId) {
        Document document = documentRepository.findByIdAndUserId(documentId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        return mapToDto(document);
    }

    @Override
    public List<DocumentDto> getDocumentsInFolder(String userId, String folderId) {
        List<Document> documents;
        if (folderId == null || folderId.isEmpty()) {
            documents = documentRepository.findByUserIdAndFolderIdIsNullOrderByUploadedAtDesc(userId);
        } else {
            folderRepository.findByIdAndUserId(folderId, userId)
                    .orElseThrow(() -> new IllegalArgumentException("Folder not found"));
            documents = documentRepository.findByUserIdAndFolderIdOrderByUploadedAtDesc(userId, folderId);
        }
        return documents.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteDocument(String userId, String documentId) {
        Document document = documentRepository.findByIdAndUserId(documentId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        
        // Mock remote delete file from R2 bucket
        documentRepository.delete(document);
    }

    private DocumentDto mapToDto(Document document) {
        double bytes = document.getFileSizeBytes();
        String sizeStr = bytes > 1048576 ? String.format("%.2f MB", bytes / 1048576) : String.format("%.2f KB", bytes / 1024);

        return DocumentDto.builder()
                .id(document.getId())
                .folderId(document.getFolderId())
                .name(document.getName())
                .type(document.getFileType())
                .fileSizeBytes(document.getFileSizeBytes())
                .size(sizeStr)
                .status(document.getStatus())
                .errorMessage(document.getErrorMessage())
                .pageCount(document.getPageCount())
                .uploadedAt(document.getUploadedAt())
                .updatedAt(document.getUpdatedAt())
                .build();
    }
}
