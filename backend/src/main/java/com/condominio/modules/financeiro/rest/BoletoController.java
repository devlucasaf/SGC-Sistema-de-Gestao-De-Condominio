package com.condominio.modules.financeiro.rest;

import com.condominio.modules.financeiro.dto.AlterarVencimentoDTO;
import com.condominio.modules.financeiro.dto.BoletoRequestDTO;
import com.condominio.modules.financeiro.dto.BoletoResponseDTO;
import com.condominio.modules.financeiro.repository.BoletoRepository;
import com.condominio.modules.financeiro.service.BoletoService;

import com.condominio.modules.morador.model.Morador;
import com.condominio.modules.usuario.model.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/boletos")
public class BoletoController {

    @Autowired
    private BoletoService boletoService;

    @Autowired
    private BoletoRepository boletoRepository;

    // --- ROTA PARA O MORADOR BUSCAR SEUS PRÓPRIOS BOLETOS ---
    @GetMapping("/meus-boletos")
    public ResponseEntity<List<BoletoResponseDTO>> listarMeusBoletos(
            @AuthenticationPrincipal Usuario usuarioLogado) {

        if (!(usuarioLogado instanceof Morador)) {
            throw new RuntimeException("Apenas moradores podem consultar boletos.");
        }

        List<BoletoResponseDTO> resposta = boletoRepository.findByMoradorId(usuarioLogado.getId())
                .stream()
                .map(BoletoResponseDTO::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(resposta);
    }

    // --- ROTA PARA LISTAR BOLETOS POR ID DO MORADOR ---
    @GetMapping("/morador/{idMorador}")
    public ResponseEntity<List<BoletoResponseDTO>> listarPorMorador(@PathVariable Long idMorador) {
        List<BoletoResponseDTO> resposta = boletoRepository.findByMoradorId(idMorador)
                .stream()
                .map(BoletoResponseDTO::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(resposta);
    }

    // --- ROTA PARA GERAR UM NOVO BOLETO ---
    @PostMapping
    public ResponseEntity<Void> gerarBoleto(@RequestBody @Valid BoletoRequestDTO dto) {
        boletoService.gerarBoleto(dto);
        return ResponseEntity.status(201).build();
    }

    // --- ROTA PARA ALTERAR O VENCIMENTO ---
    @PatchMapping("/{id}/vencimento")
    public ResponseEntity<Void> prorrogarVencimento(
            @PathVariable Long id,
            @RequestBody @Valid AlterarVencimentoDTO dto) {

        boletoService.prorrogarVencimento(id, dto);
        return ResponseEntity.noContent().build();
    }
}