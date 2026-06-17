package sgc.condominio.modules.admin.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class CriarSindicoDTO {

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório")
    private String email;

    @NotBlank(message = "O CPF é obrigatório")
    private String cpf;

    @NotBlank(message = "A senha é obrigatória")
    private String senha;

    @NotNull(message = "A data de nascimento é obrigatória")
    private String dataNascimento;

    private String telefone;
}

