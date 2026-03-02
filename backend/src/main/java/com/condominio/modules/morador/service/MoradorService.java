package com.condominio.modules.morador.service;

import com.condominio.modules.morador.dto.MoradorRequestDTO;
import com.condominio.modules.morador.dto.MoradorResponseDTO;
import com.condominio.modules.morador.model.Morador;
import com.condominio.modules.morador.repository.MoradorRepository;
import com.condominio.modules.unidade.model.Unidade;
import com.condominio.modules.unidade.repository.UnidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MoradorService {

    @Autowired
    private MoradorRepository moradorRepository;

    @Autowired
    private UnidadeRepository unidadeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- CADASTRAR MORADOR ---
    @Transactional
    public MoradorResponseDTO cadastrar(MoradorRequestDTO dto) {

        // Valida a existência de um CPF
        if (moradorRepository.existsByCpf(dto.getCpf())) {
            throw new IllegalArgumentException("Erro: CPF já cadastrado no sistema.");
        }

        // Valida a existência de um E-mail
        if (moradorRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Erro: E-mail já utilizado por outro usuário.");
        }

        // Valida a existência de uma unidade
        Unidade unidade = unidadeRepository.findById(dto.getIdUnidade())
                .orElseThrow(() -> new EntityNotFoundException("Unidade não encontrada com o ID: " + dto.getIdUnidade()));

        // Criação da Entidade
        Morador morador = new Morador(
                dto.getNome(),
                dto.getDataNascimento(), // Agora vem antes do CPF
                dto.getCpf(),
                dto.getEmail(),
                passwordEncoder.encode(dto.getSenha()), // senhaHash
                dto.getTelefone(), // O telefone agora entra direto no construtor!
                unidade,
                dto.getTipoMorador()
        );

        // Define o telefone
        morador.setTelefone(dto.getTelefone());

        // Salva no banco de dados
        moradorRepository.save(morador);

        return MoradorResponseDTO.fromEntity(morador);
    }

    public MoradorResponseDTO buscarPorId(Long id) {
        Morador morador = moradorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Morador não encontrado com id: " + id));

        return MoradorResponseDTO.fromEntity(morador);
    }

    public List<MoradorResponseDTO> listarTodos() {
        return moradorRepository.findAll()
                .stream()
                .map(MoradorResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

}
