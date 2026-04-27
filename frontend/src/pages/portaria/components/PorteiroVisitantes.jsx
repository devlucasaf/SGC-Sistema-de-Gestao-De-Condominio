import { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiUserPlus, FiLogOut, FiSearch, FiClock, FiUsers } from "react-icons/fi";

function PorteiroVisitantes({ unidades, perfil, api, toast, formatarData }) {
    // --- ESTADOS ---
    const [visitantesPresentes, setVisitantesPresentes] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [abaVisitante, setAbaVisitante] = useState("presentes");

    // --- FORMULÁRIO ---
    const [nomeVisitante, setNomeVisitante] = useState("");
    const [cpfVisitante, setCpfVisitante] = useState("");
    const [telefoneVisitante, setTelefoneVisitante] = useState("");
    const [idUnidade, setIdUnidade] = useState("");

    // --- DROPDOWN CUSTOMIZADO UNIDADE ---
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [buscaUnidade, setBuscaUnidade] = useState("");
    const dropdownRef = useRef(null);

    // --- MODAL CONFIRMAÇÃO DE SAÍDA ---
    const [modalSaida, setModalSaida] = useState({ aberto: false, idAcesso: null, nome: "" });

    // --- BUSCA NO HISTÓRICO ---
    const [buscaHistorico, setBuscaHistorico] = useState("");

    // --- FECHAR DROPDOWN AO CLICAR FORA ---
    useEffect(() => {
        function handleClickFora(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    // --- CARREGAR DADOS ---
    useEffect(() => {
        carregarVisitantes();
    }, []);

    async function carregarVisitantes() {
        setCarregando(true);
        try {
            const [resPresentes, resHistorico] = await Promise.all([
                api.get("/visitantes/presentes").catch(() => ({ data: [] })),
                api.get("/visitantes/historico").catch(() => ({ data: [] })),
            ]);
            setVisitantesPresentes(resPresentes.data || []);
            setHistorico(resHistorico.data || []);
        } catch (err) {
            console.error("Erro ao carregar visitantes:", err);
        } finally {
            setCarregando(false);
        }
    }

    // --- FORMATAR CPF ---
    function formatarCpf(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);
        return numeros
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    // --- FORMATAR TELEFONE ---
    function formatarTelefone(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);
        return numeros
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }

    // --- REGISTRAR ENTRADA ---
    async function registrarEntrada(e) {
        e.preventDefault();
        if (!idUnidade) {
            toast.erro("Selecione a unidade de destino.");
            return;
        }

        setEnviando(true);
        try {
            await api.post("/visitantes/entrada", {
                nome: nomeVisitante.trim(),
                cpf: cpfVisitante.replace(/\D/g, "") || null,
                telefone: telefoneVisitante.replace(/\D/g, "") || null,
                idUnidade: Number(idUnidade),
                idPorteiro: perfil.id,
            });
            toast.sucesso("Entrada registrada com sucesso!");
            setNomeVisitante("");
            setCpfVisitante("");
            setTelefoneVisitante("");
            setIdUnidade("");
            setMostrarForm(false);
            carregarVisitantes();
        } catch (err) {
            toast.erro(err.response?.data?.message || "Erro ao registrar entrada.");
        } finally {
            setEnviando(false);
        }
    }

    // --- PEDIR CONFIRMAÇÃO DE SAÍDA ---
    function pedirConfirmacaoSaida(idAcesso, nome) {
        setModalSaida({ aberto: true, idAcesso, nome });
    }

    // --- CONFIRMAR SAÍDA ---
    async function confirmarSaida() {
        const { idAcesso } = modalSaida;
        setModalSaida({ aberto: false, idAcesso: null, nome: "" });
        try {
            await api.put(`/visitantes/saida/${idAcesso}`);
            toast.sucesso("Saída registrada com sucesso!");
            carregarVisitantes();
        } catch (err) {
            toast.erro(err.response?.data?.message || "Erro ao registrar saída.");
        }
    }

    // --- LABEL DA UNIDADE SELECIONADA ---
    function getLabelUnidade(id) {
        const u = unidades.find(u => u.id === Number(id));
        return u ? `Bloco ${u.bloco} - Apto ${u.numeroApto}` : "";
    }

    // --- FILTRAR UNIDADES NO DROPDOWN ---
    const unidadesFiltradas = unidades.filter(u => {
        const texto = `Bloco ${u.bloco} - Apto ${u.numeroApto}`.toLowerCase();
        return texto.includes(buscaUnidade.toLowerCase());
    });

    // --- FILTRAR HISTÓRICO ---
    const historicoFiltrado = historico.filter(v => {
        const texto = `${v.nomeVisitante} ${v.blocoAptoDestino} ${v.cpfVisitante || ""}`.toLowerCase();
        return texto.includes(buscaHistorico.toLowerCase());
    });

    return (
        <>
            {/* --- RESUMO --- */}
            <div className="dashboard-grid">
                <div className="dashboard-card" style={{ borderLeft: "4px solid #2ecc71" }}>
                    <h3>Presentes Agora</h3>
                    <div className="valor">{visitantesPresentes.length}</div>
                </div>
                <div className="dashboard-card azul">
                    <h3>Total de Registros</h3>
                    <div className="valor">{historico.length}</div>
                </div>
            </div>

            {/* --- BOTÃO REGISTRAR ENTRADA --- */}
            <button
                onClick={() => setMostrarForm(!mostrarForm)}
                className="btn-publicar"
                style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}
            >
                <FiUserPlus /> {mostrarForm ? "Fechar Formulário" : "Registrar Entrada"}
            </button>

            {/* --- FORMULÁRIO DE ENTRADA --- */}
            {mostrarForm && (
                <div style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "20px"
                }}>
                    <h3 style={{ margin: "0 0 16px", color: "var(--text-primary)" }}>Registrar Entrada de Visitante</h3>

                    <form onSubmit={registrarEntrada} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {/* --- NOME --- */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                                Nome do Visitante *
                            </label>
                            <input
                                type="text"
                                value={nomeVisitante}
                                onChange={e => setNomeVisitante(e.target.value)}
                                placeholder="Nome completo"
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

                        {/* --- CPF E TELEFONE --- */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                                    CPF (opcional)
                                </label>
                                <input
                                    type="text"
                                    value={cpfVisitante}
                                    onChange={e => setCpfVisitante(formatarCpf(e.target.value))}
                                    placeholder="000.000.000-00"
                                    maxLength={14}
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
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                                    Telefone (opcional)
                                </label>
                                <input
                                    type="text"
                                    value={telefoneVisitante}
                                    onChange={e => setTelefoneVisitante(formatarTelefone(e.target.value))}
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
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
                        </div>

                        {/* --- UNIDADE DE DESTINO (DROPDOWN CUSTOMIZADO) --- */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                                Unidade de Destino *
                            </label>
                            <div className="sindico-custom-select-wrapper" ref={dropdownRef}>
                                <div
                                    className={`sindico-custom-select-trigger ${dropdownAberto ? "aberto" : ""} ${idUnidade ? "selecionado" : ""}`}
                                    onClick={() => setDropdownAberto(!dropdownAberto)}
                                >
                                    <span>{idUnidade ? getLabelUnidade(idUnidade) : "Selecione a unidade"}</span>
                                    <FiChevronDown className={`sindico-custom-select-arrow ${dropdownAberto ? "girar" : ""}`} />
                                </div>
                                {dropdownAberto && (
                                    <ul className="sindico-custom-select-opcoes">
                                        <li style={{ padding: "6px 12px", position: "sticky", top: 0, background: "var(--bg-card)", zIndex: 2 }}>
                                            <input
                                                type="text"
                                                placeholder="Buscar unidade..."
                                                value={buscaUnidade}
                                                onChange={e => setBuscaUnidade(e.target.value)}
                                                onClick={e => e.stopPropagation()}
                                                style={{
                                                    width: "100%",
                                                    padding: "8px",
                                                    borderRadius: "6px",
                                                    border: "1px solid var(--border-color)",
                                                    background: "var(--bg-input, var(--bg-card))",
                                                    color: "var(--text-primary)",
                                                    fontSize: "0.85rem",
                                                    boxSizing: "border-box"
                                                }}
                                            />
                                        </li>
                                        {unidadesFiltradas.length === 0 ? (
                                            <li className="sindico-custom-select-item" style={{ color: "var(--text-muted)", pointerEvents: "none" }}>
                                                Nenhuma unidade encontrada
                                            </li>
                                        ) : (
                                            unidadesFiltradas.map(u => (
                                                <li
                                                    key={u.id}
                                                    className={`sindico-custom-select-item ${Number(idUnidade) === u.id ? "ativo" : ""}`}
                                                    onClick={() => {
                                                        setIdUnidade(u.id);
                                                        setDropdownAberto(false);
                                                        setBuscaUnidade("");
                                                    }}
                                                >
                                                    Bloco {u.bloco} - Apto {u.numeroApto}
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn-publicar" disabled={enviando} style={{ alignSelf: "flex-start" }}>
                            {enviando ? "Registrando..." : "Registrar Entrada"}
                        </button>
                    </form>
                </div>
            )}

            {/* --- ABAS: PRESENTES / HISTÓRICO --- */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <button
                    onClick={() => setAbaVisitante("presentes")}
                    style={{
                        padding: "8px 20px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                        background: abaVisitante === "presentes" ? "#2ecc71" : "transparent",
                        color: abaVisitante === "presentes" ? "#fff" : "var(--text-secondary)",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.2s ease"
                    }}
                >
                    <FiUsers /> Presentes ({visitantesPresentes.length})
                </button>
                <button
                    onClick={() => setAbaVisitante("historico")}
                    style={{
                        padding: "8px 20px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                        background: abaVisitante === "historico" ? "#3498db" : "transparent",
                        color: abaVisitante === "historico" ? "#fff" : "var(--text-secondary)",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.2s ease"
                    }}
                >
                    <FiClock /> Histórico ({historico.length})
                </button>
            </div>

            {/* --- LISTA DE PRESENTES --- */}
            {abaVisitante === "presentes" && (
                <>
                    {carregando ? (
                        <p className="msg-vazia">Carregando...</p>
                    ) : visitantesPresentes.length === 0 ? (
                        <p className="msg-vazia">Nenhum visitante presente no momento.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {visitantesPresentes.map(v => (
                                <div
                                    key={v.idAcesso}
                                    style={{
                                        background: "var(--bg-card)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        borderLeft: "4px solid #2ecc71",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: "12px"
                                    }}
                                >
                                    <div style={{ flex: 1, minWidth: "200px" }}>
                                        <h4 style={{ margin: "0 0 4px", color: "var(--text-primary)" }}>
                                            {v.nomeVisitante}
                                        </h4>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                            <span>📍 {v.blocoAptoDestino}</span>
                                            {v.cpfVisitante && <span>📋 {formatarCpf(v.cpfVisitante)}</span>}
                                            {v.telefoneVisitante && <span>📞 {formatarTelefone(v.telefoneVisitante)}</span>}
                                            <span>🕐 Entrada: {formatarData(v.entrada)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => pedirConfirmacaoSaida(v.idAcesso, v.nomeVisitante)}
                                        style={{
                                            padding: "8px 16px",
                                            borderRadius: "8px",
                                            border: "1px solid #e74c3c",
                                            background: "rgba(231,76,60,0.1)",
                                            color: "#e74c3c",
                                            cursor: "pointer",
                                            fontSize: "0.82rem",
                                            fontWeight: "600",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        <FiLogOut /> Registrar Saída
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* --- HISTÓRICO --- */}
            {abaVisitante === "historico" && (
                <>
                    {/* --- BUSCA --- */}
                    <div style={{ position: "relative", marginBottom: "16px" }}>
                        <FiSearch style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--text-muted)",
                            fontSize: "16px"
                        }} />
                        <input
                            type="text"
                            placeholder="Buscar por nome, CPF ou unidade..."
                            value={buscaHistorico}
                            onChange={e => setBuscaHistorico(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 10px 10px 38px",
                                borderRadius: "8px",
                                border: "1px solid var(--border-color)",
                                background: "var(--bg-input, var(--bg-card))",
                                color: "var(--text-primary)",
                                fontSize: "0.9rem",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    {carregando ? (
                        <p className="msg-vazia">Carregando...</p>
                    ) : historicoFiltrado.length === 0 ? (
                        <p className="msg-vazia">Nenhum registro encontrado.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {historicoFiltrado.map(v => (
                                <div
                                    key={v.idAcesso}
                                    style={{
                                        background: "var(--bg-card)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: "12px",
                                        padding: "14px 16px",
                                        borderLeft: `4px solid ${v.saida ? "#3498db" : "#2ecc71"}`,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: "10px"
                                    }}
                                >
                                    <div style={{ flex: 1, minWidth: "200px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                                            <h4 style={{ margin: 0, color: "var(--text-primary)", fontSize: "0.95rem" }}>
                                                {v.nomeVisitante}
                                            </h4>
                                            <span style={{
                                                padding: "2px 10px",
                                                borderRadius: "20px",
                                                fontSize: "0.7rem",
                                                fontWeight: "600",
                                                background: v.saida ? "rgba(52,152,219,0.12)" : "rgba(46,204,113,0.12)",
                                                color: v.saida ? "#3498db" : "#2ecc71"
                                            }}>
                                                {v.saida ? "Finalizado" : "Presente"}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                            <span>📍 {v.blocoAptoDestino}</span>
                                            <span>🕐 Entrada: {formatarData(v.entrada)}</span>
                                            {v.saida && <span>🕑 Saída: {formatarData(v.saida)}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* --- MODAL CONFIRMAÇÃO DE SAÍDA --- */}
            {modalSaida.aberto && (
                <div className="modal-overlay" onClick={() => setModalSaida({ aberto: false, idAcesso: null, nome: "" })}>
                    <div className="modal-confirm" onClick={e => e.stopPropagation()}>
                        <div className="modal-confirm-icone">🚪</div>
                        <h3>Registrar saída?</h3>
                        <p>Confirmar a saída do visitante <strong>{modalSaida.nome}</strong>?</p>
                        <div className="modal-confirm-botoes">
                            <button
                                className="btn-cancelar"
                                onClick={() => setModalSaida({ aberto: false, idAcesso: null, nome: "" })}
                            >
                                Cancelar
                            </button>
                            <button className="btn-confirmar-excluir" onClick={confirmarSaida}>
                                Confirmar Saída
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PorteiroVisitantes;

