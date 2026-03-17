package com.condominio.modules.financeiro.rest;

import com.condominio.modules.financeiro.dto.AlterarVencimentoDTO;
import com.condominio.modules.financeiro.service.BoletoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/boletos")
public class BoletoController {

    @Autowired
    private BoletoService boletoService;

    // --- ROTA PARA ALTERAR O VENCIMENTO ---
    @PatchMapping("/{id}/vencimento")
    public ResponseEntity<Void> prorrogarVencimento(
            @PathVariable Long id,
            @RequestBody @Valid AlterarVencimentoDTO dto) {

        boletoService.prorrogarVencimento(id, dto);

        // --- 204 NO CONTENT ---
        return ResponseEntity.noContent().build();
    }
}