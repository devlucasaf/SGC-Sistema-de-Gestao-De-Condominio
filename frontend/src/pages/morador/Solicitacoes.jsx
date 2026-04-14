import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../services/api";
import { useToast } from "../../components/Toast";
import "../../styles/Entregas.css";
import "../../styles/Reclamacao.css";
import "../../styles/Solicitacoes.css";

import {
    FiSun, FiMoon, FiArrowLeft, FiSend, FiPlus,
    FiCalendar, FiFileText, FiClock, FiCheckCircle,
    FiXCircle, FiSearch, FiTruck, FiTool, FiPackage, FiUser
} from "react-icons/fi";

registerLocale("pt-BR", ptBR);

const TIPOS_SOLICITACAO = [
    {
        valor: "OBRA",
        nome: "Obra",
        IconeReact: FiTool,
        cor: "#e67e22"
    },
    {
        valor: "MUDANCA",
        nome: "Mudança",
        IconeReact: FiTruck,
        cor: "#3498db"
    },
    {
        valor: "ENTREGA",
        nome: "Entrega",
        IconeReact: FiPackage,
        cor: "#2ecc71"
    },
    {
        valor: "PRESTADOR",
        nome: "Prestador",
        IconeReact: FiUser,
        cor: "#9b59b6"
    },
];

