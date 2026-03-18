package com.example.backend.service.file;

import org.springframework.web.multipart.MultipartFile;

public interface FileParserService {
    
    /**
     * Parses the text content from a given document file (e.g., PDF, DOCX).
     *
     * @param file The multipart file to parse.
     * @return The extracted text content as a String.
     * @throws Exception If parsing fails.
     */
    String parseDocument(MultipartFile file) throws Exception;
}