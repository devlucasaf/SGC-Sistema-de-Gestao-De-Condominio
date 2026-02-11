package com.condominio.modules.morador.dto;

import java.time.LocalDate;

public class MoradorResponseDTO {

    private Long id;
    private String nome;
    private LocalDate dataNascimento;
    private String email;
    private String telefone;
    private String status;
    private String unidade;

    private String cpf;
    private String rg;

    public MoradorResponseDTO() {}

    public MoradorResponseDTO(Long id, String nome, LocalDate dataNascimento, String email,
                              String telefone, String status, String unidade,
                              String cpf, String rg) {
        this.id = id;
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.email = email;
        this.telefone = telefone;
        this.status = status;
        this.unidade = unidade;
        this.cpf = cpf;
        this.rg = rg;
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUnidade() {
        return unidade;
    }

    public void setUnidade(String unidade) {
        this.unidade = unidade;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }
}
