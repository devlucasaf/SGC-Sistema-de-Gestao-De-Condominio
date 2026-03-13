package com.condominio.modules.sindico.dto;

import com.condominio.modules.sindico.model.Sindico;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SindicoResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private String telefone;
    private LocalDate dataInicioMandato;
    private LocalDate dataFimMandato;
    private String status;

    public static SindicoResponseDTO fromEntity(Sindico sindico) {
        SindicoResponseDTO dto = new SindicoResponseDTO();

        // --- DADOS DA HERANÇA COM USUÁRIO ---
        dto.setId(sindico.getId());
        dto.setNome(sindico.getUsuario().getNome());
        dto.setEmail(sindico.getUsuario().getEmail());
        dto.setCpf(sindico.getUsuario().getCpf());
        dto.setTelefone(sindico.getUsuario().getTelefone());

        // --- DADOS DO SÍNDICO ---
        dto.setDataInicioMandato(sindico.getDataInicioMandato());
        dto.setDataFimMandato(sindico.getDataFimMandato());
        dto.setStatus(sindico.getStatus());

        return dto;
    }
}
