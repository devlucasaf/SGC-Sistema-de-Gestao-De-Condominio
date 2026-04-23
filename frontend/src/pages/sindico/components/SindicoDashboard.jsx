function SindicoDashboard({ moradores, unidades, reclamacoes, avisos, documentos, formatarData }) {
    const totalPendentes = reclamacoes.filter(r => r.status === "PENDENTE").length;
    const totalEmAnalise = reclamacoes.filter(r => r.status === "EM_ANALISE").length;

    return (
        <>
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Total de Moradores</h3>
                    <div className="valor">{moradores.length}</div>
                </div>

                <div className="dashboard-card azul">
                    <h3>Unidades Cadastradas</h3>
                    <div className="valor">{unidades.length}</div>
                </div>

                <div className="dashboard-card amarelo">
                    <h3>Reclamações Pendentes</h3>
                    <div className="valor">{totalPendentes}</div>
                </div>

                <div className="dashboard-card vermelho">
                    <h3>Em Análise</h3>
                    <div className="valor">{totalEmAnalise}</div>
                </div>

                <div className="dashboard-card azul">
                    <h3>Documentos</h3>
                    <div className="valor">{documentos.length}</div>
                </div>
            </div>

            <h3 style={{ color: "#2ecc71", marginBottom: "14px" }}>Últimos Avisos</h3>
            {avisos.length === 0 ? (
                <p className="msg-vazia">Nenhum aviso publicado ainda.</p>
            ) : (
                <div className="lista-avisos">
                    {avisos.slice(0, 3).map(a => (
                        <div className="card-aviso" key={a.id}>
                            <h4>{a.titulo}</h4>
                            <p>{a.mensagem}</p>
                            
                            <div className="meta-aviso">
                                <span>{formatarData(a.dataCriacao)}</span>
                                <span>{a.nomeSindico}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default SindicoDashboard;

