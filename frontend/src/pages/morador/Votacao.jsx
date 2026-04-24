import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../components/Toast";
import { FiArrowLeft, FiSun, FiMoon, FiCheckCircle } from "react-icons/fi";
import "../../styles/Home.css";
import "../../styles/Votacao.css";

function Votacao() {
    const [votacoes            , setVotacoes            ] = useState([]);
    const [carregando          , setCarregando          ] = useState(true);
    const [votando             , setVotando             ] = useState(null);
    const [candidatoSelecionado, setCandidatoSelecionado] = useState("");
    const [enviando            , setEnviando            ] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem("theme");
        return saved === "dark";
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

    async function enviarVoto(votacaoId) {
        if (!candidatoSelecionado) {
            toast.erro("Selecione um candidato.");
            return;
        }
        setEnviando(true);
        try {
            await api.post(`/api/votacoes/${votacaoId}/votar`, { candidato: candidatoSelecionado });
            toast.sucesso("Voto registrado com sucesso!");
            setCandidatoSelecionado("");
            setVotando(null);
            carregarVotacoes();
        } catch (err) {
            toast.erro(err.response?.data?.message || err.response?.data?.erro || "Erro ao votar.");
        } finally {
            setEnviando(false);
        }
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

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="navbar-logo">
                    <h2>Residencial Boca de Pedreiro</h2>
                </div>

                <ul className="navbar-links">
                    <li><Link to="/home">Início</Link></li>
                </ul>

                <div className="acoes-usuario">
                    <button className="btn-tema" onClick={() => setIsDarkMode(!isDarkMode)} aria-label="Alternar Tema">
                        {isDarkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </div>
            </nav>

            <main className="home-conteudo">
                <div className="votacao-header">
                    <button onClick={() => navigate("/home")} className="btn-voltar">
                        <FiArrowLeft />
                    </button>
                    <h2>Votação para Síndico</h2>
                </div>

                {carregando ? (
                    <p style={{ color: "var(--text-muted)" }}>Carregando votações...</p>
                ) : votacoes.filter(v => v.status !== "CANCELADA").length === 0 ? (
                    <div className="votacao-vazia">
                        <div className="votacao-vazia-icone"></div>
                        <p>Nenhuma votação disponível no momento.</p>
                    </div>
                ) : (
                    <div className="votacao-lista">
                        {votacoes.filter(v => v.status !== "CANCELADA").map(v => {
                            const podeVotar = v.status === "ABERTA" && !v.jaVotou;
                            const vencedor = v.resultado && v.status === "ENCERRADA"
                                ? Object.entries(v.resultado).sort((a, b) => b[1] - a[1])[0]
                                : null;
                            const badgeClass = v.status === "ABERTA" ? "votacao-badge-aberta"
                                : v.status === "ENCERRADA" ? "votacao-badge-encerrada" : "votacao-badge-cancelada";

                            return (
                                <div 
                                    key={v.id} 
                                    className="votacao-card"
                                    style={{ 
                                        borderLeft: `4px solid ${v.status === "ABERTA" ? "#2ecc71" : v.status === "ENCERRADA" ? "#3498db" : "#95a5a6"}` 
                                    }}
                                >

                                    <div className="votacao-card-header">
                                        <div>
                                            <h3 className="votacao-card-titulo">{v.titulo}</h3>
                                            {v.descricao && <p className="votacao-card-descricao">{v.descricao}</p>}
                                        </div>
                                        <span className={`votacao-badge ${badgeClass}`}>
                                            {getLabelStatus(v.status)}
                                        </span>
                                    </div>

                                    <div className="votacao-info">
                                        <span>Período: {v.dataInicio} a {v.dataFim}</span>
                                        <span>{v.totalVotos} voto(s)</span>
                                    </div>

                                    {/* --- JÁ VOTOU --- */}
                                    {v.jaVotou && v.status === "ABERTA" && (
                                        <div className="votacao-ja-votou">
                                            <FiCheckCircle size={20} />
                                            Você já votou nesta eleição. Obrigado!
                                        </div>
                                    )}

                                    {/* --- FORMULÁRIO DE VOTO --- */}
                                    {podeVotar && (
                                        <div style={{ marginBottom: "16px" }}>
                                            <p className="votacao-selecao-titulo">Selecione seu candidato:</p>
                                            <div className="votacao-candidatos-lista">
                                                {(v.candidatos || []).map((c, i) => (
                                                    <label key={i}
                                                        className={`votacao-candidato-option ${votando === v.id && candidatoSelecionado === c ? "selecionado" : ""}`}>
                                                        <input type="radio" name={`voto-${v.id}`} value={c}
                                                            checked={votando === v.id && candidatoSelecionado === c}
                                                            onChange={() => { setVotando(v.id); setCandidatoSelecionado(c); }} />
                                                        <span className="candidato-nome">{c}</span>
                                                    </label>
                                                ))}
                                            </div>

                                            {votando === v.id && (
                                                <button onClick={() => enviarVoto(v.id)} disabled={enviando} className="btn-confirmar-voto">
                                                    {enviando ? "Enviando..." : "✓ Confirmar Voto"}
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* --- RESULTADO --- */}
                                    {v.status === "ENCERRADA" && v.resultado && v.totalVotos > 0 && (
                                        <div>
                                            <p className="votacao-resultado-titulo">Resultado Final</p>
                                            {Object.entries(v.resultado).sort((a, b) => b[1] - a[1]).map(([candidato, votos]) => {
                                                const pct = v.totalVotos > 0 ? ((votos / v.totalVotos) * 100).toFixed(1) : 0;
                                                const isVencedor = vencedor && candidato === vencedor[0];
                                                
                                                return (
                                                    <div key={candidato} className="votacao-resultado-item">
                                                        <div className="votacao-resultado-info">
                                                            <span className={`votacao-resultado-nome ${isVencedor ? "vencedor" : ""}`}>
                                                                {isVencedor ? " " : ""}{candidato}
                                                            </span>
                                                            <span className="votacao-resultado-votos">{votos} voto(s) — {pct}%</span>
                                                        </div>

                                                        <div className="votacao-barra-fundo">
                                                            <div 
                                                                className={`votacao-barra-preenchida ${isVencedor ? "vencedor" : "normal"}`}
                                                                style={{ 
                                                                    width: `${pct}%` 
                                                                }} 
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Votacao;

