package com.example.back.service;

import com.example.back.dto.LoginRequestDTO;
import com.example.back.dto.RankingResponseDTO;
import com.example.back.entity.Invitado;
import com.example.back.repository.InvitadoRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvitadoService {

    private final InvitadoRepository invitadoRepository;

    public Invitado login(LoginRequestDTO request) {
        Optional<Invitado> invitadoExistente = invitadoRepository.findByNombreAndNumeroMesa(
                request.getNombre(), request.getNumeroMesa()
        );

        if (invitadoExistente.isPresent()) {
            Invitado invitado = invitadoExistente.get();
            if (request.getFotoPerfilUrl() != null) {
                invitado.setFotoPerfilUrl(request.getFotoPerfilUrl());
                invitadoRepository.save(invitado);
            }
            return invitado;
        }

        // Si no existía, creamos un jugador nuevo
        Invitado nuevo = new Invitado();
        nuevo.setNombre(request.getNombre());
        nuevo.setNumeroMesa(request.getNumeroMesa());
        nuevo.setFotoPerfilUrl(request.getFotoPerfilUrl());
        nuevo.setPuntosTotales(0);
        return invitadoRepository.save(nuevo);
    }

    public List<RankingResponseDTO> obtenerRanking() {
        return invitadoRepository.findTop10ByOrderByPuntosTotalesDescUltimaMisionCompletadaAsc()
                .stream()
                .map(invitado -> new RankingResponseDTO(
                        invitado.getNombre(), 
                        invitado.getPuntosTotales(),
                        invitado.getFotoPerfilUrl()
                ))
                .toList();
    }
}