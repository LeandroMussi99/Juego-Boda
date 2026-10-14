package com.example.back.controller;

import com.example.back.entity.Mision;
import com.example.back.service.MisionService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/misiones")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MisionController {

    private MisionService misionService;

    @GetMapping
    public ResponseEntity<List<Mision>> obtenerMisiones() {
        return ResponseEntity.ok(misionService.obtenerTodas());
    }
}
