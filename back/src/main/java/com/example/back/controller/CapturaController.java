package com.example.back.controller;

import com.example.back.dto.CapturaRequestDTO;
import com.example.back.entity.Captura;
import com.example.back.service.CapturaService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/capturas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CapturaController {

    private final CapturaService capturaService;

    @PostMapping
    public ResponseEntity<?> registrarCaptura(@RequestBody CapturaRequestDTO request) {
        try {
            Captura captura = capturaService.registrarCaptura(request);
            return ResponseEntity.ok(captura);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/completadas/{invitadoId}")
    public ResponseEntity<List<Long>> obtenerCompletadas(@PathVariable Long invitadoId) {
        return ResponseEntity.ok(capturaService.obtenerMisionesCompletadas(invitadoId));
    }
}