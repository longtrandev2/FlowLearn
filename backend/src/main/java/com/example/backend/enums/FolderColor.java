package com.example.backend.enums;

import java.util.Arrays;

public enum FolderColor {
    OCEAN("ocean"),
    INDIGO("indigo"),
    EMERALD("emerald"),
    AMBER("amber"),
    ROSE("rose"),
    VIOLET("violet");

    private final String value;

    FolderColor(final String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static FolderColor fromValue(final String value) {
        return Arrays.stream(values())
                .filter(color -> color.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown FolderColor value: " + value));
    }
}
