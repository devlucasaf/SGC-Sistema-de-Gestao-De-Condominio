package com.condominio.modules.morador.model;

import com.condominio.modules.unidade.model.Unidade;
import com.condominio.modules.usuario.model.TipoUsuario;
import com.condominio.modules.usuario.model.Usuario;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "morador")
@PrimaryKeyJoinColumn(name = "id_usuario") // Liga o ID do Morador ao ID do Usuario
public class Morador extends Usuario {

    // --- RELACIONAMENTO COM O IMÓVEL ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_unidade", nullable = false)
    private Unidade unidade;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private TipoMorador tipoMorador; // Proprietário, Inquilino, etc.

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
        // Obrigatório para o Hibernate
    }

    public Morador(String nome, LocalDate dataNascimento, String cpf, String email,
                   String senhaHash, String telefone, Unidade unidade, TipoMorador tipoMorador) {
        // Envia os dados pessoais para a classe pai (Usuario) definindo o perfil como MORADOR
        super(nome, dataNascimento, cpf, email, senhaHash, telefone, TipoUsuario.MORADOR);

        // Define os dados específicos do Morador
        this.unidade = unidade;
        this.tipoMorador = tipoMorador;
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
        // O método getDataNascimento() vem herdado da classe pai!
        if (this.getDataNascimento() == null) {
            return false;
        }

        return LocalDate.now().minusYears(18).isAfter(this.getDataNascimento())
                || LocalDate.now().minusYears(18).isEqual(this.getDataNascimento());
    }

    public void registrarSaidaDoCondominio() {
        this.dataSaida = LocalDate.now();
        this.status = StatusMorador.EX_MORADOR;
    }

    public void aceitarTermoDeUso() {
        this.aceiteTermos = true;
        this.dataAceiteTermos = LocalDate.now();
    }

    // --- GETTERS E SETTERS (Apenas dos atributos desta classe) ---

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