package sgc.condominio.modules.unidade.dto;

import sgc.condominio.modules.unidade.model.Unidade;

import lombok.Data;

@Data
public class UnidadeResponseDTO {

    private Long        id;
    private String      bloco;
    private Integer     andar;
    private String      numeroApto;

    public static UnidadeResponseDTO fromEntity(Unidade unidade) {
        UnidadeResponseDTO dto = new UnidadeResponseDTO();

        dto.setId(unidade.getId());
        dto.setBloco(unidade.getBloco());
        dto.setAndar(unidade.getAndar());
        dto.setNumeroApto(unidade.getNumeroApto());

        return dto;
    }
}
