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

    // Rota específica para alterar apenas o vencimento (por isso usamos PATCH em vez de PUT)
    @PatchMapping("/{id}/vencimento")
    public ResponseEntity<Void> prorrogarVencimento(
            @PathVariable Long id,
            @RequestBody @Valid AlterarVencimentoDTO dto) {

        boletoService.prorrogarVencimento(id, dto);

        // Retorna 204 No Content, que é o padrão correto quando a ação tem sucesso mas não precisamos devolver dados
        return ResponseEntity.noContent().build();
    }
}