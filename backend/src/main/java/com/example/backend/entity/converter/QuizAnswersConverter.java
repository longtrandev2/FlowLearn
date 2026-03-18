package com.example.backend.entity.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Converter(autoApply = false)
public class QuizAnswersConverter implements AttributeConverter<List<Map<String, Object>>, String> {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(final List<Map<String, Object>> attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            return OBJECT_MAPPER.writeValueAsString(attribute);
        } catch (final JsonProcessingException exception) {
            throw new IllegalArgumentException("Cannot serialize quiz answers", exception);
        }
    }

    @Override
    public List<Map<String, Object>> convertToEntityAttribute(final String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return OBJECT_MAPPER.readValue(dbData, new TypeReference<>() {
            });
        } catch (final JsonProcessingException exception) {
            throw new IllegalArgumentException("Cannot deserialize quiz answers", exception);
        }
    }
}
