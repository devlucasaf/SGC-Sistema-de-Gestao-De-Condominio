package com.condominio.modules.reclamacao.rest;

import com.condominio.infra.pagination.PageResponseDTO;

import com.condominio.modules.reclamacao.dto.ReclamacaoRequestDTO;
import com.condominio.modules.reclamacao.dto.ReclamacaoResponseDTO;
import com.condominio.modules.reclamacao.model.StatusReclamacao;
import com.condominio.modules.reclamacao.service.ReclamacaoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

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
    public ResponseEntity<PageResponseDTO<ReclamacaoResponseDTO>> listarTodas(
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(service.buscarTodas(pageable));
    }

    @GetMapping("/unidade/{unidade}")
    public ResponseEntity<PageResponseDTO<ReclamacaoResponseDTO>> listarPorUnidade(
            @PathVariable String unidade,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(service.buscarPorUnidade(unidade, pageable));
    }
}