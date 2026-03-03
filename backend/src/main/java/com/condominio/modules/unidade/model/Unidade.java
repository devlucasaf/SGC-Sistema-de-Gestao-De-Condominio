package com.condominio.modules.unidade.model;

import javax.persistence.*;

@Entity
@Table(name = "unidade")
public class Unidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unidade")
    private Long id;

    @Column(nullable = false, length = 50)
    private String bloco;

    @Column(nullable = false)
    private Integer andar;

    @Column(name = "numero_apto", nullable = false, length = 10)
    private String numeroApto;

    public Unidade() {}

    public Unidade(String bloco, Integer andar, String numeroApto) {
        this.bloco = bloco;
        this.andar = andar;
        this.numeroApto = numeroApto;
    }

    // --- GETTERS E SETTERS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBloco() {
        return bloco;
    }

    public void setBloco(String bloco) {
        this.bloco = bloco;
    }

    public Integer getAndar() {
        return andar;
    }

    public void setAndar(Integer andar) {
        this.andar = andar;
    }

    public String getNumeroApto() {
        return numeroApto;
    }

    public void setNumeroApto(String numeroApto) {
        this.numeroApto = numeroApto;
    }
}