package sgc.condominio.modules.solicitacao.dto;

import sgc.condominio.modules.solicitacao.model.TipoSolicitacao;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class SolicitacaoRequestDTO {

    @NotNull(message = "O tipo da solicitação é obrigatório")
    private TipoSolicitacao tipo;

    @NotBlank(message = "O título é obrigatório")
    private String titulo;

    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

    @NotBlank(message = "A data prevista é obrigatória")
    private String dataPrevista;
}

