package com.condominio.modules.reclamacao.dto;

import java.time.LocalDateTime;

public class ReclamacaoResponseDTO {

    private Long            id;
    private String          tipo;
    private String          categoria;
    private String          descricao;
    private String          unidade;
    private String          status;
    private LocalDateTime   dataCriacao;

    public ReclamacaoResponseDTO() {}

    public ReclamacaoResponseDTO(Long id, String tipo, String categoria, String descricao, String unidade,
                                 String status, LocalDateTime dataCriacao) {

        this.id = id;
        this.tipo = tipo;
        this.categoria = categoria;
        this.descricao = descricao;
        this.unidade = unidade;
        this.status = status;
        this.dataCriacao = dataCriacao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getUnidade() {
        return unidade;
    }

    public void setUnidade(String unidade) {
        this.unidade = unidade;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}
