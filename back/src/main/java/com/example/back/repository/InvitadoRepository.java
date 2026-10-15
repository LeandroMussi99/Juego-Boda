package com.example.back.repository;

import com.example.back.entity.Invitado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvitadoRepository extends JpaRepository<Invitado, Long> {
    Optional<Invitado> findByNombreAndNumeroMesa(String nombre, Integer numeroMesa);
    
    List<Invitado> findTop10ByOrderByPuntosTotalesDescUltimaMisionCompletadaAsc();
}