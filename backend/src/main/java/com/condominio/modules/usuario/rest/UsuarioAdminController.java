package com.condominio.modules.usuario.rest;

import com.condominio.modules.usuario.dto.RedefinirSenhaDTO;
import com.condominio.modules.usuario.model.Usuario;
import com.condominio.modules.usuario.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collections;
import java.util.Map;

@RestController
public class UsuarioAdminController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * o próprio usuário redefine sua senha
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

        return ResponseEntity.ok(Collections.singletonMap(
                "mensagem", "Senha redefinida com sucesso! Agora você pode fazer login com a nova senha."
        ));
    }

    @PatchMapping("/admin/usuarios/redefinir-senha")
    public ResponseEntity<Map<String, String>> redefinirSenhaSindico(
            @RequestBody Map<String, String> body) {

        String email = body.get("email");
        String novaSenha = body.get("novaSenha");

        if (email == null || email.isBlank() || novaSenha == null || novaSenha.isBlank()) {
            throw new RuntimeException("E-mail e nova senha são obrigatórios.");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nenhum usuário encontrado com o e-mail: " + email));

        usuario.setSenhaHash(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Collections.singletonMap(
                "mensagem", "Senha do usuário " + usuario.getNome() + " redefinida com sucesso!"
        ));
    }
}

