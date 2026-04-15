import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";
import "../../styles/Documentos.css";

import { FiSun, FiMoon, FiArrowLeft, FiFileText, FiAlertTriangle, FiBook, FiChevronDown, FiChevronUp } from "react-icons/fi";

function Documentos() {
    const navigate = useNavigate();

    const [documentos, setDocumentos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtro, setFiltro] = useState("TODOS");
    const [abertos, setAbertos] = useState({});

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

    useEffect(() => {
        buscarDocumentos();
    }, []);

    async function buscarDocumentos() {
        setCarregando(true);
        try {
            const res = await api.get("/documentos");
            setDocumentos(res.data || []);
        }

        catch (err) {
            console.error("Erro ao buscar documentos:", err);
        }

        finally {
            setCarregando(false);
        }
    }

    function toggleAberto(id) {
        setAbertos(prev => ({ ...prev, [id]: !prev[id] }));
    }

    function getIconeCategoria(categoria) {
        switch (categoria) {
            case "REGRA": 
                return <FiAlertTriangle />;
            case "MULTA": 
                return <FiAlertTriangle />;
            case "REGIMENTO": 
                return <FiBook />;
            default: 
                return <FiFileText />;
        }
    }

    function getLabelCategoria(categoria) {
        switch (categoria) {
            case "REGRA":
                return "Regra";
            case "MULTA":
                return "Multa";
            case "REGIMENTO":
                return "Regimento";
            default:
                return categoria;
        }
    }

    function getBadgeClasse(categoria) {
        switch (categoria) {
            case "REGRA":
                return "badge-doc badge-regra";
            case "MULTA":
                return "badge-doc badge-multa";
            case "REGIMENTO":
                return "badge-doc badge-regimento";
            default:
                return "badge-doc";
        }
    }

    const documentosFiltrados = filtro === "TODOS"
        ? documentos
        : documentos.filter(d => d.categoria === filtro);

    return (
        <div className="documentos-container">
            <nav className="doc-navbar">
                <h2 className="doc-navbar-titulo">
                    <FiFileText /> Documentos e Regimento
                </h2>

                <button className="btn-tema" onClick={alternarTema} aria-label="Alternar Tema">
                    {isDarkMode ? <FiSun /> : <FiMoon />}
                </button>
            </nav>

            <main className="doc-conteudo">
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
                </div>

                {/* Filtros */}
                <div className="doc-filtros">
                    {["TODOS", "REGIMENTO", "REGRA", "MULTA"].map(cat => (
                        <button
                            key={cat}
                            className={`btn-filtro-doc ${filtro === cat ? "ativo" : ""}`}
                            onClick={() => setFiltro(cat)}
                        >
                            {cat === "TODOS" ? "Todos" : getLabelCategoria(cat)}
                        </button>
                    ))}
                </div>

                {/* Lista */}
                {carregando ? (
                    <Loading mensagem="Carregando documentos..." />
                ) : documentosFiltrados.length === 0 ? (
                    <div className="doc-vazio">
                        <FiFileText className="doc-vazio-icone" />
                        <p>Nenhum documento encontrado.</p>
                    </div>
                ) : (
                    <div className="doc-lista">
                        {documentosFiltrados.map(doc => (
                            <div key={doc.id} className="doc-card">
                                <div className="doc-card-header" onClick={() => toggleAberto(doc.id)}>
                                    <div className="doc-card-info">
                                        <span className="doc-card-icone">
                                            {getIconeCategoria(doc.categoria)}
                                        </span>
                                        <div>
                                            <h3 className="doc-card-titulo">{doc.titulo}</h3>
                                            <div className="doc-card-meta">
                                                <span className={getBadgeClasse(doc.categoria)}>
                                                    {getLabelCategoria(doc.categoria)}
                                                </span>
                                                <span className="doc-card-data">
                                                    {doc.dataAtualizacao
                                                        ? `Atualizado em ${new Date(doc.dataAtualizacao).toLocaleDateString("pt-BR")}`
                                                        : `Publicado em ${new Date(doc.dataCriacao).toLocaleDateString("pt-BR")}`
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="doc-card-seta">
                                        {abertos[doc.id] ? <FiChevronUp /> : <FiChevronDown />}
                                    </span>
                                </div>

                                {abertos[doc.id] && (
                                    <div className="doc-card-conteudo">
                                        <p>{doc.conteudo}</p>
                                        <span className="doc-card-autor">
                                            Publicado por: <strong>{doc.nomeSindico}</strong>
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Documentos;
