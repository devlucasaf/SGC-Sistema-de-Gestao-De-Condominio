package sgc.condominio.modules.usuario.rest;

import sgc.condominio.modules.morador.model.Morador;
import sgc.condominio.modules.unidade.model.Unidade;
import sgc.condominio.modules.unidade.repository.UnidadeRepository;
import sgc.condominio.modules.usuario.dto.AtualizarCadastroDTO;
import sgc.condominio.modules.usuario.dto.UsuarioPerfilDTO;
import sgc.condominio.modules.usuario.model.Usuario;
import sgc.condominio.modules.usuario.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/perfil")
@CrossOrigin("*")
public class PerfilController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UnidadeRepository unidadeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<UsuarioPerfilDTO> getPerfilLogado(@AuthenticationPrincipal Usuario usuarioLogado) {
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }

        Usuario usuarioCompleto = usuarioRepository.findById(usuarioLogado.getId()).orElse(null);
        if (usuarioCompleto == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok(UsuarioPerfilDTO.fromEntity(usuarioCompleto));
    }

    /**
     * O morador atualiza seus dados cadastrais: nome, email, telefone, apartamento e bloco.
     * O andar é calculado automaticamente pelo número do apartamento.
     */
    @PatchMapping("/atualizar-cadastro")
    @Transactional
    public ResponseEntity<?> atualizarCadastro(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody AtualizarCadastroDTO dto) {

        if (usuarioLogado == null) {
            return ResponseEntity.status(401).body(Collections.singletonMap("erro", "Usuário não autenticado."));
        }

        Usuario usuario = usuarioRepository.findById(usuarioLogado.getId()).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(404).body(Collections.singletonMap("erro", "Usuário não encontrado."));
        }

        // --- ATUALIZA NOME ---
        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            usuario.setNome(dto.getNome().trim());
        }

        // --- ATUALIZA EMAIL (verifica duplicidade) ---
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            String novoEmail = dto.getEmail().trim();
            if (!novoEmail.equals(usuario.getEmail()) && usuarioRepository.existsByEmail(novoEmail)) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("erro", "Este e-mail já está em uso por outro usuário."));
            }
            usuario.setEmail(novoEmail);
        }

        // --- ATUALIZA TELEFONE ---
        if (dto.getTelefone() != null) {
            usuario.setTelefone(dto.getTelefone().trim());
        }

        // --- ATUALIZA UNIDADE (somente para moradores) ---
        if (usuario instanceof Morador) {
            Morador morador = (Morador) usuario;
            Unidade unidade = morador.getUnidade();

            boolean unidadeAlterada = false;

            if (dto.getNumeroApto() != null && !dto.getNumeroApto().isBlank()) {
                unidade.setNumeroApto(dto.getNumeroApto().trim());

                // --- CALCULA O ANDAR AUTOMATICAMENTE ---
                try {
                    String numeros = dto.getNumeroApto().trim().replaceAll("[^0-9]", "");
                    if (numeros.length() >= 2) {
                        int andar = Integer.parseInt(numeros.substring(0, numeros.length() - 2));
                        if (andar == 0) andar = 1;
                        unidade.setAndar(andar);
                    } else {
                        unidade.setAndar(1);
                    }
                } catch (NumberFormatException e) {
                    unidade.setAndar(1);
                }

                unidadeAlterada = true;
            }

            if (dto.getBloco() != null && !dto.getBloco().isBlank()) {
                unidade.setBloco(dto.getBloco().trim().toUpperCase());
                unidadeAlterada = true;
            }

            if (unidadeAlterada) {
                unidadeRepository.save(unidade);
            }
        }

        usuarioRepository.save(usuario);

        // --- RETORNA O PERFIL ATUALIZADO ---
        Usuario atualizado = usuarioRepository.findById(usuario.getId()).orElse(usuario);
        return ResponseEntity.ok(UsuarioPerfilDTO.fromEntity(atualizado));
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
