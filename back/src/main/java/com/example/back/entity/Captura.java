package com.example.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "captura")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Captura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitado_id", nullable = false)
    private Invitado invitado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mision_id", nullable = false)
    private Mision mision;

    @Column(name = "url_multimedia", nullable = false, length = 500)
    private String urlMultimedia;

    @Column(name = "estado_validacion")
    private String estadoValidacion = "pendiente";

    @Column(name = "fecha_subida", updatable = false)
    private LocalDateTime fechaSubida = LocalDateTime.now();
}