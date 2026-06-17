package sgc.condominio.modules.encomenda.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class EncomendaRequestDTO {

    @NotBlank(message = "A descrição da encomenda é obrigatória")
    private String descricao;

    @NotNull(message = "O ID da unidade de destino é obrigatório")
    private Long idUnidade;

    @NotNull(message = "O ID do porteiro que recebeu a encomenda é obrigatório")
    private Long idPorteiro;
}
