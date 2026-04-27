package com.condominio.modules.visitante.rest;

import com.condominio.modules.visitante.dto.VisitanteRequestDTO;
import com.condominio.modules.visitante.dto.VisitanteResponseDTO;
import com.condominio.modules.visitante.service.VisitanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/visitantes")
public class VisitanteController {

    @Autowired
    private VisitanteService visitanteService;

    // --- REGISTRA A ENTRADA DE UM VISITANTE ---
    @PostMapping("/entrada")
    public ResponseEntity<VisitanteResponseDTO> registrarEntrada(
            @RequestBody @Valid VisitanteRequestDTO dto, UriComponentsBuilder uriBulder) {

        VisitanteResponseDTO response = visitanteService.registrarEntrada(dto);

        URI uri = uriBulder.path("/visitantes/acesso/{id}")
                .buildAndExpand(response.getIdAcesso())
                .toUri();

        return ResponseEntity.created(uri).body(response);
    }

    // --- REGISTRAR SAÍDA ---
    @PutMapping("/saida/{idAcesso}")
    public ResponseEntity<VisitanteResponseDTO> registrarSaida(@PathVariable Long idAcesso) {
        VisitanteResponseDTO response = visitanteService.registrarSaida(idAcesso);
        return ResponseEntity.ok(response);
    }

    // --- LISTAR TODOS OS VISITANTES QUE ESTÃO NO CONDOMÍNIO ---
    @GetMapping("/presentes")
    public ResponseEntity<List<VisitanteResponseDTO>> listarPresentes() {
        List<VisitanteResponseDTO> lista = visitanteService.listarPresentes();
        return ResponseEntity.ok(lista);
    }

    // --- LISTAR HISTÓRICO DE TODOS OS ACESSOS ---
    @GetMapping("/historico")
    public ResponseEntity<List<VisitanteResponseDTO>> listarHistorico() {
        List<VisitanteResponseDTO> lista = visitanteService.listarTodos();
        return ResponseEntity.ok(lista);
    }
}
