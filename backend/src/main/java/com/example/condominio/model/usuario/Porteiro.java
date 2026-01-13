package com.example.condominio.model.usuario;

import com.example.condominio.model.operacoes.Encomenda;
import com.example.condominio.model.operacoes.Visitante;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "porteiro")
@PrimaryKeyJoinColumn(name = "id_funcionario")
public class Porteiro extends Funcionario {

    @Column(name = "portaria_atribuida")
    private String portariaAtribuida;

    @Enumerated(EnumType.STRING)
    @Column(name = "turno_fixo")
    private TurnoPorteiro turnoFixo;

    @ElementCollection
    @CollectionTable(name = "porteiro_permissoes",
            joinColumns = @JoinColumn(name = "id_funcionario"))
    @Column(name = "permissao")
    @Enumerated(EnumType.STRING)
    private Set<PermissaoPorteiro> permissoes = new HashSet<>();

    @Column(name = "data_treinamento_seguranca")
    private LocalDate dataTreinamentoSeguranca;

    @Column(name = "certificacao_seguranca")
    private String certificacaoSeguranca;

    @Column(name = "ultima_atualizacao_acesso")
    private LocalDateTime ultimaAtualizacaoAcesso;

    // Relacionamentos específicos
    @OneToMany(mappedBy = "porteiroResponsavel", cascade = CascadeType.ALL)
    private Set<Visitante> visitantesRegistrados = new HashSet<>();

    @OneToMany(mappedBy = "porteiroResponsavel", cascade = CascadeType.ALL)
    private Set<Encomenda> encomendasRegistradas = new HashSet<>();

    @OneToMany(mappedBy = "porteiroResponsavel", cascade = CascadeType.ALL)
    private Set<Correspondencia> correspondencias = new HashSet<>();

    @OneToMany(mappedBy = "porteiroResponsavel", cascade = CascadeType.ALL)
    private Set<OcorrenciaPortaria> ocorrencias = new HashSet<>();

    // Enums (fora do construtor!)
    public enum TurnoPorteiro {
        MATUTINO(1, "06:00-18:00"),
        NOTURNO(2, "18:00-06:00"),
        INTERMITENTE(3, "Plantão variado");

        private final int codigo;
        private final String horario;

        TurnoPorteiro(int codigo, String horario) {
            this.codigo = codigo;
            this.horario = horario;
        }

        public int getCodigo() {
            return codigo;
        }

        public String getHorario() {
            return horario;
        }
    }

    public enum PermissaoPorteiro {
        REGISTRAR_VISITANTE,
        REGISTRAR_ENCOMENDA,
        REGISTRAR_CORRESPONDENCIA,
        CONSULTAR_RESERVAS,
        CONSULTAR_MORADORES,
        GERAR_RELATORIO_PORTARIA,
        REGISTRAR_OCORRENCIA,
        LIBERAR_ACESSO_TEMPORARIO,
        BLOQUEAR_ACESSO,
        VISUALIZAR_ALERTAS
    }

    // Construtor (FORA do enum!)
    public Porteiro() {
        this.setCargo(CargoFuncionario.PORTEIRO);
        this.permissoes.add(PermissaoPorteiro.REGISTRAR_VISITANTE);
        this.permissoes.add(PermissaoPorteiro.REGISTRAR_ENCOMENDA);
        this.ultimaAtualizacaoAcesso = LocalDateTime.now();
    }

    // Métodos de negócio
    public boolean podeRegistrarVisitante() {
        return this.permissoes.contains(PermissaoPorteiro.REGISTRAR_VISITANTE)
                && this.getStatus() == StatusFuncionario.ATIVO;
    }

    public boolean podeConsultarMorador() {
        return this.permissoes.contains(PermissaoPorteiro.CONSULTAR_MORADORES);
    }

    public boolean podeRegistrarOcorrencia() {
        return this.permissoes.contains(PermissaoPorteiro.REGISTRAR_OCORRENCIA);
    }

    public void adicionarPermissao(PermissaoPorteiro permissao) {
        this.permissoes.add(permissao);
    }

    public void removerPermissao(PermissaoPorteiro permissao) {
        this.permissoes.remove(permissao);
    }

    public boolean temPermissao(PermissaoPorteiro permissao) {
        return this.permissoes.contains(permissao);
    }

    // Getters e Setters

    public String getPortariaAtribuida() {
        return portariaAtribuida;
    }

    public void setPortariaAtribuida(String portariaAtribuida) {
        this.portariaAtribuida = portariaAtribuida;
    }

    public TurnoPorteiro getTurnoFixo() {
        return turnoFixo;
    }

    public void setTurnoFixo(TurnoPorteiro turnoFixo) {
        this.turnoFixo = turnoFixo;
    }

    public Set<PermissaoPorteiro> getPermissoes() {
        return permissoes;
    }

    public void setPermissoes(Set<PermissaoPorteiro> permissoes) {
        this.permissoes = permissoes;
    }

    public LocalDate getDataTreinamentoSeguranca() {
        return dataTreinamentoSeguranca;
    }

    public void setDataTreinamentoSeguranca(LocalDate dataTreinamentoSeguranca) {
        this.dataTreinamentoSeguranca = dataTreinamentoSeguranca;
    }

    public String getCertificacaoSeguranca() {
        return certificacaoSeguranca;
    }

    public void setCertificacaoSeguranca(String certificacaoSeguranca) {
        this.certificacaoSeguranca = certificacaoSeguranca;
    }

    public LocalDateTime getUltimaAtualizacaoAcesso() {
        return ultimaAtualizacaoAcesso;
    }

    public void setUltimaAtualizacaoAcesso(LocalDateTime ultimaAtualizacaoAcesso) {
        this.ultimaAtualizacaoAcesso = ultimaAtualizacaoAcesso;
    }

    public Set<Visitante> getVisitantesRegistrados() {
        return visitantesRegistrados;
    }

    public void setVisitantesRegistrados(Set<Visitante> visitantesRegistrados) {
        this.visitantesRegistrados = visitantesRegistrados;
    }

    public Set<Encomenda> getEncomendasRegistradas() {
        return encomendasRegistradas;
    }

    public void setEncomendasRegistradas(Set<Encomenda> encomendasRegistradas) {
        this.encomendasRegistradas = encomendasRegistradas;
    }

    public Set<Correspondencia> getCorrespondencias() {
        return correspondencias;
    }

    public void setCorrespondencias(Set<Correspondencia> correspondencias) {
        this.correspondencias = correspondencias;
    }

    public Set<OcorrenciaPortaria> getOcorrencias() {
        return ocorrencias;
    }

    public void setOcorrencias(Set<OcorrenciaPortaria> ocorrencias) {
        this.ocorrencias = ocorrencias;
    }

    @Override
    public String toString() {
        return "Porteiro{" +
                "id=" + getId() +
                ", nome='" + getNome() + '\'' +
                ", portariaAtribuida='" + portariaAtribuida + '\'' +
                ", turnoFixo=" + turnoFixo +
                ", matricula='" + getMatricula() + '\'' +
                ", status=" + getStatus() +
                '}';
    }
}
