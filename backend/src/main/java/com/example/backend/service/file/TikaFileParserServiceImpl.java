package com.example.backend.service.file;

import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.apache.tika.metadata.Metadata;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Slf4j
@Service
public class TikaFileParserServiceImpl implements FileParserService {

    private final Tika tika;

    public TikaFileParserServiceImpl() {
        this.tika = new Tika();
        // Sets maximum string length to unlimited (or very high) so we can parse large documents
        this.tika.setMaxStringLength(-1); 
    }

    @Override
    public String parseDocument(MultipartFile file) throws Exception {
        log.info("Parsing document with Apache Tika: {}", file.getOriginalFilename());
        
        try (InputStream inputStream = file.getInputStream()) {
            return tika.parseToString(inputStream, new Metadata());
        } catch (Exception e) {
            log.error("Failed to parse document: {}", file.getOriginalFilename(), e);
            throw new Exception("Document parsing failed", e);
        }
    }
}