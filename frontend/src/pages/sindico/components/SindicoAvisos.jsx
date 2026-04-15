import { useState } from "react";

function SindicoAvisos({ avisos, setAvisos, perfil, api, toast, formatarData }) {
    const [tituloAviso, setTituloAviso] = useState("");
    const [mensagemAviso, setMensagemAviso] = useState("");
    const [enviandoAviso, setEnviandoAviso] = useState(false);
    const [modalConfirm, setModalConfirm] = useState({ aberto: false, idAviso: null });

    async function publicarAviso(e) {
        e.preventDefault();
        if (!tituloAviso.trim() || !mensagemAviso.trim()) { 
            return;
        }

        setEnviandoAviso(true);
        try {
            await api.post("/avisos", {
                titulo: tituloAviso,
                mensagem: mensagemAviso,
                idSindico: perfil.id,
            });

            setTituloAviso("");
            setMensagemAviso("");

            const res = await api.get("/avisos");
            setAvisos(res.data || []);
        } 
        
        catch (err) {
            console.error("Erro ao publicar aviso:", err);
            toast.erro("Erro ao publicar aviso.", "Falha");
        } 
        
        finally {
            setEnviandoAviso(false);
        }
    }

    function pedirConfirmacaoDeletar(id) {
        setModalConfirm({ 
            aberto: true, 
            idAviso: id 
        });
    }

    async function confirmarDeletar() {
        const id = modalConfirm.idAviso;
        setModalConfirm({ 
            aberto: false, 
            idAviso: null 
        });

        try {
            await api.delete(`/avisos/${id}`);
            setAvisos(avisos.filter(a => a.id !== id));
        } 
        
        catch (err) {
            console.error("Erro ao deletar aviso:", err);
            toast.erro("Erro ao deletar aviso.", "Falha");
        }
    }

    function cancelarDeletar() {
        setModalConfirm({ 
            aberto: false, 
            idAviso: null 
        });
    }

    return (
        <>
            <form className="form-aviso" onSubmit={publicarAviso}>
                <input
                    type="text"
                    placeholder="Título do aviso"
                    value={tituloAviso}
                    onChange={(e) => setTituloAviso(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Escreva a mensagem do aviso para os moradores..."
                    value={mensagemAviso}
                    onChange={(e) => setMensagemAviso(e.target.value)}
                    required
                />
                <button type="submit" className="btn-publicar" disabled={enviandoAviso}>
                    {enviandoAviso ? "Publicando..." : "Publicar Aviso"}
                </button>
            </form>

            <h3 style={{ color: "#2ecc71", marginBottom: "14px" }}>Avisos Publicados</h3>
            {avisos.length === 0 ? (
                <p className="msg-vazia">Nenhum aviso publicado ainda.</p>
            ) : (
                <div className="lista-avisos">
                    {avisos.map(a => (
                        <div className="card-aviso" key={a.id}>
                            <h4>{a.titulo}</h4>
                            <p>{a.mensagem}</p>

                            <div className="meta-aviso">
                                <span>{formatarData(a.dataCriacao)} — {a.nomeSindico}</span>
                                <button className="btn-deletar-aviso" onClick={() => pedirConfirmacaoDeletar(a.id)}>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de confirmação */}
            {modalConfirm.aberto && (
                <div className="modal-overlay" onClick={cancelarDeletar}>
                    <div className="modal-confirm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-confirm-icone">⚠️</div>
                        <h3>Confirmar exclusão</h3>
                        <p>Tem certeza que deseja excluir este aviso? Esta ação não poderá ser desfeita.</p>
                        <div className="modal-confirm-botoes">
                            <button className="btn-cancelar" onClick={cancelarDeletar}>Cancelar</button>
                            <button className="btn-confirmar-excluir" onClick={confirmarDeletar}>Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SindicoAvisos;

