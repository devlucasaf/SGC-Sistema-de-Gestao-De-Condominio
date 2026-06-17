package sgc.condominio.modules.morador.model;

public enum TipoMorador {
    PROPRIETARIO("Proprietário"),         // Dono do imóvel
    INQUILINO("Inquilino"),               // Quem aluga
    DEPENDENTE("Dependente");             // Filho, conjuge, etc

    private final String descricao;

    TipoMorador(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
