package com.condominio.modules.autenticacao.rest;

import com.condominio.modules.autenticacao.dto.AutenticacaoDTO;
import com.condominio.modules.autenticacao.dto.LoginResponseDTO;
import com.condominio.infra.security.TokenService;
import com.condominio.modules.usuario.model.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AutenticacaoDTO data) {

        // --- ENCAPSULA O EMAIL E SENHA ---
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getSenha());

        // --- TENTA FAZER A AUTENTICAÇÃO ---
        var auth = authenticationManager.authenticate(usernamePassword);

        // --- GERA O TOKEN ---
        var token = tokenService.gerarToken((Usuario) auth.getPrincipal());

        // --- DEVOLVE O TOKEN ---
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
}
