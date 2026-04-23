import { FiPackage, FiAlertCircle, FiCalendar, FiFileText, FiClock, FiCheck, FiArrowRight } from "react-icons/fi";

function PorteiroDashboard({
    encomendas, reclamacoes, reservas, solicitacoes,
    formatarData, formatarDataCurta, setAbaAtiva
}) {
    const hoje = new Date().toISOString().split("T")[0];

    // --- CONTADORES ---
    const encomendasPendentes   = encomendas.filter(e => e.status === "AGUARDANDO_RETIRADA");
    const encomendasRetiradas   = encomendas.filter(e => e.status === "RETIRADO");
    const reclamacoesPendentes  = reclamacoes.filter(r => r.status === "PENDENTE");
    const reclamacoesEmAnalise  = reclamacoes.filter(r => r.status === "EM_ANALISE");
    const reservasHoje          = reservas.filter(r => r.dataReserva === hoje);
    const reservasProximas      = reservas.filter(r => r.dataReserva > hoje).slice(0, 3);
    const solicitacoesPendentes = solicitacoes.filter(s => s.status === "PENDENTE");
    const solicitacoesAprovadas = solicitacoes.filter(s => s.status === "APROVADO");

    // ---HORA ATUAL FORMATADA ---
    const agora = new Date();
    const saudacao = agora.getHours() < 12 ? "Bom dia" : agora.getHours() < 18 ? "Boa tarde" : "Boa noite";
    const dataHoje = agora.toLocaleDateString("pt-BR", {
        weekday: "long",
        day:     "numeric",
        month:   "long",
        year:    "numeric"
    });

    return (
        <div className="porteiro-dashboard">
            {/* --- SAUDAÇÃO --- */}
            <div className="dashboard-saudacao">
                <h2>{saudacao}!</h2>
                <p>{dataHoje.charAt(0).toUpperCase() + dataHoje.slice(1)}</p>
            </div>

            {/* --- CARDS DE RESUMO --- */}
            <div className="dashboard-cards-grid">
                <div
                    className="dash-card dash-card-encomendas"
                    onClick={() => setAbaAtiva("entregas")}
                >
                    <div className="dash-card-icone"><FiPackage /></div>
                    <div className="dash-card-info">
                        <span className="dash-card-valor">{encomendasPendentes.length}</span>
                        <span className="dash-card-label">Encomendas Aguardando</span>
                    </div>

                    <div className="dash-card-extra">
                        <span>{encomendasRetiradas.length} retiradas</span>
                    </div>
                </div>

                <div
                    className="dash-card dash-card-reclamacoes"
                    onClick={() => setAbaAtiva("reclamacoes")}
                >
                    <div className="dash-card-icone"><FiAlertCircle /></div>

                    <div className="dash-card-info">
                        <span className="dash-card-valor">{reclamacoesPendentes.length}</span>
                        <span className="dash-card-label">Reclamações Pendentes</span>
                    </div>

                    <div className="dash-card-extra">
                        <span>{reclamacoesEmAnalise.length} em análise</span>
                    </div>
                </div>

                <div
                    className="dash-card dash-card-reservas"
                    onClick={() => setAbaAtiva("reservas")}
                >
                    <div className="dash-card-icone"><FiCalendar /></div>

                    <div className="dash-card-info">
                        <span className="dash-card-valor">{reservasHoje.length}</span>
                        <span className="dash-card-label">Reservas Hoje</span>
                    </div>

                    <div className="dash-card-extra">
                        <span>{reservas.length} total</span>
                    </div>
                </div>

                <div
                    className="dash-card dash-card-solicitacoes"
                    onClick={() => setAbaAtiva("solicitacoes")}
                >
                    <div className="dash-card-icone"><FiFileText /></div>

                    <div className="dash-card-info">
                        <span className="dash-card-valor">{solicitacoesPendentes.length}</span>
                        <span className="dash-card-label">Solicitações Pendentes</span>
                    </div>
                    
                    <div className="dash-card-extra">
                        <span>{solicitacoesAprovadas.length} aprovadas</span>
                    </div>
                </div>
            </div>

            {/* --- SEÇÕES RÁPIDAS --- */}
            <div className="dashboard-secoes">
                {/* --- ENCOMENDAS AGUARDANDO RETIRADA --- */}
                <div className="dashboard-secao">
                    <div className="secao-header">
                        <h3><FiPackage /> Encomendas Aguardando Retirada</h3>
                        {encomendasPendentes.length > 3 && (
                            <button className="secao-ver-todas" onClick={() => setAbaAtiva("entregas")}>
                                Ver todas <FiArrowRight />
                            </button>
                        )}
                    </div>

                    {encomendasPendentes.length === 0 ? (
                        <div className="secao-vazia">
                            <FiCheck className="secao-vazia-icone" />
                            <p>Nenhuma encomenda pendente</p>
                        </div>
                    ) : (
                        <div className="secao-lista">
                            {encomendasPendentes.slice(0, 4).map(enc => (
                                <div key={enc.id} className="secao-item">
                                    <div className="secao-item-icone pendente"><FiPackage /></div>
                                    <div className="secao-item-info">
                                        <strong>{enc.descricao}</strong>
                                        <span>Bloco {enc.blocoUnidade} — Apto {enc.numeroApto}</span>
                                    </div>

                                    <span className="secao-item-tempo">
                                        <FiClock /> {formatarData(enc.dataRecebimento)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- RESERVAS DO DIA --- */}
                <div className="dashboard-secao">
                    <div className="secao-header">
                        <h3><FiCalendar /> Reservas de Hoje</h3>
                        {reservasHoje.length > 3 && (
                            <button className="secao-ver-todas" onClick={() => setAbaAtiva("reservas")}>
                                Ver todas <FiArrowRight />
                            </button>
                        )}
                    </div>

                    {reservasHoje.length === 0 ? (
                        <div className="secao-vazia">
                            <FiCalendar className="secao-vazia-icone" />
                            <p>Nenhuma reserva para hoje</p>
                        </div>
                    ) : (
                        <div className="secao-lista">
                            {reservasHoje.slice(0, 4).map(res => (
                                <div key={res.id} className="secao-item">
                                    <div className="secao-item-icone reserva"><FiCalendar /></div>
                                    <div className="secao-item-info">
                                        <strong>{res.nomeAreaLazer}</strong>
                                        <span>{res.nomeMorador} — Bloco {res.bloco}, Apto {res.numeroApto}</span>
                                    </div>

                                    <span className={`badge-status ${
                                        res.status === "CONFIRMADA" || res.status === "APROVADA" ? "badge-verde" : "badge-amarelo"
                                    }`}>
                                        {res.status === "CONFIRMADA" || res.status === "APROVADA" ? "Confirmada" : res.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- PRÓXIMAS RESERVAS --- */}
                    {reservasProximas.length > 0 && (
                        <>
                            <h4 className="secao-sub-header">Próximas reservas</h4>
                            <div className="secao-lista">
                                {reservasProximas.map(res => (
                                    <div key={res.id} className="secao-item secao-item-futuro">
                                        <div className="secao-item-icone reserva"><FiCalendar /></div>

                                        <div className="secao-item-info">
                                            <strong>{res.nomeAreaLazer}</strong>
                                            <span>{res.nomeMorador}</span>
                                        </div>

                                        <span className="secao-item-tempo">
                                            {formatarDataCurta(res.dataReserva)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* --- SOLICITAÇÕES PENDENTES --- */}
            {solicitacoesPendentes.length > 0 && (
                <div className="dashboard-secao dashboard-secao-full">
                    <div className="secao-header">
                        <h3><FiFileText /> Solicitações Pendentes</h3>
                        <button className="secao-ver-todas" onClick={() => setAbaAtiva("solicitacoes")}>
                            Ver todas <FiArrowRight />
                        </button>
                    </div>

                    <div className="secao-lista">
                        {solicitacoesPendentes.slice(0, 3).map(sol => {
                            const corTipo = sol.tipo === "OBRA" ? "#e67e22"
                                : sol.tipo === "MUDANCA"   ? "#3498db"
                                : sol.tipo === "ENTREGA"   ? "#2ecc71"
                                : sol.tipo === "PRESTADOR" ? "#9b59b6" : "#888";

                            const nomeTipo = sol.tipo === "OBRA" ? "Obra"
                                : sol.tipo === "MUDANCA"   ? "Mudança"
                                : sol.tipo === "ENTREGA"   ? "Entrega"
                                : sol.tipo === "PRESTADOR" ? "Prestador" : sol.tipo;

                            return (
                                <div key={sol.id} className="secao-item" style={{ borderLeft: `3px solid ${corTipo}` }}>
                                    <div className="secao-item-icone" style={{ background: `${corTipo}15`, color: corTipo }}>
                                        <FiFileText />
                                    </div>

                                    <div className="secao-item-info">
                                        <strong>{sol.titulo}</strong>
                                        <span>
                                            {nomeTipo} — {sol.nomeMorador || "—"} {sol.apartamentoMorador ? `(${sol.apartamentoMorador})` : ""}
                                        </span>
                                    </div>
                                    <span className="secao-item-tempo">
                                        {sol.dataPrevista ? formatarDataCurta(sol.dataPrevista) : "—"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* --- RECLAMAÇÕES RECENTES --- */}
            {reclamacoesPendentes.length > 0 && (
                <div className="dashboard-secao dashboard-secao-full">
                    <div className="secao-header">
                        <h3><FiAlertCircle /> Reclamações Recentes</h3>
                        <button className="secao-ver-todas" onClick={() => setAbaAtiva("reclamacoes")}>
                            Ver todas <FiArrowRight />
                        </button>
                    </div>

                    <div className="secao-lista">
                        {reclamacoesPendentes.slice(0, 3).map(rec => (
                            <div key={rec.id} className="secao-item">
                                <div className="secao-item-icone reclamacao"><FiAlertCircle /></div>
                                <div className="secao-item-info">
                                    <strong>{rec.tipo || rec.categoria || "Reclamação"}</strong>
                                    <span>{rec.descricao?.substring(0, 80)}{rec.descricao?.length > 80 ? "..." : ""}</span>
                                </div>
                                <span className="badge-status badge-amarelo">Pendente</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PorteiroDashboard;

