package com.condominio.modules.visitante.model;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import java.time.LocalDateTime;

@Data
public class Visitante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(unique = true)
    private String cpf;

    private String telefone;

    @Column(name = "data_cadastro")
    private LocalDateTime dataCadastro;

    public Visitante() {
        this.dataCadastro = LocalDateTime.now();
    }
}
