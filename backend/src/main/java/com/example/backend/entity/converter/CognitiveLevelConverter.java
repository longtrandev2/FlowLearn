package com.example.backend.entity.converter;

import com.example.backend.enums.CognitiveLevel;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class CognitiveLevelConverter implements AttributeConverter<CognitiveLevel, String> {

    @Override
    public String convertToDatabaseColumn(final CognitiveLevel attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public CognitiveLevel convertToEntityAttribute(final String dbData) {
        return dbData == null ? null : CognitiveLevel.fromValue(dbData);
    }
}
