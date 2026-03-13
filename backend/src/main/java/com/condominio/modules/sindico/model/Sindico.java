package com.condominio.modules.sindico.model;

import com.condominio.modules.usuario.model.Usuario;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "sindico")
@Data
public class Sindico {

    @Id
    @Column(name = "id_usuario")
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(name = "data_inicio_mandato", nullable = false)
    private LocalDate dataInicioMandato;

    @Column(name = "data_fim_mandato")
    private LocalDate dataFimMandato;

    @Column(nullable = false)
    private String status;
}
