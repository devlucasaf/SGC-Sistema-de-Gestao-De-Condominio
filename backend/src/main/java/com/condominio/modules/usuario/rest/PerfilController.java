package com.condominio.modules.usuario.rest;

import com.condominio.modules.usuario.dto.UsuarioPerfilDTO;
import com.condominio.modules.usuario.model.Usuario;
import com.condominio.modules.usuario.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/perfil")
@CrossOrigin("*")
public class PerfilController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<UsuarioPerfilDTO> getPerfilLogado(@AuthenticationPrincipal Usuario usuarioLogado) {
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(UsuarioPerfilDTO.fromEntity(usuarioLogado));
    }

    /**
     * O próprio usuário logado altera sua senha.
     * Precisa informar a senha atual para confirmar identidade.
     */
    @PatchMapping("/alterar-senha")
    public ResponseEntity<Map<String, String>> alterarSenha(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody Map<String, String> body) {

        if (usuarioLogado == null) {
            return ResponseEntity.status(401).body(Collections.singletonMap("erro", "Usuário não autenticado."));
        }

        String senhaAtual = body.get("senhaAtual");
        String novaSenha = body.get("novaSenha");

        if (senhaAtual == null || senhaAtual.isBlank() || novaSenha == null || novaSenha.isBlank()) {
            throw new IllegalArgumentException("Senha atual e nova senha são obrigatórias.");
        }

        if (novaSenha.length() < 6) {
            throw new IllegalArgumentException("A nova senha deve ter no mínimo 6 caracteres.");
        }

        // --- VERIFICA SE A SENHA ATUAL ESTÁ CORRETA ---
        if (!passwordEncoder.matches(senhaAtual, usuarioLogado.getPassword())) {
            throw new IllegalArgumentException("Senha atual incorreta.");
        }

        // --- ATUALIZA A SENHA ---
        usuarioLogado.setSenhaHash(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuarioLogado);

        return ResponseEntity.ok(Collections.singletonMap(
                "mensagem", "Senha alterada com sucesso!"
        ));
    }
}
