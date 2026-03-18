package com.example.backend.service.file;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface FileStorageService {
    
    /**
     * Uploads a file to the storage provider (e.g., Cloudinary, S3).
     *
     * @param file The multipart file to upload.
     * @return The public URL or object key of the uploaded file.
     * @throws IOException If the upload fails.
     */
    String uploadFile(MultipartFile file) throws IOException;
    
    /**
     * Deletes a file from the storage provider.
     *
     * @param fileUrlOrKey The public URL or object key of the file to delete.
     * @throws IOException If the deletion fails.
     */
    void deleteFile(String fileUrlOrKey) throws IOException;
}