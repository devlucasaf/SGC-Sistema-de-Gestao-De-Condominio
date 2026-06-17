package sgc.condominio.modules.infracao.dto;

import sgc.condominio.modules.infracao.model.StatusInfracao;
import sgc.condominio.modules.infracao.model.TipoInfracao;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InfracaoResponseDTO {

    private Long            id;
    private TipoInfracao    tipo;
    private String          motivo;
    private String          descricao;
    private BigDecimal      valor;
    private StatusInfracao  status;
    private Long            moradorId;
    private String          nomeMorador;
    private String          unidadeMorador;
    private LocalDate       dataInfracao;
    private LocalDateTime   dataCriacao;
}

