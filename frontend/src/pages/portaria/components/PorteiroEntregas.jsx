import { useState } from "react";
import { FiPackage, FiClock, FiCheck, FiArrowRight } from "react-icons/fi";

function PorteiroEntregas({ encomendas, setEncomendas, unidades, perfil, api, toast, formatarData }) {
    const [descricaoEncomenda, setDescricaoEncomenda] = useState("");
    const [idUnidadeEncomenda, setIdUnidadeEncomenda] = useState("");
    const [enviandoEncomenda , setEnviandoEncomenda ] = useState(false);

    const encomendasPendentes = encomendas.filter(e => e.status === "AGUARDANDO_RETIRADA").length;
    const encomendasRetiradas = encomendas.filter(e => e.status === "RETIRADO").length;

    async function registrarEncomenda(e) {
        e.preventDefault();
        if (!descricaoEncomenda.trim() || !idUnidadeEncomenda) {
            return;
        }

        setEnviandoEncomenda(true);
        try {
            await api.post("/encomendas", {
                descricao: descricaoEncomenda,
                idUnidade: Number(idUnidadeEncomenda),
                idPorteiro: perfil.id,
            });

            setDescricaoEncomenda("");
            setIdUnidadeEncomenda("");
            toast.sucesso("Encomenda registrada com sucesso!", "Sucesso");

            const res = await api.get("/encomendas");
            setEncomendas(res.data || []);
        } catch (err) {
            console.error("Erro ao registrar encomenda:", err);
            toast.erro("Erro ao registrar encomenda.", "Falha");
        } finally {
            setEnviandoEncomenda(false);
        }
    }

    async function marcarRetirada(id) {
        try {
            await api.put(`/encomendas/${id}/retirar`);
            toast.sucesso("Retirada registrada!", "Sucesso");
            const res = await api.get("/encomendas");
            setEncomendas(res.data || []);
        }

        catch (err) {
            console.error("Erro ao registrar retirada:", err);
            toast.erro("Erro ao registrar retirada.", "Falha");
        }
    }

    return (
        <>
            {/* Formulário de registro */}
            <div className="porteiro-form-card">
                <h3><FiPackage /> Registrar Nova Encomenda</h3>
                <form className="porteiro-form" onSubmit={registrarEncomenda}>
                    <input
                        type="text"
                        placeholder="Descrição (ex: Pacote Amazon, Carta registrada...)"
                        value={descricaoEncomenda}
                        onChange={(e) => setDescricaoEncomenda(e.target.value)}
                        required
                    />
                    <select
                        value={idUnidadeEncomenda}
                        onChange={(e) => setIdUnidadeEncomenda(e.target.value)}
                        required
                    >
                        <option value="">Selecione a unidade</option>
                        {unidades.map(u => (
                            <option key={u.id} value={u.id}>
                                Bloco {u.bloco} — Apto {u.numeroApto}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="btn-registrar" disabled={enviandoEncomenda}>
                        {enviandoEncomenda ? "Registrando..." : "Registrar Encomenda"}
                    </button>
                </form>
            </div>

            {/* Cards de resumo */}
            <div className="porteiro-resumo">
                <div className="resumo-card pendente">
                    <FiClock />
                    <div>
                        <span className="resumo-valor">{encomendasPendentes}</span>
                        <span className="resumo-label">Aguardando Retirada</span>
                    </div>
                </div>
                <div className="resumo-card retirado">
                    <FiCheck />
                    <div>
                        <span className="resumo-valor">{encomendasRetiradas}</span>
                        <span className="resumo-label">Retiradas</span>
                    </div>
                </div>
            </div>

            {/* Lista de encomendas */}
            <h3 className="porteiro-subtitulo">Encomendas Registradas</h3>
            {encomendas.length === 0 ? (
                <p className="msg-vazia">Nenhuma encomenda registrada.</p>
            ) : (
                <div className="porteiro-lista">
                    {encomendas.map(enc => (
                        <div key={enc.id} className={`porteiro-card ${enc.status === "RETIRADO" ? "card-retirado" : ""}`}>
                            <div className="porteiro-card-info">
                                <div className="porteiro-card-icone">
                                    <FiPackage />
                                </div>

                                <div className="porteiro-card-dados">
                                    <h4>{enc.descricao}</h4>
                                    <div className="porteiro-card-meta">
                                        <span>Bloco {enc.blocoUnidade} — Apto {enc.numeroApto}</span>
                                        <span>{formatarData(enc.dataRecebimento)}</span>
                                        {enc.dataRetirada && (
                                            <span>Retirado em {formatarData(enc.dataRetirada)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="porteiro-card-acoes">
                                <span className={`badge-status ${enc.status === "RETIRADO" ? "badge-verde" : "badge-amarelo"}`}>
                                    {enc.status === "RETIRADO" ? "Retirado" : "Aguardando"}
                                </span>
                                {enc.status === "AGUARDANDO_RETIRADA" && (
                                    <button className="btn-retirada" onClick={() => marcarRetirada(enc.id)}>
                                        <FiArrowRight /> Dar Baixa
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default PorteiroEntregas;

