package com.condominio.modules.unidade.service;

import com.condominio.modules.unidade.dto.UnidadeRequestDTO;
import com.condominio.modules.unidade.dto.UnidadeResponseDTO;
import com.condominio.modules.unidade.model.Unidade;
import com.condominio.modules.unidade.repository.UnidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UnidadeService {

    @Autowired
    private UnidadeRepository unidadeRepository;

    // Cadastrar Unidade
    @Transactional
    public UnidadeResponseDTO cadastrar(UnidadeRequestDTO dto) {
        Unidade unidade = new Unidade();

        unidade.setBloco(dto.getBloco());
        unidade.setAndar(dto.getAndar());
        unidade.setNumeroApto(dto.getNumeroApto());

        unidadeRepository.save(unidade);

        return UnidadeResponseDTO.fromEntity(unidade);
    }

    // Listar Todas
    public List<UnidadeResponseDTO> listarTodas() {
        return unidadeRepository.findAll().stream()
                .map(UnidadeResponseDTO::fromEntity)
                .collect(Collectors.toList());    }
}
