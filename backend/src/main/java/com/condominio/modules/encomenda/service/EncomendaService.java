package com.condominio.modules.encomenda.service;

import com.condominio.infra.pagination.PageMapper;
import com.condominio.infra.pagination.PageResponseDTO;

import com.condominio.modules.encomenda.dto.EncomendaRequestDTO;
import com.condominio.modules.encomenda.dto.EncomendaResponseDTO;
import com.condominio.modules.encomenda.model.Encomenda;
import com.condominio.modules.encomenda.model.StatusEncomenda;
import com.condominio.modules.encomenda.repository.EncomendaRepository;

import com.condominio.modules.porteiro.model.Porteiro;
import com.condominio.modules.porteiro.repository.PorteiroRepository;

import com.condominio.modules.unidade.model.Unidade;
import com.condominio.modules.unidade.repository.UnidadeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.transaction.Transactional;

import java.time.LocalDateTime;

import java.util.stream.Collectors;

@Service
public class EncomendaService {

    @Autowired
    private EncomendaRepository encomendaRepository;

    @Autowired
    private UnidadeRepository unidadeRepository;

    @Autowired
    private PorteiroRepository porteiroRepository;

    @Transactional
    public EncomendaResponseDTO registrarEntrada(EncomendaRequestDTO dto) {

        // --- BUSCA A INIDADE E O PORTEIRO ---
        Unidade unidade = unidadeRepository.findById(dto.getIdUnidade())
                .orElseThrow(() -> new RuntimeException("Unidade não encontrada"));

        Porteiro porteiro = porteiroRepository.findById(dto.getIdPorteiro())
                .orElseThrow(() -> new RuntimeException("Porteiro não encontrado"));

        // --- CRIA A ENTIDADE USANDO O CONSTRUTOR ---
        Encomenda encomenda = new Encomenda(dto.getDescricao(), unidade, porteiro);

        encomendaRepository.save(encomenda);

        return EncomendaResponseDTO.fromEntity(encomenda);
    }

    @Transactional
    public EncomendaResponseDTO registrarRetirada(Long idEncomenda) {
        Encomenda encomenda = encomendaRepository.findById(idEncomenda)
                .orElseThrow(() -> new RuntimeException("Encomenda não encontrada"));

        if (encomenda.getStatus() == StatusEncomenda.RETIRADO) {
            throw new IllegalStateException("Esta encomenda já foi retirada");
        }

        // --- ATUALIZA OS DADOS DE RETIRADA ---
        encomenda.setStatus(StatusEncomenda.RETIRADO);
        encomenda.setDataRetirada(LocalDateTime.now());

        return EncomendaResponseDTO.fromEntity(encomendaRepository.save(encomenda));
    }

    public PageResponseDTO<EncomendaResponseDTO> listarPorUnidade(Long idUnidade, Pageable pageable) {
        Page<Encomenda> pagina = encomendaRepository.findByUnidadeId(idUnidade, pageable);

        return PageMapper.toDTO(pagina, EncomendaResponseDTO::fromEntity);
    }
}
