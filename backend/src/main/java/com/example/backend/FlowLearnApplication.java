package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
@EnableJpaAuditing
public class FlowLearnApplication {

	public static void main(String[] args) {
		loadEnv();
		SpringApplication.run(FlowLearnApplication.class, args);
	}

	private static void loadEnv() {
		try {
			Path path = Paths.get(".env");
			if (!Files.exists(path)) {
				path = Paths.get("backend/.env"); // fallback for running from project root
			}
			if (Files.exists(path)) {
				System.out.println("Loading .env from: " + path.toAbsolutePath());
				Files.lines(path)
					.filter(line -> !line.startsWith("#") && !line.trim().isEmpty())
					.forEach(line -> {
						String[] parts = line.split("=", 2);
						if (parts.length == 2) {
							String key = parts[0].trim().replace("\uFEFF", ""); // remove BOM
							String value = parts[1].trim();
							System.out.println("Setting: '" + key + "' = '" + value + "'");
							System.setProperty(key, value);
						}
					});
			} else {
				System.out.println("Could not find .env file!");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
