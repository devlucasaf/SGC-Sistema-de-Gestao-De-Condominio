package com.condominio.modules.reclamacao.model;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reclamacoes")
@Data
public class Reclamacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo;
    private String categoria;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String unidadeAlvo;

    private String status = "PENDENTE";

    private LocalDateTime dataCriacao = LocalDateTime.now();
}