package sgc.condominio.modules.manutencao.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ManutencaoRequestDTO {

    @NotBlank(message = "O título é obrigatório")
    private String titulo;

    private String descricao;

    @NotBlank(message = "O tipo é obrigatório")
    private String tipo;

    @NotNull(message = "A data de início é obrigatória")
    private String dataInicio;

    private String dataFim;

    @NotNull(message = "O ID do síndico é obrigatório")
    private Long idSindico;
}

