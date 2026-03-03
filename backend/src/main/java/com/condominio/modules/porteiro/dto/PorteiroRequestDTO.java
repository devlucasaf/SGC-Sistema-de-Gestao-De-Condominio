package com.condominio.modules.porteiro.dto;

import lombok.Data;

import org.hibernate.validator.constraints.br.CPF;

import javax.validation.constraints.*;

import java.time.LocalDate;

@Data
public class PorteiroRequestDTO {
    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O CPF é obrigatório")
    @CPF(message = "CPF inválido")
    private String cpf;

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotNull(message = "A data de nascimento é obrigatória")
    @Past(message = "A data de nascimento deve ser anterior a hoje")
    private LocalDate dataNascimento;

    private String telefone;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    private String senha;

    @NotBlank(message = "A matrícula é obrigatória")
    private String matricula;
}
