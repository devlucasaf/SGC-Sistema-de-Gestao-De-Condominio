package com.condominio.modules.usuario.dto;

import lombok.Data;

@Data
public class AtualizarCadastroDTO {
    private String nome;
    private String email;
    private String telefone;
    private String numeroApto;
    private String bloco;
}

