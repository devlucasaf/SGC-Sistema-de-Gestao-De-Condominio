package com.condominio.modules.votacao.service;

import com.condominio.modules.morador.model.Morador;
import com.condominio.modules.usuario.model.Usuario;
import com.condominio.modules.usuario.repository.UsuarioRepository;
import com.condominio.modules.votacao.dto.VotacaoRequestDTO;
import com.condominio.modules.votacao.dto.VotacaoResponseDTO;
import com.condominio.modules.votacao.dto.VotoRequestDTO;
import com.condominio.modules.votacao.model.StatusVotacao;
import com.condominio.modules.votacao.model.Votacao;
import com.condominio.modules.votacao.model.Voto;
import com.condominio.modules.votacao.repository.VotacaoRepository;
import com.condominio.modules.votacao.repository.VotoRepository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VotacaoService {

    @Autowired
    private VotacaoRepository votacaoRepository;

    @Autowired
    private VotoRepository votoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public VotacaoResponseDTO criar(VotacaoRequestDTO dto) {
        Votacao votacao = new Votacao();
        votacao.setTitulo(dto.getTitulo());
        votacao.setDescricao(dto.getDescricao());
        votacao.setDataInicio(LocalDate.parse(dto.getDataInicio()));
        votacao.setDataFim(LocalDate.parse(dto.getDataFim()));

        try {
            votacao.setCandidatos(objectMapper.writeValueAsString(dto.getCandidatos()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erro ao serializar candidatos.");
        }

        Votacao salva = votacaoRepository.save(votacao);
        return converterParaDTO(salva, null);
    }

    @Transactional(readOnly = true)
    public List<VotacaoResponseDTO> listarTodas(Long usuarioLogadoId) {
        return votacaoRepository.findAllByOrderByDataCriacaoDesc()
                .stream()
                .map(v -> converterParaDTO(v, usuarioLogadoId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VotacaoResponseDTO> listarAbertas(Long usuarioLogadoId) {
        return votacaoRepository.findByStatusOrderByDataCriacaoDesc(StatusVotacao.ABERTA)
                .stream()
                .map(v -> converterParaDTO(v, usuarioLogadoId))
                .collect(Collectors.toList());
    }

    @Transactional
    public void votar(Long votacaoId, VotoRequestDTO dto, Long moradorId) {
        Votacao votacao = votacaoRepository.findById(votacaoId)
                .orElseThrow(() -> new RuntimeException("Votação não encontrada."));

        if (votacao.getStatus() != StatusVotacao.ABERTA) {
            throw new RuntimeException("Esta votação não está aberta.");
        }

        LocalDate hoje = LocalDate.now();
        if (hoje.isBefore(votacao.getDataInicio()) || hoje.isAfter(votacao.getDataFim())) {
            throw new RuntimeException("Votação fora do período permitido.");
        }

        if (votoRepository.existsByVotacaoIdAndMoradorId(votacaoId, moradorId)) {
            throw new RuntimeException("Você já votou nesta eleição.");
        }

        // --- VERIFICAR SE O CANDIDATO É VÁLIDO ---
        List<String> candidatos = parseCandidatos(votacao.getCandidatos());
        if (!candidatos.contains(dto.getCandidato())) {
            throw new RuntimeException("Candidato inválido.");
        }

        Voto voto = new Voto();

        voto.setVotacao(votacao);
        voto.setMoradorId(moradorId);
        voto.setCandidato(dto.getCandidato());

        // --- BUSCAR UNIDADE DO MORADOR ---
        usuarioRepository.findById(moradorId).ifPresent(u -> {
            if (u instanceof Morador) {
                Morador m = (Morador) u;
                if (m.getUnidade() != null) {
                    voto.setUnidade("Apto " + m.getUnidade().getNumeroApto() + " - Bloco " + m.getUnidade().getBloco());
                }
            }
        });

        votoRepository.save(voto);
    }

    @Transactional
    public void alterarStatus(Long id, StatusVotacao novoStatus) {
        Votacao votacao = votacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Votação não encontrada."));
        votacao.setStatus(novoStatus);
        votacaoRepository.save(votacao);
    }

    @Transactional(readOnly = true)
    public VotacaoResponseDTO buscarPorId(Long id, Long usuarioLogadoId) {
        Votacao votacao = votacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Votação não encontrada."));
        return converterParaDTO(votacao, usuarioLogadoId);
    }

    private VotacaoResponseDTO converterParaDTO(Votacao votacao, Long usuarioLogadoId) {
        VotacaoResponseDTO dto = new VotacaoResponseDTO();

        dto.setId(votacao.getId());
        dto.setTitulo(votacao.getTitulo());
        dto.setDescricao(votacao.getDescricao());
        dto.setCandidatos(parseCandidatos(votacao.getCandidatos()));
        dto.setDataInicio(votacao.getDataInicio());
        dto.setDataFim(votacao.getDataFim());
        dto.setStatus(votacao.getStatus());
        dto.setDataCriacao(votacao.getDataCriacao());

        // --- CONTAR VOTOS ---
        List<Voto> votos = votoRepository.findByVotacaoId(votacao.getId());
        dto.setTotalVotos(votos.size());

        // --- RESULTADO ---
        Map<String, Long> resultado = new LinkedHashMap<>();
        for (String candidato : parseCandidatos(votacao.getCandidatos())) {
            resultado.put(candidato, votos.stream().filter(v -> v.getCandidato().equals(candidato)).count());
        }
        dto.setResultado(resultado);

        // --- JÁ VOTOU? ---
        if (usuarioLogadoId != null) {
            dto.setJaVotou(votoRepository.existsByVotacaoIdAndMoradorId(votacao.getId(), usuarioLogadoId));
        }

        return dto;
    }

    private List<String> parseCandidatos(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }
}

