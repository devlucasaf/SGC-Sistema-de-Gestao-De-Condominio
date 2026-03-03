package com.condominio.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import java.util.Date;

public class Login {

    private Integer id;

    private String cpf;
    private String nome;
    private String email;

    private Date dataNascimento;

    @JsonIgnore
    private byte[] senha;

    private Date dataAlteracaoReserva;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {
        return id;
    }

}
