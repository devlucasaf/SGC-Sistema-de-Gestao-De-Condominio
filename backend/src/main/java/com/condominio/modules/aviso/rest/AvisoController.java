package com.condominio.modules.aviso.rest;

import com.condominio.modules.aviso.dto.AvisoRequestDTO;
import com.condominio.modules.aviso.dto.AvisoResponseDTO;
import com.condominio.modules.aviso.service.AvisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/avisos")
public class AvisoController {

    @Autowired
    private AvisoService avisoService;

    @PostMapping
    public ResponseEntity<AvisoResponseDTO> publicar(@RequestBody @Valid AvisoRequestDTO dto) {
        AvisoResponseDTO response = avisoService.publicarAviso(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AvisoResponseDTO>> listarMural() {
        List<AvisoResponseDTO> mural = avisoService.listarMural();
        return ResponseEntity.ok(mural);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        avisoService.deletarAviso(id);
        return ResponseEntity.noContent().build();
    }
}
