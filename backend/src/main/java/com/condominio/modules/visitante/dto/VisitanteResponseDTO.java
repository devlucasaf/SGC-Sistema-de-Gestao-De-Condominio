package com.condominio.modules.visitante.dto;

import com.condominio.modules.visitante.model.RegistrarAcesso;
import com.condominio.modules.unidade.model.Unidade;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VisitanteResponseDTO {
    private Long idAcesso;
    private String nomeVisitante;
    private String blocoAptoDestino;
    private LocalDateTime entrada;
    private LocalDateTime saida;

    public static VisitanteResponseDTO fromEntity(RegistrarAcesso acesso) {
        VisitanteResponseDTO dto = new VisitanteResponseDTO();

        dto.setIdAcesso(acesso.getId());
        dto.setNomeVisitante(acesso.getVisitante().getNome());
        dto.setBlocoAptoDestino("Bloco " + acesso.getUnidade().getBloco() + " - " + acesso.getUnidade().getNumeroApto());
        dto.setEntrada(acesso.getDataHoraEntrada());
        dto.setSaida(acesso.getDataHoraSaida());

        return dto;
    }
}
