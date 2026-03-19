package com.condominio.modules.aviso.service;

import com.condominio.modules.aviso.dto.AvisoRequestDTO;
import com.condominio.modules.aviso.dto.AvisoResponseDTO;
import com.condominio.modules.aviso.model.Aviso;
import com.condominio.modules.aviso.repository.AvisoRepository;
import com.condominio.modules.sindico.model.Sindico;
import com.condominio.modules.sindico.repository.SindicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvisoService {

    @Autowired
    private AvisoRepository avisoRepository;

    @Autowired
    private SindicoRepository sindicoRepository;

    @Transactional
    public AvisoResponseDTO publicarAviso(AvisoRequestDTO dto) {
        // --- BUSCA O SÍNDICO PELO ID ---
        Sindico sindico = sindicoRepository.findById(dto.getIdSindico())
                .orElseThrow(() -> new RuntimeException("Síndico não encontrado."));

        // --- MONTA O OBJETO AVISO ---
        Aviso aviso = new Aviso();

        aviso.setTitulo(dto.getTitulo());
        aviso.setMensagem(dto.getMensagem());
        aviso.setDataCriacao(LocalDateTime.now());
        aviso.setSindico(sindico);

        // --- SALVA O AVISO NO BANCO DE DADOS ---
        Aviso avisoSalvo = avisoRepository.save(aviso);

        return AvisoResponseDTO.fromEntity(avisoSalvo);
    }

    public List<AvisoResponseDTO> listarMural() {
        return avisoRepository.findAllByOrderByDataCriacaoDesc()
                .stream()
                .map(AvisoResponseDTO::fromEntity) // Converte cada entidade em DTO
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletarAviso(Long id) {
        if (!avisoRepository.existsById(id)) {
            throw new RuntimeException("Aviso não encontrado.");
        }

        avisoRepository.deleteById(id);
    }
}
