package sgc.condominio.modules.visitante.dto;

import sgc.condominio.modules.visitante.model.RegistrarAcesso;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VisitanteResponseDTO {
    private Long            idAcesso;
    private String          nomeVisitante;
    private String          cpfVisitante;
    private String          telefoneVisitante;
    private String          blocoAptoDestino;
    private LocalDateTime   entrada;
    private LocalDateTime   saida;

    public static VisitanteResponseDTO fromEntity(RegistrarAcesso acesso) {
        VisitanteResponseDTO dto = new VisitanteResponseDTO();

        dto.setIdAcesso(acesso.getId());
        dto.setNomeVisitante(acesso.getVisitante().getNome());
        dto.setCpfVisitante(acesso.getVisitante().getCpf());
        dto.setTelefoneVisitante(acesso.getVisitante().getTelefone());
        dto.setBlocoAptoDestino("Bloco " + acesso.getUnidade().getBloco() + " - " + acesso.getUnidade().getNumeroApto());
        dto.setEntrada(acesso.getDataHoraEntrada());
        dto.setSaida(acesso.getDataHoraSaida());

        return dto;
    }
}
