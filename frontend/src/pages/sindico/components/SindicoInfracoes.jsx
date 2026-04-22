import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";

function SindicoInfracoes({ infracoes, setInfracoes, moradores, api, toast }) {
    const [filtroTipoInf, setFiltroTipoInf] = useState("TODOS");
    const [filtroStatusInf, setFiltroStatusInf] = useState("TODOS");
    const [tipoInfracao, setTipoInfracao] = useState("MULTA");
    const [motivoInfracao, setMotivoInfracao] = useState("");
    const [descricaoInfracao, setDescricaoInfracao] = useState("");
    const [valorInfracao, setValorInfracao] = useState("");
    const [moradorInfracao, setMoradorInfracao] = useState("");
    const [dataInfracao, setDataInfracao] = useState(null);
    const [enviandoInfracao, setEnviandoInfracao] = useState(false);
    const [mostrarFormInfracao, setMostrarFormInfracao] = useState(false);
    const [dropdownMoradorAberto, setDropdownMoradorAberto] = useState(false);
    const [buscaMorador, setBuscaMorador] = useState("");
    const dropdownMoradorRef = useRef(null);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        function handleClickFora(e) {
            if (dropdownMoradorRef.current && !dropdownMoradorRef.current.contains(e.target)) {
                setDropdownMoradorAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    const moradorSelecionadoObj = moradores.find(m => String(m.id) === String(moradorInfracao));
    const moradoresFiltrados = moradores.filter(m =>
        m.nome?.toLowerCase().includes(buscaMorador.toLowerCase()) ||
        (m.unidade || "").toLowerCase().includes(buscaMorador.toLowerCase())
    );

    // --- FORMATADOR DE DINHEIRO ---
    function formatarDinheiro(valor) {
        const numeros = valor.replace(/\D/g, "");
        const centavos = parseInt(numeros || "0", 10);
        return (centavos / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function handleValorChange(e) {
        const raw = e.target.value.replace(/\D/g, "");
        if (raw === "") {
            setValorInfracao("");
            return;
        }
        setValorInfracao(formatarDinheiro(raw));
    }

    function valorParaNumero(valorFormatado) {
        if (!valorFormatado) {
            return 0;
        }
        return parseFloat(valorFormatado.replace(/\./g, "").replace(",", ".")) || 0;
    }

    function exibirDinheiro(valor) {
        const num = typeof valor === "number" ? valor : parseFloat(valor || "0");
        return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    async function criarInfracao(e) {
        e.preventDefault();
        if (!motivoInfracao.trim() || !moradorInfracao || !dataInfracao) {
            toast.erro("Preencha todos os campos obrigatórios (morador, motivo e data).");
            return;
        }

        setEnviandoInfracao(true);
        
        try {
            const payload = {
                tipo: tipoInfracao,
                motivo: motivoInfracao,
                descricao: descricaoInfracao,
                valor: tipoInfracao === "MULTA" ? valorParaNumero(valorInfracao) : 0,
                moradorId: Number(moradorInfracao),
                dataInfracao: dataInfracao.toISOString().split("T")[0],
            };
            console.log("Enviando infração:", payload);
            await api.post("/api/infracoes", payload);

            setMotivoInfracao(""); setDescricaoInfracao(""); setValorInfracao("");
            setMoradorInfracao(""); setDataInfracao(null); setMostrarFormInfracao(false);
            setBuscaMorador("");

            toast.sucesso("Infração registrada com sucesso!");
            const res = await api.get("/api/infracoes");
            setInfracoes(res.data || []);
        } 
        
        catch (err) {
            console.error("Erro ao criar infração:", err.response?.status, err.response?.data);
            toast.erro(err.response?.data?.message || err.response?.data?.erro || "Erro ao registrar infração.");
        }
        
        finally {
            setEnviandoInfracao(false);
        }
    }

    async function alterarStatusInfracao(id, novoStatus) {
        try {
            await api.patch(`/api/infracoes/${id}/status?novoStatus=${novoStatus}`);
            const res = await api.get("/api/infracoes");
            setInfracoes(res.data || []);
            toast.sucesso("Status atualizado!");
        } 
        
        catch (err) {
            toast.erro("Erro ao atualizar status.");
        }
    }

    const pendentes = infracoes.filter(i => i.status === "PENDENTE").length;
    const contestadas = infracoes.filter(i => i.status === "CONTESTADA").length;
    const pagas = infracoes.filter(i => i.status === "PAGA").length;
    const canceladas = infracoes.filter(i => i.status === "CANCELADA").length;

    const filtradas = infracoes.filter(i => {
        const passaTipo = filtroTipoInf === "TODOS" || i.tipo === filtroTipoInf;
        const passaStatus = filtroStatusInf === "TODOS" || i.status === filtroStatusInf;
        return passaTipo && passaStatus;
    });

    return (
        <>
            {/* Resumo */}
            <div className="dashboard-grid">
                <div className="dashboard-card amarelo"><h3>Pendentes</h3><div className="valor">{pendentes}</div></div>
                <div className="dashboard-card azul"><h3>Contestadas</h3><div className="valor">{contestadas}</div></div>
                <div className="dashboard-card"><h3>Pagas</h3><div className="valor">{pagas}</div></div>
                <div className="dashboard-card vermelho"><h3>Canceladas</h3><div className="valor">{canceladas}</div></div>
            </div>

            {/* Botão nova infração */}
            <button onClick={() => setMostrarFormInfracao(!mostrarFormInfracao)} className="btn-publicar" style={{ marginBottom: "16px" }}>
                {mostrarFormInfracao ? "Fechar Formulário" : "+ Nova Multa / Advertência"}
            </button>

            {/* Formulário */}
            {mostrarFormInfracao && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                    <h3 style={{ margin: "0 0 16px", color: "var(--text-primary)" }}>Registrar Infração</h3>
                    <form onSubmit={criarInfracao} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                            {/* Tipo */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Tipo</label>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setTipoInfracao("MULTA")} 
                                        style={{
                                            flex: 1, 
                                            padding: "10px", 
                                            borderRadius: "8px", 
                                            cursor: "pointer",
                                            border: tipoInfracao === "MULTA" ? "2px solid #e74c3c" : "1px solid var(--border-color)",
                                            background: tipoInfracao === "MULTA" ? "rgba(231,76,60,0.1)" : "transparent",
                                            color: tipoInfracao === "MULTA" ? "#e74c3c" : "var(--text-secondary)",
                                            fontWeight: tipoInfracao === "MULTA" ? "600" : "400"
                                    }}>Multa</button>

                                    <button 
                                        type="button" 
                                        onClick={() => setTipoInfracao("ADVERTENCIA")} 
                                        style={{
                                            flex: 1, 
                                            padding: "10px", 
                                            borderRadius: "8px", 
                                            cursor: "pointer",
                                            border: tipoInfracao === "ADVERTENCIA" ? "2px solid #f1c40f" : "1px solid var(--border-color)",
                                            background: tipoInfracao === "ADVERTENCIA" ? "rgba(241,196,15,0.1)" : "transparent",
                                            color: tipoInfracao === "ADVERTENCIA" ? "#f1c40f" : "var(--text-secondary)",
                                            fontWeight: tipoInfracao === "ADVERTENCIA" ? "600" : "400"
                                    }}>Advertência</button>
                                </div>
                            </div>

                            {/* Morador */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Morador</label>
                                <div className="sindico-custom-select-wrapper" ref={dropdownMoradorRef}>
                                    <div
                                        className={`sindico-custom-select-trigger ${dropdownMoradorAberto ? "aberto" : ""} ${moradorInfracao ? "selecionado" : ""}`}
                                        onClick={() => setDropdownMoradorAberto(!dropdownMoradorAberto)}
                                    >
                                        <span>
                                            {moradorSelecionadoObj
                                                ? `${moradorSelecionadoObj.nome} — ${moradorSelecionadoObj.unidade || "Sem unidade"}`
                                                : "Selecione o morador"}
                                        </span>
                                        <FiChevronDown className={`sindico-custom-select-arrow ${dropdownMoradorAberto ? "girar" : ""}`} />
                                    </div>
                                    {dropdownMoradorAberto && (
                                        <ul className="sindico-custom-select-opcoes">
                                            <input
                                                type="text"
                                                className="sindico-custom-select-busca"
                                                placeholder="Buscar morador..."
                                                value={buscaMorador}
                                                onChange={(e) => setBuscaMorador(e.target.value)}
                                                autoFocus
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            {moradoresFiltrados.length === 0 ? (
                                                <li className="sindico-custom-select-item" style={{ color: "var(--text-muted)", cursor: "default" }}>
                                                    Nenhum morador encontrado
                                                </li>
                                            ) : (
                                                moradoresFiltrados.map(m => (
                                                    <li
                                                        key={m.id}
                                                        className={`sindico-custom-select-item ${String(moradorInfracao) === String(m.id) ? "ativo" : ""}`}
                                                        onClick={() => {
                                                            setMoradorInfracao(String(m.id));
                                                            setDropdownMoradorAberto(false);
                                                            setBuscaMorador("");
                                                        }}
                                                    >
                                                        {m.nome} — {m.unidade || "Sem unidade"}
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    )}
                                    <input type="text" value={moradorInfracao} required tabIndex={-1}
                                        style={{ position: "absolute", opacity: 0, height: 0, width: 0, pointerEvents: "none" }}
                                        onChange={() => {}}
                                    />
                                </div>
                            </div>

                            {/* Motivo */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Motivo</label>
                                <input 
                                    type="text" 
                                    value={motivoInfracao} 
                                    onChange={(e) => setMotivoInfracao(e.target.value)} 
                                    placeholder="Ex: Barulho após 22h" 
                                    required
                                    style={{ 
                                        padding: "10px", 
                                        borderRadius: "8px", 
                                        border: "1px solid var(--border-color)", 
                                        background: "var(--bg-input, var(--bg-card))", 
                                        color: "var(--text-primary)", fontSize: "0.9rem" 
                                    }} 
                                />
                            </div>

                            {/* Data */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Data da infração</label>
                                <div className="sindico-datepicker-wrapper">
                                    <DatePicker
                                        selected={dataInfracao}
                                        onChange={(date) => setDataInfracao(date)}
                                        locale="pt-BR"
                                        dateFormat="dd/MM/yyyy"
                                        maxDate={new Date()}
                                        placeholderText="Selecione a data"
                                        className="sindico-datepicker-input"
                                        calendarClassName="datepicker-calendario"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        required
                                        autoComplete="off"
                                    />
                                    <FiCalendar className="sindico-datepicker-icone" />
                                </div>
                            </div>

                            {/* Valor (só se MULTA) */}
                            {tipoInfracao === "MULTA" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Valor (R$)</label>
                                    <div style={{ position: "relative" }}>
                                        <span style={{
                                            position: "absolute",
                                            left: "10px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "var(--text-secondary)",
                                            fontWeight: "600",
                                            fontSize: "0.9rem"
                                        }}>R$</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={valorInfracao}
                                            onChange={handleValorChange}
                                            placeholder="0,00"
                                            style={{
                                                padding: "10px 10px 10px 36px",
                                                borderRadius: "8px",
                                                border: "1px solid var(--border-color)",
                                                background: "var(--bg-input, var(--bg-card))",
                                                color: "var(--text-primary)",
                                                fontSize: "0.9rem",
                                                width: "100%",
                                                boxSizing: "border-box"
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Descrição */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Descrição (opcional)</label>
                            <textarea 
                                value={descricaoInfracao} 
                                onChange={(e) => setDescricaoInfracao(e.target.value)} 
                                placeholder="Detalhes sobre a infração..." 
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

                        <button type="submit" className="btn-publicar" disabled={enviandoInfracao} style={{ alignSelf: "flex-start" }}>
                            {enviandoInfracao ? "Registrando..." : "Registrar Infração"}
                        </button>
                    </form>
                </div>
            )}

            {/* Filtros */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "0 0 16px" }}>
                {["TODOS", "MULTA", "ADVERTENCIA"].map(t => (
                    <button 
                        key={t} 
                        onClick={() => setFiltroTipoInf(t)} 
                        style={{
                            padding: "6px 14px", 
                            borderRadius: "20px",
                            border: filtroTipoInf === t ? "2px solid var(--primary-green)" : "1px solid var(--border-color)",
                            background: filtroTipoInf === t ? "rgba(46,204,113,0.12)" : "transparent",
                            color: filtroTipoInf === t ? "var(--primary-green)" : "var(--text-secondary)",
                            cursor: "pointer", 
                            fontSize: "0.85rem", 
                            fontWeight: filtroTipoInf === t ? "600" : "400"
                        }}
                    >
                        {t === "TODOS" ? "Todos" : t === "MULTA" ? "Multas" : "Advertências"}
                    </button>
                ))}
                <span style={{ width: "1px", background: "var(--border-color)", margin: "0 4px" }} />
                {["TODOS", "PENDENTE", "CONTESTADA", "PAGA", "CANCELADA"].map(s => (
                    <button 
                        key={s} 
                        onClick={() => setFiltroStatusInf(s)} 
                        style={{
                            padding: "6px 14px", 
                            borderRadius: "20px",
                            border: filtroStatusInf === s ? "2px solid var(--primary-green)" : "1px solid var(--border-color)",
                            background: filtroStatusInf === s ? "rgba(46,204,113,0.12)" : "transparent",
                            color: filtroStatusInf === s ? "var(--primary-green)" : "var(--text-secondary)",
                            cursor: "pointer", 
                            fontSize: "0.85rem", 
                            fontWeight: filtroStatusInf === s ? "600" : "400"
                        }}
                    >
                        {s === "TODOS" ? "Todos Status" : s === "PENDENTE" ? "Pendente" : s === "CONTESTADA" ? "Contestada" : s === "PAGA" ? "Paga" : "Cancelada"}
                    </button>
                ))}
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "12px" }}>
                {filtradas.length} infração(ões) encontrada(s)
            </p>

            {/* Lista */}
            {filtradas.length === 0 ? (
                <p className="msg-vazia">Nenhuma infração encontrada.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {filtradas.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao)).map(inf => (
                        <div 
                            key={inf.id} 
                            style={{
                                background: "var(--bg-card)", 
                                border: "1px solid var(--border-color)",
                                borderRadius: "12px", 
                                padding: "20px",
                                borderLeft: `4px solid ${inf.tipo === "MULTA" ? "#e74c3c" : "#f1c40f"}`
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                                <div>
                                    <span style={{ fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
                                        {inf.tipo === "MULTA" ? "MULTA" : "ADVERTÊNCIA"}
                                    </span>
                                    <h4 style={{ margin: "4px 0 0", color: "var(--text-primary)" }}>{inf.motivo}</h4>
                                </div>
                                <span style={{
                                    padding: "4px 12px", 
                                    borderRadius: "20px", 
                                    fontSize: "0.75rem", 
                                    fontWeight: "600",
                                    background: inf.status === "PENDENTE" ? "rgba(241,196,15,0.12)" : inf.status === "CONTESTADA" ? "rgba(52,152,219,0.12)" : inf.status === "PAGA" ? "rgba(46,204,113,0.12)" : "rgba(149,165,166,0.12)",
                                    color: inf.status === "PENDENTE" ? "#f1c40f" : inf.status === "CONTESTADA" ? "#3498db" : inf.status === "PAGA" ? "#2ecc71" : "#95a5a6"
                                }}>
                                    {inf.status === "PENDENTE" ? "Pendente" : inf.status === "CONTESTADA" ? "Contestada" : inf.status === "PAGA" ? "Paga" : "Cancelada"}
                                </span>
                            </div>

                            {inf.descricao && <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "8px" }}>{inf.descricao}</p>}

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                                <span>
                                    {inf.nomeMorador || "—"}
                                </span>

                                <span>
                                    {inf.unidadeMorador || "—"}
                                </span>

                                <span>
                                    {inf.dataInfracao ? new Date(inf.dataInfracao + "T00:00:00").toLocaleDateString("pt-BR") : "—"}
                                </span>
                                {inf.tipo === "MULTA" && (
                                    <span style={{ fontWeight: "700", color: "#e74c3c" }}>{exibirDinheiro(inf.valor || 0)}</span>
                                )}
                            </div>

                            {/* Botões de ação */}
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {inf.status !== "PAGA" && inf.tipo === "MULTA" && (
                                    <button 
                                        onClick={() => alterarStatusInfracao(inf.id, "PAGA")} 
                                        style={{
                                            padding: "6px 14px", 
                                            borderRadius: "6px", 
                                            border: "1px solid #2ecc71",
                                            background: "rgba(46,204,113,0.1)", 
                                            color: "#2ecc71", 
                                            cursor: "pointer", 
                                            fontSize: "0.8rem", 
                                            fontWeight: "500"
                                    }}>Marcar como Paga</button>
                                )}
                                {inf.status !== "CANCELADA" && (
                                    <button 
                                        onClick={() => alterarStatusInfracao(inf.id, "CANCELADA")} 
                                        style={{
                                            padding: "6px 14px", 
                                            borderRadius: "6px", 
                                            border: "1px solid #95a5a6",
                                            background: "rgba(149,165,166,0.1)", 
                                            color: "#95a5a6", 
                                            cursor: "pointer", 
                                            fontSize: "0.8rem", 
                                            fontWeight: "500"
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                )}
                                {inf.status === "CONTESTADA" && (
                                    <button 
                                        onClick={() => alterarStatusInfracao(inf.id, "PENDENTE")} 
                                        style={{
                                            padding: "6px 14px", 
                                            borderRadius: "6px", 
                                            border: "1px solid #f1c40f",
                                            background: "rgba(241,196,15,0.1)", 
                                            color: "#f1c40f", 
                                            cursor: "pointer", 
                                            fontSize: "0.8rem", 
                                            fontWeight: "500"
                                    }}>Recusar Contestação</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default SindicoInfracoes;

