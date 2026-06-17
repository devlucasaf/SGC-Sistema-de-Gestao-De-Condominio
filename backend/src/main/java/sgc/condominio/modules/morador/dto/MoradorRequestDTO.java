package sgc.condominio.modules.morador.dto;

import sgc.condominio.modules.morador.model.TipoMorador;

import lombok.Data;

import javax.validation.constraints.*;

import java.time.LocalDate;

@Data
public class MoradorRequestDTO {
    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O CPF é obrigatório")
    @Pattern(
            regexp = "^\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}$",
            message = "CPF inválido. Use o formato 000.000.000-00 ou 00000000000"
    )
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

    @NotNull(message = "O ID da unidade é obrigatório")
    private Long idUnidade;

    @NotNull(message = "O tipo de morador é obrigatório (PROPRIETARIO ou INQUILINO)")
    private TipoMorador tipoMorador;
}
