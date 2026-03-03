package com.condominio.modules.morador.dto;

import com.condominio.modules.morador.model.Morador;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MoradorResponseDTO {

    private Long id;
    private String nome;
    private LocalDate dataNascimento;
    private String email;
    private String telefone;
    private String cpf;
    private String tipoMorador;

    private String unidade;

    public static MoradorResponseDTO fromEntity(Morador morador) {
        MoradorResponseDTO dto = new MoradorResponseDTO();

        dto.setId(morador.getId());
        dto.setNome(morador.getNome());
        dto.setDataNascimento(morador.getDataNascimento());
        dto.setEmail(morador.getEmail());
        dto.setTelefone(morador.getTelefone());
        dto.setCpf(morador.getCpf());

        // Converte o Enum para String
        if (morador.getTipoMorador() != null) {
            dto.setTipoMorador(morador.getTipoMorador().name());
        }

        // Formata a unidade para ficar bonito no JSON
        if (morador.getUnidade() != null) {
            String descricaoUnidade = "Bloco " + morador.getUnidade().getBloco() +
                    " - Apto " + morador.getUnidade().getNumeroApto();
            dto.setUnidade(descricaoUnidade);
        }

        return dto;
    }
}
