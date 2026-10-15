package com.example.back.controller;

import com.example.back.dto.LoginRequestDTO;
import com.example.back.dto.RankingResponseDTO;
import com.example.back.entity.Invitado;
import com.example.back.service.InvitadoService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invitados")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class InvitadoController {

    private final InvitadoService invitadoService;


    @PostMapping("/login")
    public ResponseEntity<Invitado> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(invitadoService.login(request));
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<RankingResponseDTO>> obtenerRanking() {
        return ResponseEntity.ok(invitadoService.obtenerRanking());
    }

    @GetMapping
    public ResponseEntity<List<Invitado>> obtenerTodos() {
        return ResponseEntity.ok(invitadoService.obtenerTodos());
    }

    @PutMapping("/{id}/admin")
    public ResponseEntity<Invitado> hacerAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(invitadoService.hacerAdmin(id));
    }

    @PutMapping("/{id}/quitar-admin")
    public ResponseEntity<Invitado> quitarAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(invitadoService.quitarAdmin(id));
    }
}
