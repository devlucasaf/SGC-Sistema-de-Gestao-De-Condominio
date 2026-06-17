package sgc.condominio.modules.autenticacao.rest;

import sgc.condominio.modules.autenticacao.dto.AutenticacaoDTO;
import sgc.condominio.modules.autenticacao.dto.LoginResponseDTO;
import sgc.condominio.infra.security.TokenService;
import sgc.condominio.modules.usuario.model.Usuario;
import sgc.condominio.modules.usuario.repository.UsuarioRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collections;
import java.util.Map;

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

        // --- GERA O ACCESS TOKEN E O REFRESH TOKEN ---
        String token = tokenService.gerarToken(usuario);
        String refreshToken = tokenService.gerarRefreshToken(usuario);

        log.info("Login realizado com sucesso: {} ({})", usuario.getNome(), usuario.getTipoUsuario());

        // --- DEVOLVE OS TOKENS ---
        return ResponseEntity.ok(new LoginResponseDTO(token, refreshToken));
    }

    // --- ENDPOINT DE REFRESH TOKEN ---
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");

        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", "Refresh token é obrigatório."));
        }

        try {
            // --- VALIDA SE É UM REFRESH TOKEN ---
            String tokenType = tokenService.getTokenType(refreshToken);
            if (!"refresh".equals(tokenType)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("message", "Token inválido."));
            }

            // --- EXTRAI O USUÁRIO DO REFRESH TOKEN ---
            String email = tokenService.getSubject(refreshToken);
            Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("message", "Usuário não encontrado."));
            }

            // --- GERA NOVOS TOKENS ---
            String novoToken = tokenService.gerarToken(usuario);
            String novoRefreshToken = tokenService.gerarRefreshToken(usuario);

            return ResponseEntity.ok(new LoginResponseDTO(novoToken, novoRefreshToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Refresh token inválido ou expirado."));
        }
    }
}
