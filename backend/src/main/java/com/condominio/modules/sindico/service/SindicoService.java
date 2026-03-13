package com.condominio.modules.sindico.service;

import com.condominio.modules.sindico.dto.SindicoRequestDTO;
import com.condominio.modules.sindico.dto.SindicoResponseDTO;
import com.condominio.modules.sindico.repository.SindicoRepository;
import com.condominio.modules.usuario.model.TipoUsuario;
import com.condominio.modules.usuario.model.Usuario;
import com.condominio.modules.usuario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        // --- VERIFICA SE O CPF OU EMAIL EXISTE ---
        if (usuarioRepository.existsByCpf(dto.getCpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }

        // --- CRIA E SALVA O USUÁRIO BASE ---
        Usuario newUser = new Usuario();

        newUser.setNome(dto.getNome());
        newUser.setCpf(dto.getCpf());
        newUser.setEmail(dto.getEmail());
        newUser.setTelefone((dto.getTelefone()));
        newUser.setDataNascimento(dto.getDataNascimento());
        newUser.setTipoUsuario(TipoUsuario.SINDICO); // define o cargo

        // --- CRIPTOGRAFA A SENHA ---
        String senhaCriptografada = passwordEncoder.encode(dto.getSenha());
        usuario.setSenhaHash(senhaCriptografada);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
    }
}
