package sgc.condominio.modules.votacao.rest;

import sgc.condominio.modules.usuario.model.Usuario;
import sgc.condominio.modules.votacao.dto.VotacaoRequestDTO;
import sgc.condominio.modules.votacao.dto.VotacaoResponseDTO;
import sgc.condominio.modules.votacao.dto.VotoRequestDTO;
import sgc.condominio.modules.votacao.model.StatusVotacao;
import sgc.condominio.modules.votacao.service.VotacaoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/votacoes")
public class VotacaoController {

    @Autowired
    private VotacaoService service;

    @PostMapping
    public ResponseEntity<VotacaoResponseDTO> criar(@RequestBody @Valid VotacaoRequestDTO dto) {
        return ResponseEntity.ok(service.criar(dto));
    }

    @GetMapping
    public ResponseEntity<List<VotacaoResponseDTO>> listarTodas(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(service.listarTodas(usuarioLogado.getId()));
    }

    @GetMapping("/abertas")
    public ResponseEntity<List<VotacaoResponseDTO>> listarAbertas(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(service.listarAbertas(usuarioLogado.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VotacaoResponseDTO> buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(service.buscarPorId(id, usuarioLogado.getId()));
    }

    @PostMapping("/{id}/votar")
    public ResponseEntity<Map<String, String>> votar(
            @PathVariable Long id,
            @RequestBody @Valid VotoRequestDTO dto,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        service.votar(id, dto, usuarioLogado.getId());
        return ResponseEntity.ok(Map.of("mensagem", "Voto registrado com sucesso!"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alterarStatus(
            @PathVariable Long id,
            @RequestParam StatusVotacao novoStatus) {
        service.alterarStatus(id, novoStatus);
        return ResponseEntity.noContent().build();
    }
}

