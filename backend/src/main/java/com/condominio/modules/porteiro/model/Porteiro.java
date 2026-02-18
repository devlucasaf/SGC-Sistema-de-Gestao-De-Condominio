package com.condominio.modules.porteiro.model;

import com.condominio.model.base.BaseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "porteiro")
public class Porteiro implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_porteiro")   
    private Long id;

    // --- DADOS PESSOAIS ---
    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Column(name = "cpf", unique = true, length = 14)
    private String cpf;

    // --- CONTATO & ACESSO ---
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "senha_hash", nullable = false, length = 255)
    private String senhaHash;

    @Column(length = 20)
    private String telefone;

    @Column(name = "matricula", unique = true, length = 50)
    private String matricula;

    @Column(name = "data_entrada", nullable = false)
    private LocalDate dataEntrada;

    @Column(name = "data_saida")
    private LocalDate dataSaida;
}