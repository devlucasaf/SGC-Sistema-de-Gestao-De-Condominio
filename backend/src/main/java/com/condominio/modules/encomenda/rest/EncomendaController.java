package com.condominio.modules.encomenda.rest;

import com.condominio.modules.encomenda.dto.EncomendaRequestDTO;
import com.condominio.modules.encomenda.dto.EncomendaResponseDTO;
import com.condominio.modules.encomenda.service.EncomendaService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;

import java.net.URI;

import java.util.List;

@RestController
@RequestMapping("/encomendas")
public class EncomendaController {

    @Autowired
    private EncomendaService encomendaService;

    @PostMapping
    public ResponseEntity<EncomendaResponseDTO> registrarEntrada(
            @RequestBody @Valid EncomendaRequestDTO dto,
            UriComponentsBuilder uriBuilder) {

        EncomendaResponseDTO response = encomendaService.registrarEntrada(dto);

        URI uri = uriBuilder.path("/encomendas/{id}")
                .buildAndExpand(response.getId())
                .toUri();

        return ResponseEntity.created(uri).body(response);
    }

    // --- ROTA PARA DAR BAIXA NA RETIRADA ---
    @PutMapping("/{id}/retirar")
    public ResponseEntity<EncomendaResponseDTO> registrarRetirada(@PathVariable Long id) {
        EncomendaResponseDTO response = encomendaService.registrarRetirada(id);
        return ResponseEntity.ok(response);
    }

    // --- ROTA PARA LISTAR AS ENCOMENDAS DE UMA UNIDADE ---
    @GetMapping("/unidade/{idUnidade}")
    public ResponseEntity<List<EncomendaResponseDTO>> listarPorUnidade(@PathVariable Long idUnidade) {
        List<EncomendaResponseDTO> lista = encomendaService.listarPorUnidade(idUnidade);
        return ResponseEntity.ok(lista);
    }
}
