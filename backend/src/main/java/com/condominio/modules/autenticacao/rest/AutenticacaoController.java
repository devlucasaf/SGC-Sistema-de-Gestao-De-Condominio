package com.condominio.modules.autenticacao.rest;

import com.condominio.modules.autenticacao.dto.AutenticacaoDTO;
import com.condominio.modules.autenticacao.dto.LoginResponseDTO;
import com.condominio.infra.security.TokenService;
import com.condominio.modules.usuario.model.Usuario;
import com.condominio.modules.usuario.repository.UsuarioRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collections;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AutenticacaoController {

    private static final Logger log = LoggerFactory.getLogger(AutenticacaoController.class);

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid AutenticacaoDTO data) {

        // --- BUSCA O USUÁRIO PELO E-MAIL ---
        Usuario usuario = usuarioRepository.findByEmail(data.getEmail()).orElse(null);

        if (usuario == null) {
            log.warn("Tentativa de login com e-mail não cadastrado: {}", data.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "E-mail ou senha inválidos."));
        }

        // --- VERIFICA A SENHA COM BCRYPT ---
        if (!passwordEncoder.matches(data.getSenha(), usuario.getPassword())) {
            log.warn("Senha incorreta para o usuário: {}", data.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "E-mail ou senha inválidos."));
        }

        // --- GERA O TOKEN JWT ---
        String token = tokenService.gerarToken(usuario);

        log.info("Login realizado com sucesso: {} ({})", usuario.getNome(), usuario.getTipoUsuario());

        // --- DEVOLVE O TOKEN ---
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
}
