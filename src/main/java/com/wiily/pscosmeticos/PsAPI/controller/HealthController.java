package com.wiily.pscosmeticos.PsAPI.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {
    @GetMapping
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> map = new HashMap<>();
        map.put("status", "UP");
        map.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(map);
    }
}
