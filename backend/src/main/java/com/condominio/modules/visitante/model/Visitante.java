package com.condominio.modules.visitante.model;

import lombok.Data;

import javax.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "visitantes")
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
