package com.example.backend.entity.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Collections;
import java.util.Map;

@Converter(autoApply = false)
public class QuizOptionsConverter implements AttributeConverter<Map<String, String>, String> {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(final Map<String, String> attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            return OBJECT_MAPPER.writeValueAsString(attribute);
        } catch (final JsonProcessingException exception) {
            throw new IllegalArgumentException("Cannot serialize quiz options", exception);
        }
    }

    @Override
    public Map<String, String> convertToEntityAttribute(final String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return Collections.emptyMap();
        }
        try {
            return OBJECT_MAPPER.readValue(dbData, new TypeReference<>() {
            });
        } catch (final JsonProcessingException exception) {
            throw new IllegalArgumentException("Cannot deserialize quiz options", exception);
        }
    }
}
