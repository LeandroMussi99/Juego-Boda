package com.example.back.service;

import com.example.back.entity.Mision;
import com.example.back.repository.MisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MisionService {
    
    @Autowired
    private MisionRepository misionRepository;

    public List<Mision> obtenerTodas() {
        return misionRepository.findAll();
    }
}
