import { useState } from "react";
import { FiClock, FiAlertCircle, FiCheck, FiFileText } from "react-icons/fi";

function PorteiroSolicitacoes({ solicitacoes, formatarData }) {
    const [filtroTipoSol, setFiltroTipoSol] = useState("TODOS");
    const [filtroStatusSol, setFiltroStatusSol] = useState("TODOS");

    const pendentes = solicitacoes.filter(s => s.status === "PENDENTE").length;
    const emAnalise = solicitacoes.filter(s => s.status === "EM_ANALISE").length;
    const aprovadas = solicitacoes.filter(s => s.status === "APROVADO").length;

    const filtradas = solicitacoes.filter(s => {
        const passaTipo = filtroTipoSol === "TODOS" || s.tipo === filtroTipoSol;
        const passaStatus = filtroStatusSol === "TODOS" || s.status === filtroStatusSol;
        return passaTipo && passaStatus;
    });

    function getNomeTipo(tipo) {
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

    function getIconeTipo(tipo) {
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

    function getCorTipo(tipo) {
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

    return (
        <>
            {/* Resumo */}
            <div className="porteiro-resumo">
                <div className="resumo-card pendente">
                    <FiClock />
                    <div>
                        <span className="resumo-valor">{pendentes}</span>
                        <span className="resumo-label">Pendentes</span>
                    </div>
                </div>

                <div className="resumo-card analise">
                    <FiAlertCircle />
                    <div>
                        <span className="resumo-valor">{emAnalise}</span>
                        <span className="resumo-label">Em Análise</span>
                    </div>
                </div>

                <div className="resumo-card retirado">
                    <FiCheck />
                    <div>
                        <span className="resumo-valor">{aprovadas}</span>
                        <span className="resumo-label">Aprovadas</span>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "16px 0" }}>
                {["TODOS", "OBRA", "MUDANCA", "ENTREGA", "PRESTADOR"].map(t => (
                    <button
                        key={t}
                        onClick={() => setFiltroTipoSol(t)}
                        style={{
                            padding: "6px 14px",
                            borderRadius: "20px",
                            border: filtroTipoSol === t ? "2px solid var(--primary-green)" : "1px solid var(--border-color)",
                            background: filtroTipoSol === t ? "rgba(46,204,113,0.12)" : "transparent",
                            color: filtroTipoSol === t ? "var(--primary-green)" : "var(--text-secondary)",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            fontWeight: filtroTipoSol === t ? "600" : "400"
                        }}
                    >
                        {t === "TODOS" ? "Todos" : `${getIconeTipo(t)} ${getNomeTipo(t)}`}
                    </button>
                ))}

                <span style={{ width: "1px", background: "var(--border-color)", margin: "0 4px" }} />

                {["TODOS", "PENDENTE", "EM_ANALISE", "APROVADO", "RECUSADO"].map(s => (
                    <button
                        key={s}
                        onClick={() => setFiltroStatusSol(s)}
                        style={{
                            padding: "6px 14px",
                            borderRadius: "20px",
                            border: filtroStatusSol === s ? "2px solid var(--primary-green)" : "1px solid var(--border-color)",
                            background: filtroStatusSol === s ? "rgba(46,204,113,0.12)" : "transparent",
                            color: filtroStatusSol === s ? "var(--primary-green)" : "var(--text-secondary)",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            fontWeight: filtroStatusSol === s ? "600" : "400"
                        }}
                    >
                        {
                            s === "TODOS" ? "Todos Status" :
                            s === "PENDENTE" ? "Pendente" :
                            s === "EM_ANALISE" ? "Em Análise" :
                            s === "APROVADO" ? "Aprovado" : "Recusado"
                        }
                    </button>
                ))}
            </div>

            <h3 className="porteiro-subtitulo">
                Solicitações dos Moradores ({filtradas.length})
            </h3>

            {/* Lista - somente visualização */}
            {filtradas.length === 0 ? (
                <p className="msg-vazia">Nenhuma solicitação encontrada.</p>
            ) : (
                <div className="porteiro-lista">
                    {filtradas
                        .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
                        .map(sol => (
                        <div key={sol.id} className="porteiro-card" style={{ borderLeft: `4px solid ${getCorTipo(sol.tipo)}` }}>
                            <div className="porteiro-card-info">
                                <div className="porteiro-card-icone" style={{ color: getCorTipo(sol.tipo) }}>
                                    <FiFileText />
                                </div>
                                <div className="porteiro-card-dados">
                                    <h4>{getIconeTipo(sol.tipo)} {sol.titulo}</h4>
                                    <p className="porteiro-card-desc">{sol.descricao}</p>
                                    <div className="porteiro-card-meta">
                                        <span>Tipo: {getNomeTipo(sol.tipo)}</span>
                                        <span>Data prevista: {sol.dataPrevista ? new Date(sol.dataPrevista + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</span>
                                        <span>{sol.nomeMorador || "—"}</span>
                                        <span>{sol.apartamentoMorador || sol.unidade || "—"}</span>
                                        <span>Criada em: {formatarData(sol.dataCriacao)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="porteiro-card-acoes">
                                <span className={`badge-status ${
                                    sol.status === "APROVADO" ? "badge-verde" :
                                    sol.status === "EM_ANALISE" ? "badge-azul" :
                                    sol.status === "RECUSADO" ? "badge-vermelho" :
                                    "badge-amarelo"
                                }`}>
                                    {
                                        sol.status === "PENDENTE" ? "Pendente" :
                                        sol.status === "EM_ANALISE" ? "Em Análise" :
                                        sol.status === "APROVADO" ? "Aprovado" : "Recusado"
                                    }
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default PorteiroSolicitacoes;

