package com.example.back.service;

import com.example.back.entity.Mision;
import com.example.back.repository.MisionRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MisionService {
    
    private MisionRepository misionRepository;

    public List<Mision> obtenerTodas() {
        return misionRepository.findAll();
    }
}
