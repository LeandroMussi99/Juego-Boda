package com.example.back.service;

import com.example.back.entity.Invitado;
import com.example.back.repository.InvitadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class InvitadoService {

    @Autowired
    private InvitadoRepository invitadoRepository;

    // Lógica del Login: Si el nombre existe, lo devuelve. Si no existe, lo crea y lo guarda.
    public Invitado loginORegistro(String nombre) {
        Optional<Invitado> invitadoExistente = invitadoRepository.findByNombre(nombre);
        
        if (invitadoExistente.isPresent()) {
            return invitadoExistente.get();
        }
        
        Invitado nuevoInvitado = new Invitado();
        nuevoInvitado.setNombre(nombre);
        
        return invitadoRepository.save(nuevoInvitado);
    }
}