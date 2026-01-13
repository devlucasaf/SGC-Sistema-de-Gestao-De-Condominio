package com.example.condominio.model.operacoes;

import com.example.condominio.model.usuario.Morador;
import com.example.condominio.model.usuario.Porteiro;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitante")
public class Visitante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_visitante")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_morador", nullable = false)
    private Morador morador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_porteiro")
    private Porteiro porteiroResponsavel;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 11)
    private String cpf;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusVisitante status = StatusVisitante.AUTORIZADO;

    @Column(name = "data_visita", nullable = false)
    private LocalDate dataVisita = LocalDate.now();

    @Column(name = "hora_entrada")
    private LocalDateTime horaEntrada;

    @Column(name = "hora_saida")
    private LocalDateTime horaSaida;

    @Column(length = 200)
    private String observacoes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Enums
    public enum StatusVisitante {
        AUTORIZADO,
        REGISTRADO,
        FINALIZADO
    }

    // Construtor MÍNIMO
    public Visitante() {}

    public Visitante(String nome, Morador morador) {
        this.nome = nome;
        this.morador = morador;
        this.dataVisita = LocalDate.now();
        this.status = StatusVisitante.AUTORIZADO;
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

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        if (cpf != null) {
            this.cpf = cpf.replaceAll("[^0-9]", "");
        }
        else {
            this.cpf = null;
        }
    }

    public StatusVisitante getStatus() {
        return status;
    }

    public void setStatus(StatusVisitante status) {
        this.status = status;
    }

    public LocalDate getDataVisita() {
        return dataVisita;
    }

    public void setDataVisita(LocalDate dataVisita) {
        this.dataVisita = dataVisita;
    }

    public LocalDateTime getHoraEntrada() {
        return horaEntrada;
    }

    public void setHoraEntrada(LocalDateTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public LocalDateTime getHoraSaida() {
        return horaSaida;
    }

    public void setHoraSaida(LocalDateTime horaSaida) {
        this.horaSaida = horaSaida;
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
    public boolean estaDentro() {
        return horaEntrada != null && horaSaida == null;
    }

    public void registrarEntrada(Porteiro porteiro) {
        this.porteiroResponsavel = porteiro;
        this.horaEntrada = LocalDateTime.now();
        this.status = StatusVisitante.REGISTRADO;
    }

    public void registrarSaida() {
        this.horaSaida = LocalDateTime.now();
        this.status = StatusVisitante.FINALIZADO;
    }

    public String getCpfFormatado() {
        if (cpf == null || cpf.length() != 11) return cpf;
        return cpf.substring(0, 3) + "." +
                cpf.substring(3, 6) + "." +
                cpf.substring(6, 9) + "-" +
                cpf.substring(9);
    }

    @Override
    public String toString() {
        return "Visitante{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", cpf='" + getCpfFormatado() + '\'' +
                ", data=" + dataVisita +
                ", status=" + status +
                '}';
    }
}
