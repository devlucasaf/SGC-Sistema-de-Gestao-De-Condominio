package com.condominio.modules.solicitacao.service;

import com.condominio.infra.pagination.PageMapper;
import com.condominio.infra.pagination.PageResponseDTO;

import com.condominio.modules.solicitacao.dto.SolicitacaoRequestDTO;
import com.condominio.modules.solicitacao.dto.SolicitacaoResponseDTO;
import com.condominio.modules.solicitacao.model.Solicitacao;
import com.condominio.modules.solicitacao.model.StatusSolicitacao;
import com.condominio.modules.solicitacao.repository.SolicitacaoRepository;
import com.condominio.modules.usuario.model.Usuario;
import com.condominio.modules.usuario.repository.UsuarioRepository;
import com.condominio.modules.morador.model.Morador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public SolicitacaoResponseDTO salvar(SolicitacaoRequestDTO dto, Long moradorId, String unidade) {
        Solicitacao solicitacao = new Solicitacao();

        solicitacao.setTipo(dto.getTipo());
        solicitacao.setTitulo(dto.getTitulo());
        solicitacao.setDescricao(dto.getDescricao());
        solicitacao.setDataPrevista(LocalDate.parse(dto.getDataPrevista()));
        solicitacao.setMoradorId(moradorId);
        solicitacao.setUnidade(unidade);

        Solicitacao entidadeSalva = repository.save(solicitacao);

        return converterParaResponseDTO(entidadeSalva);
    }

    @Transactional(readOnly = true)
    public PageResponseDTO<SolicitacaoResponseDTO> buscarTodas(Pageable pageable) {
        Page<Solicitacao> pagina = repository.findAll(pageable);
        return PageMapper.toDTO(pagina, this::converterParaResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> buscarPorMorador(Long moradorId) {
        return repository.findByMoradorIdOrderByDataCriacaoDesc(moradorId)
                .stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    public PageResponseDTO<SolicitacaoResponseDTO> buscarPorUnidade(String unidade, Pageable pageable) {
        Page<Solicitacao> pagina = repository.findByUnidadeOrderByDataCriacaoDesc(unidade, pageable);
        return PageMapper.toDTO(pagina, this::converterParaResponseDTO);
    }

    @Transactional
    public void atualizarStatus(Long id, StatusSolicitacao novoStatus) {
        Solicitacao solicitacao = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada."));

        solicitacao.setStatus(novoStatus);
        repository.save(solicitacao);
    }

    private SolicitacaoResponseDTO converterParaResponseDTO(Solicitacao solicitacao) {
        SolicitacaoResponseDTO response = new SolicitacaoResponseDTO();

        response.setId(solicitacao.getId());
        response.setTipo(solicitacao.getTipo());
        response.setTitulo(solicitacao.getTitulo());
        response.setDescricao(solicitacao.getDescricao());
        response.setDataPrevista(solicitacao.getDataPrevista());
        response.setStatus(solicitacao.getStatus());
        response.setUnidade(solicitacao.getUnidade());
        response.setMoradorId(solicitacao.getMoradorId());
        response.setDataCriacao(solicitacao.getDataCriacao());

        // --- BUSCAR DADOS DO MORADOR ---
        if (solicitacao.getMoradorId() != null) {
            usuarioRepository.findById(solicitacao.getMoradorId()).ifPresent(usuario -> {
                response.setNomeMorador(usuario.getNome());
                if (usuario instanceof Morador) {
                    Morador morador = (Morador) usuario;
                    if (morador.getUnidade() != null) {
                        response.setApartamentoMorador(
                            "Apto " + morador.getUnidade().getNumeroApto() +
                            " - Bloco " + morador.getUnidade().getBloco()
                        );
                    }
                }
            });
        }

        return response;
    }
}

