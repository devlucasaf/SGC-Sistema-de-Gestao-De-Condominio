package sgc.condominio.modules.visitante.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class VisitanteRequestDTO {
    @NotBlank(message = "Nome do visitante é obrigatório")
    private String nome;

    private String cpf;
    private String telefone;

    @NotNull(message = "ID da unidade de destino é obrigatório")
    private Long idUnidade;

    @NotNull(message = "ID do porteiro é obrigatório")
    private Long idPorteiro;
}
