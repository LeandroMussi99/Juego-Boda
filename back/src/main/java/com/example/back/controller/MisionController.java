package com.example.back.controller;

import com.example.back.entity.Mision;
import com.example.back.service.MisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/misiones")
@CrossOrigin(origins = "*")
public class MisionController {

    @Autowired
    private MisionService misionService;

    @GetMapping
    public ResponseEntity<List<Mision>> obtenerMisiones() {
        return ResponseEntity.ok(misionService.obtenerTodas());
    }
}
