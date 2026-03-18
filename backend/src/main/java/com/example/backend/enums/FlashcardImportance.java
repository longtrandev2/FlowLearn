package com.example.backend.enums;

import java.util.Arrays;

public enum FlashcardImportance {
    CORE("core"),
    SUPPORT("support"),
    ADVANCED("advanced");

    private final String value;

    FlashcardImportance(final String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static FlashcardImportance fromValue(final String value) {
        return Arrays.stream(values())
                .filter(importance -> importance.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown FlashcardImportance value: " + value));
    }
}
