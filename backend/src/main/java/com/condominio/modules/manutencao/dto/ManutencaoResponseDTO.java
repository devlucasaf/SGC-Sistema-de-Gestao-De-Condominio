package com.condominio.modules.manutencao.dto;

import com.condominio.modules.manutencao.model.Manutencao;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ManutencaoResponseDTO {

    private Long            id;
    private String          titulo;
    private String          descricao;
    private String          tipo;
    private String          status;
    private LocalDateTime   dataInicio;
    private LocalDateTime   dataFim;
    private LocalDateTime   dataCriacao;
    private String          nomeSindico;

    // --- CONVERTE ENTIDADE PARA DTO ---
    public static ManutencaoResponseDTO fromEntity(Manutencao m) {
        ManutencaoResponseDTO dto = new ManutencaoResponseDTO();

        dto.setId(m.getId());
        dto.setTitulo(m.getTitulo());
        dto.setDescricao(m.getDescricao());
        dto.setTipo(m.getTipo().name());
        dto.setStatus(m.getStatus().name());
        dto.setDataInicio(m.getDataInicio());
        dto.setDataFim(m.getDataFim());
        dto.setDataCriacao(m.getDataCriacao());
        dto.setNomeSindico(m.getSindico().getUsuario().getNome());

        return dto;
    }
}

