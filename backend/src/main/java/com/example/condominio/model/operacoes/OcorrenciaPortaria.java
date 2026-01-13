package com.example.condominio.model.operacoes;

import com.example.condominio.model.usuario.Morador;
import com.example.condominio.model.usuario.Porteiro;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ocorrencia_portaria")
public class OcorrenciaPortaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ocorrencia_portaria")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_porteiro")
    private Porteiro porteiroResponsavel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_morador")
    private Morador moradorEnvolvido;

    @Column(name = "descricao", nullable = false, length = 500)
    private String descricao;

    @Column(name = "data_ocorrencia", nullable = false)
    private LocalDateTime dataOcorrencia = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoOcorrencia tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusOcorrencia status = StatusOcorrencia.ABERTA;

    public enum TipoOcorrencia {
        BARULHO,
        VAZAMENTO,
        ELEVADOR,
        ENERGIA,
        LIMPEZA,
        SEGURANCA,
        OUTROS
    }
    public enum  StatusOcorrencia {
        ABERTA,
        EM_ANDAMENTO,
        RESOLVIDA,
        ARQUIVADA
    }

    public OcorrenciaPortaria() {}

    public OcorrenciaPortaria(Porteiro porteiro, Morador morador, TipoOcorrencia tipo, String descricao) {
        this.porteiroResponsavel = porteiro;
        this.moradorEnvolvido = morador;
        this.tipo = tipo;
        this.descricao = descricao;
        this.dataOcorrencia = LocalDateTime.now();
        this.status = StatusOcorrencia.ABERTA;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Porteiro getPorteiroResponsavel() {
        return porteiroResponsavel;
    }

    public void setPorteiroResponsavel(Porteiro porteiroResponsavel) {
        this.porteiroResponsavel = porteiroResponsavel;
    }

    public Morador getMoradorEnvolvido() {
        return moradorEnvolvido;
    }

    public void setMoradorEnvolvido(Morador moradorEnvolvido) {
        this.moradorEnvolvido = moradorEnvolvido;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getDataOcorrencia() {
        return dataOcorrencia;
    }

    public void setDataOcorrencia(LocalDateTime dataOcorrencia) {
        this.dataOcorrencia = dataOcorrencia;
    }

    public TipoOcorrencia getTipo() {
        return tipo;
    }

    public void setTipo(TipoOcorrencia tipo) {
        this.tipo = tipo;
    }

    public StatusOcorrencia getStatus() {
        return status;
    }

    public void setStatus(StatusOcorrencia status) {
        this.status = status;
    }

    public boolean estaAberta() {
        return status == StatusOcorrencia.ABERTA;
    }

    public boolean estaResolvida() {
        return status == StatusOcorrencia.RESOLVIDA;
    }

    public void marcarComoResolvida() {
        this.status = StatusOcorrencia.RESOLVIDA;
    }

    public void marcarComoEmAndamento() {
        this.status = StatusOcorrencia.EM_ANDAMENTO;
    }

    public boolean envolveMorador() {
        return moradorEnvolvido != null;
    }

    public Long idadeEmDias() {
        return java.time.Duration.between(dataOcorrencia, LocalDateTime.now()).toDays();
    }

    @Override
    public String toString() {
        return "OcorrenciaPortaria{" +
                "id=" + id +
                ", tipo=" + tipo +
                ", status=" + status +
                ", dataOcorrencia=" + dataOcorrencia +
                ", descricao='" + (descricao != null && descricao.length() > 30 ?
                descricao.substring(0, 30) + "..." : descricao) + '\'' +
                '}';
    }
}
