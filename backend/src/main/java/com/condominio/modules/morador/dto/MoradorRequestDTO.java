package com.condominio.modules.morador.dto;

import com.condominio.modules.morador.model.StatusMorador;
import com.condominio.modules.morador.model.TipoMorador;
import org.hibernate.validator.constraints.br.CPF;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.UUID;

public record MoradorRequestDTO (
    @NotBlank(message = "O nome é obrigatório")
    String nome,

    @NotBlank(message = "O CPF é obrigatório")
    @CPF(message = "CPF inválido")
    String cpf,

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    String email,

    @NotBlank(message = "O telefone é obrigatório")
    String telefone,

    @NotNull(message = "O tipo de morador é obrigatório (PROPRIETARIO ou INQUILINO)")
    TipoMorador tipoMorador,

    @NotNull(message = "O status do morador é obrigatório (ATIVO ou INATIVO)")
    StatusMorador statusMorador,

    @NotNull(message = "O ID da unidade é obrigatório")
    Long unidadeId
) {}


