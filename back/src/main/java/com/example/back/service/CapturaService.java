package com.example.back.service;

import com.example.back.dto.CapturaRequestDTO;
import com.example.back.dto.CapturaResponseDTO;
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
    
    private final CapturaRepository capturaRepository;
    private final InvitadoRepository invitadoRepository;
    private final MisionRepository misionRepository;

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
        captura.setEstadoValidacion("PENDIENTE");
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

    // 1. Traer la lista para el panel de Admin
    public List<CapturaResponseDTO> obtenerPendientes() {
        return capturaRepository.findByEstadoValidacion("PENDIENTE").stream()
                .map(c -> {
                    CapturaResponseDTO dto = new CapturaResponseDTO();
                    dto.setId(c.getId());
                    dto.setUrlMultimedia(c.getUrlMultimedia());
                    dto.setNombreInvitado(c.getInvitado().getNombre());
                    dto.setDescripcionMision(c.getMision().getDescripcion());
                    dto.setPuntosMision(c.getMision().getPuntos());
                    return dto;
                }).toList();
    }

    // 2. Aprobar foto (Mantiene los puntos)
    public void aprobarCaptura(Long id) {
        Captura captura = capturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Captura no encontrada"));
        captura.setEstadoValidacion("APROBADA");
        capturaRepository.save(captura);
    }

    // 3. Rechazar foto (Quita puntos y elimina la foto para reintentar)
    public void rechazarCaptura(Long id) {
        Captura captura = capturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Captura no encontrada"));
        
        Invitado invitado = captura.getInvitado();
        invitado.setPuntosTotales(invitado.getPuntosTotales() - captura.getMision().getPuntos());
        invitadoRepository.save(invitado);
        
        capturaRepository.delete(captura);
    }
}