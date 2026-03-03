package com.condominio.modules.unidade.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class UnidadeRequestDTO {

    @NotBlank(message = "O bloco é obrigatório")
    private String bloco;

    @NotNull(message = "O andar é obrigatório")
    private Integer andar;

    @NotBlank(message = "O número do apartamento é obrigatório")
    private String numeroApto;
}