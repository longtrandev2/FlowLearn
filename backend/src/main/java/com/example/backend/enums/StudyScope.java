package com.example.backend.enums;

import java.util.Arrays;

public enum StudyScope {
    FILE("file"),
    FOLDER("folder");

    private final String value;

    StudyScope(final String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static StudyScope fromValue(final String value) {
        return Arrays.stream(values())
                .filter(scope -> scope.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown StudyScope value: " + value));
    }
}
