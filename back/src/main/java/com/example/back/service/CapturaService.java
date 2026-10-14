package com.example.back.service;

import com.example.back.dto.CapturaRequestDTO;
import com.example.back.entity.Captura;
import com.example.back.entity.Invitado;
import com.example.back.entity.Mision;
import com.example.back.repository.CapturaRepository;
import com.example.back.repository.InvitadoRepository;
import com.example.back.repository.MisionRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CapturaService {
    
    private CapturaRepository capturaRepository;
    private InvitadoRepository invitadoRepository;
    private MisionRepository misionRepository;

    @Transactional
    public Captura registrarCaptura(CapturaRequestDTO request) {
        // 1. Regla anti-trampas: Validar si el invitado ya hizo esta misión
        if (capturaRepository.existsByInvitadoIdAndMisionId(request.getInvitadoId(), request.getMisionId())) {
            throw new RuntimeException("Ya completaste esta misión.");
        }

        // 2. Buscar al invitado y la misión en la base de datos
        Invitado invitado = invitadoRepository.findById(request.getInvitadoId())
                .orElseThrow(() -> new RuntimeException("Invitado no encontrado"));
        Mision mision = misionRepository.findById(request.getMisionId())
                .orElseThrow(() -> new RuntimeException("Misión no encontrada"));

        // 3. Crear y guardar el registro de la captura
        Captura captura = new Captura();
        captura.setInvitado(invitado);
        captura.setMision(mision);
        captura.setUrlMultimedia(request.getUrlMultimedia());
        capturaRepository.save(captura);

        // 4. Sumar los puntos al invitado y registrar la hora exacta del desempate
        invitado.setPuntosTotales(invitado.getPuntosTotales() + mision.getPuntos());
        invitado.setUltimaMisionCompletada(LocalDateTime.now());
        invitadoRepository.save(invitado);

        return captura;
    }

    public List<Long> obtenerMisionesCompletadas(Long invitadoId) {
        return capturaRepository.findByInvitadoId(invitadoId)
                .stream()
                .map(captura -> captura.getMision().getId())
                .toList();
    }
}