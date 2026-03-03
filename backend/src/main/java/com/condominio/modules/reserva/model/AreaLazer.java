package com.condominio.modules.reserva.model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "area_lazer")
@Data
public class AreaLazer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    private Integer capacidadeMaxima;

    private boolean precisaPagar;

    public AreaLazer() {}

    public AreaLazer(String nome, Integer capacidadeMaxima) {
        this.nome = nome;
        this.capacidadeMaxima = capacidadeMaxima;
    }
}
