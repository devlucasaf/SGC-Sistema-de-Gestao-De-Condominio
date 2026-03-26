package com.condominio.modules.reclamacao.rest;

import com.condominio.modules.reclamacao.dto.ReclamacaoRequestDTO;
import com.condominio.modules.reclamacao.dto.ReclamacaoResponseDTO;
import com.condominio.modules.reclamacao.model.StatusReclamacao;
import com.condominio.modules.reclamacao.service.ReclamacaoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reclamacoes")
public class ReclamacaoController {

    @Autowired
    private ReclamacaoService service;

    @PostMapping
    public ResponseEntity<ReclamacaoResponseDTO> criar(@RequestBody @Valid ReclamacaoRequestDTO dto) {
        return ResponseEntity.ok(service.salvar(dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(
            @PathVariable Long id,
            @RequestParam StatusReclamacao novoStatus) {
        service.atualizarStatus(id, novoStatus);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ReclamacaoResponseDTO>> listarTodas() {
        return ResponseEntity.ok(service.buscarTodas());
    }

    @GetMapping("/unidade/{unidade}")
    public ResponseEntity<List<ReclamacaoResponseDTO>> listarPorUnidade(@PathVariable String unidade) {
        return ResponseEntity.ok(service.buscarPorUnidade(unidade));
    }
}
