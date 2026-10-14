package com.example.back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CapturaRequestDTO {
    private Long invitadoId;
    private Long misionId;
    private String urlMultimedia;
}