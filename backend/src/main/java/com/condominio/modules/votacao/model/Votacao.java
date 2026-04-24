package com.condominio.modules.votacao.model;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "votacoes")
@Data
public class Votacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String candidatos; // JSON array: ["Nome1","Nome2"]

    @Column(nullable = false)
    private LocalDate dataInicio;

    @Column(nullable = false)
    private LocalDate dataFim;

    @Enumerated(EnumType.STRING)
    private StatusVotacao status = StatusVotacao.ABERTA;

    private LocalDateTime dataCriacao = LocalDateTime.now();
}

