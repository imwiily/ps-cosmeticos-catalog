package com.wiily.pscosmeticos.PsAPI.controller;

import com.wiily.pscosmeticos.PsAPI.infra.config.AppProperties;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/image/")
public class ImageController {
    @Autowired
    AppProperties properties;

    @GetMapping("{name}")
    public ResponseEntity<byte[]> viewImage(@PathVariable String name, @RequestParam(name = "type") String type) throws IOException {
        String filePath = findFile(name, properties.getStorage().getImageRoot());
        File image = new File(filePath);
        if (!image.exists()) {
            return ResponseEntity.notFound().build();
        }
        byte[] content = getTypeImage(image, type);

        return ResponseEntity.ok()
                .header("Content-Type", Files.probeContentType(image.toPath()))
                .header("Content-Disposition", "inline; filename=\"" + name + "\"")
                .body(content);
    }

    private byte[] getTypeImage(File image, String type) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        switch (type.toUpperCase()) {
            case "ICON" -> {
                Thumbnails.of(image)
                        .scale(0.1f)
                        .toOutputStream(baos);
                return baos.toByteArray();
            }
            case "DISPLAY" -> {
                Thumbnails.of(image)
                        .scale(1.0f)
                        .toOutputStream(baos);
                return baos.toByteArray();
            }
            case "MID-DISPLAY" -> {
                Thumbnails.of(image)
                        .scale(0.5f)
                        .toOutputStream(baos);
                return baos.toByteArray();
            }
            default -> {
                return null;
            }
        }
    }

    public String findFile(String fileName, String rootPath) {
        try {
            Optional<Path> result = Files.walk(Paths.get(rootPath))
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().equals(fileName))
                    .findFirst();
            return result.map(path -> path.toAbsolutePath().toString()).orElse(null);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
