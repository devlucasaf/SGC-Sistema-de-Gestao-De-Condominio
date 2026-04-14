package com.condominio.modules.infracao.model;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "infracoes")
@Data
public class Infracao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoInfracao tipo;

    @Column(nullable = false)
    private String motivo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(precision = 10, scale = 2)
    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusInfracao status = StatusInfracao.PENDENTE;

    @Column(nullable = false)
    private Long moradorId;

    private String nomeMorador;

    private String unidadeMorador;

    @Column(name = "data_infracao", nullable = false)
    private LocalDate dataInfracao;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao = LocalDateTime.now();
}

