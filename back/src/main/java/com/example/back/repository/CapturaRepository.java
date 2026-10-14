package com.example.back.repository;

import com.example.back.entity.Captura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CapturaRepository extends JpaRepository<Captura, Long> {
    // Para la regla anti-trampas: verificamos si ya existe una foto de este invitado para esta misión
    boolean existsByInvitadoIdAndMisionId(Long invitadoId, Long misionId);

    List<Captura> findByInvitadoId(Long invitadoId);
}
