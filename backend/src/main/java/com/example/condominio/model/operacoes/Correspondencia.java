package com.example.condominio.model.operacoes;

import com.example.condominio.model.usuario.Morador;
import com.example.condominio.model.usuario.Porteiro;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "correspondencia")
public class Correspondencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_correspondencia")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_morador", nullable = false)
    private Morador morador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_porteiro")
    private Porteiro porteiroResponsavel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoCorrespondencia tipo;

    @Column(length = 100)
    private String remetente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusCorrespondencia status = StatusCorrespondencia.AGUARDANDO;

    @Column(name = "data_recebimento", nullable = false)
    private LocalDateTime dataRecebimento = LocalDateTime.now();

    @Column(name = "data_entrega")
    private LocalDateTime dataEntrega;

    @Column(length = 200)
    private String observacoes;

    public enum TipoCorrespondencia {
        CONTA,
        CARTA,
        NOTIFICACAO,
        REVISTA,
        DOCUMENTO,
        OUTROS
    }

    public enum StatusCorrespondencia {
        AGUARDANDO,
        ENTREGUE,
        DEVOLVIDA
    }

    public Correspondencia() {}

    public Correspondencia(Morador morador, TipoCorrespondencia tipo, String remetente) {
        this.morador = morador;
        this.tipo = tipo;
        this.remetente = remetente;
        this.status = StatusCorrespondencia.AGUARDANDO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Morador getMorador() {
        return morador;
    }

    public void setMorador(Morador morador) {
        this.morador = morador;
    }

    public Porteiro getPorteiroResponsavel() {
        return porteiroResponsavel;
    }

    public void setPorteiroResponsavel(Porteiro porteiroResponsavel) {
        this.porteiroResponsavel = porteiroResponsavel;
    }

    public TipoCorrespondencia getTipo() {
        return tipo;
    }

    public void setTipo(TipoCorrespondencia tipo) {
        this.tipo = tipo;
    }

    public String getRemetente() {
        return remetente;
    }

    public void setRemetente(String remetente) {
        this.remetente = remetente;
    }

    public StatusCorrespondencia getStatus() {
        return status;
    }

    public LocalDateTime getDataRecebimento() {
        return dataRecebimento;
    }

    public void setDataRecebimento(LocalDateTime dataRecebimento) {
        this.dataRecebimento = dataRecebimento;
    }

    public LocalDateTime getDataEntrega() {
        return dataEntrega;
    }

    public void setDataEntrega(LocalDateTime dataEntrega) {
        this.dataEntrega = dataEntrega;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    // Métodos de negócio
    public boolean aguardandoEntrega() {
        return status == StatusCorrespondencia.AGUARDANDO;
    }

    public void registrarEntrega() {
        this.dataEntrega = LocalDateTime.now();
        this.status = StatusCorrespondencia.ENTREGUE;
    }

    @Override
    public String toString() {
        return "Correspondencia{" +
                "id=" + id +
                ", tipo=" + tipo +
                ", remetente='" + remetente + '\'' +
                ", status=" + status +
                ", morador=" + (morador != null ? morador.getNome() : "null") +
                '}';
    }

}
