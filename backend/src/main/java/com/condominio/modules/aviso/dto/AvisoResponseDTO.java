package com.condominio.modules.aviso.dto;

import com.condominio.modules.aviso.model.Aviso;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AvisoResponseDTO {

    private Long id;
    private String titulo;
    private String mensagem;
    private LocalDateTime dataCriacao;
    private String nomeSindico;

    public static AvisoResponseDTO fromEntity(Aviso aviso) {
        AvisoResponseDTO dto = new AvisoResponseDTO();

        dto.setId(aviso.getId());
        dto.setTitulo(aviso.getTitulo());
        dto.setMensagem(aviso.getMensagem());
        dto.setDataCriacao(aviso.getDataCriacao());

        dto.setNomeSindico(aviso.getSindico().getUsuario().getNome());

        return dto;
    }
}
