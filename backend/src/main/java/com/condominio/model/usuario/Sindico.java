package com.condominio.model.usuario;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "sindico")
@PrimaryKeyJoinColumn(name = "id_morador")
public class Sindico extends Morador {

    @Column(name = "data_inicio_mandato", nullable = false)
    private LocalDate dataInicioMandato;

    @Column(name = "data_fim_mandato")
    private LocalDate dataFimMandato;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_mandato", nullable = false, length = 20)
    private StatusMandato statusMandato = StatusMandato.ATIVO;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_sindico", nullable = false, length = 20)
    private TipoSindico tipoSindico = TipoSindico.TITULAR;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "sindico_permissoes",
            joinColumns = @JoinColumn(name = "id_morador")
    )
    @Column(name = "permissao", length = 50)
    @Enumerated(EnumType.STRING)
    private Set<PermissaoSindico> permissoes = new HashSet<>();

    @Column(name = "observacoes_mandato", length = 1000)
    private String observacoesMandato;

    @Column(name = "created_at_sindico", updatable = false)
    private LocalDateTime createdAtSindico;

    @Column(name = "updated_at_sindico")
    private LocalDateTime updatedAtSindico;

    // ===== ENUMS =====

    public enum StatusMandato {
        ATIVO("Ativo"),
        FINALIZADO("Finalizado"),
        INTERINO("Interino"),
        SUSPENSO("Suspenso");

        private final String descricao;

        StatusMandato(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum TipoSindico {
        TITULAR("Síndico Titular"),
        SUPLENTE("Síndico Suplente"),
        INTERINO("Síndico Interino");

        private final String descricao;

        TipoSindico(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum PermissaoSindico {
        CADASTRAR_MORADORES("Cadastrar Moradores"),
        APROVAR_CADASTROS("Aprovar Cadastros"),
        GERAR_BOLETOS("Gerar Boletos"),
        ENVIAR_COMUNICADOS("Enviar Comunicados"),
        ADMINISTRAR_RESERVAS("Administrar Reservas"),
        GERAR_RELATORIOS("Gerar Relatórios");

        private final String descricao;

        PermissaoSindico(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    // ===== CONSTRUTORES =====

    public Sindico() {
        super();
        this.createdAtSindico = LocalDateTime.now();
        this.updatedAtSindico = LocalDateTime.now();
        this.dataInicioMandato = LocalDate.now();

        // Permissões padrão (você pode ajustar depois)
        this.permissoes.add(PermissaoSindico.CADASTRAR_MORADORES);
        this.permissoes.add(PermissaoSindico.APROVAR_CADASTROS);
        this.permissoes.add(PermissaoSindico.GERAR_BOLETOS);
        this.permissoes.add(PermissaoSindico.ENVIAR_COMUNICADOS);
        this.permissoes.add(PermissaoSindico.ADMINISTRAR_RESERVAS);
        this.permissoes.add(PermissaoSindico.GERAR_RELATORIOS);
    }

    // ===== CICLO DE VIDA =====

    @PrePersist
    protected void onCreateSindico() {
        createdAtSindico = LocalDateTime.now();
        updatedAtSindico = LocalDateTime.now();
        if (dataInicioMandato == null) {
            dataInicioMandato = LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdateSindico() {
        updatedAtSindico = LocalDateTime.now();
    }

    // ===== REGRAS DE NEGÓCIO =====

    public boolean isMandatoAtivo() {
        return statusMandato == StatusMandato.ATIVO || statusMandato == StatusMandato.INTERINO;
    }

    public boolean isMandatoExpirado() {
        if (dataFimMandato == null) return false;
        return LocalDate.now().isAfter(dataFimMandato);
    }

    public boolean temPermissao(PermissaoSindico permissao) {
        return permissoes != null && permissoes.contains(permissao);
    }

    public void adicionarPermissao(PermissaoSindico permissao) {
        if (permissao == null) return;
        if (permissoes == null) permissoes = new HashSet<>();
        permissoes.add(permissao);
        updatedAtSindico = LocalDateTime.now();
    }

    public void removerPermissao(PermissaoSindico permissao) {
        if (permissao == null || permissoes == null) return;
        permissoes.remove(permissao);
        updatedAtSindico = LocalDateTime.now();
    }

    public void finalizarMandato() {
        this.statusMandato = StatusMandato.FINALIZADO;
        this.dataFimMandato = LocalDate.now();
        this.updatedAtSindico = LocalDateTime.now();
    }

    // ===== GETTERS / SETTERS =====

    public LocalDate getDataInicioMandato() {
        return dataInicioMandato;
    }

    public void setDataInicioMandato(LocalDate dataInicioMandato) {
        this.dataInicioMandato = dataInicioMandato;
    }

    public LocalDate getDataFimMandato() {
        return dataFimMandato;
    }

    public void setDataFimMandato(LocalDate dataFimMandato) {
        this.dataFimMandato = dataFimMandato;
    }

    public StatusMandato getStatusMandato() {
        return statusMandato;
    }

    public void setStatusMandato(StatusMandato statusMandato) {
        this.statusMandato = statusMandato;
    }

    public TipoSindico getTipoSindico() {
        return tipoSindico;
    }

    public void setTipoSindico(TipoSindico tipoSindico) {
        this.tipoSindico = tipoSindico;
    }

    public Set<PermissaoSindico> getPermissoes() {
        return permissoes;
    }

    public void setPermissoes(Set<PermissaoSindico> permissoes) {
        this.permissoes = permissoes;
    }

    public String getObservacoesMandato() {
        return observacoesMandato;
    }

    public void setObservacoesMandato(String observacoesMandato) {
        this.observacoesMandato = observacoesMandato;
    }

    public LocalDateTime getCreatedAtSindico() {
        return createdAtSindico;
    }

    public void setCreatedAtSindico(LocalDateTime createdAtSindico) {
        this.createdAtSindico = createdAtSindico;
    }

    public LocalDateTime getUpdatedAtSindico() {
        return updatedAtSindico;
    }

    public void setUpdatedAtSindico(LocalDateTime updatedAtSindico) {
        this.updatedAtSindico = updatedAtSindico;
    }

    @Override
    public String toString() {
        return "Sindico{" +
                "idMorador=" + getId() +
                ", nome='" + getNome() + '\'' +
                ", tipoSindico=" + tipoSindico +
                ", statusMandato=" + statusMandato +
                ", dataInicioMandato=" + dataInicioMandato +
                ", dataFimMandato=" + dataFimMandato +
                ", mandatoAtivo=" + isMandatoAtivo() +
                '}';
    }
}
