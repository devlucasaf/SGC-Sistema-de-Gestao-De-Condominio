package com.condominio.modules.reclamacao.dto;

import com.condominio.modules.reclamacao.model.StatusReclamacao;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReclamacaoResponseDTO {

    private Long                id;
    private String              tipo;
    private String              categoria;
    private String              descricao;
    private String              unidade;
    private StatusReclamacao    status;
    private LocalDateTime       dataCriacao;
}
