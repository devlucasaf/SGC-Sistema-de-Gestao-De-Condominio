package com.condominio.modules.documento.rest;

import com.condominio.modules.documento.dto.DocumentoRequestDTO;
import com.condominio.modules.documento.dto.DocumentoResponseDTO;
import com.condominio.modules.documento.service.DocumentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/documentos")
public class DocumentoController {

    @Autowired
    private DocumentoService documentoService;

    @PostMapping
    public ResponseEntity<DocumentoResponseDTO> criar(@RequestBody @Valid DocumentoRequestDTO dto) {
        DocumentoResponseDTO response = documentoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<DocumentoResponseDTO>> listarTodos() {
        List<DocumentoResponseDTO> lista = documentoService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<DocumentoResponseDTO>> listarPorCategoria(@PathVariable String categoria) {
        List<DocumentoResponseDTO> lista = documentoService.listarPorCategoria(categoria);
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentoResponseDTO> atualizar(@PathVariable Long id, @RequestBody @Valid DocumentoRequestDTO dto) {
        DocumentoResponseDTO response = documentoService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        documentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

