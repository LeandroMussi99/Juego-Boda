package com.example.back.controller;

import com.example.back.dto.LoginRequestDTO;
import com.example.back.entity.Invitado;
import com.example.back.service.InvitadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invitados")
@CrossOrigin(origins = "*") 
public class InvitadoController {

    @Autowired
    private InvitadoService invitadoService;


    @PostMapping("/login")
    public ResponseEntity<Invitado> login(@RequestBody LoginRequestDTO request) {
        Invitado invitado = invitadoService.loginORegistro(request.getNombre());
        return ResponseEntity.ok(invitado);
    }
}
