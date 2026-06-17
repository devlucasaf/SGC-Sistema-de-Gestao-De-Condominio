package sgc.condominio.modules.sindico.dto;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class SindicoRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    @NotBlank(message = "E-Mail é obrigatório")
    @Email(message = "E-Mail inválido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    private String senha;

    private String telefone;

    @NotNull(message = "Data de nascimento é obrigatória")
    private LocalDate dataNascimento;

    @NotNull(message = "Data de início do mandato é obrigatória")
    private LocalDate dataInicioMandato;

    private LocalDate dataFimMandato;
}
