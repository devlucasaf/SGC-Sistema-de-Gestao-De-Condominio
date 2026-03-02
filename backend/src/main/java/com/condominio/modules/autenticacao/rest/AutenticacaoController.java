package com.condominio.modules.autenticacao.rest;

import com.condominio.modules.autenticacao.dto.AutenticacaoDTO;
import com.condominio.modules.autenticacao.dto.LoginResponseDTO;
import com.condominio.infra.security.TokenService;
import com.condominio.modules.usuario.model.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AutenticacaoDTO data) {

        // Encapsula o email e senha
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getSenha());

        // Tenta fazer a autenticação
        var auth = authenticationManager.authenticate(usernamePassword);

        // Gera o token se der certo
        var token = tokenService.gerarToken((Usuario) auth.getPrincipal());

        // Devolve o token
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
}
