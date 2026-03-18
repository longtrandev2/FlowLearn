package com.example.backend.entity.converter;

import com.example.backend.enums.DocumentStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class DocumentStatusConverter implements AttributeConverter<DocumentStatus, String> {

    @Override
    public String convertToDatabaseColumn(final DocumentStatus attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public DocumentStatus convertToEntityAttribute(final String dbData) {
        return dbData == null ? null : DocumentStatus.fromValue(dbData);
    }
}
