package com.condominio.model.usuario;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "funcionario")
@Inheritance(strategy = InheritanceType.JOINED)
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_funcionario")
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(name = "email_corporativo", nullable = false, unique = true, length = 120)
    private String emailCorporativo;

    @Column(length = 20)
    private String telefone;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(name = "matricula_funcionario", nullable = false, unique = true, length = 30)
    private String matriculaFuncionario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CargoFuncionario cargo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TurnoFuncionario turno;

    @Column(name = "data_admissao", nullable = false)
    private LocalDate dataAdmissao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusFuncionario status = StatusFuncionario.ATIVO;

    @Column(name = "senha_hash", nullable = false, length = 255)
    private String senhaHash;

    @Column(name = "observacoes", length = 500)
    private String observacoes;

    @Column(name = "ativo_sistema")
    private boolean ativoSistema = true;

    @Column(name = "primeiro_acesso")
    private boolean primeiroAcesso = true;

    @Column(name = "data_ultimo_acesso")
    private LocalDateTime dataUltimoAcesso;

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

    // ===== ENUMS =====

    public enum StatusFuncionario {
        ATIVO("Ativo"),
        AFASTADO("Afastado"),
        DESLIGADO("Desligado");

        private final String descricao;

        StatusFuncionario(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum TurnoFuncionario {
        MANHA("Manhã"),
        TARDE("Tarde"),
        NOITE("Noite"),
        MADRUGADA("Madrugada"),
        INTEGRAL("Integral");

        private final String descricao;

        TurnoFuncionario(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum CargoFuncionario {
        PORTEIRO("Porteiro"),
        LIMPEZA("Limpeza"),
        MANUTENCAO("Manutenção"),
        ZELADOR("Zelador"),
        SEGURANCA("Segurança"),
        ADMINISTRATIVO("Administrativo");

        private final String descricao;

        CargoFuncionario(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    // ===== CONSTRUTORES =====

    public Funcionario() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.dataAdmissao = LocalDate.now();
    }

    public Funcionario(String nome, String cpf, String emailCorporativo, String senhaHash,
                       String matriculaFuncionario, CargoFuncionario cargo, TurnoFuncionario turno) {
        this();
        this.nome = nome;
        this.cpf = cpf;
        this.emailCorporativo = emailCorporativo;
        this.senhaHash = senhaHash;
        this.matriculaFuncionario = matriculaFuncionario;
        this.cargo = cargo;
        this.turno = turno;
    }

    // ===== CICLO DE VIDA =====

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (dataAdmissao == null) dataAdmissao = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ===== REGRAS DE NEGÓCIO =====

    public boolean isAtivo() {
        return status == StatusFuncionario.ATIVO && ativoSistema && !bloqueado;
    }

    public void registrarFalhaLogin() {
        if (tentativasLoginFalhas == null) tentativasLoginFalhas = 0;
        tentativasLoginFalhas++;

        if (tentativasLoginFalhas >= 5) {
            bloqueado = true;
            dataBloqueio = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
    }

    public void resetarTentativasLogin() {
        tentativasLoginFalhas = 0;
        bloqueado = false;
        dataBloqueio = null;
        updatedAt = LocalDateTime.now();
    }

    public void atualizarUltimoAcesso() {
        dataUltimoAcesso = LocalDateTime.now();
        primeiroAcesso = false;
        updatedAt = LocalDateTime.now();
    }

    // ===== GETTERS / SETTERS =====

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

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmailCorporativo() {
        return emailCorporativo;
    }

    public void setEmailCorporativo(String emailCorporativo) {
        this.emailCorporativo = emailCorporativo;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getMatriculaFuncionario() {
        return matriculaFuncionario;
    }

    public void setMatriculaFuncionario(String matriculaFuncionario) {
        this.matriculaFuncionario = matriculaFuncionario;
    }

    public CargoFuncionario getCargo() {
        return cargo;
    }

    public void setCargo(CargoFuncionario cargo) {
        this.cargo = cargo;
    }

    public TurnoFuncionario getTurno() {
        return turno;
    }

    public void setTurno(TurnoFuncionario turno) {
        this.turno = turno;
    }

    public LocalDate getDataAdmissao() {
        return dataAdmissao;
    }

    public void setDataAdmissao(LocalDate dataAdmissao) {
        this.dataAdmissao = dataAdmissao;
    }

    public StatusFuncionario getStatus() {
        return status;
    }

    public void setStatus(StatusFuncionario status) {
        this.status = status;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
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

    public String getStatusDescricao() {
        return status != null ? status.getDescricao() : "Desconhecido";
    }

    @Override
    public String toString() {
        return "Funcionario{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", emailCorporativo='" + emailCorporativo + '\'' +
                ", cargo=" + cargo +
                ", status=" + status +
                ", ativo=" + isAtivo() +
                '}';
    }
}