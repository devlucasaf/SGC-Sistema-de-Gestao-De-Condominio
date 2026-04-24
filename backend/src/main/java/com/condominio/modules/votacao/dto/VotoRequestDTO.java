package com.condominio.modules.votacao.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;

@Data
public class VotoRequestDTO {

    @NotBlank(message = "Candidato é obrigatório")
    private String candidato;
}

