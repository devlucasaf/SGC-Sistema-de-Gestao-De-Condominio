package sgc.condominio.modules.sindico.rest;

import sgc.condominio.modules.sindico.dto.SindicoRequestDTO;
import sgc.condominio.modules.sindico.dto.SindicoResponseDTO;
import sgc.condominio.modules.sindico.service.SindicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/sindicos")
public class SindicoController {

    @Autowired
    private SindicoService sindicoService;

    // --- ROTA PARA CADASTRAR UM NOVO SÍNDICO ---
    @PostMapping
    public ResponseEntity<SindicoResponseDTO> cadastrar(@RequestBody @Valid SindicoRequestDTO dto) {
        SindicoResponseDTO response = sindicoService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --- ROTA PARA LISTAR TODOS OS SÍNDICOS ---
    @GetMapping
    public ResponseEntity<List<SindicoResponseDTO>> listarTodos() {
        List<SindicoResponseDTO> lista = sindicoService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    // --- ROTA QUE INATIVA OU REATIVA UM SÍNDICO ---
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alternarStatus(
            @PathVariable Long id,
            @RequestParam String novoStatus) {

        sindicoService.alternarStatus(id, novoStatus);
        return ResponseEntity.noContent().build();
    }
}