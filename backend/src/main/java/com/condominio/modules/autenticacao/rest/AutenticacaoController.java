package com.condominio.modules.autenticacao.rest;

import com.condominio.modules.autenticacao.dto.AutenticacaoDTO;
import com.condominio.modules.autenticacao.dto.LoginResponseDTO;
import com.condominio.infra.security.TokenService;
import com.condominio.modules.usuario.model.Usuario;
import com.condominio.modules.usuario.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AutenticacaoController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AutenticacaoDTO data) {

        // --- BUSCA O USUÁRIO PELO E-MAIL ---
        Usuario usuario = usuarioRepository.findByEmail(data.getEmail())
                .orElseThrow(() -> new RuntimeException("E-mail ou senha inválidos."));

        // --- VERIFICA A SENHA COM BCRYPT ---
        if (!passwordEncoder.matches(data.getSenha(), usuario.getPassword())) {
            throw new RuntimeException("E-mail ou senha inválidos.");
        }

        // --- GERA O TOKEN JWT ---
        String token = tokenService.gerarToken(usuario);

        // --- DEVOLVE O TOKEN ---
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
}