function Solicitacoes() {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [filtroTipo, setFiltroTipo] = useState("TODOS");
    const [filtroStatus, setFiltroStatus] = useState("TODOS");
    const [enviando, setEnviando] = useState(false);
    const [carregando, setCarregando] = useState(true);

    // --- CAMPOS DO FORMULÁRIO ---
    const [tipo, setTipo] = useState("");
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataPrevista, setDataPrevista] = useState(null);

    const navigate = useNavigate();
    const toast = useToast();

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

    // --- BUSCAR SOLICITAÇÕES DO BACKEND ---
    useEffect(() => {
        buscarSolicitacoes();
    }, []);

    async function buscarSolicitacoes() {
        setCarregando(true);
        try {
            const response = await api.get("/api/solicitacoes/minhas");
            setSolicitacoes(response.data || []);
        }

        catch (error) {
            console.error("Erro ao buscar solicitações:", error);
            if (error.response?.status === 404 || error.response?.status === 500) {
                setSolicitacoes([]);
            }
        }

        finally {
            setCarregando(false);
        }
    }

    // --- ENVIAR NOVA SOLICITAÇÃO ---
    async function enviarSolicitacao(e) {
        e.preventDefault();

        if (!tipo) {
            toast.erro("Selecione o tipo da solicitação.", "Campo obrigatório");
            return;
        }

        setEnviando(true);

        const dados = {
            tipo,
            titulo,
            descricao,
            dataPrevista: dataPrevista
                ? dataPrevista.toISOString().split("T")[0]
                : null,
        };

        try {
            const response = await api.post("/api/solicitacoes", dados);
            toast.sucesso("Solicitação enviada com sucesso!", "Solicitação registrada");
            setSolicitacoes([response.data, ...solicitacoes]);
            limparFormulario();
        }

        catch (error) {
            console.error("Erro ao enviar solicitação:", error);
            const msg = error.response?.data?.erros?.join(", ")
                || error.response?.data?.message
                || "Erro ao enviar solicitação. Tente novamente.";
            toast.erro(msg, "Erro");
        }

        finally {
            setEnviando(false);
        }
    }

    function limparFormulario() {
        setTipo("");
        setTitulo("");
        setDescricao("");
        setDataPrevista(null);
        setMostrarFormulario(false);
    }

    // --- FILTROS ---
    const solicitacoesFiltradas = solicitacoes.filter((s) => {
        const passaTipo = filtroTipo === "TODOS" || s.tipo === filtroTipo;
        const passaStatus = filtroStatus === "TODOS" || s.status === filtroStatus;
        return passaTipo && passaStatus;
    });

    // --- HELPERS ---
    function getIconeTipo(tipoVal) {
        const found = TIPOS_SOLICITACAO.find(t => t.valor === tipoVal);
        return found ? found.icone : "📋";
    }

    function getNomeTipo(tipoVal) {
        const found = TIPOS_SOLICITACAO.find(t => t.valor === tipoVal);
        return found ? found.nome : tipoVal;
    }

    function formatarStatus(status) {
        switch (status) {
            case "PENDENTE":
                return "Pendente";
            case "EM_ANALISE":
                return "Em Análise";
            case "APROVADO":
                return "Aprovado";
            case "RECUSADO":
                return "Recusado";
            default:
                return status;
        }
    }

    function getIconeStatus(status) {
        switch (status) {
            case "PENDENTE":
                return <FiClock />;
            case "EM_ANALISE":
                return <FiSearch />;
            case "APROVADO":
                return <FiCheckCircle />;
            case "RECUSADO":
                return <FiXCircle />;
            default:
                return <FiClock />;
        }
    }

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className="entregas-container">
            {/* --- NAVBAR --- */}
            <nav className="navbar">
                <div className="navbar-logo">
                    <h2>Solicitações</h2>
                </div>

                <div className="perfil-container">
                    <button className="btn-tema" onClick={alternarTema} aria-label="Alternar Tema">
                        {isDarkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </div>
            </nav>

            <main className="entregas-conteudo">
                {/* --- BOTÃO VOLTAR + NOVA SOLICITAÇÃO --- */}
                <div
                    className="entregas-header"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px"
                    }}
                >
                    <button className="btn-voltar" onClick={() => navigate("/home")}>
                        <FiArrowLeft /> Voltar para Página Inicial
                    </button>

                    <button
                        className="btn-nova-solicitacao"
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    >
                        <FiPlus /> {mostrarFormulario ? "Cancelar" : "Nova Solicitação"}
                    </button>
                </div>

                {/* --- FORMULÁRIO NOVA SOLICITAÇÃO --- */}
                {mostrarFormulario && (
                    <div className="cartao-formulario fadeIn">
                        <h3>Nova Solicitação</h3>
                        <p>Informe a administração sobre eventos futuros no seu apartamento.</p>

                        <form onSubmit={enviarSolicitacao} className="form-solicitacao">
                            {/* --- SELEÇÃO DE TIPO --- */}
                            <div className="campo-form">
                                <label>Tipo da Solicitação:</label>
                                <div className="grupo-tipos-solicitacao">
                                    {TIPOS_SOLICITACAO.map((t) => (
                                        <button
                                            key={t.valor}
                                            type="button"
                                            className={`tipo-card ${tipo === t.valor ? "selecionado" : ""}`}
                                            onClick={() => setTipo(t.valor)}
                                        >
                                            <span className="tipo-card-icone">{t.icone}</span>
                                            <span className="tipo-card-nome">{t.nome}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {tipo && (
                                <div className="campos-dinamicos fadeIn">
                                    {/* --- TÍTULO --- */}
                                    <div className="campo-form">
                                        <label>Título:</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Reforma do banheiro"
                                            value={titulo}
                                            onChange={(e) => setTitulo(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* --- DESCRIÇÃO --- */}
                                    <div className="campo-form">
                                        <label>Descrição:</label>
                                        <textarea
                                            rows="4"
                                            placeholder="Descreva os detalhes da solicitação..."
                                            value={descricao}
                                            onChange={(e) => setDescricao(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>

                                    {/* --- DATA PREVISTA --- */}
                                    <div className="campo-form">
                                        <label><FiCalendar style={{ marginRight: "6px" }} /> Data Prevista:</label>
                                        <DatePicker
                                            selected={dataPrevista}
                                            onChange={(date) => setDataPrevista(date)}
                                            dateFormat="dd/MM/yyyy"
                                            locale="pt-BR"
                                            placeholderText="Selecione a data"
                                            minDate={new Date()}
                                            className="campo-datepicker"
                                            required
                                        />
                                    </div>

                                    {/* --- BOTÃO ENVIAR --- */}
                                    <button
                                        type="submit"
                                        className="btn-enviar-reclamacao"
                                        disabled={enviando}
                                    >
                                        <FiSend /> {enviando ? "Enviando..." : "Enviar Solicitação"}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                )}

                {/* --- FILTROS --- */}
                <div className="solicitacoes-filtros">
                    <button
                        className={`filtro-btn ${filtroTipo === "TODOS" ? "ativo" : ""}`}
                        onClick={() => setFiltroTipo("TODOS")}
                    >
                        Todos
                    </button>
                    {TIPOS_SOLICITACAO.map((t) => (
                        <button
                            key={t.valor}
                            className={`filtro-btn ${filtroTipo === t.valor ? "ativo" : ""}`}
                            onClick={() => setFiltroTipo(t.valor)}
                        >
                            {t.icone} {t.nome}
                        </button>
                    ))}

                    <span style={{
                            width: "1px",
                            background: "var(--border-color)",
                            margin: "0 4px"
                        }}
                    />

                    {["TODOS", "PENDENTE", "EM_ANALISE", "APROVADO", "RECUSADO"].map((s) => (
                        <button
                            key={s}
                            className={`filtro-btn ${filtroStatus === s ? "ativo" : ""}`}
                            onClick={() => setFiltroStatus(s)}
                        >
                            {s === "TODOS" ? "Todos Status" : formatarStatus(s)}
                        </button>
                    ))}
                </div>

                {/* --- CONTADOR --- */}
                <div className="solicitacoes-contador">
                    <h3>Minhas Solicitações</h3>
                    <span>{solicitacoesFiltradas.length} solicitação(ões)</span>
                </div>

                {/* --- LISTA DE SOLICITAÇÕES --- */}
                {carregando ? (
                    <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                        Carregando solicitações...
                    </p>
                ) : solicitacoesFiltradas.length === 0 ? (
                    <div className="solicitacoes-vazio">
                        <div className="solicitacoes-vazio-icone">
                            <FiFileText />
                        </div>

                        <h3>Nenhuma solicitação encontrada</h3>
                        <p>Clique em "Nova Solicitação" para criar uma.</p>
                    </div>
                ) : (
                    <div className="entregas-lista">
                        {solicitacoesFiltradas
                            .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
                            .map((sol) => (
                            <div key={sol.id} className={`solicitacao-card tipo-${sol.tipo}`}>
                                <div className="solicitacao-card-header">
                                    <h3>
                                        {getIconeTipo(sol.tipo)} {sol.titulo}
                                    </h3>

                                    <span className={`tag-status ${sol.status}`}>
                                        {getIconeStatus(sol.status)} {formatarStatus(sol.status)}
                                    </span>
                                </div>

                                <div className="solicitacao-card-body">
                                    <p>
                                        <FiFileText /> {sol.descricao}
                                    </p>

                                    <p>
                                        <FiCalendar /> Data prevista: {sol.dataPrevista
                                            ? new Date(sol.dataPrevista + "T00:00:00").toLocaleDateString("pt-BR")
                                            : "—"}
                                    </p>

                                    <p>
                                        <FiClock /> Criada em: {sol.dataCriacao
                                            ? new Date(sol.dataCriacao).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })
                                            : "—"}
                                    </p>
                                </div>

                                <div className="solicitacao-card-tags">
                                    <span className={`tag-tipo ${sol.tipo}`}>
                                        {getIconeTipo(sol.tipo)} {getNomeTipo(sol.tipo)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Solicitacoes;

