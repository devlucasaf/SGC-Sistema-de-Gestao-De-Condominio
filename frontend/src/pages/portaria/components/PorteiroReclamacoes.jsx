import { FiClock, FiAlertCircle, FiCheck } from "react-icons/fi";

function PorteiroReclamacoes({ reclamacoes, formatarData }) {
    return (
        <>
            <div className="porteiro-resumo">
                <div className="resumo-card pendente">
                    <FiClock />
                    <div>
                        <span className="resumo-valor">{reclamacoes.filter(r => r.status === "PENDENTE").length}</span>
                        <span className="resumo-label">Pendentes</span>
                    </div>
                </div>

                <div className="resumo-card analise">
                    <FiAlertCircle />
                    <div>
                        <span className="resumo-valor">{reclamacoes.filter(r => r.status === "EM_ANALISE").length}</span>
                        <span className="resumo-label">Em Análise</span>
                    </div>
                </div>

                <div className="resumo-card retirado">
                    <FiCheck />
                    <div>
                        <span className="resumo-valor">{reclamacoes.filter(r => r.status === "RESOLVIDA").length}</span>
                        <span className="resumo-label">Resolvidas</span>
                    </div>
                </div>
            </div>

            <h3 className="porteiro-subtitulo">Reclamações do Condomínio</h3>
            {reclamacoes.length === 0 ? (
                <p className="msg-vazia">Nenhuma reclamação registrada.</p>
            ) : (
                <div className="porteiro-lista">
                    {reclamacoes.map(rec => (
                        <div key={rec.id} className="porteiro-card">
                            <div className="porteiro-card-info">
                                <div className="porteiro-card-icone icone-reclamacao">
                                    <FiAlertCircle />
                                </div>

                                <div className="porteiro-card-dados">
                                    <h4>{rec.tipo || rec.categoria || "Reclamação"}</h4>
                                    <p className="porteiro-card-desc">{rec.descricao}</p>
                                    <div className="porteiro-card-meta">
                                        <span>Unidade: {rec.unidade || "—"}</span>
                                        <span>{formatarData(rec.dataCriacao)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="porteiro-card-acoes">
                                <span className={`badge-status ${
                                    rec.status === "RESOLVIDA" ? "badge-verde" :
                                    rec.status === "EM_ANALISE" ? "badge-azul" : "badge-amarelo"
                                }`}>
                                    {
                                        rec.status === "RESOLVIDA" ? "Resolvida" :
                                        rec.status === "EM_ANALISE" ? "Em Análise" : "Pendente"
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

export default PorteiroReclamacoes;

