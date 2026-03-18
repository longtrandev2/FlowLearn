package com.example.backend.enums;

import java.util.Arrays;

public enum CognitiveLevel {
    RECALL("recall"),
    UNDERSTAND("understand"),
    APPLY("apply");

    private final String value;

    CognitiveLevel(final String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static CognitiveLevel fromValue(final String value) {
        return Arrays.stream(values())
                .filter(level -> level.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown CognitiveLevel value: " + value));
    }
}
