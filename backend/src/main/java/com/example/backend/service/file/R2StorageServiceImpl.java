package com.example.backend.service.file;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class R2StorageServiceImpl implements FileStorageService {

    private final S3Client s3Client;

    @Value("${cloudflare.r2.bucket:flowlearn-documents}")
    private String bucketName;

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        String key = "documents/" + UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        log.info("Uploading file to Cloudflare R2: {} (key: {})", file.getOriginalFilename(), key);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return key; // returning the key as required by DB schema "r2_key"
    }

    @Override
    public void deleteFile(String key) throws IOException {
        log.info("Deleting file from Cloudflare R2 (key: {})", key);

        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.deleteObject(deleteObjectRequest);
    }
}