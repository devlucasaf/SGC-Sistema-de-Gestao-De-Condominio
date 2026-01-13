package com.example.condominio.model.operacoes;

import com.example.condominio.model.usuario.Morador;
import com.example.condominio.model.usuario.Porteiro;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "encomenda")
public class Encomenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_encomenda")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_morador", nullable = false)
    private Morador morador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_porteiro")
    private Porteiro porteiroResponsavel;

    @Column(name = "data_recebimento", nullable = false)
    private LocalDateTime dataRecebimento = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoEncomenda tipo;

    @Column(length = 100)
    private String remetente;

    @Column(length = 500)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusEncomenda status = StatusEncomenda.AGUARDANDO_RETIRADA;

    @Column(name = "data_retirada")
    private LocalDateTime dataRetirada;

    @Column(length = 200)
    private String observacoes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Enums SIMPLIFICADOS
    public enum TipoEncomenda {
        PACOTE,
        DOCUMENTO,
        ALIMENTOS,
        ELETRONICO,
        OUTROS
    }

    public enum StatusEncomenda {
        AGUARDANDO_RETIRADA,
        ENTREGUE,
        DEVOLVIDA,
        EXTRAVIADA
    }

    // Construtor
    public Encomenda() {}

    public Encomenda(Morador morador, TipoEncomenda tipo, String remetente) {
        this.morador = morador;
        this.tipo = tipo;
        this.remetente = remetente;
        this.dataRecebimento = LocalDateTime.now();
        this.status = StatusEncomenda.AGUARDANDO_RETIRADA;
    }

    // Getters e Setters

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

    public LocalDateTime getDataRecebimento() {
        return dataRecebimento;
    }

    public void setDataRecebimento(LocalDateTime dataRecebimento) {
        this.dataRecebimento = dataRecebimento;
    }

    public TipoEncomenda getTipo() {
        return tipo;
    }

    public void setTipo(TipoEncomenda tipo) {
        this.tipo = tipo;
    }

    public String getRemetente() {
        return remetente;
    }

    public void setRemetente(String remetente) {
        this.remetente = remetente;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public StatusEncomenda getStatus() {
        return status;
    }

    public void setStatus(StatusEncomenda status) {
        this.status = status;
    }

    public LocalDateTime getDataRetirada() {
        return dataRetirada;
    }

    public void setDataRetirada(LocalDateTime dataRetirada) {
        this.dataRetirada = dataRetirada;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Métodos de negócio - SIMPLES
    public boolean aguardandoRetirada() {
        return status == StatusEncomenda.AGUARDANDO_RETIRADA;
    }

    public void registrarRetirada() {
        this.dataRetirada = LocalDateTime.now();
        this.status = StatusEncomenda.ENTREGUE;
    }

    @Override
    public String toString() {
        return "Encomenda{" +
                "id=" + id +
                ", tipo=" + tipo +
                ", remetente='" + remetente + '\'' +
                ", status=" + status +
                ", dataRecebimento=" + dataRecebimento +
                ", morador=" + (morador != null ? morador.getNome() : "null") +
                '}';
    }
}
