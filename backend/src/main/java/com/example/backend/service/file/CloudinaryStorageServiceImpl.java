package com.example.backend.service.file;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryStorageServiceImpl implements FileStorageService {

    private final Cloudinary cloudinary;
    private final RestTemplate restTemplate;

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        String key = "documents/" + UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        log.info("Uploading file to Cloudinary: {} (key: {})", file.getOriginalFilename(), key);
        
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "public_id", key,
                "resource_type", "raw"
        ));
        
        return (String) uploadResult.get("public_id");
    }

    @Override
    public void deleteFile(String key) throws IOException {
        log.info("Deleting file from Cloudinary (key: {})", key);
        cloudinary.uploader().destroy(key, ObjectUtils.asMap("resource_type", "raw"));
    }

    @Override
    public void uploadText(String key, String text) throws IOException {
        log.info("Uploading text to Cloudinary: {}", key);
        byte[] bytes = text.getBytes(StandardCharsets.UTF_8);

        cloudinary.uploader().upload(bytes, ObjectUtils.asMap(
                "public_id", key,
                "resource_type", "raw"
        ));
    }

    @Override
    public String downloadText(String key) throws IOException {
        log.info("Downloading text from Cloudinary: {}", key);
        
        String url = cloudinary.url().resourceType("raw").generate(key);
        // By default, Cloudinary adds public_id to url.
        // We use a simple GET request to fetch the raw file content.
        try {
            byte[] response = restTemplate.getForObject(url, byte[].class);
            if (response != null) {
                return new String(response, StandardCharsets.UTF_8);
            } else {
                throw new IOException("Failed to download text content from Cloudinary (null response)");
            }
        } catch (Exception e) {
            log.error("Failed to download text from Cloudinary", e);
            throw new IOException("Failed to download text content from Cloudinary", e);
        }
    }
}
