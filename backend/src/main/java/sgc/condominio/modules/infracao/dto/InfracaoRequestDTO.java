package sgc.condominio.modules.infracao.dto;

import sgc.condominio.modules.infracao.model.TipoInfracao;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
public class InfracaoRequestDTO {

    @NotNull(message = "O tipo da infração é obrigatório")
    private TipoInfracao tipo;

    @NotBlank(message = "O motivo é obrigatório")
    private String motivo;

    private String descricao;

    private BigDecimal valor;

    @NotNull(message = "O morador é obrigatório")
    private Long moradorId;

    @NotBlank(message = "A data da infração é obrigatória")
    private String dataInfracao;
}

