package com.example.condominio.model.usuario;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "morador")
@Inheritance(strategy = InheritanceType.JOINED)
public class Morador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_morador")
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(unique = true, nullable = false)
    private String email;

    private String telefone;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    private StatusMorador status = StatusMorador.ATIVO;

    @Column(name = "data_entrada")
    private LocalDate dataEntrada;

    @ManyToOne
    @JoinColumn(name = "id_unidade", nullable = false)
    private Unidade unidade;

    @OneToOne(mappedBy = "morador", cascade = CascadeType.ALL)
    private Sindico sindico;

    public enum StatusMorador {
        ATIVO, INATIVO, INADIMPLENTE, VISITANTE_TEMPORARIO
    }

}