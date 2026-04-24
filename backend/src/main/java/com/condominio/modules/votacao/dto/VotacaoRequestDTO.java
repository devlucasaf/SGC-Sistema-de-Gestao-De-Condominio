package com.condominio.modules.votacao.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class VotacaoRequestDTO {

    @NotBlank(message = "Título é obrigatório")
    private String titulo;

    private String descricao;

    @NotNull(message = "Lista de candidatos é obrigatória")
    private List<String> candidatos;

    @NotBlank(message = "Data de início é obrigatória")
    private String dataInicio;

    @NotBlank(message = "Data de fim é obrigatória")
    private String dataFim;
}

