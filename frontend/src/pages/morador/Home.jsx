import React, { useState, useEffect }   from    "react";
import { useNavigate, Link }            from    "react-router-dom";
import  DatePicker, { registerLocale }  from    "react-datepicker";
import  { ptBR }                        from    "date-fns/locale";

import  api         from    "../../services/api.js";
import  Loading     from    "../../components/Loading";

import "react-datepicker/dist/react-datepicker.css";
import "../../styles/Home.css";

import { FiUser, FiSettings, FiHome, FiLogOut, FiMoon, FiSun, FiLock, FiMessageSquare, FiFileText, FiPackage, FiCalendar, FiAlertTriangle, FiClock, FiTool } from "react-icons/fi";

registerLocale("pt-BR", ptBR);

function Home() {
    const [avisos   ,       setAvisos          ]   = useState([]);
    const [perfil   ,       setPerfil          ]   = useState({});
    const [historico,       setHistorico       ]   = useState([]);

    const [carregando,      setCarregando      ]   = useState(true);
    const [menuAberto,      setMenuAberto      ]   = useState(false);

    // --- CALENDÁRIO ---
    const [dataSelecionada, setDataSelecionada ] = useState(new Date());
    const [datasReservas,   setDatasReservas   ] = useState([]);
    const [datasManutencoes,setDatasManutencoes] = useState([]);
    const [eventosNoDia,    setEventosNoDia    ] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const dados = localStorage.getItem("perfilUsuario");
        if (dados) {
            const perfilLocal = JSON.parse(dados);
            setPerfil(perfilLocal);
        }

        const atualizarPerfil = async () => {
            try {
                const resposta = await api.get("/perfil");
                setPerfil(resposta.data);
                localStorage.setItem("perfilUsuario", JSON.stringify(resposta.data));
            } catch (err) {
                console.error("Erro ao atualizar perfil:", err);
            }
        };
        atualizarPerfil();
    }, []);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("perfilUsuario");
        navigate("/login");
    }

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    useEffect(() => {
        const root = document.documentElement;

        if (isDarkMode) {
            root.setAttribute("dark-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.removeAttribute("dark-theme");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    useEffect(() => {
        const buscarAvisos = async () => {
            try {
                const resposta = await api.get("/avisos");
                setAvisos(resposta.data);
            } catch (error) {
                console.error("Erro ao buscar avisos:", error);
            } finally {
                setCarregando(false);
            }
        };

        buscarAvisos();
    }, []);

    // --- BUSCAR DADOS DO CALENDÁRIO ---
    useEffect(() => {
        async function buscarCalendario() {
            try {
                const [resReservas, resManutencoes] = await Promise.all([
                    api.get("/reservas/minhas-reservas").catch(() => ({ data: [] })),
                    api.get("/api/manutencoes/proximas").catch(() => ({ data: [] })),
                ]);

                const reservas = (resReservas.data || []).filter(r => r.status !== "CANCELADA");
                const manutencoes = resManutencoes.data || [];

                setDatasReservas(reservas.map(r => ({
                    data: new Date(r.dataReserva + "T00:00:00"),
                    nome: r.nomeAreaLazer,
                    horaInicio: r.horaInicio,
                    horaFim: r.horaFim,
                })));

                setDatasManutencoes(manutencoes.map(m => ({
                    data: new Date(m.dataInicio),
                    titulo: m.titulo,
                    tipo: m.tipo,
                })));
            } catch (err) {
                console.error("Erro ao buscar calendário:", err);
            }
        }
        buscarCalendario();
    }, []);

    // --- EVENTOS NO DIA SELECIONADO ---
    useEffect(() => {
        const diaStr = dataSelecionada.toISOString().split("T")[0];
        const eventos = [];

        datasReservas.forEach(r => {
            if (r.data.toISOString().split("T")[0] === diaStr) {
                eventos.push({
                    tipo: "reserva",
                    texto: `Reserva: ${r.nome}${r.horaInicio ? ` (${r.horaInicio.substring(0,5)} - ${r.horaFim.substring(0,5)})` : ""
                    }`
                });
            }
        });

        datasManutencoes.forEach(m => {
            if (m.data.toISOString().split("T")[0] === diaStr) {
                eventos.push({ tipo: "manutencao", texto: `Manutenção: ${m.titulo}` });
            }
        });

        setEventosNoDia(eventos);
    }, [dataSelecionada, datasReservas, datasManutencoes]);

    // --- BUSCAR HISTÓRICO DE AÇÕES ---
    useEffect(() => {
        async function buscarHistorico() {
            try {
                const [resSolicitacoes, resInfracoes, resReservas, resEncomendas] = await Promise.all([
                    api.get("/api/solicitacoes/minhas").catch(()    => ({ data: { conteudo: [] } })),
                    api.get("/api/infracoes/minhas").catch(()       => ({ data: [] })),
                    api.get("/reservas/minhas-reservas").catch(()   => ({ data: [] })),
                    api.get("/encomendas").catch(()                 => ({ data: [] })),
                ]);

                const eventos = [];

                // --- SOLICITAÇÕES ---
                const solicitacoes = resSolicitacoes.data?.conteudo || resSolicitacoes.data || [];
                solicitacoes.forEach(s => {
                    const tipoLabel = { 
                        OBRA: "obra", 
                        MUDANCA: "mudança", 
                        ENTREGA: "entrega", 
                        PRESTADOR: "prestador" 
                    };

                    const statusLabel = { 
                        PENDENTE: "está pendente", 
                        EM_ANALISE: "está em análise", 
                        APROVADO: "foi aprovada", 
                        RECUSADO: "foi recusada" 
                    };

                    eventos.push({
                        id: `sol-${s.id}`,
                        tipo: "solicitacao",
                        icone: <FiFileText />,
                        mensagem: `Sua solicitação de ${tipoLabel[s.tipo] || s.tipo} "${s.titulo}" ${statusLabel[s.status] || s.status}.`,
                        status: s.status,
                        data: s.dataCriacao || s.data,
                    });
                });

                // --- INFRAÇÕES ---
                const infracoes = resInfracoes.data || [];
                infracoes.forEach(inf => {
                    const tipoLabel = inf.tipo === "MULTA" ? "Multa" : "Advertência";
                    const statusLabel = { 
                        PENDENTE: "pendente", 
                        PAGA: "paga", 
                        CONTESTADA: "contestada", 
                        CANCELADA: "cancelada" 
                    };

                    eventos.push({
                        id: `inf-${inf.id}`,
                        tipo: "infracao",
                        icone: <FiAlertTriangle />,
                        mensagem: `${tipoLabel} registrada: "${inf.motivo}" — Status: ${statusLabel[inf.status] || inf.status}.`,
                        status: inf.status,
                        data: inf.dataCriacao || inf.dataInfracao,
                    });
                });

                // --- RESERVAS ---
                const reservas = resReservas.data || [];
                reservas.forEach(r => {
                    const statusLabel = { 
                        APROVADA: "foi confirmada", 
                        CANCELADA: "foi cancelada", 
                        PENDENTE: "está pendente" 
                    };

                    eventos.push({
                        id: `res-${r.id}`,
                        tipo: "reserva",
                        icone: <FiCalendar />,
                        mensagem: `Sua reserva em "${r.nomeAreaLazer}" para ${new Date(r.dataReserva + "T00:00:00").toLocaleDateString("pt-BR")} ${statusLabel[r.status] || r.status}.`,
                        status: r.status,
                        data: r.dataReserva,
                    });
                });

                // --- ENCOMENDAS ---
                const encomendas = resEncomendas.data || [];
                const perfilLocal = JSON.parse(localStorage.getItem("perfilUsuario") || "{}");
                encomendas
                    .filter(e => e.nomeMorador === perfilLocal.nome)
                    .forEach(e => {
                        const retirada = e.status === "RETIRADA" || e.dataRetirada;
                        eventos.push({
                            id: `enc-${e.id}`,
                            tipo: "encomenda",
                            icone: <FiPackage />,
                            mensagem: retirada
                                ? `Encomenda "${e.descricao || "pacote"}" foi retirada.`
                                : `Nova encomenda "${e.descricao || "pacote"}" registrada para você na portaria.`,
                            status: retirada ? "RETIRADA" : "PENDENTE",
                            data: e.dataRetirada || e.dataRecebimento || e.dataCriacao,
                        });
                    });

                // --- ORDENAR POR DATA MAIS RECENTE ---
                eventos.sort((a, b) => {
                    const da = new Date(a.data || 0);
                    const db = new Date(b.data || 0);
                    return db - da;
                });

                setHistorico(eventos.slice(0, 15));
            } catch (err) {
                console.error("Erro ao buscar histórico:", err);
            }
        }

        buscarHistorico();
    }, []);

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="navbar-logo">
                    <h2>Residencial Boca de Pedreiro</h2>
                </div>

                <ul className="navbar-links">
                    {perfil.tipoMorador !== "Dependente" && (
                        <li><Link to="/boleto">Boleto</Link></li>
                    )}
                    <li><Link to="/reserva">Reserva</Link></li>
                    <li><Link to="/entregas">Entrega</Link></li>
                    <li><Link to="/reclamacao">Reclamação</Link></li>
                    <li><Link to="/solicitacoes">Solicitações</Link></li>
                    <li><Link to="/minhas-infracoes">Multas</Link></li>
                    <li><Link to="/documentos">Documentos</Link></li>
                    <li><Link to="/votacao">Votação</Link></li>
                </ul>

                <div className="acoes-usuario">
                    <button
                        className="btn-tema"
                        onClick={alternarTema}
                        aria-label="Alternar Tema"
                    >
                        {isDarkMode ? <FiSun /> : <FiMoon />}
                    </button>

                    <div className="perfil-container">
                        <button
                            className="btn-avatar"
                            onClick={() => setMenuAberto(!menuAberto)}
                            aria-label="Menu de perfil"
                        >
                            <FiUser className="icon-avatar" />
                        </button>

                        {menuAberto && (
                            <div className="menu-dropdown">
                                <div className="dropdown-perfil-info">
                                    <p className="dropdown-perfil-nome">{perfil.nome || "Usuário"}</p>
                                    <p className="dropdown-perfil-detalhe">{perfil.detalheExtra || ""}</p>
                                </div>

                                <hr className="dropdown-divisor" />

                                <Link to="/atualizar-cadastro" className="dropdown-item">
                                    <FiSettings className="dropdown-icon" /> Atualizar Cadastro
                                </Link>

                                <Link to="/minha-unidade" className="dropdown-item">
                                    <FiHome className="dropdown-icon" /> Minha Unidade
                                </Link>

                                <Link to="/alterar-senha" className="dropdown-item">
                                    <FiLock className="dropdown-icon" /> Alterar Senha
                                </Link>

                                <hr className="dropdown-divisor" />

                                <button 
                                    onClick={handleLogout} 
                                    className="dropdown-item sair" 
                                    style={{ 
                                        background: "none", 
                                        border: "none", 
                                        cursor: "pointer", 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: "8px", 
                                        width: "100%", 
                                        fontSize: "inherit", 
                                        color: "inherit", 
                                        padding: "8px 12px" 
                                    }}>
                                    <FiLogOut className="dropdown-icon" /> Sair
                                </button>
                            </div>
                        )}
                    </div> 
                </div> 
            </nav>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            <main className="home-conteudo">
                <div className="frame-comunicados">
                    <h2 className="comunicados-titulo">Mural de Avisos</h2>
                    {carregando ? (
                        <Loading mensagem="Buscando avisos..." />
                    ) : avisos.length === 0 ? (
                        <p className="sem-avisos">Nenhum aviso publicado no momento.</p>
                    ) : (
                        avisos.map((aviso) => (
                            <div key={aviso.id} className="cartao-aviso">
                                <div className="aviso-cabecalho">
                                    <h3>{aviso.titulo}</h3>

                                    <span className="aviso-data">
                                        {new Date(aviso.dataCriacao).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                </div>

                                <p className="aviso-mensagem">{aviso.mensagem}</p>
                                <p className="aviso-autor">Publicado por: <strong>{aviso.nomeSindico}</strong></p>
                            </div>
                        ))
                    )}
                </div>

                {/* --- CALENDÁRIO DE EVENTOS --- */}
                <div className="frame-comunicados" style={{ marginTop: "24px" }}>
                    <h2 className="comunicados-titulo">
                        <FiCalendar style={{ marginRight: "8px", verticalAlign: "middle" }} />
                        Calendário de Eventos
                    </h2>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
                        <div>
                            <DatePicker
                                selected={dataSelecionada}
                                onChange={(date) => setDataSelecionada(date)}
                                inline
                                locale="pt-BR"
                                calendarClassName="datepicker-calendario"
                                dayClassName={(date) => {
                                    const dStr = date.toISOString().split("T")[0];
                                    const temReserva = datasReservas.some(r => r.data.toISOString().split("T")[0] === dStr);
                                    const temManutencao = datasManutencoes.some(m => m.data.toISOString().split("T")[0] === dStr);
                                    if (temReserva && temManutencao) return "calendario-ambos";
                                    if (temReserva) return "calendario-reserva";
                                    if (temManutencao) return "calendario-manutencao";
                                    return undefined;
                                }}
                            />
                            <div style={{ display: "flex", gap: "14px", marginTop: "10px", fontSize: "0.78rem" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#2ecc71", display: "inline-block" }}></span>
                                    Reservas
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f39c12", display: "inline-block" }}></span>
                                    Manutenções
                                </span>
                            </div>
                        </div>

                        <div style={{ flex: 1, minWidth: "200px" }}>
                            <h4 style={{ margin: "0 0 10px", color: "var(--text-primary)", fontSize: "0.95rem" }}>
                                Eventos em {dataSelecionada.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                            </h4>
                            {eventosNoDia.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Nenhum evento neste dia.</p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {eventosNoDia.map((ev, i) => (
                                        <div key={i} style={{
                                            padding: "10px 14px",
                                            borderRadius: "8px",
                                            borderLeft: `4px solid ${ev.tipo === "reserva" ? "#2ecc71" : "#f39c12"}`,
                                            background: ev.tipo === "reserva" ? "rgba(46,204,113,0.08)" : "rgba(243,156,18,0.08)",
                                            fontSize: "0.85rem",
                                            color: "var(--text-primary)",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        }}>
                                            {ev.tipo === "reserva" ? <FiCalendar style={{ color: "#2ecc71" }} /> : <FiTool style={{ color: "#f39c12" }} />}
                                            {ev.texto}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- HISTÓRICO DE AÇÕES --- */}
                <div className="frame-comunicados" style={{ marginTop: "24px" }}>
                    <h2 className="comunicados-titulo"><FiClock style={{ marginRight: "8px", verticalAlign: "middle" }} />Histórico de Ações</h2>
                    {historico.length === 0 ? (
                        <p className="sem-avisos">Nenhuma atividade recente encontrada.</p>
                    ) : (
                        <div className="timeline-container">
                            {historico.map((evento) => (
                                <div key={evento.id} className={`timeline-item timeline-${evento.tipo}`}>
                                    <div className={`timeline-icone timeline-icone-${evento.tipo}`}>
                                        {evento.icone}
                                    </div>
                                    <div className="timeline-conteudo">
                                        <p className="timeline-mensagem">{evento.mensagem}</p>
                                        <div className="timeline-rodape">
                                            <span className={`timeline-badge timeline-badge-${(evento.status || "").toLowerCase().replace("_", "-")}`}>
                                                {evento.status}
                                            </span>
                                            {evento.data && (
                                                <span className="timeline-data">
                                                    {new Date(evento.data + (evento.data.length === 10 ? "T00:00:00" : "")).toLocaleDateString("pt-BR", {
                                                        day: "2-digit", month: "2-digit", year: "numeric"
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;
