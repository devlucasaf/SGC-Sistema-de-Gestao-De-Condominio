package com.condominio.modules.infracao.rest;

import com.condominio.modules.infracao.dto.InfracaoRequestDTO;
import com.condominio.modules.infracao.dto.InfracaoResponseDTO;
import com.condominio.modules.infracao.model.StatusInfracao;
import com.condominio.modules.infracao.service.InfracaoService;
import com.condominio.modules.usuario.model.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/infracoes")
public class InfracaoController {

    @Autowired
    private InfracaoService service;

    @PostMapping
    public ResponseEntity<InfracaoResponseDTO> criar(@RequestBody @Valid InfracaoRequestDTO dto) {
        return ResponseEntity.ok(service.criar(dto));
    }

    @GetMapping
    public ResponseEntity<List<InfracaoResponseDTO>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<InfracaoResponseDTO>> listarMinhas(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(service.listarPorMorador(usuarioLogado.getId()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(
            @PathVariable Long id,
            @RequestParam StatusInfracao novoStatus) {
        service.atualizarStatus(id, novoStatus);
        return ResponseEntity.noContent().build();
    }
}

