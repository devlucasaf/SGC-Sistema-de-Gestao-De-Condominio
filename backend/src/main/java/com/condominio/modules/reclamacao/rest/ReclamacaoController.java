package com.condominio.modules.reclamacao.rest;

import com.condominio.modules.reclamacao.dto.ReclamacaoRequestDTO;
import com.condominio.modules.reclamacao.dto.ReclamacaoResponseDTO;
import com.condominio.modules.reclamacao.model.Reclamacao;
import com.condominio.modules.reclamacao.service.ReclamacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reclamacoes")
public class ReclamacaoController {

    @Autowired
    private ReclamacaoService service;

    @PostMapping
    public ResponseEntity<ReclamacaoResponseDTO> criar(@RequestBody ReclamacaoRequestDTO dto) {
        return ResponseEntity.ok(service.salvar(dto));
    }

    @GetMapping
    public ResponseEntity<List<ReclamacaoResponseDTO>> listar() {
        return ResponseEntity.ok(service.buscarTodas());
    }
}
