package com.condominio.modules.reclamacao.service;

import com.condominio.modules.reclamacao.dto.ReclamacaoRequestDTO;
import com.condominio.modules.reclamacao.dto.ReclamacaoResponseDTO; // Importante importar o novo DTO
import com.condominio.modules.reclamacao.model.Reclamacao;
import com.condominio.modules.reclamacao.repository.ReclamacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReclamacaoService {

    @Autowired
    private ReclamacaoRepository repository;

    public ReclamacaoResponseDTO salvar(ReclamacaoRequestDTO dto) {
        Reclamacao reclamacao = new Reclamacao();

        reclamacao.setTipo(dto.getTipo());
        reclamacao.setCategoria(dto.getCategoria());
        reclamacao.setDescricao(dto.getDescricao());
        reclamacao.setUnidade(dto.getUnidade());

        Reclamacao entidadeSalva = repository.save(reclamacao);

        return converterParaResponseDTO(entidadeSalva);
    }

    public List<ReclamacaoResponseDTO> buscarTodas() {
        return repository.findAll()
                .stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }


    private ReclamacaoResponseDTO converterParaResponseDTO(Reclamacao reclamacao) {
        ReclamacaoResponseDTO response = new ReclamacaoResponseDTO();

        response.setId(reclamacao.getId());
        response.setTipo(reclamacao.getTipo());
        response.setCategoria(reclamacao.getCategoria());
        response.setDescricao(reclamacao.getDescricao());
        response.setUnidade(reclamacao.getUnidade());
        response.setStatus(reclamacao.getStatus());
        response.setDataCriacao(reclamacao.getDataCriacao());

        return response;
    }
}