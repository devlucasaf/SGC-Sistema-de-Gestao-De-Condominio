package com.condominio.modules.reserva.model;

import com.condominio.modules.morador.model.Morador;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "reserva")
@Data
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_morador", nullable = false)
    private Morador morador;

    @ManyToOne
    @JoinColumn(name = "id_area_lazer", nullable = false)
    private AreaLazer areaLazer;

    @Enumerated(EnumType.STRING)
    private StatusReserva status;

    private LocalDateTime dataSolicitacao;

    @Column(nullable = false)
    private LocalDate dataReserva;

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "hora_fim")
    private LocalTime horaFim;

    public Reserva() {
        this.dataSolicitacao = LocalDateTime.now();
        this.status = StatusReserva.PENDENTE;
    }
}
