package com.condominio.modules.visitante.service;

import com.condominio.modules.porteiro.model.Porteiro;
import com.condominio.modules.porteiro.repository.PorteiroRepository;

import com.condominio.modules.unidade.model.Unidade;
import com.condominio.modules.unidade.repository.UnidadeRepository;

import com.condominio.modules.visitante.dto.VisitanteRequestDTO;
import com.condominio.modules.visitante.dto.VisitanteResponseDTO;
import com.condominio.modules.visitante.model.RegistrarAcesso;
import com.condominio.modules.visitante.model.Visitante;
import com.condominio.modules.visitante.repository.RegistrarAcessoRepository;
import com.condominio.modules.visitante.repository.VisitanteRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

import java.time.LocalDateTime;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VisitanteService {

    @Autowired
    private VisitanteRepository visitanteRepository;

    @Autowired
    private RegistrarAcessoRepository acessoRepository;

    @Autowired
    private UnidadeRepository unidadeRepository;

    @Autowired
    private PorteiroRepository porteiroRepository;

    @Transactional
    public VisitanteResponseDTO registrarEntrada(VisitanteRequestDTO dto) {

        // --- VERIFICA SE A UNIDADE E O PORTEIRO EXISTE ---
        Unidade unidade = unidadeRepository.findById(dto.getIdUnidade())
                .orElseThrow(() -> new RuntimeException("Unidade não encontrada!"));

        Porteiro porteiro = porteiroRepository.findById(dto.getIdPorteiro())
                .orElseThrow(() -> new RuntimeException("Porteiro não encontrado!"));

        Visitante visitante = visitanteRepository.findByCpf(dto.getCpf())
                .orElseGet(() -> {
                    Visitante novo = new Visitante();

                    novo.setNome(dto.getNome());
                    novo.setCpf(dto.getCpf());
                    novo.setTelefone(dto.getTelefone());

                    return visitanteRepository.save(novo);
                });

        // --- CRIA O REGISTRO DE ACESSO ---
        RegistrarAcesso acesso = new RegistrarAcesso();

        acesso.setVisitante(visitante);
        acesso.setUnidade(unidade);
        acesso.setPorteiroEntrada(porteiro);
        acesso.setDataHoraEntrada(LocalDateTime.now());

        RegistrarAcesso salvo = acessoRepository.save(acesso);
        return VisitanteResponseDTO.fromEntity(salvo);
    }

    @Transactional
    public VisitanteResponseDTO registrarSaida(Long idAcesso) {
        RegistrarAcesso acesso = acessoRepository.findById(idAcesso)
                .orElseThrow(() -> new RuntimeException("Registro de acesso não encontrado"));

        if (acesso.getDataHoraSaida() != null) {
            throw new IllegalStateException("Saída já registrada para este acesso.");
        }

        acesso.setDataHoraSaida(LocalDateTime.now());
        
        
        return VisitanteResponseDTO.fromEntity(acessoRepository.save(acesso));
    }

    public List<VisitanteResponseDTO> listarPresentes() {
        return acessoRepository.findByDataHoraSaidaIsNull()
                .stream()
                .map(VisitanteResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // --- LISTAR TODOS OS REGISTROS DE ACESSO (HISTÓRICO) ---
    public List<VisitanteResponseDTO> listarTodos() {
        return acessoRepository.findAllByOrderByDataHoraEntradaDesc()
                .stream()
                .map(VisitanteResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
