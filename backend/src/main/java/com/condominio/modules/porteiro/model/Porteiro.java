package com.condominio.modules.porteiro.model;

import com.condominio.modules.usuario.model.TipoUsuario;
import com.condominio.modules.usuario.model.Usuario;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "porteiro")
public class Porteiro extends Usuario {

    @Column(name = "matricula", unique = true, length = 50)
    private String matricula;

    @Column(name = "data_entrada", nullable = false)
    private LocalDate dataEntrada;

    public Porteiro() {
        // Construtor vazio exigido pelo JPA
    }

    // --- CONSTRUTOR ---
    public Porteiro(String nome, LocalDate dataNascimento, String cpf, String email, String senhaHash, String telefone, String matricula) {
        super(nome, dataNascimento, cpf, email, senhaHash, telefone, TipoUsuario.PORTEIRO);

        this.matricula = matricula;
        this.dataEntrada = LocalDate.now();
    }

    // --- GETTERS E SETTERS ---

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public LocalDate getDataEntrada() {
        return dataEntrada;
    }

    public void setDataEntrada(LocalDate dataEntrada) {
        this.dataEntrada = dataEntrada;
    }
}
