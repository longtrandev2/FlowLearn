package com.example.backend.entity.converter;

import com.example.backend.entity.json.QuizAnswerRecord;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Collections;
import java.util.List;

@Converter(autoApply = false)
public class QuizAnswersConverter implements AttributeConverter<List<QuizAnswerRecord>, String> {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(final List<QuizAnswerRecord> attribute) {
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
    public List<QuizAnswerRecord> convertToEntityAttribute(final String dbData) {
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
