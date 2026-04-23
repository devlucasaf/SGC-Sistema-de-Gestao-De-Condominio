import { useState, useRef, useEffect }  from "react";
import { FiChevronDown }                from "react-icons/fi";

function SindicoDocumentos({ documentos, setDocumentos, perfil, api, toast, formatarData }) {
    const [tituloDocumento       , setTituloDocumento       ]   =   useState("");
    const [conteudoDocumento     , setConteudoDocumento     ]   =   useState("");
    const [categoriaDocumento    , setCategoriaDocumento    ]   =   useState("REGRA");
    const [enviandoDocumento     , setEnviandoDocumento     ]   =   useState(false);
    const [editandoDocumento     , setEditandoDocumento     ]   =   useState(null);
    const [modalConfirmaDocumento, setModalConfirmaDocumento]   =   useState({ aberto: false, idDocumento: null });
    const [dropdownCatAberto     , setDropdownCatAberto     ]   =   useState(false);
    
    const dropdownCatRef = useRef(null);

    const opcoesCat = [
        {
            valor: "REGRA",
            label: "Regra"
        },
        {
            valor: "REGIMENTO",
            label: "Regimento"
        },
        {
            valor: "MULTA",
            label: "Multa"
        },
    ];

    useEffect(() => {
        function handleClickFora(e) {
            if (dropdownCatRef.current && !dropdownCatRef.current.contains(e.target)) {
                setDropdownCatAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    async function salvarDocumento(e) {
        e.preventDefault();
        if (!tituloDocumento.trim() || !conteudoDocumento.trim()) {
            return;
        }

        setEnviandoDocumento(true);

        try {
            if (editandoDocumento) {
                await api.put(`/documentos/${editandoDocumento}`, {
                    titulo:     tituloDocumento,
                    conteudo:   conteudoDocumento,
                    categoria:  categoriaDocumento,
                    idSindico:  perfil.id,
                }); 
                toast.sucesso("Documento atualizado!", "Sucesso");
            } else {
                await api.post("/documentos", {
                    titulo:     tituloDocumento,
                    conteudo:   conteudoDocumento,
                    categoria:  categoriaDocumento,
                    idSindico:  perfil.id,
                });
                toast.sucesso("Documento publicado!", "Sucesso");
            }
            setTituloDocumento("");
            setConteudoDocumento("");
            setCategoriaDocumento("REGRA");
            setEditandoDocumento(null);
            const res = await api.get("/documentos");
            setDocumentos(res.data || []);
        } catch (err) {
            console.error("Erro ao salvar documento:", err);
            toast.erro("Erro ao salvar documento.", "Falha");
        } finally {
            setEnviandoDocumento(false);
        }
    }

    function iniciarEdicaoDocumento(doc) {
        setTituloDocumento(doc.titulo);
        setConteudoDocumento(doc.conteudo);
        setCategoriaDocumento(doc.categoria);
        setEditandoDocumento(doc.id);
    }

    function cancelarEdicaoDocumento() {
        setTituloDocumento("");
        setConteudoDocumento("");
        setCategoriaDoc("REGRA");
        setEditandoDoc(null);
    }

    function pedirConfirmacaoDeletarDocumento(id) {
        setModalConfirmaDocumento({ 
            aberto: true, 
            idDocumento: id 
        });
    }

    async function confirmarDeletarDocumento() {
        const id = modalConfirmaDocumento.idDocumento;
        setModalConfirmaDocumento({ 
            aberto: false, 
            idDocumento: null 
        });

        try {
            await api.delete(`/documentos/${id}`);
            setDocumentos(documentos.filter(d => d.id !== id));
            toast.sucesso("Documento excluído!", "Sucesso");
        } catch (err) {
            console.error("Erro ao deletar documento:", err);
            toast.erro("Erro ao deletar documento.", "Falha");
        }
    }

    function cancelarDeletarDocumento() {
        setModalConfirmaDocumento({ 
            aberto: false, 
            idDocumento: null 
        });
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
                    value={tituloDocumento}
                    onChange={(e) => setTituloDocumento(e.target.value)}
                    required
                />
                <div className="sindico-custom-select-wrapper" ref={dropdownCatRef}>
                    <div
                        className={`sindico-custom-select-trigger ${dropdownCatAberto ? "aberto" : ""} selecionado`}
                        onClick={() => setDropdownCatAberto(!dropdownCatAberto)}
                    >
                        <span>{opcoesCat.find(o => o.valor === categoriaDoc)?.label || "Categoria"}</span>
                        <FiChevronDown className={`sindico-custom-select-arrow ${dropdownCatAberto ? "girar" : ""}`} />
                    </div>
                    {dropdownCatAberto && (
                        <ul className="sindico-custom-select-opcoes">
                            {opcoesCat.map(op => (
                                <li
                                    key={op.valor}
                                    className={`sindico-custom-select-item ${categoriaDoc === op.valor ? "ativo" : ""}`}
                                    onClick={() => {
                                        setCategoriaDoc(op.valor);
                                        setDropdownCatAberto(false);
                                    }}
                                >
                                    {op.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <textarea
                    placeholder="Escreva o conteúdo do documento..."
                    value={conteudoDoc}
                    onChange={(e) => setConteudoDoc(e.target.value)}
                    required
                    style={{ minHeight: "120px" }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" className="btn-publicar" disabled={enviandoDocumento}>
                        {enviandoDocumento ? "Salvando..." : editandoDocumento ? "Atualizar Documento" : "Publicar Documento"}
                    </button>
                    {editandoDocumento && (
                        <button type="button" className="btn-deletar-aviso" onClick={cancelarEdicaoDocumento} style={{ padding: "10px 20px" }}>
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
                                    <button className="badge badge-azul" style={{ cursor: "pointer", border: "none", fontSize: "0.75rem" }} onClick={() => iniciarEdicaoDocumento(d)}>
                                        Editar
                                    </button>

                                    <button className="btn-deletar-aviso" onClick={() => pedirConfirmacaoDeletarDocumento(d.id)}>
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODAL DE CONFIRMAÇÃO PARA DOCUMENTOS --- */}
            {modalConfirmaDocumento.aberto && (
                <div className="modal-overlay" onClick={cancelarDeletarDocumento}>
                    <div className="modal-confirm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-confirm-icone">⚠️</div>
                        <h3>Confirmar exclusão</h3>
                        <p>Tem certeza que deseja excluir este documento? Esta ação não poderá ser desfeita.</p>
                        <div className="modal-confirm-botoes">
                            <button className="btn-cancelar" onClick={cancelarDeletarDocumento}>Cancelar</button>
                            <button className="btn-confirmar-excluir" onClick={confirmarDeletarDocumento}>Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SindicoDocumentos;

