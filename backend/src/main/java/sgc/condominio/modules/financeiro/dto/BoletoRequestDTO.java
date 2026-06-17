package sgc.condominio.modules.financeiro.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BoletoRequestDTO {

    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

    @NotNull(message = "O valor é obrigatório")
    private BigDecimal valor;

    @NotNull(message = "A data de vencimento é obrigatória")
    private LocalDate dataVencimento;

    @NotNull(message = "O ID do morador é obrigatório")
    private Long idMorador;
}
