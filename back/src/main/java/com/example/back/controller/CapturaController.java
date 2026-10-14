package com.example.back.controller;

import com.example.back.dto.CapturaRequestDTO;
import com.example.back.entity.Captura;
import com.example.back.service.CapturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/capturas")
@CrossOrigin(origins = "*")
public class CapturaController {

    @Autowired
    private CapturaService capturaService;

    @PostMapping
    public ResponseEntity<?> registrarCaptura(@RequestBody CapturaRequestDTO request) {
        try {
            Captura captura = capturaService.registrarCaptura(request);
            return ResponseEntity.ok(captura);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}