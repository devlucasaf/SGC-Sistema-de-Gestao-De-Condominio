package com.condominio.modules.morador.service;

import com.condominio.modules.morador.dto.MoradorRequestDTO;
import com.condominio.modules.morador.dto.MoradorResponseDTO;
import com.condominio.modules.morador.model.Morador;
import com.condominio.modules.morador.repository.MoradorRepository;
import com.condominio.modules.unidade.model.Unidade;
import com.condominio.modules.unidade.repository.UnidadeRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

import java.util.List;

import java.util.stream.Collectors;

@Service
public class MoradorService {

    private static final Logger log = LoggerFactory.getLogger(MoradorService.class);

    @Autowired
    private MoradorRepository moradorRepository;

    @Autowired
    private UnidadeRepository unidadeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- CADASTRAR MORADOR ---
    @Transactional
    public MoradorResponseDTO cadastrar(MoradorRequestDTO dto) {

        // --- VALIDA A EXISTÊNCIA DE UM CPF ---
        if (moradorRepository.existsByCpf(dto.getCpf())) {
            throw new IllegalArgumentException("Erro: CPF já cadastrado no sistema.");
        }

        // --- VALIDA A EXISTÊNCIA DE UM E-MAIL ---
        if (moradorRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Erro: E-mail já utilizado por outro usuário.");
        }

        // --- VALIDA A EXISTÊNCIA DE UMA UNIDADE ---
        Unidade unidade = unidadeRepository.findById(dto.getIdUnidade())
                .orElseThrow(() -> new EntityNotFoundException("Unidade não encontrada com o ID: " + dto.getIdUnidade()));

        // --- CRIAÇÃO DE ENTIDADE ---
        Morador morador = new Morador(
                dto.getNome(),
                dto.getDataNascimento(),
                dto.getCpf(),
                dto.getEmail(),
                passwordEncoder.encode(dto.getSenha()),
                dto.getTelefone(),
                unidade,
                dto.getTipoMorador()
        );

        // --- DEFINE O TELEFONE ---
        morador.setTelefone(dto.getTelefone());

        // --- SALVA NO BANCO DE DADOS ---
        moradorRepository.save(morador);

        log.info("Morador cadastrado: {} ({})", morador.getNome(), morador.getEmail());

        return MoradorResponseDTO.fromEntity(morador);
    }

    @Transactional(readOnly = true)
    public MoradorResponseDTO buscarPorId(Long id) {
        Morador morador = moradorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Morador não encontrado com id: " + id));

        return MoradorResponseDTO.fromEntity(morador);
    }

    @Transactional(readOnly = true)
    public List<MoradorResponseDTO> listarTodos() {
        return moradorRepository.findAll()
                .stream()
                .map(MoradorResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // --- ATUALIZAR MORADOR ---
    @Transactional
    public MoradorResponseDTO atualizar(Long id, MoradorRequestDTO dto) {
        Morador morador = moradorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Morador não encontrado com id: " + id));

        Unidade unidade = unidadeRepository.findById(dto.getIdUnidade())
                .orElseThrow(() -> new EntityNotFoundException("Unidade não encontrada com o ID: " + dto.getIdUnidade()));

        morador.setNome(dto.getNome());
        morador.setDataNascimento(dto.getDataNascimento());
        morador.setEmail(dto.getEmail());
        morador.setTelefone(dto.getTelefone());
        morador.setUnidade(unidade);
        morador.setTipoMorador(dto.getTipoMorador());

        // --- SÓ ATUALIZA A SENHA SE FOI INFORMADA ---
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            morador.setSenhaHash(passwordEncoder.encode(dto.getSenha()));
        }

        moradorRepository.save(morador);

        log.info("Morador atualizado: {} (id={})", morador.getNome(), morador.getId());

        return MoradorResponseDTO.fromEntity(morador);
    }

    // --- REMOVER MORADOR ---
    @Transactional
    public void remover(Long id) {
        Morador morador = moradorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Morador não encontrado com id: " + id));

        log.info("Removendo morador: {} (id={})", morador.getNome(), morador.getId());

        moradorRepository.delete(morador);
    }
}
