package com.condominio.modules.morador.rest;

import com.condominio.modules.morador.dto.MoradorRequestDTO;
import com.condominio.modules.morador.dto.MoradorResponseDTO;
import com.condominio.modules.morador.service.MoradorService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.net.URI;

import java.util.List;

@RestController
@RequestMapping("/moradores")
@CrossOrigin("*")
public class MoradorController {

    @Autowired
    private MoradorService moradorService;

    // --- CADASTRAR ---
    @PostMapping
    public ResponseEntity<MoradorResponseDTO> cadastrar(
            @RequestBody @Valid MoradorRequestDTO dto,
            UriComponentsBuilder uriComponentsBuilder) {

        // --- CHAMA O SERVIÇO ---
        MoradorResponseDTO novoMorador = moradorService.cadastrar(dto);

        // --- CRIA A URL DE RETORNO ---
        URI uri = uriComponentsBuilder.path("/moradores/{id}")
                .buildAndExpand(novoMorador.getId())
                .toUri();

        // --- 201 CREATED ---
        return ResponseEntity.created(uri).body(novoMorador);
    }

    // --- BUSCA POR ID ---
    @GetMapping("/{id}")
    public ResponseEntity<MoradorResponseDTO> buscarPorId(@PathVariable Long id) {
        MoradorResponseDTO morador = moradorService.buscarPorId(id);
        return ResponseEntity.ok(morador);
    }

    // --- LISTAR TODOS OS GET ---
    @GetMapping
    public ResponseEntity<List<MoradorResponseDTO>> listarTodos() {
        List<MoradorResponseDTO> lista = moradorService.listarTodos();
        return ResponseEntity.ok(lista);
    }
}
