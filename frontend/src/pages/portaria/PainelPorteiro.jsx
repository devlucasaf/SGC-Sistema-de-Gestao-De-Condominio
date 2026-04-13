import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../components/Toast";
import { FiSun, FiMoon, FiPackage, FiAlertCircle, FiCalendar, FiCheck, FiClock, FiArrowRight } from "react-icons/fi";
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
    const [carregando, setCarregando] = useState(true);

    // --- NOVA ENCOMENDA ---
    const [descricaoEncomenda, setDescricaoEncomenda] = useState("");
    const [idUnidadeEncomenda, setIdUnidadeEncomenda] = useState("");
    const [enviandoEncomenda, setEnviandoEncomenda] = useState(false);

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
            const [resEncomendas, resReclamacoes, resReservas, resUnidades] = await Promise.all([
                api.get("/encomendas").catch(() => ({ data: [] })),
                api.get("/api/reclamacoes").catch(() => ({ data: { conteudo: [] } })),
                api.get("/reservas/todas").catch(() => ({ data: [] })),
                api.get("/unidades").catch(() => ({ data: [] })),
            ]);

            setEncomendas(resEncomendas.data || []);
            setReclamacoes(resReclamacoes.data.conteudo || resReclamacoes.data || []);
            setReservas(resReservas.data || []);
            setUnidades(resUnidades.data || []);
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
                                        {rec.status === "RESOLVIDA" ? "Resolvida" :
                                         rec.status === "EM_ANALISE" ? "Em Análise" : "Pendente"}
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
                        {res.status === "CONFIRMADA" ? "Confirmada" :
                         res.status === "CANCELADA" ? "Cancelada" : "Pendente"}
                    </span>
                </div>
            </div>
        );
    }
}

export default PainelPorteiro;
