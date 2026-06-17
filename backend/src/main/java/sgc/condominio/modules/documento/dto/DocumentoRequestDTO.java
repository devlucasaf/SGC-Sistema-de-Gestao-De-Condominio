package sgc.condominio.modules.documento.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class DocumentoRequestDTO {

    // --- TÍTULO DO DOCUMENTO ---
    @NotBlank(message = "O título é obrigatório")
    private String titulo;

    // --- CONTEÚDO DO DOCUMENTO ---
    @NotBlank(message = "O conteúdo é obrigatório")
    private String conteudo;

    // --- CATEGORIA DO DOCUMENTO ---
    @NotBlank(message = "A categoria é obrigatória")
    private String categoria;

    // --- ID DO SÍNDICO RESPONSÁVEL ---
    @NotNull(message = "O ID do síndico é obrigatório")
    private Long idSindico;
}
