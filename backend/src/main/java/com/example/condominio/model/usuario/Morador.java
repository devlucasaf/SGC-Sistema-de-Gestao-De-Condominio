package com.example.condominio.model.usuario;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "morador")
@Inheritance(strategy = InheritanceType.JOINED)
public class Morador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_morador")
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(length = 20)
    private String telefone;

    @Column(name = "senha_hash", nullable = false, length = 255)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatusMorador status = StatusMorador.ATIVO;

    @Column(name = "data_entrada", nullable = false)
    private LocalDate dataEntrada;

    @Column(name = "data_saida")
    private LocalDate dataSaida;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_unidade", nullable = false)
    private Unidade unidade;

    @Column(name = "cpf", unique = true, length = 14)
    private String cpf;

    @Column(name = "rg", length = 20)
    private String rg;

    @Column(name = "rg_orgao_emissor", length = 20)
    private String rgOrgaoEmissor;

    @Column(name = "rg_uf", length = 2)
    private String rgUf;

    @Column(name = "profissao", length = 100)
    private String profissao;

    @Column(name = "empresa", length = 100)
    private String empresa;

    @Column(name = "telefone_comercial", length = 20)
    private String telefoneComercial;

    @Column(name = "whatsapp", length = 20)
    private String whatsapp;

    @Column(name = "telegram", length = 50)
    private String telegram;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

    @Column(name = "notificar_email")
    private boolean notificarEmail = true;

    @Column(name = "notificar_sms")
    private boolean notificarSms = false;

    @Column(name = "notificar_push")
    private boolean notificarPush = true;

    @Column(name = "receber_comunicados")
    private boolean receberComunicados = true;

    @Column(name = "aceite_termos")
    private boolean aceiteTermos = false;

    @Column(name = "data_aceite_termos")
    private LocalDate dataAceiteTermos;

    @Column(name = "observacoes", length = 500)
    private String observacoes;

    @Column(name = "ativo_sistema")
    private boolean ativoSistema = true;

    @Column(name = "primeiro_acesso")
    private boolean primeiroAcesso = true;

    @Column(name = "data_ultimo_acesso")
    private LocalDateTime dataUltimoAcesso;

    @Column(name = "data_expiracao_senha")
    private LocalDate dataExpiracaoSenha;

    @Column(name = "tentativas_login_falhas")
    private Integer tentativasLoginFalhas = 0;

    @Column(name = "bloqueado")
    private boolean bloqueado = false;

    @Column(name = "data_bloqueio")
    private LocalDateTime dataBloqueio;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToOne(mappedBy = "morador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Sindico sindico;

    @OneToMany(mappedBy = "morador", cascade = CascadeType.ALL)
    private Set<Dependente> dependentes = new HashSet<>();

    @OneToMany(mappedBy = "morador", cascade = CascadeType.ALL)
    private Set<Veiculo> veiculos = new HashSet<>();

    @OneToMany(mappedBy = "morador", cascade = CascadeType.ALL)
    private Set<AnimalEstimacao> animais = new HashSet<>();

    // Enums
    public enum StatusMorador {
        ATIVO("Ativo"),
        INATIVO("Inativo"),
        INADIMPLENTE("Inadimplente"),
        VISITANTE_TEMPORARIO("Visitante Temporário"),
        AGUARDANDO_APROVACAO("Aguardando Aprovação"),
        SUSPENSO("Suspenso"),
        EX_MORADOR("Ex-Morador");

        private final String descricao;

        StatusMorador(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    // Construtores
    public Morador() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.dataExpiracaoSenha = LocalDate.now().plusMonths(3);
        this.dataEntrada = LocalDate.now();
    }

    public Morador(String nome, String email, String senhaHash, Unidade unidade) {
        this();
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.unidade = unidade;
        this.status = StatusMorador.AGUARDANDO_APROVACAO;
    }

    // Métodos de ciclo de vida
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (dataEntrada == null) {
            dataEntrada = LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Métodos de negócio
    public boolean isAtivo() {
        return status == StatusMorador.ATIVO && ativoSistema && !bloqueado;
    }

    public boolean isInadimplente() {
        return status == StatusMorador.INADIMPLENTE;
    }

    public boolean podeReservarEspacos() {
        return isAtivo() && !isInadimplente();
    }

    public boolean precisaRenovarSenha() {
        if (primeiroAcesso) return true;
        if (dataExpiracaoSenha == null) return false;
        return LocalDate.now().isAfter(dataExpiracaoSenha) ||
                LocalDate.now().plusDays(7).isAfter(dataExpiracaoSenha);
    }

    public void registrarFalhaLogin() {
        this.tentativasLoginFalhas++;
        if (this.tentativasLoginFalhas >= 5) {
            this.bloqueado = true;
            this.dataBloqueio = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
    }

    public void resetarTentativasLogin() {
        this.tentativasLoginFalhas = 0;
        this.bloqueado = false;
        this.dataBloqueio = null;
        this.updatedAt = LocalDateTime.now();
    }

    public void atualizarUltimoAcesso() {
        this.dataUltimoAcesso = LocalDateTime.now();
        this.primeiroAcesso = false;
        this.updatedAt = LocalDateTime.now();
    }

    public Integer calcularIdade() {
        if (dataNascimento == null) return null;
        return LocalDate.now().getYear() - dataNascimento.getYear();
    }

    public Long tempoComoMorador() {
        return java.time.temporal.ChronoUnit.DAYS.between(dataEntrada, LocalDate.now());
    }

    public void aceitarTermos() {
        this.aceiteTermos = true;
        this.dataAceiteTermos = LocalDate.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters e Setters

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
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

    public Unidade getUnidade() {
        return unidade;
    }

    public void setUnidade(Unidade unidade) {
        this.unidade = unidade;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getRgOrgaoEmissor() {
        return rgOrgaoEmissor;
    }

    public void setRgOrgaoEmissor(String rgOrgaoEmissor) {
        this.rgOrgaoEmissor = rgOrgaoEmissor;
    }

    public String getRgUf() {
        return rgUf;
    }

    public void setRgUf(String rgUf) {
        this.rgUf = rgUf;
    }

    public String getProfissao() {
        return profissao;
    }

    public void setProfissao(String profissao) {
        this.profissao = profissao;
    }

    public String getEmpresa() {
        return empresa;
    }

    public void setEmpresa(String empresa) {
        this.empresa = empresa;
    }

    public String getTelefoneComercial() {
        return telefoneComercial;
    }

    public void setTelefoneComercial(String telefoneComercial) {
        this.telefoneComercial = telefoneComercial;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public String getTelegram() {
        return telegram;
    }

    public void setTelegram(String telegram) {
        this.telegram = telegram;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public boolean isNotificarEmail() {
        return notificarEmail;
    }

    public void setNotificarEmail(boolean notificarEmail) {
        this.notificarEmail = notificarEmail;
    }

    public boolean isNotificarSms() {
        return notificarSms;
    }

    public void setNotificarSms(boolean notificarSms) {
        this.notificarSms = notificarSms;
    }

    public boolean isNotificarPush() {
        return notificarPush;
    }

    public void setNotificarPush(boolean notificarPush) {
        this.notificarPush = notificarPush;
    }

    public boolean isReceberComunicados() {
        return receberComunicados;
    }

    public void setReceberComunicados(boolean receberComunicados) {
        this.receberComunicados = receberComunicados;
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

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public boolean isAtivoSistema() {
        return ativoSistema;
    }

    public void setAtivoSistema(boolean ativoSistema) {
        this.ativoSistema = ativoSistema;
    }

    public boolean isPrimeiroAcesso() {
        return primeiroAcesso;
    }

    public void setPrimeiroAcesso(boolean primeiroAcesso) {
        this.primeiroAcesso = primeiroAcesso;
    }

    public LocalDateTime getDataUltimoAcesso() {
        return dataUltimoAcesso;
    }

    public void setDataUltimoAcesso(LocalDateTime dataUltimoAcesso) {
        this.dataUltimoAcesso = dataUltimoAcesso;
    }

    public LocalDate getDataExpiracaoSenha() {
        return dataExpiracaoSenha;
    }

    public void setDataExpiracaoSenha(LocalDate dataExpiracaoSenha) {
        this.dataExpiracaoSenha = dataExpiracaoSenha;
    }

    public Integer getTentativasLoginFalhas() {
        return tentativasLoginFalhas;
    }

    public void setTentativasLoginFalhas(Integer tentativasLoginFalhas) {
        this.tentativasLoginFalhas = tentativasLoginFalhas;
    }

    public boolean isBloqueado() {
        return bloqueado;
    }

    public void setBloqueado(boolean bloqueado) {
        this.bloqueado = bloqueado;
    }

    public LocalDateTime getDataBloqueio() {
        return dataBloqueio;
    }

    public void setDataBloqueio(LocalDateTime dataBloqueio) {
        this.dataBloqueio = dataBloqueio;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public Sindico getSindico() {
        return sindico;
    }

    public void setSindico(Sindico sindico) {
        this.sindico = sindico;
    }

    public Set<Dependente> getDependentes() {
        return dependentes;
    }

    public void setDependentes(Set<Dependente> dependentes) {
        this.dependentes = dependentes;
    }

    public Set<Veiculo> getVeiculos() {
        return veiculos;
    }

    public void setVeiculos(Set<Veiculo> veiculos) {
        this.veiculos = veiculos;
    }

    public Set<AnimalEstimacao> getAnimais() {
        return animais;
    }

    public void setAnimais(Set<AnimalEstimacao> animais) {
        this.animais = animais;
    }

    // Métodos auxiliares
    public String getStatusDescricao() {
        return status != null ? status.getDescricao() : "Desconhecido";
    }

    public String getUnidadeFormatada() {
        if (unidade == null) return "Sem unidade";
        return unidade.getBloco() + " - " +
                unidade.getAndar() + "º - " +
                "Apto " + unidade.getNumeroApto();
    }

    public void adicionarDependente(Dependente dependente) {
        dependentes.add(dependente);
        dependente.setMorador(this);
    }

    public void adicionarVeiculo(Veiculo veiculo) {
        veiculos.add(veiculo);
        veiculo.setMorador(this);
    }

    public void adicionarAnimal(AnimalEstimacao animal) {
        animais.add(animal);
        animal.setMorador(this);
    }

    @Override
    public String toString() {
        return "Morador{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", email='" + email + '\'' +
                ", status=" + status +
                ", unidade=" + (unidade != null ? unidade.getNumeroApto() : "null") +
                ", ativo=" + isAtivo() +
                '}';
    }
}
