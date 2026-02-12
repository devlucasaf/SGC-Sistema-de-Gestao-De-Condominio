package com.condominio.modules.autenticacao.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class AutenticacaoDTO {
    @NotBlank
    private String email;

    @NotBlank
    private String senha;
}
