package com.condominio.modules.reclamacao.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ReclamacaoRequestDTO {

    @NotBlank(message = "O tipo da reclamação é obrigatório")
    private String tipo;

    @NotBlank(message = "A categoria é obrigatória")
    private String categoria;

    @NotBlank(message = "A descrição não pode ser vazia")
    private String descricao;

    @NotBlank(message = "A unidade (ex: Apto 101) é obrigatória")
    private String unidade;
}
