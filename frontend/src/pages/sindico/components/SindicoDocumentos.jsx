import { useState } from "react";

function SindicoDocumentos({ documentos, setDocumentos, perfil, api, toast, formatarData }) {
    const [tituloDoc, setTituloDoc] = useState("");
    const [conteudoDoc, setConteudoDoc] = useState("");
    const [categoriaDoc, setCategoriaDoc] = useState("REGRA");
    const [enviandoDoc, setEnviandoDoc] = useState(false);
    const [editandoDoc, setEditandoDoc] = useState(null);
    const [modalConfirmDoc, setModalConfirmDoc] = useState({ aberto: false, idDoc: null });

    async function salvarDocumento(e) {
        e.preventDefault();
        if (!tituloDoc.trim() || !conteudoDoc.trim()) return;
        setEnviandoDoc(true);
        try {
            if (editandoDoc) {
                await api.put(`/documentos/${editandoDoc}`, {
                    titulo: tituloDoc,
                    conteudo: conteudoDoc,
                    categoria: categoriaDoc,
                    idSindico: perfil.id,
                });
                toast.sucesso("Documento atualizado!", "Sucesso");
            } else {
                await api.post("/documentos", {
                    titulo: tituloDoc,
                    conteudo: conteudoDoc,
                    categoria: categoriaDoc,
                    idSindico: perfil.id,
                });
                toast.sucesso("Documento publicado!", "Sucesso");
            }
            setTituloDoc("");
            setConteudoDoc("");
            setCategoriaDoc("REGRA");
            setEditandoDoc(null);
            const res = await api.get("/documentos");
            setDocumentos(res.data || []);
        } catch (err) {
            console.error("Erro ao salvar documento:", err);
            toast.erro("Erro ao salvar documento.", "Falha");
        } finally {
            setEnviandoDoc(false);
        }
    }

    function iniciarEdicaoDoc(doc) {
        setTituloDoc(doc.titulo);
        setConteudoDoc(doc.conteudo);
        setCategoriaDoc(doc.categoria);
        setEditandoDoc(doc.id);
    }

    function cancelarEdicaoDoc() {
        setTituloDoc("");
        setConteudoDoc("");
        setCategoriaDoc("REGRA");
        setEditandoDoc(null);
    }

    function pedirConfirmacaoDeletarDoc(id) {
        setModalConfirmDoc({ aberto: true, idDoc: id });
    }

    async function confirmarDeletarDoc() {
        const id = modalConfirmDoc.idDoc;
        setModalConfirmDoc({ aberto: false, idDoc: null });
        try {
            await api.delete(`/documentos/${id}`);
            setDocumentos(documentos.filter(d => d.id !== id));
            toast.sucesso("Documento excluído!", "Sucesso");
        } catch (err) {
            console.error("Erro ao deletar documento:", err);
            toast.erro("Erro ao deletar documento.", "Falha");
        }
    }

    function cancelarDeletarDoc() {
        setModalConfirmDoc({ aberto: false, idDoc: null });
    }

    function getLabelCat(cat) {
        switch (cat) {
            case "REGRA":
                return "Regra";
            case "MULTA":
                return "Multa";
            case "REGIMENTO":
                return "Regimento";
            default:
                return cat;
        }
    }

    return (
        <>
            <form className="form-aviso" onSubmit={salvarDocumento}>
                <input
                    type="text"
                    placeholder="Título do documento"
                    value={tituloDoc}
                    onChange={(e) => setTituloDoc(e.target.value)}
                    required
                />
                <select
                    value={categoriaDoc}
                    onChange={(e) => setCategoriaDoc(e.target.value)}
                    style={{
                        padding: "11px 14px",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        fontSize: "0.9rem",
                        fontFamily: "inherit",
                    }}
                >
                    <option value="REGRA">Regra</option>
                    <option value="REGIMENTO">Regimento</option>
                    <option value="MULTA">Multa</option>
                </select>
                <textarea
                    placeholder="Escreva o conteúdo do documento..."
                    value={conteudoDoc}
                    onChange={(e) => setConteudoDoc(e.target.value)}
                    required
                    style={{ minHeight: "120px" }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" className="btn-publicar" disabled={enviandoDoc}>
                        {enviandoDoc ? "Salvando..." : editandoDoc ? "Atualizar Documento" : "Publicar Documento"}
                    </button>
                    {editandoDoc && (
                        <button type="button" className="btn-deletar-aviso" onClick={cancelarEdicaoDoc} style={{ padding: "10px 20px" }}>
                            Cancelar Edição
                        </button>
                    )}
                </div>
            </form>

            <h3 style={{ color: "#2ecc71", marginBottom: "14px" }}>Documentos Publicados</h3>
            {documentos.length === 0 ? (
                <p className="msg-vazia">Nenhum documento publicado ainda.</p>
            ) : (
                <div className="lista-avisos">
                    {documentos.map(d => (
                        <div className="card-aviso" key={d.id}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                                <h4 style={{ margin: 0 }}>{d.titulo}</h4>
                                <span className={`badge ${d.categoria === "MULTA" ? "badge-vermelho" : d.categoria === "REGIMENTO" ? "badge-verde" : "badge-azul"}`}>
                                    {getLabelCat(d.categoria)}
                                </span>
                            </div>
                            <p style={{ whiteSpace: "pre-line" }}>{d.conteudo}</p>
                            <div className="meta-aviso">
                                <span>
                                    {d.dataAtualizacao
                                        ? `Atualizado em ${formatarData(d.dataAtualizacao)}`
                                        : formatarData(d.dataCriacao)
                                    } — {d.nomeSindico}
                                </span>
                                <div style={{ display: "flex", gap: "6px" }}>
                                    <button className="badge badge-azul" style={{ cursor: "pointer", border: "none", fontSize: "0.75rem" }} onClick={() => iniciarEdicaoDoc(d)}>
                                        Editar
                                    </button>
                                    <button className="btn-deletar-aviso" onClick={() => pedirConfirmacaoDeletarDoc(d.id)}>
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de confirmação para documentos */}
            {modalConfirmDoc.aberto && (
                <div className="modal-overlay" onClick={cancelarDeletarDoc}>
                    <div className="modal-confirm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-confirm-icone">⚠️</div>
                        <h3>Confirmar exclusão</h3>
                        <p>Tem certeza que deseja excluir este documento? Esta ação não poderá ser desfeita.</p>
                        <div className="modal-confirm-botoes">
                            <button className="btn-cancelar" onClick={cancelarDeletarDoc}>Cancelar</button>
                            <button className="btn-confirmar-excluir" onClick={confirmarDeletarDoc}>Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SindicoDocumentos;

