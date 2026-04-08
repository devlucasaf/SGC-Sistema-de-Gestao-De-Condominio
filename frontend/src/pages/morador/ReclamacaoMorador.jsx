import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/ReclamacaoMorador.css";

import { FiSun, FiMoon, FiArrowLeft, FiSend, FiAlertCircle, FiClock, FiCheckCircle } from "react-icons/fi";

function ReclamacaoMorador() {
    const [tipo, setTipo] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descricao, setDescricao] = useState("");
    const [unidadeInfrator, setUnidadeInfrator] = useState("");
    const [minhasReclamacoes, setMinhasReclamacoes] = useState([]);
    const [enviando, setEnviando] = useState(false);

    const navigate = useNavigate();

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

    const categoriasCondominio = [
        "Elevador",
        "Churrasqueira suja",
        "Infestação de insetos/pragas",
        "Problemas de iluminação",
        "Falta de água",
        "Academia",
        "Salão de festas",
        "Piscina",
        "Playground",
        "Outros"
    ];

    const categoriasMorador = [
        "Barulho excessivo",
        "Animais de estimação",
        "Arrastar móveis",
        "Festas",
        "Estacionou na vaga de outro morador",
        "Lixo deixado na área comum",
        "Jogando água da varanda",
        "Outros"
    ];

    // --- Buscar histórico de reclamações do morador ---
    useEffect(() => {
        async function buscarMinhasReclamacoes() {
            try {
                const perfil = JSON.parse(localStorage.getItem("perfilUsuario"));
                if (perfil && perfil.detalheExtra) {
                    // Extrai "Apto: 101 - Bloco: A" para buscar por unidade
                    const unidade = perfil.detalheExtra;
                    const response = await api.get(`/api/reclamacoes/unidade/${encodeURIComponent(unidade)}`);
                    setMinhasReclamacoes(response.data.conteudo || []);
                }
            } catch (error) {
                console.error("Erro ao buscar reclamações:", error);
            }
        }
        buscarMinhasReclamacoes();
    }, []);

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    function getIconeStatus(status) {
        switch (status) {
            case "PENDENTE": return <FiClock className="status-icon pendente" />;
            case "EM_ANALISE": return <FiAlertCircle className="status-icon em-analise" />;
            case "RESOLVIDA": return <FiCheckCircle className="status-icon resolvida" />;
            default: return <FiClock className="status-icon" />;
        }
    }

    function formatarStatus(status) {
        switch (status) {
            case "PENDENTE": return "Pendente";
            case "EM_ANALISE": return "Em Análise";
            case "RESOLVIDA": return "Resolvida";
            default: return status;
        }
    }

    async function enviarReclamacao(e) {
        e.preventDefault();
        setEnviando(true);

        try {
            const perfil = JSON.parse(localStorage.getItem("perfilUsuario"));
            const unidadeMorador = perfil?.detalheExtra || "Não informado";

            const dados = {
                tipo,
                categoria,
                descricao,
                unidade: tipo === "morador" && unidadeInfrator
                    ? `Infrator: ${unidadeInfrator} | Reclamante: ${unidadeMorador}`
                    : unidadeMorador
            };

            const response = await api.post("/api/reclamacoes", dados);

            alert("Reclamação enviada com sucesso para o Síndico!");

            // Adiciona a nova reclamação ao histórico local
            setMinhasReclamacoes([response.data, ...minhasReclamacoes]);

            setTipo("");
            setCategoria("");
            setDescricao("");
            setUnidadeInfrator("");
        } catch (error) {
            console.error("Erro ao enviar reclamação:", error);
            const msg = error.response?.data?.erros?.join(", ") || "Erro ao enviar reclamação. Verifique os dados e tente novamente.";
            alert(msg);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="entregas-container">
            <nav className="navbar">
                <div className="navbar-logo">
                    <h2>Ouvidoria / Reclamações</h2>
                </div>
                <div className="perfil-container">
                    <button className="btn-tema" onClick={alternarTema} aria-label="Alternar Tema">
                        {isDarkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </div>
            </nav>

            <main className="entregas-conteudo">
                <div className="entregas-header">
                    <button className="btn-voltar" onClick={() => navigate("/home")}>
                        <FiArrowLeft /> Voltar para Página Inicial
                    </button>
                </div>

                {/* FORMULÁRIO DE NOVA RECLAMAÇÃO */}
                <div className="cartao-formulario">
                    <h3>Registrar Nova Reclamação</h3>
                    <p>Selecione abaixo sobre o que você deseja relatar.</p>

                    <form onSubmit={enviarReclamacao} className="form-reclamacao">
                        <div className="grupo-botoes-tipo">
                            <button
                                type="button"
                                className={`btn-tipo ${tipo === "condominio" ? "ativo" : ""}`}
                                onClick={() => { setTipo("condominio"); setCategoria(""); }}
                            >
                                Problema no Condomínio
                            </button>
                            <button
                                type="button"
                                className={`btn-tipo ${tipo === "morador" ? "ativo" : ""}`}
                                onClick={() => { setTipo("morador"); setCategoria(""); }}
                            >
                                Problema com Morador
                            </button>
                        </div>

                        {tipo && (
                            <div className="campos-dinamicos fadeIn">
                                <div className="campo-form">
                                    <label>Categoria da Reclamação:</label>
                                    <select
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Selecione um motivo --</option>
                                        {(tipo === "condominio" ? categoriasCondominio : categoriasMorador).map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {tipo === "morador" && (
                                    <div className="campo-form">
                                        <label>Qual é a Unidade/Bloco do Infrator? (Opcional)</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Bloco B, Apto 402"
                                            value={unidadeInfrator}
                                            onChange={(e) => setUnidadeInfrator(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="campo-form">
                                    <label>Descreva os detalhes:</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Conte o que aconteceu..."
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn-enviar-reclamacao" disabled={enviando}>
                                    <FiSend /> {enviando ? "Enviando..." : "Enviar Reclamação"}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* HISTÓRICO DE RECLAMAÇÕES */}
                <div className="secao-historico">
                    <h3>Minhas Reclamações</h3>
                    {minhasReclamacoes.length === 0 ? (
                        <p className="texto-vazio">Você ainda não enviou nenhuma reclamação.</p>
                    ) : (
                        <div className="entregas-lista">
                            {minhasReclamacoes.map((rec) => (
                                <div key={rec.id} className="card entregas-card">
                                    <div className="card-header entregas-card-header">
                                        <h3 className="card-title">
                                            {getIconeStatus(rec.status)} {rec.categoria}
                                        </h3>
                                        <span className={`badge ${
                                            rec.status === "PENDENTE" ? "badge-warning" :
                                            rec.status === "EM_ANALISE" ? "badge-info" :
                                            "badge-success"
                                        }`}>
                                            {formatarStatus(rec.status)}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <p><strong>Tipo:</strong> {rec.tipo === "condominio" ? "Problema no Condomínio" : "Problema com Morador"}</p>
                                        <p><strong>Descrição:</strong> {rec.descricao}</p>
                                        <p><strong>Data:</strong> {rec.dataCriacao ? new Date(rec.dataCriacao).toLocaleDateString("pt-BR") : "—"}</p>
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

export default ReclamacaoMorador;