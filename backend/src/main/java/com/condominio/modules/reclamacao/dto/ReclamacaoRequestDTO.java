package com.condominio.modules.reclamacao.dto;

public class ReclamacaoRequestDTO {

    private String tipo;
    private String categoria;
    private String descricao;
    private String unidade;

    public ReclamacaoRequestDTO() {}

    public ReclamacaoRequestDTO(String tipo, String categoria, String descricao, String unidade) {
        this.tipo = tipo;
        this.categoria = categoria;
        this.descricao = descricao;
        this.unidade = unidade;
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
}
