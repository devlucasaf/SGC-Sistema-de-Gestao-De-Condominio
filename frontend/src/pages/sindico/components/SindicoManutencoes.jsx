import { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiCalendar, FiTool, FiTrash2 } from "react-icons/fi";
import DatePicker from "react-datepicker";

// --- COMPONENTE DE MANUTENÇÕES DO SÍNDICO ---
function SindicoManutencoes({ perfil, api, toast, formatarData }) {
    const [manutencoes,     setManutencoes    ] = useState([]);
    const [carregando,      setCarregando     ] = useState(true);
    const [mostrarForm,     setMostrarForm    ] = useState(false);
    const [enviando,        setEnviando       ] = useState(false);

    // --- FORMULÁRIO ---
    const [titulo,          setTitulo         ] = useState("");
    const [descricao,       setDescricao      ] = useState("");
    const [tipo,            setTipo           ] = useState("ELEVADOR");
    const [dataInicio,      setDataInicio     ] = useState(null);
    const [dataFim,         setDataFim        ] = useState(null);

    // --- DROPDOWN TIPO ---
    const [dropdownAberto,  setDropdownAberto ] = useState(false);
    const dropdownRef = useRef(null);

    // --- MODAL CONFIRMAÇÃO ---
    const [modalConfirm, setModalConfirm] = useState({ aberto: false, id: null, acao: null });

    const opcoesTipo = [
        { valor: "ELEVADOR",   label: "Elevador" },
        { valor: "PINTURA",    label: "Pintura" },
        { valor: "LIMPEZA",    label: "Limpeza" },
        { valor: "ELETRICA",   label: "Elétrica" },
        { valor: "HIDRAULICA", label: "Hidráulica" },
        { valor: "OUTRO",      label: "Outro" },
    ];

    // --- FECHAR DROPDOWN FORA ---
    useEffect(() => {
        function handleClickFora(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    useEffect(() => { carregarManutencoes(); }, []);

    async function carregarManutencoes() {
        setCarregando(true);
        try {
            const res = await api.get("/api/manutencoes/todas");
            setManutencoes(res.data || []);
        } catch (err) {
            console.error("Erro ao carregar manutenções:", err);
        } finally {
            setCarregando(false);
        }
    }

    async function criarManutencao(e) {
        e.preventDefault();
        if (!dataInicio) { toast.erro("Selecione a data de início."); return; }

        setEnviando(true);
        try {
            await api.post("/api/manutencoes", {
                titulo, descricao, tipo,
                dataInicio: dataInicio.toISOString().slice(0, 19),
                dataFim: dataFim ? dataFim.toISOString().slice(0, 19) : null,
                idSindico: perfil.id,
            });
            toast.sucesso("Manutenção agendada!");
            setTitulo(""); setDescricao(""); setTipo("ELEVADOR"); setDataInicio(null); setDataFim(null);
            setMostrarForm(false);
            carregarManutencoes();
        } catch (err) {
            toast.erro(err.response?.data?.message || "Erro ao agendar.");
        } finally { setEnviando(false); }
    }

    function pedirConfirmacao(id, acao) {
        setModalConfirm({ aberto: true, id, acao });
    }

    async function confirmarAcao() {
        const { id, acao } = modalConfirm;
        setModalConfirm({ aberto: false, id: null, acao: null });
        try {
            if (acao === "DELETAR") {
                await api.delete(`/api/manutencoes/${id}`);
                toast.sucesso("Manutenção excluída!");
            } else {
                await api.patch(`/api/manutencoes/${id}/status?novoStatus=${acao}`);
                toast.sucesso("Status atualizado!");
            }
            carregarManutencoes();
        } catch (err) {
            toast.erro("Erro ao executar ação.");
        }
    }

    function getCorStatus(status) {
        switch (status) {
            case "AGENDADA":      return { bg: "rgba(52,152,219,0.12)", cor: "#3498db" };
            case "EM_ANDAMENTO":  return { bg: "rgba(243,156,18,0.12)", cor: "#f39c12" };
            case "CONCLUIDA":     return { bg: "rgba(46,204,113,0.12)", cor: "#2ecc71" };
            case "CANCELADA":     return { bg: "rgba(149,165,166,0.12)", cor: "#95a5a6" };
            default:              return { bg: "rgba(149,165,166,0.12)", cor: "#95a5a6" };
        }
    }

    function getLabelStatus(s) {
        switch (s) {
            case "AGENDADA": return "Agendada";
            case "EM_ANDAMENTO": return "Em Andamento";
            case "CONCLUIDA": return "Concluída";
            case "CANCELADA": return "Cancelada";
            default: return s;
        }
    }

    function getLabelTipo(t) {
        return opcoesTipo.find(o => o.valor === t)?.label || t;
    }

    const agendadas = manutencoes.filter(m => m.status === "AGENDADA").length;
    const emAndamento = manutencoes.filter(m => m.status === "EM_ANDAMENTO").length;

    return (
        <>
            {/* --- RESUMO --- */}
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Total</h3>
                    <div className="valor">{manutencoes.length}</div>
                </div>
                <div className="dashboard-card" style={{ borderLeft: "4px solid #3498db" }}>
                    <h3>Agendadas</h3>
                    <div className="valor">{agendadas}</div>
                </div>
                <div className="dashboard-card" style={{ borderLeft: "4px solid #f39c12" }}>
                    <h3>Em Andamento</h3>
                    <div className="valor">{emAndamento}</div>
                </div>
            </div>

            {/* --- BOTÃO --- */}
            <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-publicar" style={{ marginBottom: "16px" }}>
                {mostrarForm ? "Fechar Formulário" : "+ Agendar Manutenção"}
            </button>

            {/* --- FORMULÁRIO --- */}
            {mostrarForm && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                    <h3 style={{ margin: "0 0 16px", color: "var(--text-primary)" }}>Agendar Manutenção</h3>
                    <form onSubmit={criarManutencao} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Título *</label>
                            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Manutenção do Elevador" required
                                style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-input, var(--bg-card))", color: "var(--text-primary)", fontSize: "0.9rem" }} />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Descrição</label>
                            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Detalhes da manutenção..." rows={3}
                                style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-input, var(--bg-card))", color: "var(--text-primary)", fontSize: "0.9rem", resize: "vertical" }} />
                        </div>

                        {/* --- TIPO (DROPDOWN CUSTOMIZADO) --- */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Tipo *</label>
                            <div className="sindico-custom-select-wrapper" ref={dropdownRef}>
                                <div className={`sindico-custom-select-trigger ${dropdownAberto ? "aberto" : ""} selecionado`} onClick={() => setDropdownAberto(!dropdownAberto)}>
                                    <span><FiTool style={{ marginRight: "6px" }} />{getLabelTipo(tipo)}</span>
                                    <FiChevronDown className={`sindico-custom-select-arrow ${dropdownAberto ? "girar" : ""}`} />
                                </div>
                                {dropdownAberto && (
                                    <ul className="sindico-custom-select-opcoes">
                                        {opcoesTipo.map(op => (
                                            <li key={op.valor}
                                                className={`sindico-custom-select-item ${tipo === op.valor ? "ativo" : ""}`}
                                                onClick={() => { setTipo(op.valor); setDropdownAberto(false); }}>
                                                {op.label}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* --- DATAS --- */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Data de início *</label>
                                <div className="sindico-datepicker-wrapper">
                                    <DatePicker selected={dataInicio} onChange={d => setDataInicio(d)} locale="pt-BR" dateFormat="dd/MM/yyyy HH:mm"
                                        showTimeSelect timeFormat="HH:mm" timeIntervals={30} minDate={new Date()} placeholderText="Selecione"
                                        className="sindico-datepicker-input" calendarClassName="datepicker-calendario" required autoComplete="off" />
                                    <FiCalendar className="sindico-datepicker-icone" />
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Data de término</label>
                                <div className="sindico-datepicker-wrapper">
                                    <DatePicker selected={dataFim} onChange={d => setDataFim(d)} locale="pt-BR" dateFormat="dd/MM/yyyy HH:mm"
                                        showTimeSelect timeFormat="HH:mm" timeIntervals={30} minDate={dataInicio || new Date()} placeholderText="Selecione"
                                        className="sindico-datepicker-input" calendarClassName="datepicker-calendario" autoComplete="off" />
                                    <FiCalendar className="sindico-datepicker-icone" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-publicar" disabled={enviando} style={{ alignSelf: "flex-start" }}>
                            {enviando ? "Agendando..." : "Agendar Manutenção"}
                        </button>
                    </form>
                </div>
            )}

            {/* --- LISTA --- */}
            {carregando ? (
                <p className="msg-vazia">Carregando...</p>
            ) : manutencoes.length === 0 ? (
                <p className="msg-vazia">Nenhuma manutenção agendada.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {manutencoes.map(m => {
                        const corStatus = getCorStatus(m.status);
                        return (
                            <div key={m.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px", borderLeft: `4px solid ${corStatus.cor}` }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                                    <div>
                                        <h4 style={{ margin: "0 0 4px", color: "var(--text-primary)" }}>{m.titulo}</h4>
                                        {m.descricao && <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>{m.descricao}</p>}
                                    </div>
                                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                        <span style={{ padding: "3px 12px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: "600", background: corStatus.bg, color: corStatus.cor }}>
                                            {getLabelStatus(m.status)}
                                        </span>
                                        <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: "500", background: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                                            {getLabelTipo(m.tipo)}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                                    <span>📅 Início: {formatarData(m.dataInicio)}</span>
                                    {m.dataFim && <span>📅 Término: {formatarData(m.dataFim)}</span>}
                                </div>

                                {/* --- AÇÕES --- */}
                                {(m.status === "AGENDADA" || m.status === "EM_ANDAMENTO") && (
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        {m.status === "AGENDADA" && (
                                            <button onClick={() => pedirConfirmacao(m.id, "EM_ANDAMENTO")}
                                                style={{ padding: "5px 12px", borderRadius: "6px", border: "1px solid #f39c12", background: "rgba(243,156,18,0.1)", color: "#f39c12", cursor: "pointer", fontSize: "0.78rem", fontWeight: "500" }}>
                                                Iniciar
                                            </button>
                                        )}
                                        {m.status === "EM_ANDAMENTO" && (
                                            <button onClick={() => pedirConfirmacao(m.id, "CONCLUIDA")}
                                                style={{ padding: "5px 12px", borderRadius: "6px", border: "1px solid #2ecc71", background: "rgba(46,204,113,0.1)", color: "#2ecc71", cursor: "pointer", fontSize: "0.78rem", fontWeight: "500" }}>
                                                Concluir
                                            </button>
                                        )}
                                        <button onClick={() => pedirConfirmacao(m.id, "CANCELADA")}
                                            style={{ padding: "5px 12px", borderRadius: "6px", border: "1px solid #95a5a6", background: "rgba(149,165,166,0.1)", color: "#95a5a6", cursor: "pointer", fontSize: "0.78rem", fontWeight: "500" }}>
                                            Cancelar
                                        </button>
                                        <button onClick={() => pedirConfirmacao(m.id, "DELETAR")}
                                            style={{ padding: "5px 12px", borderRadius: "6px", border: "1px solid #e74c3c", background: "rgba(231,76,60,0.1)", color: "#e74c3c", cursor: "pointer", fontSize: "0.78rem", fontWeight: "500" }}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- MODAL --- */}
            {modalConfirm.aberto && (
                <div className="modal-overlay" onClick={() => setModalConfirm({ aberto: false, id: null, acao: null })}>
                    <div className="modal-confirm" onClick={e => e.stopPropagation()}>
                        <div className="modal-confirm-icone">{modalConfirm.acao === "DELETAR" ? "🗑️" : "⚠️"}</div>
                        <h3>{modalConfirm.acao === "DELETAR" ? "Excluir manutenção?" : `Alterar para "${getLabelStatus(modalConfirm.acao)}"?`}</h3>
                        <p>Esta ação não poderá ser desfeita.</p>
                        <div className="modal-confirm-botoes">
                            <button className="btn-cancelar" onClick={() => setModalConfirm({ aberto: false, id: null, acao: null })}>Voltar</button>
                            <button className="btn-confirmar-excluir" onClick={confirmarAcao}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SindicoManutencoes;

