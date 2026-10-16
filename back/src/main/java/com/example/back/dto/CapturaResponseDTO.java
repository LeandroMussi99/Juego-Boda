package com.example.back.dto;

import lombok.Data;

@Data
public class CapturaResponseDTO {
    private Long id;
    private String urlMultimedia;
    private String nombreInvitado;
    private String descripcionMision;
    private Integer puntosMision;
}