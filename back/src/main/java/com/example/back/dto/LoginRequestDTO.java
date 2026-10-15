package com.example.back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {
    private String nombre;
    private Integer numeroMesa;
    private String fotoPerfilUrl;
}