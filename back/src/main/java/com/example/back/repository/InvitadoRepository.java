package com.example.back.repository;

import com.example.back.entity.Invitado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitadoRepository extends JpaRepository<Invitado, Long> {
    Optional<Invitado> findByNombre(String nombre);
    
    List<Invitado> findTop10ByOrderByPuntosTotalesDescUltimaMisionCompletadaAsc();
}