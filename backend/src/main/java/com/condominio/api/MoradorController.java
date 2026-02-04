package com.condominio.api;

import com.condominio.dto.morador.MoradorCreateRequest;
import com.condominio.dto.morador.MoradorResponse;
import com.condominio.dto.morador.MoradorUpdateRequest;
import com.condominio.service.MoradorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/moradores")
@Validated
public class MoradorController {

    private final MoradorService moradorService;

    public MoradorController(MoradorService moradorService) {
        this.moradorService = moradorService;
    }

    /**
     * Listar moradores
     * Regra sugerida: apenas SÍNDICO pode listar todos.
     */
    @GetMapping
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<List<MoradorResponse>> listar() {
        return ResponseEntity.ok(moradorService.listar());
    }

    /**
     * Detalhar morador por ID
     * Regra sugerida: SÍNDICO pode ver qualquer um.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<MoradorResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(moradorService.buscarPorId(id));
    }

    /**
     * Criar morador
     * Regra sugerida: apenas SÍNDICO cria moradores.
     */
    @PostMapping
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<MoradorResponse> criar(@Valid @RequestBody MoradorCreateRequest request) {
        MoradorResponse created = moradorService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Atualizar morador
     * Regra sugerida: apenas SÍNDICO atualiza.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<MoradorResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody MoradorUpdateRequest request
    ) {
        return ResponseEntity.ok(moradorService.atualizar(id, request));
    }

    /**
     * Remover / desativar morador
     * Regra sugerida: apenas SÍNDICO remove/desativa.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        moradorService.remover(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * "Meu perfil" (para dashboard)
     * O front usa o token JWT, e esse endpoint devolve o morador logado.
     * Regra sugerida: qualquer usuário autenticado, mas aqui retornamos apenas se for MORADOR/SINDICO.
     */
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('MORADOR','SINDICO')")
    public ResponseEntity<MoradorResponse> me(Authentication authentication) {
        // authentication.getName() geralmente é o "username" do UserDetails (no seu caso, o email)
        String email = authentication.getName();
        return ResponseEntity.ok(moradorService.buscarPorEmail(email));
    }
}
