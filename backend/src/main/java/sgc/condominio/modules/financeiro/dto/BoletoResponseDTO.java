package sgc.condominio.modules.financeiro.dto;

import sgc.condominio.modules.financeiro.model.Boleto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BoletoResponseDTO {
    private Long        id;
    private String      descricao;
    private BigDecimal  valor;
    private LocalDate   dataVencimento;
    private String      status;
    private String      urlBoleto;

    public static BoletoResponseDTO fromEntity(Boleto boleto) {
        BoletoResponseDTO dto = new BoletoResponseDTO();

        dto.setId(boleto.getId());
        dto.setDescricao(boleto.getDescricao());
        dto.setValor(boleto.getValor());
        dto.setDataVencimento(boleto.getDataVencimento());
        dto.setStatus(boleto.getStatus());
        dto.setUrlBoleto(boleto.getUrlBoleto());

        return dto;
    }
}

