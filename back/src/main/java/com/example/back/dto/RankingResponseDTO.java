package com.example.back.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RankingResponseDTO {
    private String nombre;
    private Integer puntos;
}