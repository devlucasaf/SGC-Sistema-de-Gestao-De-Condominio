package com.condominio.modules.porteiro.dto;

import com.condominio.modules.porteiro.model.Porteiro;
import lombok.Data;
import java.time.LocalDate;

@Data
public class PorteiroResponseDTO {
    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private String telefone;
    private LocalDate dataNascimento;

    private String matricula;
    private LocalDate dataEntrada;

    public static PorteiroResponseDTO fromEntity(Porteiro porteiro) {
        PorteiroResponseDTO dto = new PorteiroResponseDTO();
        dto.setId(porteiro.getId());
        dto.setNome(porteiro.getNome());
        dto.setCpf(porteiro.getCpf());
        dto.setEmail(porteiro.getEmail());
        dto.setTelefone(porteiro.getTelefone());
        dto.setDataNascimento(porteiro.getDataNascimento());

        dto.setMatricula(porteiro.getMatricula());
        dto.setDataEntrada(porteiro.getDataEntrada());
        return dto;
    }
}