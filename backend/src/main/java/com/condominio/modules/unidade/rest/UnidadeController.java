package com.condominio.modules.unidade.rest;

import com.condominio.modules.unidade.dto.UnidadeRequestDTO;
import com.condominio.modules.unidade.dto.UnidadeResponseDTO;
import com.condominio.modules.unidade.service.UnidadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/unidades")
public class UnidadeController {

    @Autowired
    private UnidadeService unidadeService;

    @PostMapping
    public ResponseEntity<UnidadeResponseDTO> cadastrar(
            @RequestBody @Valid UnidadeRequestDTO dto,
            UriComponentsBuilder uriComponentsBuilder) {

        UnidadeResponseDTO novaUnidade = unidadeService.cadastrar(dto);;

        URI uri = uriComponentsBuilder.path("/unidades/{id}")
                .buildAndExpand(novaUnidade.getId())
                .toUri();

        return ResponseEntity.created(uri).body(novaUnidade);
    }

    @GetMapping
    public ResponseEntity<List<UnidadeResponseDTO>> listarTodas() {
        return ResponseEntity.ok(unidadeService.listarTodas());
    }
}
