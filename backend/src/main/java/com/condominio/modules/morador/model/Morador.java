package com.condominio.modules.morador.model;

import com.condominio.model.base.BaseEntity;
import com.condominio.model.usuario.Unidade;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "morador")
public class Morador extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_morador")
    private Long id;

//  +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=

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

    // --- RELACIONAMENTO COM O IMÓVEL ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_unidade", nullable = false)
    private Unidade unidade;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private TipoMorador tipoMorador; // Enum corrigido

    // --- SITUAÇÃO NO CONDOMÍNIO ---
    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private StatusMorador status = StatusMorador.ATIVO;

    @Column(name = "data_entrada", nullable = false)
    private LocalDate dataEntrada;

    @Column(name = "data_saida")
    private LocalDate dataSaida;

    // --- JURÍDICO ---
    @Column(name = "aceite_termos", nullable = false)
    private boolean aceiteTermos = false;

    @Column(name = "data_aceite_termos")
    private LocalDate dataAceiteTermos;

    // --- CONSTRUTORES ---
    public Morador() {
        // Hibernate
    }

    public Morador(String nome, String email, String cpf, String senhaHash, Unidade unidade, TipoMorador tipoMorador) {
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;                     // Agora recebe o valor corretamente
        this.senhaHash = senhaHash;
        this.unidade = unidade;
        this.tipoMorador = tipoMorador;     // Agora recebe o valor corretamente
        this.dataEntrada = LocalDate.now();
        this.status = StatusMorador.AGUARDANDO_APROVACAO;
    }

    // --- MÉTODOS DE NEGÓCIO ---

    public boolean podeUsarAreasComuns() {
        return isAtivo() && !isInadimplente();
    }

    public boolean isAtivo() {
        return this.status == StatusMorador.ATIVO && this.dataSaida == null;
    }

    public boolean isInadimplente() {
        return this.status == StatusMorador.INADIMPLENTE;
    }

    public boolean isMaiorDeIdade() {
        if (this.dataNascimento == null) return false;
        return LocalDate.now().minusYears(18).isAfter(this.dataNascimento)
                || LocalDate.now().minusYears(18).isEqual(this.dataNascimento);
    }

    public void registrarSaidaDoCondominio() {
        this.dataSaida = LocalDate.now();
        this.status = StatusMorador.EX_MORADOR;
    }

    public void aceitarTermoDeUso() {
        this.aceiteTermos = true;
        this.dataAceiteTermos = LocalDate.now();
    }

    // --- GETTERS E SETTERS ---

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public Unidade getUnidade() {
        return unidade;
    }

    public void setUnidade(Unidade unidade) {
        this.unidade = unidade;
    }

    public TipoMorador getTipoMorador() {
        return tipoMorador;
    }

    public void setTipoMorador(TipoMorador tipoMorador) {
        this.tipoMorador = tipoMorador;
    }

    public StatusMorador getStatus() {
        return status;
    }

    public void setStatus(StatusMorador status) {
        this.status = status;
    }

    public LocalDate getDataEntrada() {
        return dataEntrada;
    }

    public void setDataEntrada(LocalDate dataEntrada) {
        this.dataEntrada = dataEntrada;
    }

    public LocalDate getDataSaida() {
        return dataSaida;
    }

    public void setDataSaida(LocalDate dataSaida) {
        this.dataSaida = dataSaida;
    }

    public boolean isAceiteTermos() {
        return aceiteTermos;
    }

    public void setAceiteTermos(boolean aceiteTermos) {
        this.aceiteTermos = aceiteTermos;
    }

    public LocalDate getDataAceiteTermos() {
        return dataAceiteTermos;
    }

    public void setDataAceiteTermos(LocalDate dataAceiteTermos) {
        this.dataAceiteTermos = dataAceiteTermos;
    }

}