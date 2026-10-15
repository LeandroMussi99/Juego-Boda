package com.example.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "invitado")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Invitado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(name = "numero_mesa", nullable = false)
    private Integer numeroMesa;

    @Column(name = "foto_perfil_url")
    private String fotoPerfilUrl;

    @Column(name = "puntos_totales")
    private Integer puntosTotales = 0;

    @Column(name = "fecha_ingreso", updatable = false)
    private LocalDateTime fechaIngreso = LocalDateTime.now();

    @Column(name = "ultima_mision_completada")
    private LocalDateTime ultimaMisionCompletada;

    @Column(name = "es_admin")
    private Boolean esAdmin = false;
}
