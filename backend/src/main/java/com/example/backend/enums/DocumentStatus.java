package com.example.backend.enums;

import java.util.Arrays;

public enum DocumentStatus {
    UPLOADING("uploading"),
    PROCESSING("processing"),
    READY("ready"),
    ERROR("error");

    private final String value;

    DocumentStatus(final String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static DocumentStatus fromValue(final String value) {
        return Arrays.stream(values())
                .filter(status -> status.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown DocumentStatus value: " + value));
    }
}
