import { FiPackage, FiClock, FiUser } from "react-icons/fi";

function SindicoEntregas({ minhasEntregas, carregandoEntregas }) {
    if (carregandoEntregas) {
        return <p className="msg-vazia">Carregando entregas...</p>;
    }

    if (minhasEntregas.length === 0) {
        return <p className="msg-vazia">Nenhuma encomenda registrada para sua unidade.</p>;
    }

    return (
        <div className="lista-entregas-sindico">
            {minhasEntregas.map(e => (
                <div key={e.id} className={`card-entrega-sindico ${e.status === "RETIRADO" ? "entrega-retirada" : ""}`}>
                    <div className="entrega-icone"><FiPackage /></div>
                    <div className="entrega-info">
                        <h4>{e.descricao}</h4>
                        <div className="entrega-meta">
                            <span>
                                <FiClock /> 
                                {e.dataRecebimento ? new Date(e.dataRecebimento).toLocaleDateString("pt-BR") + " — " + new Date(e.dataRecebimento).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "—"}
                            </span>
                            
                            <span><FiUser /> {e.nomePorteiro || "Portaria"}</span>
                        </div>
                        {e.dataRetirada && (
                            <span className="entrega-retirada-info">Retirado em {new Date(e.dataRetirada).toLocaleDateString("pt-BR")}</span>
                        )}
                    </div>
                    <span className={`badge ${e.status === "RETIRADO" ? "badge-verde" : "badge-amarelo"}`}>
                        {e.status === "RETIRADO" ? "Retirado" : "Aguardando"}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default SindicoEntregas;

