function SindicoReclamacoes({ reclamacoes, setReclamacoes, api, toast, formatarData }) {

    async function alterarStatus(id, novoStatus) {
        try {
            await api.patch(`/api/reclamacoes/${id}/status?novoStatus=${novoStatus}`);
            const res = await api.get("/api/reclamacoes");
            setReclamacoes(res.data.conteudo || res.data || []);
        } catch (err) {
            console.error("Erro ao atualizar status:", err);
            toast.erro("Erro ao atualizar status.", "Falha");
        }
    }

    return reclamacoes.length === 0 ? (
        <p className="msg-vazia">Nenhuma reclamação registrada.</p>
    ) : (
        <table className="tabela-sindico">
            <thead>
                <tr>
                    <th>Categoria</th>
                    <th>Descrição</th>
                    <th>Unidade</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {reclamacoes.map(r => (
                    <tr key={r.id}>
                        <td>
                            {r.categoria}
                        </td>

                        <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {r.descricao}
                        </td>

                        <td>
                            {r.unidade || "—"}
                        </td>

                        <td>
                            <span className={`badge ${r.status === "PENDENTE" ? "badge-amarelo" : r.status === "EM_ANALISE" ? "badge-azul" : "badge-verde"}`}>
                                {r.status.replace("_", " ")}
                            </span>
                        </td>
                        
                        <td style={{ fontSize: "0.85rem" }}>{formatarData(r.dataCriacao)}</td>
                        
                        <td>
                            {r.status !== "RESOLVIDA" && (
                                <div style={{ display: "flex", gap: "6px" }}>
                                    {r.status === "PENDENTE" && (
                                        <button onClick={() => alterarStatus(r.id, "EM_ANALISE")} className="badge badge-azul" style={{ cursor: "pointer", border: "none" }}>
                                            Analisar
                                        </button>
                                    )}
                                    <button onClick={() => alterarStatus(r.id, "RESOLVIDA")} className="badge badge-verde" style={{ cursor: "pointer", border: "none" }}>
                                        Resolver
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default SindicoReclamacoes;

