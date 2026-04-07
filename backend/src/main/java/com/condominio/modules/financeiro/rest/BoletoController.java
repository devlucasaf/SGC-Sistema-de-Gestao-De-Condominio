package com.condominio.modules.financeiro.rest;

import com.condominio.modules.financeiro.dto.AlterarVencimentoDTO;
import com.condominio.modules.financeiro.model.Boleto;
import com.condominio.modules.financeiro.repository.BoletoRepository;
import com.condominio.modules.financeiro.service.BoletoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/boletos")
public class BoletoController {

    @Autowired
    private BoletoService boletoService;

    @Autowired
    private BoletoRepository boletoRepository;

    // --- ROTA PARA ALTERAR O VENCIMENTO ---
    @PatchMapping("/{id}/vencimento")
    public ResponseEntity<Void> prorrogarVencimento(
            @PathVariable Long id,
            @RequestBody @Valid AlterarVencimentoDTO dto) {

        boletoService.prorrogarVencimento(id, dto);

        // --- 204 NO CONTENT ---
        return ResponseEntity.noContent().build();
    }

    // --- ROTA PARA LISTAR BOLETOS DO MORADOR ---
    @GetMapping("/morador/{idMorador}")
    public ResponseEntity<List<Map<String, Object>>> listarPorMorador(@PathVariable Long idMorador) {
        List<Boleto> boletos = boletoRepository.findByMoradorId(idMorador);

        List<Map<String, Object>> resposta = boletos.stream().map(b -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", b.getId());
            map.put("descricao", b.getDescricao());
            map.put("valor", b.getValor());
            map.put("dataVencimento", b.getDataVencimento());
            map.put("status", b.getStatus());
            map.put("urlBoleto", b.getUrlBoleto());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(resposta);
    }
}