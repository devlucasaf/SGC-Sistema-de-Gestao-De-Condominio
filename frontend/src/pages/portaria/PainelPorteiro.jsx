import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../components/Toast";
import { FiSun, FiMoon, FiPackage, FiAlertCircle, FiCalendar, FiCheck, FiClock, FiArrowRight, FiFileText, FiUser } from "react-icons/fi";
import "../../styles/PainelPorteiro.css";

function PainelPorteiro() {
    const [abaAtiva, setAbaAtiva] = useState("entregas");
    const navigate = useNavigate();
    const toast = useToast();

    // --- DADOS ---
    const [encomendas, setEncomendas] = useState([]);
    const [reclamacoes, setReclamacoes] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [filtroTipoSol, setFiltroTipoSol] = useState("TODOS");
    const [filtroStatusSol, setFiltroStatusSol] = useState("TODOS");
    const [carregando, setCarregando] = useState(true);

    // --- NOVA ENCOMENDA ---
    const [descricaoEncomenda, setDescricaoEncomenda] = useState("");
    const [idUnidadeEncomenda, setIdUnidadeEncomenda] = useState("");
    const [enviandoEncomenda, setEnviandoEncomenda] = useState(false);

    // --- MEU PERFIL ---
    const [meuNome, setMeuNome] = useState("");
    const [meuEmail, setMeuEmail] = useState("");
    const [meuTelefone, setMeuTelefone] = useState("");
    const [salvandoPerfil, setSalvandoPerfil] = useState(false);

    // --- TEMA ---
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.setAttribute("dark-theme", "dark");
            localStorage.setItem("theme", "dark");
        }

        else {
            root.removeAttribute("dark-theme");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    const perfil = JSON.parse(localStorage.getItem("perfilUsuario") || "{}");

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        setCarregando(true);
        try {
            const [resEncomendas, resReclamacoes, resReservas, resUnidades, resSolicitacoes] = await Promise.all([
                api.get("/encomendas").catch(() => ({ data: [] })),
                api.get("/api/reclamacoes").catch(() => ({ data: { conteudo: [] } })),
                api.get("/reservas/todas").catch(() => ({ data: [] })),
                api.get("/unidades").catch(() => ({ data: [] })),
                api.get("/api/solicitacoes").catch(() => ({ data: { conteudo: [] } })),
            ]);

            setEncomendas(resEncomendas.data || []);
            setReclamacoes(resReclamacoes.data.conteudo || resReclamacoes.data || []);
            setReservas(resReservas.data || []);
            setUnidades(resUnidades.data || []);
            setSolicitacoes(resSolicitacoes.data.conteudo || resSolicitacoes.data || []);
        }

        catch (err) {
            console.error("Erro ao carregar dados:", err);
        }

        finally {
            setCarregando(false);
        }
    }

    // --- ENTREGAS ---
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
        }

        catch (err) {
            console.error("Erro ao registrar encomenda:", err);
            toast.erro("Erro ao registrar encomenda.", "Falha");
        }

        finally {
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

    // --- MEU PERFIL: CARREGAR ---
    async function carregarMeuPerfilPorteiro() {
        try {
            const res = await api.get("/perfil");
            const p = res.data;
            setMeuNome(p.nome || "");
            setMeuEmail(p.email || "");
            setMeuTelefone(formatarTelefone(p.telefone || ""));
        } 
        
        catch (err) {
            console.error("Erro ao carregar perfil:", err);
        }
    }

    function formatarTelefone(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);
        return numeros
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }

    async function salvarPerfilPorteiro(e) {
        e.preventDefault();
        setSalvandoPerfil(true);
        try {
            const res = await api.patch("/perfil/atualizar-cadastro", {
                nome: meuNome.trim(),
                email: meuEmail.trim(),
                telefone: meuTelefone.replace(/\D/g, ""),
            });
            localStorage.setItem("perfilUsuario", JSON.stringify(res.data));
            toast.sucesso("Cadastro atualizado com sucesso!");
        } 
        
        catch (err) {
            console.error("Erro ao salvar perfil:", err);
            toast.erro(err.response?.data?.erro || "Erro ao atualizar cadastro.");
        } 
        
        finally {
            setSalvandoPerfil(false);
        }
    }

    // --- LOGOUT ---
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("perfilUsuario");
        navigate("/login");
    }

    // --- HELPERS ---
    function formatarData(dataString) {
        if (!dataString) {
            return "—";
        }
        const data = new Date(dataString);
        return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }

    function formatarDataCurta(dataString) {
        if (!dataString) {
            return "—";
        }
        return new Date(dataString).toLocaleDateString("pt-BR");
    }

    // --- CONTADORES ---
    const encomendasPendentes = encomendas.filter(e => e.status === "AGUARDANDO_RETIRADA").length;
    const encomendasRetiradas = encomendas.filter(e => e.status === "RETIRADO").length;
    const reclamacoesPendentes = reclamacoes.filter(r => r.status === "PENDENTE").length;
    const reservasHoje = reservas.filter(r => {
        const hoje = new Date().toISOString().split("T")[0];
        return r.dataReserva === hoje;
    }).length;

    const solicitacoesPendentes = solicitacoes.filter(s => s.status === "PENDENTE").length;

    return (
        <div className="painel-porteiro">
            {/* --- SIDEBAR --- */}
            <aside className="sidebar-porteiro">
                <div className="sidebar-logo">
                    <h2>Residencial Boca de Pedreiro</h2>
                    <span>Portaria</span>
                </div>

                <ul className="sidebar-menu">
                    <li>
                        <button
                            className={abaAtiva === "entregas" ? "ativo" : ""}
                            onClick={() => setAbaAtiva("entregas")}
                        >
                            <FiPackage /> Entregas
                            {encomendasPendentes > 0 && (
                                <span className="badge-count">{encomendasPendentes}</span>
                            )}
                        </button>
                    </li>

                    <li>
                        <button
                            className={abaAtiva === "reclamacoes" ? "ativo" : ""}
                            onClick={() => setAbaAtiva("reclamacoes")}
                        >
                            <FiAlertCircle /> Reclamações
                            {reclamacoesPendentes > 0 && (
                                <span className="badge-count">{reclamacoesPendentes}</span>
                            )}
                        </button>
                    </li>

                    <li>
                        <button
                            className={abaAtiva === "reservas" ? "ativo" : ""}
                            onClick={() => setAbaAtiva("reservas")}
                        >
                            <FiCalendar /> Reservas
                            {reservasHoje > 0 && (
                                <span className="badge-count">{reservasHoje}</span>
                            )}
                        </button>
                    </li>

                    <li>
                        <button
                            className={abaAtiva === "solicitacoes" ? "ativo" : ""}
                            onClick={() => setAbaAtiva("solicitacoes")}
                        >
                            <FiFileText /> Solicitações
                            {solicitacoesPendentes > 0 && (
                                <span className="badge-count">{solicitacoesPendentes}</span>
                            )}
                        </button>
                    </li>
                    <li style={{ borderTop: "1px solid var(--border-color)", marginTop: "8px", paddingTop: "8px" }}>
                        <button
                            className={abaAtiva === "meu-cadastro" ? "ativo" : ""}
                            onClick={() => { setAbaAtiva("meu-cadastro"); carregarMeuPerfilPorteiro(); }}
                        >
                            <FiUser /> Meu Cadastro
                        </button>
                    </li>
                </ul>

                <div className="sidebar-logout">
                    <button onClick={handleLogout}>Sair</button>
                </div>
            </aside>

            {/* --- CONTEÚDO --- */}
            <div className="conteudo-porteiro">
                <header className="header-porteiro">
                    <h1>
                        {abaAtiva === "entregas" && "Entregas / Encomendas"}
                        {abaAtiva === "reclamacoes" && "Reclamações"}
                        {abaAtiva === "reservas" && "Reservas de Áreas"}
                        {abaAtiva === "solicitacoes" && "Solicitações dos Moradores"}
                        {abaAtiva === "meu-cadastro" && "Meu Cadastro"}
                    </h1>

                    <div className="header-acoes">
                        <span className="header-nome">Olá, {perfil.nome || "Porteiro"}</span>
                        <button className="btn-tema" onClick={alternarTema} aria-label="Alternar Tema">
                            {isDarkMode ? <FiSun /> : <FiMoon />}
                        </button>
                    </div>
                </header>

                <div className="corpo-porteiro">
                    {carregando ? (
                        <p className="msg-vazia">Carregando dados...</p>
                    ) : (
                        <>
                            {abaAtiva === "entregas" && renderEntregas()}
                            {abaAtiva === "reclamacoes" && renderReclamacoes()}
                            {abaAtiva === "reservas" && renderReservas()}
                            {abaAtiva === "solicitacoes" && renderSolicitacoesPorteiro()}
                            {abaAtiva === "meu-cadastro" && renderMeuCadastroPorteiro()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    function renderEntregas() {
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

    function renderReclamacoes() {
        return (
            <>
                <div className="porteiro-resumo">
                    <div className="resumo-card pendente">
                        <FiClock />
                        <div>
                            <span className="resumo-valor">{reclamacoes.filter(r => r.status === "PENDENTE").length}</span>
                            <span className="resumo-label">Pendentes</span>
                        </div>
                    </div>

                    <div className="resumo-card analise">
                        <FiAlertCircle />
                        <div>
                            <span className="resumo-valor">{reclamacoes.filter(r => r.status === "EM_ANALISE").length}</span>
                            <span className="resumo-label">Em Análise</span>
                        </div>
                    </div>

                    <div className="resumo-card retirado">
                        <FiCheck />
                        <div>
                            <span className="resumo-valor">{reclamacoes.filter(r => r.status === "RESOLVIDA").length}</span>
                            <span className="resumo-label">Resolvidas</span>
                        </div>
                    </div>
                </div>

                <h3 className="porteiro-subtitulo">Reclamações do Condomínio</h3>
                {reclamacoes.length === 0 ? (
                    <p className="msg-vazia">Nenhuma reclamação registrada.</p>
                ) : (
                    <div className="porteiro-lista">
                        {reclamacoes.map(rec => (
                            <div key={rec.id} className="porteiro-card">
                                <div className="porteiro-card-info">
                                    <div className="porteiro-card-icone icone-reclamacao">
                                        <FiAlertCircle />
                                    </div>

                                    <div className="porteiro-card-dados">
                                        <h4>{rec.tipo || rec.categoria || "Reclamação"}</h4>
                                        <p className="porteiro-card-desc">{rec.descricao}</p>
                                        <div className="porteiro-card-meta">
                                            <span>Unidade: {rec.unidade || "—"}</span>
                                            <span>{formatarData(rec.dataCriacao)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="porteiro-card-acoes">
                                    <span className={`badge-status ${
                                        rec.status === "RESOLVIDA" ? "badge-verde" :
                                        rec.status === "EM_ANALISE" ? "badge-azul" : "badge-amarelo"
                                    }`}>
                                        {
                                            rec.status === "RESOLVIDA" ? "Resolvida" :
                                            rec.status === "EM_ANALISE" ? "Em Análise" : "Pendente"
                                        }
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }

    function renderReservas() {
        const hoje = new Date().toISOString().split("T")[0];
        const reservasHojeList = reservas.filter(r => r.dataReserva === hoje);
        const reservasFuturas = reservas.filter(r => r.dataReserva > hoje);
        const reservasPassadas = reservas.filter(r => r.dataReserva < hoje);

        return (
            <>
                <div className="porteiro-resumo">
                    <div className="resumo-card pendente">
                        <FiCalendar />
                        <div>
                            <span className="resumo-valor">{reservasHojeList.length}</span>
                            <span className="resumo-label">Hoje</span>
                        </div>
                    </div>

                    <div className="resumo-card analise">
                        <FiClock />
                        <div>
                            <span className="resumo-valor">{reservasFuturas.length}</span>
                            <span className="resumo-label">Próximas</span>
                        </div>
                    </div>

                    <div className="resumo-card retirado">
                        <FiCheck />
                        <div>
                            <span className="resumo-valor">{reservasPassadas.length}</span>
                            <span className="resumo-label">Concluídas</span>
                        </div>
                    </div>
                </div>

                {reservasHojeList.length > 0 && (
                    <>
                        <h3 className="porteiro-subtitulo destaque">Reservas de Hoje</h3>
                        <div className="porteiro-lista">
                            {reservasHojeList.map(res => renderCardReserva(res))}
                        </div>
                    </>
                )}

                {reservasFuturas.length > 0 && (
                    <>
                        <h3 className="porteiro-subtitulo">Próximas Reservas</h3>
                        <div className="porteiro-lista">
                            {reservasFuturas.map(res => renderCardReserva(res))}
                        </div>
                    </>
                )}

                {reservasPassadas.length > 0 && (
                    <>
                        <h3 className="porteiro-subtitulo">Reservas Anteriores</h3>
                        <div className="porteiro-lista">
                            {reservasPassadas.map(res => renderCardReserva(res))}
                        </div>
                    </>
                )}

                {reservas.length === 0 && (
                    <p className="msg-vazia">Nenhuma reserva encontrada.</p>
                )}
            </>
        );
    }

    function renderMeuCadastroPorteiro() {
        return (
            <div className="porteiro-form-card">
                <h3><FiUser /> Atualizar Meu Cadastro</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "16px" }}>
                    Atualize seus dados pessoais abaixo.
                </p>

                <form className="porteiro-form" onSubmit={salvarPerfilPorteiro} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                                Nome completo
                            </label>
                            <input
                                type="text"
                                value={meuNome}
                                onChange={(e) => setMeuNome(e.target.value)}
                                placeholder="Seu nome"
                                required
                                style={{
                                    padding: "10px 14px",
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
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={meuEmail}
                                onChange={(e) => setMeuEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                style={{
                                    padding: "10px 14px",
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
                                Telefone
                            </label>
                            <input
                                type="text"
                                value={meuTelefone}
                                onChange={(e) => setMeuTelefone(formatarTelefone(e.target.value))}
                                placeholder="(00) 00000-0000"
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: "8px",
                                    border: "1px solid var(--border-color)",
                                    background: "var(--bg-input, var(--bg-card))",
                                    color: "var(--text-primary)",
                                    fontSize: "0.9rem"
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-registrar"
                        disabled={salvandoPerfil}
                        style={{ 
                            alignSelf: "flex-start", 
                            marginTop: "8px" 
                        }}
                    >
                        {salvandoPerfil ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </form>
            </div>
        );
    }

    function renderSolicitacoesPorteiro() {
        const pendentes = solicitacoes.filter(s => s.status === "PENDENTE").length;
        const emAnalise = solicitacoes.filter(s => s.status === "EM_ANALISE").length;
        const aprovadas = solicitacoes.filter(s => s.status === "APROVADO").length;
        const recusadas = solicitacoes.filter(s => s.status === "RECUSADO").length;

        const filtradas = solicitacoes.filter(s => {
            const passaTipo = filtroTipoSol === "TODOS" || s.tipo === filtroTipoSol;
            const passaStatus = filtroStatusSol === "TODOS" || s.status === filtroStatusSol;
            return passaTipo && passaStatus;
        });

        function getNomeTipo(tipo) {
            switch (tipo) {
                case "OBRA":
                    return "Obra";
                case "MUDANCA":
                    return "Mudança";
                case "ENTREGA":
                    return "Entrega";
                case "PRESTADOR":
                    return "Prestador";
                default:
                    return tipo;
            }
        }

        function getIconeTipo(tipo) {
            switch (tipo) {
                case "OBRA":
                    return "";
                case "MUDANCA":
                    return "";
                case "ENTREGA":
                    return "";
                case "PRESTADOR":
                    return "";
                default:
                    return "";
            }
        }

        function getCorTipo(tipo) {
            switch (tipo) {
                case "OBRA":
                    return "#e67e22";
                case "MUDANCA":
                    return "#3498db";
                case "ENTREGA":
                    return "#2ecc71";
                case "PRESTADOR":
                    return "#9b59b6";
                default:
                    return "#888";
            }
        }

        return (
            <>
                {/* Resumo */}
                <div className="porteiro-resumo">
                    <div className="resumo-card pendente">
                        <FiClock />
                        <div>
                            <span className="resumo-valor">{pendentes}</span>
                            <span className="resumo-label">Pendentes</span>
                        </div>
                    </div>

                    <div className="resumo-card analise">
                        <FiAlertCircle />
                        <div>
                            <span className="resumo-valor">{emAnalise}</span>
                            <span className="resumo-label">Em Análise</span>
                        </div>
                    </div>

                    <div className="resumo-card retirado">
                        <FiCheck />
                        <div>
                            <span className="resumo-valor">{aprovadas}</span>
                            <span className="resumo-label">Aprovadas</span>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "16px 0" }}>
                    {["TODOS", "OBRA", "MUDANCA", "ENTREGA", "PRESTADOR"].map(t => (
                        <button
                            key={t}
                            onClick={() => setFiltroTipoSol(t)}
                            style={{
                                padding: "6px 14px", 
                                borderRadius: "20px",
                                border: filtroTipoSol === t ? "2px solid var(--primary-green)" : "1px solid var(--border-color)",
                                background: filtroTipoSol === t ? "rgba(46,204,113,0.12)" : "transparent",
                                color: filtroTipoSol === t ? "var(--primary-green)" : "var(--text-secondary)",
                                cursor: "pointer", 
                                fontSize: "0.85rem",
                                fontWeight: filtroTipoSol === t ? "600" : "400"
                            }}
                        >
                            {t === "TODOS" ? "Todos" : `${getIconeTipo(t)} ${getNomeTipo(t)}`}
                        </button>
                    ))}

                    <span style={{ width: "1px", background: "var(--border-color)", margin: "0 4px" }} />

                    {["TODOS", "PENDENTE", "EM_ANALISE", "APROVADO", "RECUSADO"].map(s => (
                        <button
                            key={s}
                            onClick={() => setFiltroStatusSol(s)}
                            style={{
                                padding: "6px 14px", borderRadius: "20px",
                                border: filtroStatusSol === s ? "2px solid var(--primary-green)" : "1px solid var(--border-color)",
                                background: filtroStatusSol === s ? "rgba(46,204,113,0.12)" : "transparent",
                                color: filtroStatusSol === s ? "var(--primary-green)" : "var(--text-secondary)",
                                cursor: "pointer", fontSize: "0.85rem",
                                fontWeight: filtroStatusSol === s ? "600" : "400"
                            }}
                        >
                            {
                                s === "TODOS" ? "Todos Status" :
                                s === "PENDENTE" ? "Pendente" :
                                s === "EM_ANALISE" ? "Em Análise" :
                                s === "APROVADO" ? "Aprovado" : "Recusado"
                            }
                        </button>
                    ))}
                </div>

                <h3 className="porteiro-subtitulo">
                    Solicitações dos Moradores ({filtradas.length})
                </h3>

                {/* Lista - somente visualização */}
                {filtradas.length === 0 ? (
                    <p className="msg-vazia">Nenhuma solicitação encontrada.</p>
                ) : (
                    <div className="porteiro-lista">
                        {filtradas
                            .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
                            .map(sol => (
                            <div key={sol.id} className="porteiro-card" style={{ borderLeft: `4px solid ${getCorTipo(sol.tipo)}` }}>
                                <div className="porteiro-card-info">
                                    <div className="porteiro-card-icone" style={{ color: getCorTipo(sol.tipo) }}>
                                        <FiFileText />
                                    </div>

                                    <div className="porteiro-card-dados">
                                        <h4>{getIconeTipo(sol.tipo)} {sol.titulo}</h4>
                                        <p className="porteiro-card-desc">{sol.descricao}</p>
                                        <div className="porteiro-card-meta">
                                            <span>
                                                Tipo: {getNomeTipo(sol.tipo)}
                                            </span>

                                            <span>
                                                Data prevista: {sol.dataPrevista ? new Date(sol.dataPrevista + "T00:00:00").toLocaleDateString("pt-BR") : "—"}
                                            </span>

                                            <span>
                                                {sol.nomeMorador || "—"}
                                            </span>

                                            <span>
                                                {sol.apartamentoMorador || sol.unidade || "—"}
                                            </span>

                                            <span>
                                                Criada em: {formatarData(sol.dataCriacao)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="porteiro-card-acoes">
                                    <span className={`badge-status ${
                                        sol.status === "APROVADO" ? "badge-verde" :
                                        sol.status === "EM_ANALISE" ? "badge-azul" :
                                        sol.status === "RECUSADO" ? "badge-vermelho" :
                                        "badge-amarelo"
                                    }`}>
                                        {
                                            sol.status === "PENDENTE" ? "Pendente" :
                                            sol.status === "EM_ANALISE" ? "Em Análise" :
                                            sol.status === "APROVADO" ? "Aprovado" : "Recusado"
                                        }
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }

    function renderCardReserva(res) {
        return (
            <div key={res.id} className="porteiro-card">
                <div className="porteiro-card-info">
                    <div className="porteiro-card-icone icone-reserva">
                        <FiCalendar />
                    </div>

                    <div className="porteiro-card-dados">
                        <h4>{res.nomeAreaLazer}</h4>
                        <div className="porteiro-card-meta">
                            <span>{res.nomeMorador}</span>
                            <span>Bloco {res.bloco} — Apto {res.numeroApto}</span>
                            <span>{formatarDataCurta(res.dataReserva)}</span>
                        </div>
                    </div>
                </div>
                <div className="porteiro-card-acoes">
                    <span className={`badge-status ${
                        res.status === "CONFIRMADA" ? "badge-verde" :
                        res.status === "CANCELADA" ? "badge-vermelho" : "badge-amarelo"
                    }`}>
                        {
                            res.status === "CONFIRMADA" ? "Confirmada" :
                            res.status === "CANCELADA" ? "Cancelada" : "Pendente"
                        }
                    </span>
                </div>
            </div>
        );
    }
}

export default PainelPorteiro;
