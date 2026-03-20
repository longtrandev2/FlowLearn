package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class ApplicationConfigTest {
    @Test
    void printHash() {
        System.out.println("HASH_OUTPUT=" + new BCryptPasswordEncoder().encode("password123"));
    }
}
