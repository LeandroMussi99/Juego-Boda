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

    private InvitadoService invitadoService;


    @PostMapping("/login")
    public ResponseEntity<Invitado> login(@RequestBody LoginRequestDTO request) {
        Invitado invitado = invitadoService.loginORegistro(request.getNombre());
        return ResponseEntity.ok(invitado);
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<RankingResponseDTO>> obtenerRanking() {
        return ResponseEntity.ok(invitadoService.obtenerRanking());
    }
}
