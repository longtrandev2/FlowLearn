package com.example.backend.enums;

import lombok.Getter;

@Getter
public enum FlashcardImportance {
    CORE("core"),
    SUPPORT("support"),
    ADVANCED("advanced");

    private final String value;

    FlashcardImportance(String value) {
        this.value = value;
    }

    public static FlashcardImportance fromValue(String value) {
        for (FlashcardImportance importance : FlashcardImportance.values()) {
            if (importance.value.equals(value)) {
                return importance;
            }
        }
        throw new IllegalArgumentException("Unknown FlashcardImportance value: " + value);
    }
}
