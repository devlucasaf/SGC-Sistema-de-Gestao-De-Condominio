package com.example.condominio.model.usuario;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "sindico")
@PrimaryKeyJoinColumn(name = "id_morador")
public class Sindico extends Morador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sindico")
    private Long idSindico;

    @Column(name = "data_inicio_mandato", nullable = false)
    private LocalDate dataInicioMandato;

    @Column(name = "data_fim_mandato")
    private LocalDate dataFimMandato;

    @Column(name = "data_eleicao")
    private LocalDate dataEleicao;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_mandato", nullable = false, length = 20)
    private StatusMandato statusMandato = StatusMandato.ATIVO;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_sindico", nullable = false, length = 20)
    private TipoSindico tipoSindico = TipoSindico.TITULAR;

    @ElementCollection
    @CollectionTable(
            name = "sindico_permissoes",
            joinColumns = @JoinColumn(name = "id_sindico")
    )
    @Column(name = "permissao", length = 50)
    @Enumerated(EnumType.STRING)
    private Set<PermissaoSindico> permissoes = new HashSet<>();

    @Column(name = "forma_eleicao", length = 50)
    private String formaEleicao;

    @Column(name = "numero_ata_eleicao", length = 50)
    private String numeroAtaEleicao;

    @Column(name = "votos_recebidos")
    private Integer votosRecebidos;

    @Column(name = "total_votantes")
    private Integer totalVotantes;

    @Column(name = "percentual_votos")
    private Double percentualVotos;

    @Column(name = "remuneracao")
    private Double remuneracao;

    @Column(name = "auxilio_despesas")
    private Double auxilioDespesas;

    @Column(name = "periodicidade_remuneracao", length = 20)
    private String periodicidadeRemuneracao;

    @Column(name = "data_proxima_prestacao_contas")
    private LocalDate dataProximaPrestacaoContas;

    @Column(name = "data_ultima_prestacao_contas")
    private LocalDate dataUltimaPrestacaoContas;

    @Column(name = "status_prestacao_contas", length = 20)
    private String statusPrestacaoContas;

    @Column(name = "assinatura_digital")
    private String assinaturaDigital;

    @Column(name = "foto_assinatura")
    private String fotoAssinatura;

    @Column(name = "token_assinatura", length = 100)
    private String tokenAssinatura;

    @Column(name = "limite_assinatura_diario")
    private Integer limiteAssinaturaDiario = 10;

    @Column(name = "assinaturas_hoje")
    private Integer assinaturasHoje = 0;

    @Column(name = "data_reset_assinaturas")
    private LocalDate dataResetAssinaturas = LocalDate.now();

    @Column(name = "notificar_aprovacoes")
    private boolean notificarAprovacoes = true;

    @Column(name = "notificar_pendencias")
    private boolean notificarPendencias = true;

    @Column(name = "notificar_reunioes")
    private boolean notificarReunioes = true;

    @Column(name = "notificar_visitas")
    private boolean notificarVisitas = false;

    @Column(name = "assinatura_automatica_documentos")
    private boolean assinaturaAutomaticaDocumentos = false;

    @Column(name = "assinatura_automatica_boletos")
    private boolean assinaturaAutomaticaBoletos = false;

    @Column(name = "assinatura_automatica_comunicados")
    private boolean assinaturaAutomaticaComunicados = true;

    @Column(name = "limite_aprovacoes_diarias")
    private Integer limiteAprovacoesDiarias = 20;

    @Column(name = "aprovacoes_hoje")
    private Integer aprovacoesHoje = 0;

    @Column(name = "data_reset_aprovacoes")
    private LocalDate dataResetAprovacoes = LocalDate.now();

    @Column(name = "horario_disponivel_inicio")
    private String horarioDisponivelInicio = "08:00";

    @Column(name = "horario_disponivel_fim")
    private String horarioDisponivelFim = "18:00";

    @Column(name = "dias_disponiveis", length = 50)
    private String diasDisponiveis = "SEG,TER,QUA,QUI,SEX";

    @Column(name = "contato_emergencia_sindico", length = 20)
    private String contatoEmergenciaSindico;

    @Column(name = "observacoes_mandato", length = 1000)
    private String observacoesMandato;

    @Column(name = "historico_mandatos", length = 2000)
    private String historicoMandatos;

    @Column(name = "created_at_sindico", updatable = false)
    private LocalDateTime createdAtSindico;

    @Column(name = "updated_at_sindico")
    private LocalDateTime updatedAtSindico;

    @OneToMany(mappedBy = "sindico", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Funcionario> funcionariosContratados = new HashSet<>();

    @OneToMany(mappedBy = "sindicoAprovador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Reserva> reservasAprovadas = new HashSet<>();

    @OneToMany(mappedBy = "sindico", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Comunicado> comunicadosEnviados = new HashSet<>();

    @OneToMany(mappedBy = "sindicoResponsavel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Reclamacao> reclamacoesAtribuidas = new HashSet<>();

    @OneToMany(mappedBy = "sindico", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Assembleia> assembleiasConvocadas = new HashSet<>();

    public enum StatusMandato {
        ATIVO("Ativo"),
        FINALIZADO("Finalizado"),
        INTERINO("Interino"),
        SUSPENSO("Suspenso"),
        RENOVADO("Renovado"),
        AFASTADO("Afastado");

        private final String descricao;

        StatusMandato(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum TipoSindico {
        TITULAR("Síndico Titular"),
        SUPLENTE("Síndico Suplente"),
        INTERINO("Síndico Interino"),
        CONSUBSTANCIADO("Consubstanciado"),
        PROFISSIONAL("Síndico Profissional"),
        ADJUNTO("Síndico Adjunto");

        private final String descricao;

        TipoSindico(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public enum PermissaoSindico {
        CADASTRAR_MORADORES("Cadastrar Moradores"),
        EDITAR_MORADORES("Editar Moradores"),
        EXCLUIR_MORADORES("Excluir Moradores"),
        APROVAR_CADASTROS("Aprovar Cadastros"),
        BLOQUEAR_MORADORES("Bloquear Moradores"),

        CADASTRAR_FUNCIONARIOS("Cadastrar Funcionários"),
        EDITAR_FUNCIONARIOS("Editar Funcionários"),
        EXCLUIR_FUNCIONARIOS("Excluir Funcionários"),
        GERENCIAR_FOLHA_PAGAMENTO("Gerenciar Folha de Pagamento"),

        GERAR_BOLETOS("Gerar Boletos"),
        GERAR_REMESSAS("Gerar Remessas"),
        CONCILIAR_PAGAMENTOS("Conciliar Pagamentos"),
        GERAR_RELATORIOS_FINANCEIROS("Gerar Relatórios Financeiros"),
        APROVAR_DESPESAS("Aprovar Despesas"),
        DEFINIR_MULTA("Definir Multas"),

        ENVIAR_COMUNICADOS("Enviar Comunicados"),
        CRIAR_ENQUETES("Criar Enquetes"),
        CONVOCAR_ASSEMBLEIAS("Convocar Assembleias"),
        GERENCIAR_MURAL("Gerenciar Mural"),

        ADMINISTRAR_RESERVAS("Administrar Reservas"),
        APROVAR_RESERVAS("Aprovar Reservas"),
        CANCELAR_RESERVAS("Cancelar Reservas"),
        CONFIGURAR_ESPACOS("Configurar Espaços"),
        DEFINIR_HORARIOS("Definir Horários"),

        ABRIR_CHAMADOS("Abrir Chamados"),
        ATRIBUIR_CHAMADOS("Atribuir Chamados"),
        APROVAR_ORCAMENTOS("Aprovar Orçamentos"),
        FECHAR_CHAMADOS("Fechar Chamados"),

        GERENCIAR_PORTEIROS("Gerenciar Porteiros"),
        CONSULTAR_LOGS("Consultar Logs"),
        APROVAR_VISITANTES("Aprovar Visitantes"),
        BLOQUEAR_ACESSOS("Bloquear Acessos"),

        CONFIGURAR_SISTEMA("Configurar Sistema"),
        GERENCIAR_PERMISSOES("Gerenciar Permissões"),
        BACKUP_DADOS("Backup de Dados"),
        RESTAURAR_DADOS("Restaurar Dados"),

        GERAR_RELATORIOS("Gerar Relatórios"),
        EXPORTAR_DADOS("Exportar Dados"),
        VISUALIZAR_ESTATISTICAS("Visualizar Estatísticas"),

        ASSINAR_DOCUMENTOS("Assinar Documentos"),
        GERAR_ATA("Gerar Ata"),
        ARQUIVAR_DOCUMENTOS("Arquivar Documentos");

        private final String descricao;

        PermissaoSindico(String descricao) {
            this.descricao = descricao;
        }

        public String getDescricao() {
            return descricao;
        }
    }

    public Sindico() {
        super();
        this.createdAtSindico = LocalDateTime.now();
        this.updatedAtSindico = LocalDateTime.now();
        this.dataInicioMandato = LocalDate.now();

        this.permissoes.add(PermissaoSindico.CADASTRAR_MORADORES);
        this.permissoes.add(PermissaoSindico.APROVAR_CADASTROS);
        this.permissoes.add(PermissaoSindico.GERAR_BOLETOS);
        this.permissoes.add(PermissaoSindico.ENVIAR_COMUNICADOS);
        this.permissoes.add(PermissaoSindico.ADMINISTRAR_RESERVAS);
        this.permissoes.add(PermissaoSindico.GERAR_RELATORIOS);
    }

    public Sindico(Morador morador, LocalDate dataInicioMandato, TipoSindico tipoSindico) {
        super();
        this.setId(morador.getId());
        this.setNome(morador.getNome());
        this.setEmail(morador.getEmail());
        this.setSenhaHash(morador.getSenhaHash());
        this.setUnidade(morador.getUnidade());
        this.dataInicioMandato = dataInicioMandato;
        this.tipoSindico = tipoSindico;
        this.createdAtSindico = LocalDateTime.now();
        this.updatedAtSindico = LocalDateTime.now();

        this.permissoes.add(PermissaoSindico.CADASTRAR_MORADORES);
        this.permissoes.add(PermissaoSindico.APROVAR_CADASTROS);
        this.permissoes.add(PermissaoSindico.GERAR_BOLETOS);
        this.permissoes.add(PermissaoSindico.ENVIAR_COMUNICADOS);
    }

    @PrePersist
    protected void onCreateSindico() {
        createdAtSindico = LocalDateTime.now();
        updatedAtSindico = LocalDateTime.now();
        if (dataInicioMandato == null) {
            dataInicioMandato = LocalDate.now();
        }
        resetarContadoresDiarios();
    }

    @PreUpdate
    protected void onUpdateSindico() {
        updatedAtSindico = LocalDateTime.now();
        verificarResetContadores();
    }

    public boolean isMandatoAtivo() {
        return statusMandato == StatusMandato.ATIVO || statusMandato == StatusMandato.INTERINO;
    }

    public boolean isMandatoExpirado() {
        if (dataFimMandato == null) return false;
        return LocalDate.now().isAfter(dataFimMandato);
    }

    public boolean podeAssinarDocumento() {
        return isMandatoAtivo() &&
                assinaturasHoje < limiteAssinaturaDiario &&
                temPermissao(PermissaoSindico.ASSINAR_DOCUMENTOS);
    }

    public boolean podeAprovarCadastro() {
        return isMandatoAtivo() &&
                aprovacoesHoje < limiteAprovacoesDiarias &&
                temPermissao(PermissaoSindico.APROVAR_CADASTROS);
    }

    public boolean temPermissao(PermissaoSindico permissao) {
        return permissoes.contains(permissao);
    }

    public void adicionarPermissao(PermissaoSindico permissao) {
        permissoes.add(permissao);
        updatedAtSindico = LocalDateTime.now();
    }

    public void removerPermissao(PermissaoSindico permissao) {
        permissoes.remove(permissao);
        updatedAtSindico = LocalDateTime.now();
    }

    public void registrarAssinatura() {
        if (assinaturasHoje < limiteAssinaturaDiario) {
            assinaturasHoje++;
            updatedAtSindico = LocalDateTime.now();
        }
    }

    public void registrarAprovacao() {
        if (aprovacoesHoje < limiteAprovacoesDiarias) {
            aprovacoesHoje++;
            updatedAtSindico = LocalDateTime.now();
        }
    }

    private void resetarContadoresDiarios() {
        LocalDate hoje = LocalDate.now();
        if (!hoje.equals(dataResetAssinaturas)) {
            assinaturasHoje = 0;
            dataResetAssinaturas = hoje;
        }
        if (!hoje.equals(dataResetAprovacoes)) {
            aprovacoesHoje = 0;
            dataResetAprovacoes = hoje;
        }
    }

    private void verificarResetContadores() {
        resetarContadoresDiarios();
    }

    public Long calcularDiasRestantesMandato() {
        if (dataFimMandato == null) return null;
        if (LocalDate.now().isAfter(dataFimMandato)) return 0L;
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), dataFimMandato);
    }

    public boolean isDisponivel() {
        if (!isMandatoAtivo()) return false;

        String horaAtual = LocalDateTime.now().getHour() + ":" + LocalDateTime.now().getMinute();
        boolean dentroHorario = horaAtual.compareTo(horarioDisponivelInicio) >= 0 &&
                horaAtual.compareTo(horarioDisponivelFim) <= 0;

        String[] dias = diasDisponiveis.split(",");
        String diaAtual = LocalDateTime.now().getDayOfWeek().name().substring(0, 3);
        boolean diaPermitido = false;
        for (String dia : dias) {
            if (dia.trim().equalsIgnoreCase(diaAtual)) {
                diaPermitido = true;
                break;
            }
        }

        return dentroHorario && diaPermitido;
    }

    public void finalizarMandato() {
        this.statusMandato = StatusMandato.FINALIZADO;
        this.dataFimMandato = LocalDate.now();
        this.updatedAtSindico = LocalDateTime.now();
    }

    public void renovarMandato(LocalDate novaDataFim) {
        this.statusMandato = StatusMandato.RENOVADO;
        this.dataFimMandato = novaDataFim;
        this.updatedAtSindico = LocalDateTime.now();
    }

    // Getters e Setters

    public Long getIdSindico() {
        return idSindico;
    }

    public void setIdSindico(Long idSindico) {
        this.idSindico = idSindico;
    }

    public LocalDate getDataInicioMandato() {
        return dataInicioMandato;
    }

    public void setDataInicioMandato(LocalDate dataInicioMandato) {
        this.dataInicioMandato = dataInicioMandato;
    }

    public LocalDate getDataFimMandato() {
        return dataFimMandato;
    }

    public void setDataFimMandato(LocalDate dataFimMandato) {
        this.dataFimMandato = dataFimMandato;
    }

    public LocalDate getDataEleicao() {
        return dataEleicao;
    }

    public void setDataEleicao(LocalDate dataEleicao) {
        this.dataEleicao = dataEleicao;
    }

    public StatusMandato getStatusMandato() {
        return statusMandato;
    }

    public void setStatusMandato(StatusMandato statusMandato) {
        this.statusMandato = statusMandato;
    }

    public TipoSindico getTipoSindico() {
        return tipoSindico;
    }

    public void setTipoSindico(TipoSindico tipoSindico) {
        this.tipoSindico = tipoSindico;
    }

    public Set<PermissaoSindico> getPermissoes() {
        return permissoes;
    }

    public void setPermissoes(Set<PermissaoSindico> permissoes) {
        this.permissoes = permissoes;
    }

    public String getFormaEleicao() {
        return formaEleicao;
    }

    public void setFormaEleicao(String formaEleicao) {
        this.formaEleicao = formaEleicao;
    }

    public String getNumeroAtaEleicao() {
        return numeroAtaEleicao;
    }

    public void setNumeroAtaEleicao(String numeroAtaEleicao) {
        this.numeroAtaEleicao = numeroAtaEleicao;
    }

    public Integer getVotosRecebidos() {
        return votosRecebidos;
    }

    public void setVotosRecebidos(Integer votosRecebidos) {
        this.votosRecebidos = votosRecebidos;
    }

    public Integer getTotalVotantes() {
        return totalVotantes;
    }

    public void setTotalVotantes(Integer totalVotantes) {
        this.totalVotantes = totalVotantes;
    }

    public Double getPercentualVotos() {
        return percentualVotos;
    }

    public void setPercentualVotos(Double percentualVotos) {
        this.percentualVotos = percentualVotos;
    }

    public Double getRemuneracao() {
        return remuneracao;
    }

    public void setRemuneracao(Double remuneracao) {
        this.remuneracao = remuneracao;
    }

    public Double getAuxilioDespesas() {
        return auxilioDespesas;
    }

    public void setAuxilioDespesas(Double auxilioDespesas) {
        this.auxilioDespesas = auxilioDespesas;
    }

    public String getPeriodicidadeRemuneracao() {
        return periodicidadeRemuneracao;
    }

    public void setPeriodicidadeRemuneracao(String periodicidadeRemuneracao) {
        this.periodicidadeRemuneracao = periodicidadeRemuneracao;
    }

    public LocalDate getDataProximaPrestacaoContas() {
        return dataProximaPrestacaoContas;
    }

    public void setDataProximaPrestacaoContas(LocalDate dataProximaPrestacaoContas) {
        this.dataProximaPrestacaoContas = dataProximaPrestacaoContas;
    }

    public LocalDate getDataUltimaPrestacaoContas() {
        return dataUltimaPrestacaoContas;
    }

    public void setDataUltimaPrestacaoContas(LocalDate dataUltimaPrestacaoContas) {
        this.dataUltimaPrestacaoContas = dataUltimaPrestacaoContas;
    }

    public String getStatusPrestacaoContas() {
        return statusPrestacaoContas;
    }

    public void setStatusPrestacaoContas(String statusPrestacaoContas) {
        this.statusPrestacaoContas = statusPrestacaoContas;
    }

    public String getAssinaturaDigital() {
        return assinaturaDigital;
    }

    public void setAssinaturaDigital(String assinaturaDigital) {
        this.assinaturaDigital = assinaturaDigital;
    }

    public String getFotoAssinatura() {
        return fotoAssinatura;
    }

    public void setFotoAssinatura(String fotoAssinatura) {
        this.fotoAssinatura = fotoAssinatura;
    }

    public String getTokenAssinatura() {
        return tokenAssinatura;
    }

    public void setTokenAssinatura(String tokenAssinatura) {
        this.tokenAssinatura = tokenAssinatura;
    }

    public Integer getLimiteAssinaturaDiario() {
        return limiteAssinaturaDiario;
    }

    public void setLimiteAssinaturaDiario(Integer limiteAssinaturaDiario) {
        this.limiteAssinaturaDiario = limiteAssinaturaDiario;
    }

    public Integer getAssinaturasHoje() {
        return assinaturasHoje;
    }

    public void setAssinaturasHoje(Integer assinaturasHoje) {
        this.assinaturasHoje = assinaturasHoje;
    }

    public LocalDate getDataResetAssinaturas() {
        return dataResetAssinaturas;
    }

    public void setDataResetAssinaturas(LocalDate dataResetAssinaturas) {
        this.dataResetAssinaturas = dataResetAssinaturas;
    }

    public boolean isNotificarAprovacoes() {
        return notificarAprovacoes;
    }

    public void setNotificarAprovacoes(boolean notificarAprovacoes) {
        this.notificarAprovacoes = notificarAprovacoes;
    }

    public boolean isNotificarPendencias() {
        return notificarPendencias;
    }

    public void setNotificarPendencias(boolean notificarPendencias) {
        this.notificarPendencias = notificarPendencias;
    }

    public boolean isNotificarReunioes() {
        return notificarReunioes;
    }

    public void setNotificarReunioes(boolean notificarReunioes) {
        this.notificarReunioes = notificarReunioes;
    }

    public boolean isNotificarVisitas() {
        return notificarVisitas;
    }

    public void setNotificarVisitas(boolean notificarVisitas) {
        this.notificarVisitas = notificarVisitas;
    }

    public boolean isAssinaturaAutomaticaDocumentos() {
        return assinaturaAutomaticaDocumentos;
    }

    public void setAssinaturaAutomaticaDocumentos(boolean assinaturaAutomaticaDocumentos) {
        this.assinaturaAutomaticaDocumentos = assinaturaAutomaticaDocumentos;
    }

    public boolean isAssinaturaAutomaticaBoletos() {
        return assinaturaAutomaticaBoletos;
    }

    public void setAssinaturaAutomaticaBoletos(boolean assinaturaAutomaticaBoletos) {
        this.assinaturaAutomaticaBoletos = assinaturaAutomaticaBoletos;
    }

    public boolean isAssinaturaAutomaticaComunicados() {
        return assinaturaAutomaticaComunicados;
    }

    public void setAssinaturaAutomaticaComunicados(boolean assinaturaAutomaticaComunicados) {
        this.assinaturaAutomaticaComunicados = assinaturaAutomaticaComunicados;
    }

    public Integer getLimiteAprovacoesDiarias() {
        return limiteAprovacoesDiarias;
    }

    public void setLimiteAprovacoesDiarias(Integer limiteAprovacoesDiarias) {
        this.limiteAprovacoesDiarias = limiteAprovacoesDiarias;
    }

    public Integer getAprovacoesHoje() {
        return aprovacoesHoje;
    }

    public void setAprovacoesHoje(Integer aprovacoesHoje) {
        this.aprovacoesHoje = aprovacoesHoje;
    }

    public LocalDate getDataResetAprovacoes() {
        return dataResetAprovacoes;
    }

    public void setDataResetAprovacoes(LocalDate dataResetAprovacoes) {
        this.dataResetAprovacoes = dataResetAprovacoes;
    }

    public String getHorarioDisponivelInicio() {
        return horarioDisponivelInicio;
    }

    public void setHorarioDisponivelInicio(String horarioDisponivelInicio) {
        this.horarioDisponivelInicio = horarioDisponivelInicio;
    }

    public String getHorarioDisponivelFim() {
        return horarioDisponivelFim;
    }

    public void setHorarioDisponivelFim(String horarioDisponivelFim) {
        this.horarioDisponivelFim = horarioDisponivelFim;
    }

    public String getDiasDisponiveis() {
        return diasDisponiveis;
    }

    public void setDiasDisponiveis(String diasDisponiveis) {
        this.diasDisponiveis = diasDisponiveis;
    }

    public String getContatoEmergenciaSindico() {
        return contatoEmergenciaSindico;
    }

    public void setContatoEmergenciaSindico(String contatoEmergenciaSindico) {
        this.contatoEmergenciaSindico = contatoEmergenciaSindico;
    }

    public String getObservacoesMandato() {
        return observacoesMandato;
    }

    public void setObservacoesMandato(String observacoesMandato) {
        this.observacoesMandato = observacoesMandato;
    }

    public String getHistoricoMandatos() {
        return historicoMandatos;
    }

    public void setHistoricoMandatos(String historicoMandatos) {
        this.historicoMandatos = historicoMandatos;
    }

    public LocalDateTime getCreatedAtSindico() {
        return createdAtSindico;
    }

    public void setCreatedAtSindico(LocalDateTime createdAtSindico) {
        this.createdAtSindico = createdAtSindico;
    }

    public LocalDateTime getUpdatedAtSindico() {
        return updatedAtSindico;
    }

    public void setUpdatedAtSindico(LocalDateTime updatedAtSindico) {
        this.updatedAtSindico = updatedAtSindico;
    }

    public Set<Funcionario> getFuncionariosContratados() {
        return funcionariosContratados;
    }

    public void setFuncionariosContratados(Set<Funcionario> funcionariosContratados) {
        this.funcionariosContratados = funcionariosContratados;
    }

    public Set<Reserva> getReservasAprovadas() {
        return reservasAprovadas;
    }

    public void setReservasAprovadas(Set<Reserva> reservasAprovadas) {
        this.reservasAprovadas = reservasAprovadas;
    }

    public Set<Comunicado> getComunicadosEnviados() {
        return comunicadosEnviados;
    }

    public void setComunicadosEnviados(Set<Comunicado> comunicadosEnviados) {
        this.comunicadosEnviados = comunicadosEnviados;
    }

    public Set<Reclamacao> getReclamacoesAtribuidas() {
        return reclamacoesAtribuidas;
    }

    public void setReclamacoesAtribuidas(Set<Reclamacao> reclamacoesAtribuidas) {
        this.reclamacoesAtribuidas = reclamacoesAtribuidas;
    }

    public Set<Assembleia> getAssembleiasConvocadas() {
        return assembleiasConvocadas;
    }

    public void setAssembleiasConvocadas(Set<Assembleia> assembleiasConvocadas) {
        this.assembleiasConvocadas = assembleiasConvocadas;
    }

    public String getStatusMandatoDescricao() {
        return statusMandato != null ? statusMandato.getDescricao() : "Desconhecido";
    }

    public String getTipoSindicoDescricao() {
        return tipoSindico != null ? tipoSindico.getDescricao() : "Desconhecido";
    }

    public List<String> getPermissoesDescricao() {
        return permissoes.stream()
                .map(PermissaoSindico::getDescricao)
                .collect(java.util.stream.Collectors.toList());
    }

    public void adicionarFuncionario(Funcionario funcionario) {
        funcionariosContratados.add(funcionario);
        funcionario.setSindicoContratante(this);
    }

    public void adicionarComunicado(Comunicado comunicado) {
        comunicadosEnviados.add(comunicado);
        comunicado.setSindico(this);
    }

    @Override
    public String toString() {
        return "Sindico{" +
                "idSindico=" + idSindico +
                ", nome='" + getNome() + '\'' +
                ", tipoSindico=" + tipoSindico +
                ", statusMandato=" + statusMandato +
                ", dataInicioMandato=" + dataInicioMandato +
                ", dataFimMandato=" + dataFimMandato +
                ", mandatoAtivo=" + isMandatoAtivo() +
                '}';
    }
}
