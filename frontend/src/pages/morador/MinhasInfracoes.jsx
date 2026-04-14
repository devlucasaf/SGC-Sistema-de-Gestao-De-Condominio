import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../components/Toast";
import { FiSun, FiMoon, FiArrowLeft, FiAlertTriangle, FiDollarSign, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import "../../styles/MinhasInfracoes.css";

function MinhasInfracoes() {
    const navigate = useNavigate();
    const toast = useToast();

    const [infracoes, setInfracoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtro, setFiltro] = useState("TODOS");

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

    useEffect(() => {
        carregarInfracoes();
    }, []);

    async function carregarInfracoes() {
        setCarregando(true);
        try {
            const res = await api.get("/api/infracoes/minhas");
            setInfracoes(res.data || []);
        }

        catch (err) {
            console.error("Erro ao carregar infrações:", err);
        }

        finally {
            setCarregando(false);
        }
    }

    async function contestarInfracao(id) {
        try {
            await api.patch(`/api/infracoes/${id}/status?novoStatus=CONTESTADA`);
            toast.sucesso("Infração contestada! O síndico será notificado.");
            carregarInfracoes();
        }

        catch (err) {
            toast.erro("Erro ao contestar infração.");
        }
    }

    const filtradas = infracoes.filter(i => {
        if (filtro === "TODOS") {
            return true;
        }

        if (filtro === "MULTA") {
            return i.tipo === "MULTA";
        }

        if (filtro === "ADVERTENCIA") {
            return i.tipo === "ADVERTENCIA";
        }
        return i.status === filtro;
    });

    const totalMultas = infracoes.filter(i => i.tipo === "MULTA").length;
    const totalAdvertencias = infracoes.filter(i => i.tipo === "ADVERTENCIA").length;
    const totalPendentes = infracoes.filter(i => i.status === "PENDENTE").length;
    const valorTotal = infracoes
        .filter(i => i.tipo === "MULTA" && i.status === "PENDENTE")
        .reduce((acc, i) => acc + (i.valor || 0), 0);

    function getCorStatus(status) {
        switch (status) {
            case "PENDENTE":
                return "#f1c40f";
            case "PAGA":
                return "#2ecc71";
            case "CONTESTADA":
                return "#3498db";
            case "CANCELADA":
                return "#95a5a6";
            default:
                return "#888";
        }
    }

    function getNomeStatus(status) {
        switch (status) {
            case "PENDENTE":
                return "Pendente";
            case "PAGA":
                return "Paga";
            case "CONTESTADA":
                return "Contestada";
            case "CANCELADA":
                return "Cancelada";
            default:
                return status;
        }
    }

    return (
        <div className="infracoes-container">
            <nav className="infracoes-nav">
                <button className="btn-voltar" onClick={() => navigate("/home")}>
                    <FiArrowLeft /> Voltar
                </button>

                <h2>Minhas Multas e Advertências</h2>

                <button className="btn-tema" onClick={() => setIsDarkMode(!isDarkMode)}>
                    {isDarkMode ? <FiSun /> : <FiMoon />}
                </button>
            </nav>

            {/* Resumo */}
            <div className="infracoes-resumo">
                <div className="resumo-item vermelho">
                    <FiAlertTriangle />
                    <div>
                        <span className="resumo-numero">{totalMultas}</span>
                        <span className="resumo-label">Multas</span>
                    </div>
                </div>

                <div className="resumo-item amarelo">
                    <FiAlertTriangle />
                    <div>
                        <span className="resumo-numero">{totalAdvertencias}</span>
                        <span className="resumo-label">Advertências</span>
                    </div>
                </div>

                <div className="resumo-item azul">
                    <FiClock />
                    <div>
                        <span className="resumo-numero">{totalPendentes}</span>
                        <span className="resumo-label">Pendentes</span>
                    </div>
                </div>

                <div className="resumo-item verde">
                    <FiDollarSign />
                    <div>
                        <span className="resumo-numero">
                            R$ {valorTotal.toFixed(2).replace(".", ",")}
                        </span>
                        <span className="resumo-label">Em multas pendentes</span>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="infracoes-filtros">
                {["TODOS", "MULTA", "ADVERTENCIA", "PENDENTE", "CONTESTADA", "PAGA", "CANCELADA"].map(f => (
                    <button
                        key={f}
                        className={`filtro-pill ${filtro === f ? "ativo" : ""}`}
                        onClick={() => setFiltro(f)}
                    >
                        {f === "TODOS" ? "Todas" :
                         f === "MULTA" ? "Multas" :
                         f === "ADVERTENCIA" ? "Advertências" :
                         f === "PENDENTE" ? "Pendentes" :
                         f === "CONTESTADA" ? "Contestadas" :
                         f === "PAGA" ? "Pagas" : "Canceladas"}
                    </button>
                ))}
            </div>

            {/* Lista */}
            {carregando ? (
                <p className="msg-vazia">Carregando...</p>
            ) : filtradas.length === 0 ? (
                <div className="msg-vazia-box">
                    <FiCheckCircle style={{ fontSize: "3rem", color: "#2ecc71" }} />
                    <h3>Nenhuma infração encontrada</h3>
                    <p>Você está em dia com o condomínio!</p>
                </div>
            ) : (
                <div className="infracoes-lista">
                    {filtradas
                        .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
                        .map(inf => (
                        <div
                            key={inf.id}
                            className={`infracao-card ${inf.tipo === "MULTA" ? "card-multa" : "card-advertencia"}`}
                        >
                            <div className="infracao-card-header">
                                <div className="infracao-tipo-tag">
                                    {inf.tipo === "MULTA" ? "MULTA" : "ADVERTÊNCIA"}
                                </div>
                                <span
                                    className="infracao-status-tag"
                                    style={{
                                        background: `${getCorStatus(inf.status)}18`,
                                        color: getCorStatus(inf.status),
                                        border: `1px solid ${getCorStatus(inf.status)}40`
                                    }}
                                >
                                    {getNomeStatus(inf.status)}
                                </span>
                            </div>

                            <h4 className="infracao-motivo">{inf.motivo}</h4>

                            {inf.descricao && (
                                <p className="infracao-descricao">{inf.descricao}</p>
                            )}

                            <div className="infracao-meta">
                                <span>
                                    {inf.dataInfracao
                                        ? new Date(inf.dataInfracao + "T00:00:00").toLocaleDateString("pt-BR")
                                        : "—"}
                                </span>
                                {inf.tipo === "MULTA" && (
                                    <span className="infracao-valor">
                                        R$ {(inf.valor || 0).toFixed(2).replace(".", ",")}
                                    </span>
                                )}
                            </div>

                            {inf.status === "PENDENTE" && (
                                <div className="infracao-acoes">
                                    <button
                                        className="btn-contestar"
                                        onClick={() => contestarInfracao(inf.id)}
                                    >
                                        <FiXCircle /> Contestar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MinhasInfracoes;
