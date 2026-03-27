package com.condominio.modules.reclamacao.service;

import com.condominio.infra.pagination.PageMapper;
import com.condominio.infra.pagination.PageResponseDTO;

import com.condominio.modules.reclamacao.dto.ReclamacaoRequestDTO;
import com.condominio.modules.reclamacao.dto.ReclamacaoResponseDTO;
import com.condominio.modules.reclamacao.model.Reclamacao;
import com.condominio.modules.reclamacao.model.StatusReclamacao;
import com.condominio.modules.reclamacao.repository.ReclamacaoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReclamacaoService {

    @Autowired
    private ReclamacaoRepository repository;

    @Transactional
    public ReclamacaoResponseDTO salvar(ReclamacaoRequestDTO dto) {
        Reclamacao reclamacao = new Reclamacao();

        reclamacao.setTipo(dto.getTipo());
        reclamacao.setCategoria(dto.getCategoria());
        reclamacao.setDescricao(dto.getDescricao());
        reclamacao.setUnidade(dto.getUnidade());

        Reclamacao entidadeSalva = repository.save(reclamacao);

        return converterParaResponseDTO(entidadeSalva);
    }

    public PageResponseDTO<ReclamacaoResponseDTO> buscarTodas(Pageable pageable) {
        Page<Reclamacao> pagina = repository.findAll(pageable);

        return PageMapper.toDTO(pagina, this::converterParaResponseDTO);
    }

    public PageResponseDTO<ReclamacaoResponseDTO> buscarPorUnidade(String unidade, Pageable pageable) {
        Page<Reclamacao> pagina = repository.findByUnidade(unidade, pageable);
        return PageMapper.toDTO(pagina, this::converterParaResponseDTO);
    }

    public List<ReclamacaoResponseDTO> buscarTodas() {
        return repository.findAll()
                .stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void atualizarStatus(Long id, StatusReclamacao novoStatus) {
        Reclamacao reclamacao = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reclamação não encontrada."));

        reclamacao.setStatus(novoStatus);
        repository.save(reclamacao);
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
