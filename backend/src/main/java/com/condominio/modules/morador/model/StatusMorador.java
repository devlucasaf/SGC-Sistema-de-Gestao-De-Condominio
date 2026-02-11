package com.condominio.modules.morador.model;

public enum StatusMorador {
    ATIVO("Ativo"),
    INATIVO("Inativo"),
    INADIMPLENTE("Inadimplente"),
    VISITANTE_TEMPORARIO("Visitante Temporário"),
    AGUARDANDO_APROVACAO("Aguardando Aprovação"),
    SUSPENSO("Suspenso"),
    EX_MORADOR("Ex-Morador");

    private final String descricao;

    StatusMorador(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
