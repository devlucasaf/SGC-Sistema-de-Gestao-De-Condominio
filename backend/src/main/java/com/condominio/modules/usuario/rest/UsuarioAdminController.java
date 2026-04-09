package com.condominio.modules.usuario.rest;

import com.condominio.modules.usuario.dto.RedefinirSenhaDTO;
import com.condominio.modules.usuario.model.TipoUsuario;
import com.condominio.modules.usuario.model.Usuario;
import com.condominio.modules.usuario.repository.UsuarioRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collections;
import java.util.Map;

@RestController
public class UsuarioAdminController {

    private static final Logger log = LoggerFactory.getLogger(UsuarioAdminController.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * O próprio usuário redefine sua senha
     * comprovando identidade com E-mail + CPF + Data de Nascimento.
     */
    @PostMapping("/auth/recuperar-senha")
    public ResponseEntity<Map<String, String>> recuperarSenha(
            @RequestBody @Valid RedefinirSenhaDTO dto) {

        // --- BUSCA O USUÁRIO PELO E-MAIL ---
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Dados inválidos. Verifique as informações e tente novamente."));

        // --- LIMPA O CPF ---
        String cpfLimpo = dto.getCpf().replaceAll("[^0-9]", "");
        String cpfBanco = usuario.getCpf().replaceAll("[^0-9]", "");

        // --- VERIFICA SE O CPF E DATA DE NASCIMENTO BATEM ---
        boolean cpfConfere = cpfBanco.equals(cpfLimpo);
        boolean dataConfere = usuario.getDataNascimento().equals(dto.getDataNascimento());

        if (!cpfConfere || !dataConfere) {
            throw new RuntimeException("Dados inválidos. Verifique as informações e tente novamente.");
        }

        usuario.setSenhaHash(passwordEncoder.encode(dto.getNovaSenha()));
        usuarioRepository.save(usuario);

        log.info("Senha recuperada com sucesso para: {}", usuario.getEmail());

        return ResponseEntity.ok(Collections.singletonMap(
                "mensagem", "Senha redefinida com sucesso! Agora você pode fazer login com a nova senha."
        ));
    }

    /**
     * Somente SÍNDICO pode redefinir a senha de outro usuário.
     */
    @PatchMapping("/admin/usuarios/redefinir-senha")
    public ResponseEntity<Map<String, String>> redefinirSenhaSindico(
            @AuthenticationPrincipal Usuario sindicoLogado,
            @RequestBody Map<String, String> body) {

        // --- VERIFICA SE QUEM ESTÁ CHAMANDO É O SÍNDICO ---
        if (sindicoLogado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("mensagem", "Usuário não autenticado."));
        }

        if (sindicoLogado.getTipoUsuario() != TipoUsuario.SINDICO) {
            log.warn("Tentativa de redefinir senha por usuário não-síndico: {}", sindicoLogado.getEmail());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Collections.singletonMap("mensagem", "Apenas o síndico pode redefinir senhas de outros usuários."));
        }

        String email = body.get("email");
        String novaSenha = body.get("novaSenha");

        if (email == null || email.isBlank() || novaSenha == null || novaSenha.isBlank()) {
            throw new RuntimeException("E-mail e nova senha são obrigatórios.");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nenhum usuário encontrado com o e-mail: " + email));

        usuario.setSenhaHash(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        log.info("Síndico {} redefiniu a senha do usuário: {}", sindicoLogado.getNome(), usuario.getEmail());

        return ResponseEntity.ok(Collections.singletonMap(
                "mensagem", "Senha do usuário " + usuario.getNome() + " redefinida com sucesso!"
        ));
    }
}
