package com.example.condominio.model.usuario;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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

    @Column(unique = true, nullable = false, length = 14)
    private String cpf;

    @Column(name = "email_corporativo", unique = true, length = 100)
    private String emailCorporativo;

    @Column(length = 20)
    private String telefone;

    @Column(name = "telefone_emergencia", length = 20)
    private String telefoneEmergencia;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(name = "matricula_funcionario", unique = true, nullable = false, length = 20)
    private String matricula;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CargoFuncionario cargo;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TurnoFuncionario turno;

    @Column(name = "data_admissao", nullable = false)
    private LocalDate dataAdmissao;

    @Column(name = "data_desligamento")
    private LocalDate dataDesligamento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusFuncionario status = StatusFuncionario.ATIVO;

    @Column(name = "senha_hash", nullable = false, length = 255)
    private String senhaHash;

    @Column(length = 500)
    private String observacoes;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

    @Column(name = "rg", length = 20)
    private String rg;

    @Column(name = "rg_orgao_emissor", length = 20)
    private String rgOrgaoEmissor;

    @Column(name = "rg_uf", length = 2)
    private String rgUf;

    @Column(name = "pis_pasep", length = 20)
    private String pisPasep;

    @Column(name = "ctps", length = 20)
    private String ctps;

    @Column(name = "ctps_serie", length = 10)
    private String ctpsSerie;

    @Column(name = "titulo_eleitor", length = 20)
    private String tituloEleitor;

    @Column(name = "reservista", length = 20)
    private String reservista;

    @Column(name = "carteira_trabalho_digital")
    private boolean carteiraTrabalhoDigital = false;

    @Column(name = "endereco_rua", length = 200)
    private String enderecoRua;

    @Column(name = "endereco_numero", length = 10)
    private String enderecoNumero;

    @Column(name = "endereco_complemento", length = 100)
    private String enderecoComplemento;

    @Column(name = "endereco_bairro", length = 100)
    private String enderecoBairro;

    @Column(name = "endereco_cidade", length = 100)
    private String enderecoCidade;

    @Column(name = "endereco_estado", length = 2)
    private String enderecoEstado;

    @Column(name = "endereco_cep", length = 9)
    private String enderecoCep;

    @Column(name = "nome_contato_emergencia", length = 100)
    private String nomeContatoEmergencia;

    @Column(name = "parentesco_contato_emergencia", length = 50)
    private String parentescoContatoEmergencia;

    @Column(name = "data_ultimo_exame_medico")
    private LocalDate dataUltimoExameMedico;

    @Column(name = "data_proximo_exame_medico")
    private LocalDate dataProximoExameMedico;

    @Column(name = "validade_exame_medico")
    private LocalDate validadeExameMedico;

    @Column(name = "possui_epi")
    private boolean possuiEpi = false;

    @Column(name = "epi_entregue")
    private String epiEntregue;

    @Column(name = "data_entrega_epi")
    private LocalDate dataEntregaEpi;

    @Column(name = "data_validade_epi")
    private LocalDate dataValidadeEpi;

    @Column(name = "banco", length = 50)
    private String banco;

    @Column(name = "agencia", length = 10)
    private String agencia;

    @Column(name = "conta_corrente", length = 20)
    private String contaCorrente;

    @Column(name = "tipo_conta", length = 20)
    private String tipoConta;

    @Column(name = "pix", length = 100)
    private String pix;

    @Column(name = "salario_base")
    private Double salarioBase;

    @Column(name = "vale_transporte")
    private Double valeTransporte;

    @Column(name = "vale_refeicao")
    private Double valeRefeicao;

    @Column(name = "outros_beneficios")
    private Double outrosBeneficios;

    @Column(name = "carga_horaria_semanal")
    private Integer cargaHorariaSemanal;

    @Column(name = "jornada_trabalho", length = 50)
    private String jornadaTrabalho;

    @Column(name = "ferias_previstas_inicio")
    private LocalDate feriasPrevistasInicio;

    @Column(name = "ferias_previstas_fim")
    private LocalDate feriasPrevistasFim;

    @Column(name = "dias_ferias_restantes")
    private Integer diasFeriasRestantes;

    @Column(name = "data_ultimas_ferias")
    private LocalDate dataUltimasFerias;

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

    @ManyToOne
    @JoinColumn(name = "id_sindico_contratante")
    private Sindico sindicoContratante;

    @ManyToOne
    @JoinColumn(name = "id_funcionario_supervisor")
    private Funcionario supervisor;

    @OneToMany(mappedBy = "supervisor", cascade = CascadeType.ALL)
    private Set<Funcionario> subordinados = new HashSet<>();

    @OneToMany(mappedBy = "funcionario", cascade = CascadeType.ALL)
    private Set<DependenteFuncionario> dependentes = new HashSet<>();

    @OneToMany(mappedBy = "funcionario", cascade = CascadeType.ALL)
    private Set<RegistroPonto> registrosPonto = new HashSet<>();

    @OneToMany(mappedBy = "funcionario", cascade = CascadeType.ALL)
    private Set<AfastamentoFuncionario> afastamentos = new HashSet<>();

    @OneToMany(mappedBy = "funcionarioResponsavel", cascade = CascadeType.ALL)
    private Set<ChamadoManutencao> chamadosAtribuidos = new HashSet<>();

    // Enums
    public enum CargoFuncionario {
        PORTEIRO("Porteiro", "OPERACIONAL"),
        ZELADOR("Zelador", "OPERACIONAL"),
        FAXINEIRO("Faxineiro", "OPERACIONAL"),
        JARDINEIRO("Jardineiro", "OPERACIONAL"),
        ELETRICISTA("Eletricista", "TECNICO"),
        ENCANADOR("Encanador", "TECNICO"),
        SEGURANCA("Segurança", "OPERACIONAL"),
        ADMINISTRATIVO("Administrativo", "ADMINISTRATIVO"),
        RECEPCIONISTA("Recepcionista", "ADMINISTRATIVO"),
        MOTORISTA("Motorista", "OPERACIONAL"),
        AUXILIAR_GERAL("Auxiliar Geral", "OPERACIONAL"),
        COORDENADOR("Coordenador", "SUPERVISAO"),
        GERENTE("Gerente", "GERENCIAL");

        private final String descricao;
        private final String categoria;

        CargoFuncionario(String descricao, String categoria) {
            this.descricao = descricao;
            this.categoria = categoria;
        }

        public String getDescricao() { return descricao; }
        public String getCategoria() { return categoria; }
    }

    public enum TurnoFuncionario {
        MANHA("Manhã", "06:00-14:00"),
        TARDE("Tarde", "14:00-22:00"),
        NOITE("Noite", "22:00-06:00"),
        INTEGRAL("Integral", "08:00-18:00"),
        ESCALA_12x36("Escala 12x36", "12h trabalho, 36h descanso"),
        ESCALA_24x48("Escala 24x48", "24h trabalho, 48h descanso"),
        ADMINISTRATIVO("Administrativo", "09:00-18:00"),
        PLANTONISTA("Plantonista", "Plantões variados");

        private final String descricao;
        private final String horario;

        TurnoFuncionario(String descricao, String horario) {
            this.descricao = descricao;
            this.horario = horario;
        }

        public String getDescricao() { return descricao; }
        public String getHorario() { return horario; }
    }

    public enum StatusFuncionario {
        ATIVO("Ativo", true),
        AFASTADO("Afastado", false),
        FERIAS("Férias", false),
        DESLIGADO("Desligado", false),
        SUSPENSO("Suspenso", false),
        LICENCA("Licença", false),
        TREINAMENTO("Em Treinamento", true),
        EXPERIENCIA("Período de Experiência", true);

        private final String descricao;
        private final boolean podeTrabalhar;

        StatusFuncionario(String descricao, boolean podeTrabalhar) {
            this.descricao = descricao;
            this.podeTrabalhar = podeTrabalhar;
        }

        public String getDescricao() { return descricao; }
        public boolean isPodeTrabalhar() { return podeTrabalhar; }
    }

    // Construtor
    public Funcionario() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.dataExpiracaoSenha = LocalDate.now().plusMonths(3);
    }

    public Funcionario(String nome, String cpf, String matricula, CargoFuncionario cargo) {
        this();
        this.nome = nome;
        this.cpf = cpf;
        this.matricula = matricula;
        this.cargo = cargo;
        this.dataAdmissao = LocalDate.now();
        this.status = StatusFuncionario.EXPERIENCIA;
    }

    // Métodos de Negócio
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (matricula == null) {
            gerarMatriculaAutomatica();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    private void gerarMatriculaAutomatica() {
        // Formato: ANO-MES-SEQUENCIAL (ex: 2024-01-001)
        String anoMes = LocalDate.now().getYear() + "-" +
                String.format("%02d", LocalDate.now().getMonthValue());
        this.matricula = anoMes + "-001"; // Em produção, buscar próximo sequencial
    }

    public boolean isAtivo() {
        return status == StatusFuncionario.ATIVO ||
                status == StatusFuncionario.EXPERIENCIA ||
                status == StatusFuncionario.TREINAMENTO;
    }

    public boolean podeTrabalhar() {
        return isAtivo() && !bloqueado && ativoSistema;
    }

    public boolean precisaRenovarExameMedico() {
        if (validadeExameMedico == null) return true;
        return LocalDate.now().isAfter(validadeExameMedico) ||
                LocalDate.now().plusMonths(1).isAfter(validadeExameMedico);
    }

    public boolean precisaRenovarEPI() {
        if (dataValidadeEpi == null) return false;
        return LocalDate.now().isAfter(dataValidadeEpi) ||
                LocalDate.now().plusMonths(1).isAfter(dataValidadeEpi);
    }

    public boolean precisaTrocarSenha() {
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

    public Double calcularSalarioTotal() {
        double total = salarioBase != null ? salarioBase : 0.0;
        total += valeTransporte != null ? valeTransporte : 0.0;
        total += valeRefeicao != null ? valeRefeicao : 0.0;
        total += outrosBeneficios != null ? outrosBeneficios : 0.0;
        return total;
    }

    public Integer calcularIdade() {
        if (dataNascimento == null) return null;
        return LocalDate.now().getYear() - dataNascimento.getYear();
    }

    public Integer calcularTempoServico() {
        return LocalDate.now().getYear() - dataAdmissao.getYear();
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

    public String getTelefoneEmergencia() {
        return telefoneEmergencia;
    }

    public void setTelefoneEmergencia(String telefoneEmergencia) {
        this.telefoneEmergencia = telefoneEmergencia;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
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

    public LocalDate getDataDesligamento() {
        return dataDesligamento;
    }

    public void setDataDesligamento(LocalDate dataDesligamento) {
        this.dataDesligamento = dataDesligamento;
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

    // Continuam todos os outros getters e setters...
    // [Restante dos getters e setters para todos os atributos]

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

    public Sindico getSindicoContratante() {
        return sindicoContratante;
    }

    public void setSindicoContratante(Sindico sindicoContratante) {
        this.sindicoContratante = sindicoContratante;
    }

    public Funcionario getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(Funcionario supervisor) {
        this.supervisor = supervisor;
    }

    public Set<Funcionario> getSubordinados() {
        return subordinados;
    }

    public void setSubordinados(Set<Funcionario> subordinados) {
        this.subordinados = subordinados;
    }

    public Set<DependenteFuncionario> getDependentes() {
        return dependentes;
    }

    public void setDependentes(Set<DependenteFuncionario> dependentes) {
        this.dependentes = dependentes;
    }

    public Set<RegistroPonto> getRegistrosPonto() {
        return registrosPonto;
    }

    public void setRegistrosPonto(Set<RegistroPonto> registrosPonto) {
        this.registrosPonto = registrosPonto;
    }

    public Set<AfastamentoFuncionario> getAfastamentos() {
        return afastamentos;
    }

    public void setAfastamentos(Set<AfastamentoFuncionario> afastamentos) {
        this.afastamentos = afastamentos;
    }

    public Set<ChamadoManutencao> getChamadosAtribuidos() {
        return chamadosAtribuidos;
    }

    public void setChamadosAtribuidos(Set<ChamadoManutencao> chamadosAtribuidos) {
        this.chamadosAtribuidos = chamadosAtribuidos;
    }

    // Métodos auxiliares para JSON
    public String getCargoDescricao() {
        return cargo != null ? cargo.getDescricao() : null;
    }

    public String getTurnoDescricao() {
        return turno != null ? turno.getDescricao() : null;
    }

    public String getStatusDescricao() {
        return status != null ? status.getDescricao() : null;
    }

    @Override
    public String toString() {
        return "Funcionario{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", matricula='" + matricula + '\'' +
                ", cargo=" + (cargo != null ? cargo.getDescricao() : "N/A") +
                ", status=" + (status != null ? status.getDescricao() : "N/A") +
                ", ativoSistema=" + ativoSistema +
                '}';
    }
}
