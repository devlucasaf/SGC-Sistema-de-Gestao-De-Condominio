import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import DatePickerHeader from "../../../components/DatePickerHeader";

function SindicoVotacao({ api, toast, formatarData }) {
    const [votacoes   , setVotacoes   ] = useState([]);
    const [carregando , setCarregando ] = useState(true);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [enviando   , setEnviando   ] = useState(false);
    const [titulo     , setTitulo     ] = useState("");
    const [descricao  , setDescricao  ] = useState("");
    const [candidatos , setCandidatos ] = useState(["", ""]);
    const [dataInicio , setDataInicio ] = useState(null);
    const [dataFim    , setDataFim    ] = useState(null);

    // --- MODAL CONFIRMAÇÃO ---
    const [modalConfirm, setModalConfirm] = useState({
        aberto: false,
        id: null,
        acao: null
    });

    useEffect(() => {
        carregarVotacoes();
    }, []);

    async function carregarVotacoes() {
        setCarregando(true);
        try {
            const res = await api.get("/api/votacoes");
            setVotacoes(res.data || []);
        } catch (err) {
            console.error("Erro ao carregar votações:", err);
        } finally {
            setCarregando(false);
        }
    }

    function adicionarCandidato() {
        setCandidatos([...candidatos, ""]);
    }

    function removerCandidato(index) {
        if (candidatos.length <= 2) {
            return;
        }
        setCandidatos(candidatos.filter((_, i) => i !== index));
    }

    function atualizarCandidato(index, valor) {
        const novos = [...candidatos];
        novos[index] = valor;
        setCandidatos(novos);
    }

    async function criarVotacao(e) {
        e.preventDefault();
        const candidatosValidos = candidatos.map(c => c.trim()).filter(c => c);
        if (candidatosValidos.length < 2) {
            toast.erro("Adicione pelo menos 2 candidatos.");
            return;
        }

        if (!dataInicio || !dataFim) {
            toast.erro("Selecione as datas de início e fim.");
            return;
        }

        setEnviando(true);
        try {
            await api.post("/api/votacoes", {
                titulo,
                descricao,
                candidatos: candidatosValidos,
                dataInicio: dataInicio.toISOString().split("T")[0],
                dataFim: dataFim.toISOString().split("T")[0],
            });
            toast.sucesso("Votação criada com sucesso!");
            setTitulo(""); setDescricao(""); setCandidatos(["", ""]); setDataInicio(null); setDataFim(null);
            setMostrarForm(false);
            carregarVotacoes();
        } catch (err) {
            toast.erro(err.response?.data?.message || "Erro ao criar votação.");
        } finally {
            setEnviando(false);
        }
    }

    function pedirConfirmacao(id, acao) {
        setModalConfirm({ 
            aberto: true, 
            id, 
            acao 
        });
    }

    async function confirmarAcao() {
        const { id, acao } = modalConfirm;
        setModalConfirm({ 
            aberto: false, 
            id: null, 
            acao: null 
        });

        try {
            await api.patch(`/api/votacoes/${id}/status?novoStatus=${acao}`);
            toast.sucesso(acao === "ENCERRADA" ? "Votação encerrada!" : "Votação cancelada!");
            carregarVotacoes();
        } catch (err) {
            toast.erro("Erro ao alterar status.");
        }
    }

    function getCorStatus(status) {
        if (status === "ABERTA") {
            return {
                bg: "rgba(46,204,113,0.12)",
                cor: "#2ecc71"
            };
        }

        if (status === "ENCERRADA") {
            return {
                bg: "rgba(52,152,219,0.12)",
                cor: "#3498db"
            };
        }
        return {
            bg: "rgba(149,165,166,0.12)",
            cor: "#95a5a6"
        };
    }

    function getLabelStatus(status) {
        if (status === "ABERTA") {
            return "Aberta";
        }

        if (status === "ENCERRADA") {
            return "Encerrada";
        }
        return "Cancelada";
    }

    const abertas = votacoes.filter(v => v.status === "ABERTA").length;
    const encerradas = votacoes.filter(v => v.status === "ENCERRADA").length;

    return (
        <>
            {/* --- RESUMO --- */}
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Total</h3>
                    <div className="valor">{votacoes.length}</div>
                </div>

                <div className="dashboard-card" style={{ borderLeft: "4px solid #2ecc71" }}>
                    <h3>Abertas</h3>
                    <div className="valor">{abertas}</div>
                </div>

                <div className="dashboard-card azul">
                    <h3>Encerradas</h3>
                    <div className="valor">{encerradas}</div>
                </div>
            </div>

            {/* --- BOTÃO --- */}
            <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-publicar" style={{ marginBottom: "16px" }}>
                {mostrarForm ? "Fechar Formulário" : "+ Nova Votação"}
            </button>

            {/* --- FORMULÁRIO --- */}
            {mostrarForm && (
                <div style={{ 
                    background: "var(--bg-card)", 
                    border: "1px solid var(--border-color)", 
                    borderRadius: "12px", 
                    padding: "20px", 
                    marginBottom: "20px" 
                }}>
                    <h3 style={{ margin: "0 0 16px", color: "var(--text-primary)" }}>Criar Votação para Síndico</h3>

                    <form onSubmit={criarVotacao} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label 
                                style={{ 
                                    fontSize: "0.85rem", 
                                    fontWeight: "600", 
                                    color: "var(--text-secondary)" 
                                }}
                            >
                                Título
                            </label>
                            
                            <input 
                                type="text" 
                                value={titulo} 
                                onChange={e => setTitulo(e.target.value)} 
                                placeholder="Ex: Eleição de Síndico 2026" 
                                required
                                style={{ 
                                    padding: "10px", 
                                    borderRadius: "8px", 
                                    border: "1px solid var(--border-color)", 
                                    background: "var(--bg-input, var(--bg-card))", 
                                    color: "var(--text-primary)", 
                                    fontSize: "0.9rem" 
                                }} 
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label 
                                style={{ 
                                    fontSize: "0.85rem", 
                                    fontWeight: "600", 
                                    color: "var(--text-secondary)" 
                                }}
                            >
                                Descrição (opcional)
                            </label>
                            <textarea 
                                value={descricao} 
                                onChange={e => setDescricao(e.target.value)} 
                                placeholder="Detalhes sobre a votação..." 
                                rows={3}
                                style={{ 
                                    padding: "10px", 
                                    borderRadius: "8px", 
                                    border: "1px solid var(--border-color)", 
                                    background: "var(--bg-input, var(--bg-card))", 
                                    color: "var(--text-primary)", 
                                    fontSize: "0.9rem", 
                                    resize: "vertical" 
                                }} 
                            />
                        </div>

                        {/* --- CANDIDATOS --- */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label 
                                style={{ 
                                    fontSize: "0.85rem", 
                                    fontWeight: "600", 
                                    color: "var(--text-secondary)" 
                                }}
                            >
                                Candidatos
                            </label>
                            {candidatos.map((c, i) => (
                                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <input 
                                        type="text" 
                                        value={c} 
                                        onChange={e => atualizarCandidato(i, e.target.value)}
                                        placeholder={`Candidato ${i + 1}`}
                                        style={{ 
                                            flex: 1, 
                                            padding: "10px", 
                                            borderRadius: "8px", 
                                            border: "1px solid var(--border-color)", 
                                            background: "var(--bg-input, var(--bg-card))", 
                                            color: "var(--text-primary)", 
                                            fontSize: "0.9rem" 
                                        }} 
                                    />
                                    {candidatos.length > 2 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removerCandidato(i)}
                                            style={{ 
                                                padding: "8px", 
                                                borderRadius: "8px", 
                                                border: "1px solid #e74c3c", 
                                                background: "rgba(231,76,60,0.1)", 
                                                color: "#e74c3c", 
                                                cursor: "pointer" 
                                            }}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={adicionarCandidato}
                                style={{ 
                                    alignSelf: "flex-start", 
                                    padding: "8px 16px", 
                                    borderRadius: "8px", 
                                    border: "1px solid var(--border-color)", 
                                    background: "transparent", 
                                    color: "var(--text-secondary)", 
                                    cursor: "pointer", 
                                    fontSize: "0.85rem", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: "6px" 
                                }}>
                                <FiPlus /> Adicionar Candidato
                            </button>
                        </div>

                        {/* --- DATAS --- */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label 
                                    style={{ 
                                        fontSize: "0.85rem", 
                                        fontWeight: "600", 
                                        color: "var(--text-secondary)" 
                                    }}
                                >
                                    Data de início
                                </label>
                                <div className="sindico-datepicker-wrapper">
                                    <DatePicker
                                        selected={dataInicio}
                                        onChange={d => setDataInicio(d)}
                                        locale="pt-BR"
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()}
                                        placeholderText="Selecione a data"
                                        className="sindico-datepicker-input"
                                        calendarClassName="datepicker-calendario"
                                        renderCustomHeader={DatePickerHeader}
                                        required
                                        autoComplete="off"
                                    />
                                    <FiCalendar className="sindico-datepicker-icone" />
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Data de encerramento</label>
                                <div className="sindico-datepicker-wrapper">
                                    <DatePicker
                                        selected={dataFim}
                                        onChange={d => setDataFim(d)}
                                        locale="pt-BR"
                                        dateFormat="dd/MM/yyyy"
                                        minDate={dataInicio || new Date()}
                                        placeholderText="Selecione a data"
                                        className="sindico-datepicker-input"
                                        calendarClassName="datepicker-calendario"
                                        renderCustomHeader={DatePickerHeader}
                                        required
                                        autoComplete="off"
                                    />
                                    <FiCalendar className="sindico-datepicker-icone" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-publicar" disabled={enviando} style={{ alignSelf: "flex-start" }}>
                            {enviando ? "Criando..." : "Criar Votação"}
                        </button>
                    </form>
                </div>
            )}

            {/* --- LISTA --- */}
            {carregando ? (
                <p className="msg-vazia">Carregando votações...</p>
            ) : votacoes.length === 0 ? (
                <p className="msg-vazia">Nenhuma votação criada ainda.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {votacoes.map(v => {
                        const corStatus = getCorStatus(v.status);
                        const vencedor = v.resultado && v.status === "ENCERRADA"
                            ? Object.entries(v.resultado).sort((a, b) => b[1] - a[1])[0]
                            : null;

                        return (
                            <div 
                                key={v.id} 
                                style={{
                                    background: "var(--bg-card)", 
                                    border: "1px solid var(--border-color)", 
                                    borderRadius: "12px", 
                                    padding: "20px",
                                    borderLeft: `4px solid ${corStatus.cor}`
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                                    <div>
                                        <h4 style={{ margin: "0 0 4px", color: "var(--text-primary)" }}>{v.titulo}</h4>
                                        {v.descricao && <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0 0 8px" }}>{v.descricao}</p>}
                                    </div>

                                    <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600", background: corStatus.bg, color: corStatus.cor }}>
                                        {getLabelStatus(v.status)}
                                    </span>
                                </div>

                                {/* --- INFORMAÇÃO --- */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                                    <span>
                                        {v.dataInicio} a {v.dataFim}
                                    </span>

                                    <span>
                                        {v.totalVotos} voto(s)
                                    </span>

                                    <span>
                                        {v.candidatos?.length || 0} candidato(s)
                                    </span>
                                </div>

                                {/* --- CANDIDATOS --- */}
                                <div style={{ marginBottom: "12px" }}>
                                    <p 
                                        style={{ 
                                            fontSize: "0.82rem", 
                                            fontWeight: "600", 
                                            color: "var(--text-secondary)", 
                                            marginBottom: "8px" 
                                        }}
                                    >
                                        Candidatos:
                                    </p>

                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                        {(v.candidatos || []).map((c, i) => (
                                            <span 
                                                key={i} 
                                                style={{
                                                    padding: "6px 14px", 
                                                    borderRadius: "20px", 
                                                    fontSize: "0.82rem",
                                                    background: "var(--bg-primary)", 
                                                    border: "1px solid var(--border-color)", 
                                                    color: "var(--text-primary)"
                                                }}
                                            >
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* --- RESULTADO --- */}
                                {v.resultado && v.totalVotos > 0 && (
                                    <div style={{ marginBottom: "12px" }}>
                                        <p style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "8px" }}>
                                            {v.status === "ENCERRADA" ? "Resultado Final:" : "Votação em andamento:"}
                                        </p>
                                        {Object.entries(v.resultado).sort((a, b) => b[1] - a[1]).map(([candidato, votos]) => {
                                            const pct = v.totalVotos > 0 ? ((votos / v.totalVotos) * 100).toFixed(1) : 0;
                                            const isVencedor = vencedor && candidato === vencedor[0];
                                            
                                            return (
                                                <div key={candidato} style={{ marginBottom: "6px" }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "2px" }}>
                                                        <span style={{ color: "var(--text-primary)", fontWeight: isVencedor ? "700" : "400" }}>
                                                            {isVencedor && v.status === "ENCERRADA" ? "🏆 " : ""}{candidato}
                                                        </span>

                                                        <span style={{ color: "var(--text-muted)" }}>{votos} voto(s) — {pct}%</span>
                                                    </div>

                                                    <div style={{ height: "8px", borderRadius: "4px", background: "var(--border-color)", overflow: "hidden" }}>
                                                        <div 
                                                            style={{
                                                                height: "100%", 
                                                                borderRadius: "4px", 
                                                                width: `${pct}%`,
                                                                background: isVencedor ? "#2ecc71" : "#3498db",
                                                                transition: "width 0.5s ease"
                                                            }} 
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* --- AÇÕES --- */}
                                {v.status === "ABERTA" && (
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        <button 
                                            onClick={() => pedirConfirmacao(v.id, "ENCERRADA")}
                                            style={{ 
                                                padding: "6px 14px", 
                                                borderRadius: "6px", 
                                                border: "1px solid #3498db", 
                                                background: "rgba(52,152,219,0.1)", 
                                                color: "#3498db", 
                                                cursor: "pointer", 
                                                fontSize: "0.8rem", 
                                                fontWeight: "500" 
                                            }}>
                                            Encerrar Votação
                                        </button>

                                        <button 
                                            onClick={() => pedirConfirmacao(v.id, "CANCELADA")}
                                            style={{ 
                                                padding: "6px 14px", 
                                                borderRadius: "6px", 
                                                border: "1px solid #95a5a6", 
                                                background: "rgba(149,165,166,0.1)", 
                                                color: "#95a5a6", 
                                                cursor: "pointer", 
                                                fontSize: "0.8rem", 
                                                fontWeight: "500" 
                                            }}>
                                            Cancelar Votação
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- MODAL CONFIRMAÇÃO --- */}
            {modalConfirm.aberto && (
                <div className="modal-overlay" onClick={() => setModalConfirm({ aberto: false, id: null, acao: null })}>
                    <div className="modal-confirm" onClick={e => e.stopPropagation()}>
                        <div className="modal-confirm-icone">⚠️</div>
                        <h3>{modalConfirm.acao === "ENCERRADA" ? "Encerrar votação?" : "Cancelar votação?"}</h3>
                        
                        <p>{modalConfirm.acao === "ENCERRADA"
                            ? "Ao encerrar, nenhum morador poderá mais votar e o resultado será divulgado."
                            : "Ao cancelar, a votação será descartada."}
                        </p>

                        <div className="modal-confirm-botoes">
                            <button 
                                className="btn-cancelar" 
                                onClick={() => setModalConfirm({ 
                                    aberto: false, 
                                    id: null, 
                                    acao: null 
                                })}>
                                    Voltar
                            </button>

                            <button className="btn-confirmar-excluir" onClick={confirmarAcao}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SindicoVotacao;

