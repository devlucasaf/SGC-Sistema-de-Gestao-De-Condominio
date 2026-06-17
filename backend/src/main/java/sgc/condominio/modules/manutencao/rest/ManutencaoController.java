package sgc.condominio.modules.manutencao.rest;

import sgc.condominio.modules.manutencao.dto.ManutencaoRequestDTO;
import sgc.condominio.modules.manutencao.dto.ManutencaoResponseDTO;
import sgc.condominio.modules.manutencao.service.ManutencaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/manutencoes")
public class ManutencaoController {

    @Autowired
    private ManutencaoService manutencaoService;

    // --- CRIAR MANUTENÇÃO ---
    @PostMapping
    public ResponseEntity<ManutencaoResponseDTO> criar(@RequestBody @Valid ManutencaoRequestDTO dto) {
        ManutencaoResponseDTO response = manutencaoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --- LISTAR TODAS (SÍNDICO) ---
    @GetMapping("/todas")
    public ResponseEntity<List<ManutencaoResponseDTO>> listarTodas() {
        return ResponseEntity.ok(manutencaoService.listarTodas());
    }

    // --- LISTAR PRÓXIMAS (MORADORES) ---
    @GetMapping("/proximas")
    public ResponseEntity<List<ManutencaoResponseDTO>> listarProximas() {
        return ResponseEntity.ok(manutencaoService.listarProximas());
    }

    // --- ATUALIZAR STATUS ---
    @PatchMapping("/{id}/status")
    public ResponseEntity<ManutencaoResponseDTO> atualizarStatus(
            @PathVariable Long id, @RequestParam String novoStatus) {
        return ResponseEntity.ok(manutencaoService.atualizarStatus(id, novoStatus));
    }

    // --- DELETAR MANUTENÇÃO ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        manutencaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

