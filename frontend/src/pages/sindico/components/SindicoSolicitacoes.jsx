import { useState } from "react";

function SindicoSolicitacoes({ solicitacoes, setSolicitacoes, api, toast, formatarData }) {
    const [filtroTipoSolicitacao, setFiltroTipoSolicitacao] = useState("TODOS");
    const [filtroStatusSolicitacao, setFiltroStatusSolicitacao] = useState("TODOS");

    async function alterarStatusSolicitacao(id, novoStatus) {
        try {
            await api.patch(`/api/solicitacoes/${id}/status?novoStatus=${novoStatus}`);
            const res = await api.get("/api/solicitacoes");
            setSolicitacoes(res.data.conteudo || res.data || []);
            toast.sucesso("Status atualizado!", "Sucesso");
        } 
        
        catch (err) {
            console.error("Erro ao atualizar status da solicitação:", err);
            toast.erro("Erro ao atualizar status.", "Falha");
        }
    }

    function getNomeTipoSolicitacao(tipo) {
        switch (tipo) {
            case "OBRA":
                return "Obra";
            case "MUDANCA":
                return "Mudança";
            case "ENTREGA":
                return "Entrega";
            case "PRESTADOR":
                return "Prestador";
            default:
                return tipo;
        }
    }

    function getIconeTipoSolicitacao(tipo) {
        switch (tipo) {
            case "OBRA":
                return "";
            case "MUDANCA":
                return "";
            case "ENTREGA":
                return "";
            case "PRESTADOR":
                return "";
            default:
                return "";
        }
    }

    function getCorTipoSol(tipo) {
        switch (tipo) {
            case "OBRA":
                return "#e67e22";
            case "MUDANCA":
                return "#3498db";
            case "ENTREGA":
                return "#2ecc71";
            case "PRESTADOR":
                return "#9b59b6";
            default:
                return "#888";
        }
    }

    const pendentes = solicitacoes.filter(s => s.status === "PENDENTE").length;
    const emAnalise = solicitacoes.filter(s => s.status === "EM_ANALISE").length;
    const aprovadas = solicitacoes.filter(s => s.status === "APROVADO").length;
    const recusadas = solicitacoes.filter(s => s.status === "RECUSADO").length;

    const filtradas = solicitacoes.filter(s => {
        const passaTipo = filtroTipoSolicitacao === "TODOS" || s.tipo === filtroTipoSolicitacao;
        const passaStatus = filtroStatusSolicitacao === "TODOS" || s.status === filtroStatusSolicitacao;
        return passaTipo && passaStatus;
    });

    return (
        <>
            {/* Resumo */}
            <div className="dashboard-grid">
                <div className="dashboard-card amarelo">
                    <h3>Pendentes</h3>
                    <div className="valor">{pendentes}</div>
                </div>

                <div className="dashboard-card azul">
                    <h3>Em Análise</h3>
                    <div className="valor">{emAnalise}</div>
                </div>

                <div className="dashboard-card">
                    <h3>Aprovadas</h3>
                    <div className="valor">{aprovadas}</div>
                </div>

                <div className="dashboard-card vermelho">
                    <h3>Recusadas</h3>
                    <div className="valor">{recusadas}</div>
                </div>
            </div>

            {/* Filtros */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "20px 0" }}>
                {["TODOS", "OBRA", "MUDANCA", "ENTREGA", "PRESTADOR"].map(t => (
                    <button
                        key={t}
                        onClick={() => setFiltroTipoSolicitacao(t)}
                        style={{
                            padding: "6px 14px",
                            borderRadius: "20px",
                            border: filtroTipoSolicitacao === t ? "2px solid var(--primary-green)" : "1px solid var(--border-color)",
                            background: filtroTipoSolicitacao === t ? "rgba(46,204,113,0.12)" : "transparent",
                            color: filtroTipoSolicitacao === t ? "var(--primary-green)" : "var(--text-secondary)",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            fontWeight: filtroTipoSolicitacao === t ? "600" : "400",
                            transition: "all 0.2s"
                        }}
                    >
                        {t === "TODOS" ? "Todos Tipos" : `${getIconeTipoSolicitacao(t)} ${getNomeTipoSolicitacao(t)}`}
                    </button>
                ))}

                <span style={{ width: "1px", background: "var(--border-color)", margin: "0 4px" }} />

                {["TODOS", "PENDENTE", "EM_ANALISE", "APROVADO", "RECUSADO"].map(s => (
                    <button
                        key={s}
                        onClick={() => setFiltroStatusSolicitacao(s)}
                        style={{
                            padding: "6px 14px",
                            borderRadius: "20px",
                            border: filtroStatusSolicitacao === s ? "2px solid var(--primary-green)" : "1px solid var(--border-color)",
                            background: filtroStatusSolicitacao === s ? "rgba(46,204,113,0.12)" : "transparent",
                            color: filtroStatusSolicitacao === s ? "var(--primary-green)" : "var(--text-secondary)",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            fontWeight: filtroStatusSolicitacao === s ? "600" : "400",
                            transition: "all 0.2s"
                        }}
                    >
                        {s === "TODOS" ? "Todos Status" : s === "PENDENTE" ? "Pendente" : s === "EM_ANALISE" ? "Em Análise" : s === "APROVADO" ? "Aprovado" : "Recusado"}
                    </button>
                ))}
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "12px" }}>
                {filtradas.length} solicitação(ões) encontrada(s)
            </p>

            {/* Lista */}
            {filtradas.length === 0 ? (
                <p className="msg-vazia">Nenhuma solicitação encontrada.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {filtradas
                        .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
                        .map(sol => (
                        <div key={sol.id} style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "12px",
                            padding: "20px",
                            borderLeft: `4px solid ${getCorTipoSol(sol.tipo)}`,
                            transition: "box-shadow 0.2s"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                                <div>
                                    <h4 style={{ margin: 0, color: "var(--text-primary)" }}>
                                        {getIconeTipoSolicitacao(sol.tipo)} {sol.titulo}
                                    </h4>
                                    <span style={{
                                        display: "inline-block",
                                        marginTop: "4px",
                                        padding: "2px 10px",
                                        borderRadius: "20px",
                                        fontSize: "0.72rem",
                                        fontWeight: "600",
                                        background: `${getCorTipoSol(sol.tipo)}20`,
                                        color: getCorTipoSol(sol.tipo)
                                    }}>
                                        {getNomeTipoSolicitacao(sol.tipo)}
                                    </span>
                                </div>
                                <span style={{
                                    padding: "4px 12px",
                                    borderRadius: "20px",
                                    fontSize: "0.75rem",
                                    fontWeight: "600",
                                    background: sol.status === "PENDENTE" ? "rgba(241,196,15,0.12)" : sol.status === "EM_ANALISE" ? "rgba(52,152,219,0.12)" : sol.status === "APROVADO" ? "rgba(46,204,113,0.12)" : "rgba(231,76,60,0.12)",
                                    color: sol.status === "PENDENTE" ? "#f1c40f" : sol.status === "EM_ANALISE" ? "#3498db" : sol.status === "APROVADO" ? "#2ecc71" : "#e74c3c"
                                }}>
                                    {sol.status === "PENDENTE" ? "Pendente" : sol.status === "EM_ANALISE" ? "Em Análise" : sol.status === "APROVADO" ? "Aprovado" : "Recusado"}
                                </span>
                            </div>

                            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "8px" }}>{sol.descricao}</p>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                                <span>Data prevista: {sol.dataPrevista ? new Date(sol.dataPrevista + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</span>
                                <span>Morador: {sol.nomeMorador || "—"}</span>
                                <span>{sol.apartamentoMorador || sol.unidade || "—"}</span>
                                <span>Criada em: {sol.dataCriacao ? formatarData(sol.dataCriacao) : "—"}</span>
                            </div>

                            {/* Botões de ação */}
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {sol.status !== "EM_ANALISE" && (
                                    <button onClick={() => alterarStatusSolicitacao(sol.id, "EM_ANALISE")} style={{
                                        padding: "6px 14px",
                                        borderRadius: "6px",
                                        border: "1px solid #3498db",
                                        background: "rgba(52,152,219,0.1)",
                                        color: "#3498db",
                                        cursor: "pointer",
                                        fontSize: "0.8rem",
                                        fontWeight: "500"
                                    }}>Em Análise</button>
                                )}
                                {sol.status !== "APROVADO" && (
                                    <button onClick={() => alterarStatusSolicitacao(sol.id, "APROVADO")} style={{
                                        padding: "6px 14px",
                                        borderRadius: "6px",
                                        border: "1px solid #2ecc71",
                                        background: "rgba(46,204,113,0.1)",
                                        color: "#2ecc71",
                                        cursor: "pointer",
                                        fontSize: "0.8rem",
                                        fontWeight: "500"
                                    }}>Aprovar</button>
                                )}
                                {sol.status !== "RECUSADO" && (
                                    <button onClick={() => alterarStatusSolicitacao(sol.id, "RECUSADO")} style={{
                                        padding: "6px 14px",
                                        borderRadius: "6px",
                                        border: "1px solid #e74c3c",
                                        background: "rgba(231,76,60,0.1)",
                                        color: "#e74c3c",
                                        cursor: "pointer",
                                        fontSize: "0.8rem",
                                        fontWeight: "500"
                                    }}>Recusar</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default SindicoSolicitacoes;

