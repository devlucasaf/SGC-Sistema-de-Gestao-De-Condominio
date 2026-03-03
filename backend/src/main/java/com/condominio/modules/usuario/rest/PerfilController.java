package com.condominio.modules.usuario.rest;

import com.condominio.modules.usuario.dto.UsuarioPerfilDTO;
import com.condominio.modules.usuario.model.Usuario;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/perfil")
public class PerfilController {

    @GetMapping
    public ResponseEntity<UsuarioPerfilDTO> getPerfilLogado(@AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(UsuarioPerfilDTO.fromEntity(usuarioLogado));
    }
}