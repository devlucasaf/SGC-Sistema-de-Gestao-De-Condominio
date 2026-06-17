package sgc.condominio.modules.solicitacao.rest;

import sgc.condominio.infra.pagination.PageResponseDTO;

import sgc.condominio.modules.solicitacao.dto.SolicitacaoRequestDTO;
import sgc.condominio.modules.solicitacao.dto.SolicitacaoResponseDTO;
import sgc.condominio.modules.solicitacao.model.StatusSolicitacao;
import sgc.condominio.modules.solicitacao.service.SolicitacaoService;
import sgc.condominio.modules.usuario.model.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoService service;

    @PostMapping
    public ResponseEntity<SolicitacaoResponseDTO> criar(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestBody @Valid SolicitacaoRequestDTO dto) {

        String unidade = "Não informado";

        SolicitacaoResponseDTO response = service.salvar(dto, usuarioLogado.getId(), unidade);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<SolicitacaoResponseDTO>> listarTodas(
            @PageableDefault(page = 0, size = 20) Pageable pageable) {
        return ResponseEntity.ok(service.buscarTodas(pageable));
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarMinhas(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(service.buscarPorMorador(usuarioLogado.getId()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(
            @PathVariable Long id,
            @RequestParam StatusSolicitacao novoStatus) {
        service.atualizarStatus(id, novoStatus);
        return ResponseEntity.noContent().build();
    }
}

