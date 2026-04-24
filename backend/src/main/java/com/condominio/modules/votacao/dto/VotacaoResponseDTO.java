package com.condominio.modules.votacao.dto;

import com.condominio.modules.votacao.model.StatusVotacao;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class VotacaoResponseDTO {

    private Long                id;
    private String              titulo;
    private String              descricao;
    private List<String>        candidatos;
    private LocalDate           dataInicio;
    private LocalDate           dataFim;
    private StatusVotacao       status;
    private LocalDateTime       dataCriacao;
    private long                totalVotos;
    private Map<String, Long>   resultado;
    private boolean             jaVotou;
}

