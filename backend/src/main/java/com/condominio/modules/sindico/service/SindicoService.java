package com.condominio.modules.sindico.service;

import com.condominio.modules.sindico.dto.SindicoRequestDTO;
import com.condominio.modules.sindico.dto.SindicoResponseDTO;
import com.condominio.modules.sindico.model.Sindico;
import com.condominio.modules.sindico.repository.SindicoRepository;
import com.condominio.modules.usuario.model.Usuario;
import com.condominio.modules.usuario.model.TipoUsuario;
import com.condominio.modules.usuario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SindicoService {

    @Autowired
    private SindicoRepository sindicoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public SindicoResponseDTO cadastrar(SindicoRequestDTO dto) {

        // --- VERIFICA SE O CPF OU E-MAIL EXISTEM ---
        if (usuarioRepository.existsByCpf(dto.getCpf())) {
            throw new RuntimeException("CPF já cadastrado no sistema.");
        }

        Usuario novoUsuario = new Usuario();

        novoUsuario.setNome(dto.getNome());
        novoUsuario.setCpf(dto.getCpf());
        novoUsuario.setEmail(dto.getEmail());
        novoUsuario.setTelefone(dto.getTelefone());
        novoUsuario.setDataNascimento(dto.getDataNascimento());
        novoUsuario.setTipoUsuario(TipoUsuario.SINDICO); 

        String senhaCripto = passwordEncoder.encode(dto.getSenha());
        novoUsuario.setSenhaHash(senhaCripto);

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        Sindico novoSindico = new Sindico();

        novoSindico.setUsuario(usuarioSalvo);
        novoSindico.setDataInicioMandato(dto.getDataInicioMandato());
        novoSindico.setDataFimMandato(dto.getDataFimMandato());
        novoSindico.setStatus("ATIVO");

        Sindico sindicoSalvo = sindicoRepository.save(novoSindico);

        return SindicoResponseDTO.fromEntity(sindicoSalvo);
    }

    public List<SindicoResponseDTO> listarTodos() {
        return sindicoRepository.findAll().stream()
                .map(SindicoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void alternarStatus(Long id, String novoStatus) {
        Sindico sindico = sindicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Síndico não encontrado."));

        sindico.setStatus(novoStatus);
        sindicoRepository.save(sindico);
    }
}