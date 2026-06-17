package sgc.condominio.modules.encomenda.dto;

import sgc.condominio.modules.encomenda.model.Encomenda;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EncomendaResponseDTO {
    private Long                id;
    private String              descricao;
    private String              status;
    private LocalDateTime       dataRecebimento;
    private LocalDateTime       dataRetirada;

    // --- DADOS PARA O FRONTEND ---
    private String              blocoUnidade;
    private String              numeroApto;
    private String              nomePorteiro;

    public static EncomendaResponseDTO fromEntity(Encomenda encomenda) {
        EncomendaResponseDTO dto = new EncomendaResponseDTO();

        dto.setId(encomenda.getId());
        dto.setDescricao(encomenda.getDescricao());
        dto.setStatus(encomenda.getStatus().name());
        dto.setDataRecebimento(encomenda.getDataRecebimento());
        dto.setDataRetirada(encomenda.getDataRetirada());

        // --- DADOS DA ENTIDADE RELACIONADA ---
        dto.setBlocoUnidade(encomenda.getUnidade().getBloco());
        dto.setNumeroApto(encomenda.getUnidade().getNumeroApto());
        dto.setNomePorteiro(encomenda.getPorteiroRecebeu().getNome());

        return dto;
    }
}
