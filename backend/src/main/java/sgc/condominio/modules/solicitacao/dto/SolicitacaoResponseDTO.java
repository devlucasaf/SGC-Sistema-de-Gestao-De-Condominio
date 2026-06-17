package sgc.condominio.modules.solicitacao.dto;

import sgc.condominio.modules.solicitacao.model.StatusSolicitacao;
import sgc.condominio.modules.solicitacao.model.TipoSolicitacao;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SolicitacaoResponseDTO {

    private Long                    id;
    private TipoSolicitacao         tipo;
    private String                  titulo;
    private String                  descricao;
    private LocalDate               dataPrevista;
    private StatusSolicitacao       status;
    private String                  unidade;
    private Long                    moradorId;
    private String                  nomeMorador;
    private String                  apartamentoMorador;
    private LocalDateTime           dataCriacao;
}
