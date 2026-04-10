import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    FiArrowLeft, FiSun, FiMoon, FiHome, FiLayers,
    FiUser, FiMail, FiPhone, FiCreditCard, FiCalendar,
    FiCheckCircle, FiEdit
} from "react-icons/fi";
import api from "../../services/api";
import Loading from "../../components/Loading";
import "../../styles/Home.css";
import "../../styles/MinhaUnidade.css";

function MinhaUnidade() {
    const [perfil, setPerfil] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    const navigate = useNavigate();

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
        const buscarPerfil = async () => {
            try {
                const resposta = await api.get("/perfil");
                setPerfil(resposta.data);
                localStorage.setItem("perfilUsuario", JSON.stringify(resposta.data));
            }

            catch (err) {
                console.error("Erro ao buscar perfil:", err);
            }

            finally {
                setCarregando(false);
            }
        };
        buscarPerfil();
    }, []);

    // --- FORMATA CPF: 12345678901 -> 123.456.789-01 ---
    function formatarCpf(cpf) {
        if (!cpf) {
            return "—";
        }

        const numeros = cpf.replace(/\D/g, "");
        return numeros
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    // --- FORMATA TELEFONE ---
    function formatarTelefone(tel) {
        if (!tel) {
            return "—";
        }

        const numeros = tel.replace(/\D/g, "");
        if (numeros.length === 11) {
            return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
        return tel;
    }

    // --- FORMATA DATA: 2026-01-15 -> 15/01/2026 ---
    function formatarData(data) {
        if (!data) {
            return "—";
        }

        const partes = data.split("-");

        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return data;
    }

    // --- COR DO STATUS ---
    function corStatus(status) {
        if (!status) {
            return "";
        }

        const s = status.toLowerCase();

        if (s.includes("ativo") && !s.includes("inativo")) {
            return "status-ativo";
        }

        if (s.includes("inadimplente")) {
            return "status-inadimplente";
        }

        if (s.includes("aguardando")) {
            return "status-aguardando";
        }

        if (s.includes("suspenso")) {
            return "status-suspenso";
        }

        if (s.includes("ex-morador") || s.includes("inativo")) {
            return "status-inativo";
        }
        return "";
    }

    if (carregando) {
        return (
            <div className="home-container">
                <Loading mensagem="Carregando dados da unidade..." />
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* --- NAVBAR --- */}
            <nav className="navbar">
                <div className="navbar-logo">
                    <h2>Residencial Boca de Pedreiro</h2>
                </div>

                <div className="acoes-usuario">
                    <button
                        className="btn-tema"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        aria-label="Alternar Tema"
                    >
                        {isDarkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </div>
            </nav>

            {/* --- CONTEÚDO --- */}
            <main className="unidade-conteudo">
                <div className="unidade-header">
                    <Link to="/home" className="btn-voltar-unidade">
                        <FiArrowLeft /> Voltar
                    </Link>
                    <h2>Minha Unidade</h2>
                    <p>Informações do seu apartamento e dados pessoais.</p>
                </div>

                {perfil ? (
                    <div className="unidade-grid">

                        {/* --- CARD DO APARTAMENTO --- */}
                        <div className="unidade-card unidade-card-destaque">
                            <div className="unidade-card-header">
                                <FiHome className="unidade-card-icone" />
                                <h3>Apartamento</h3>
                            </div>

                            <div className="unidade-card-corpo">
                                <div className="unidade-apto-grande">
                                    <span className="apto-numero">{perfil.numeroApto || "—"}</span>
                                    <span className="apto-bloco">Bloco {perfil.bloco || "—"}</span>
                                </div>

                                <div className="unidade-info-row">
                                    <div className="unidade-info-item">
                                        <FiLayers className="info-icone" />
                                        <div>
                                            <span className="info-label">Andar</span>
                                            <span className="info-valor">
                                                {perfil.andar ? `${perfil.andar}º andar` : "—"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="unidade-info-item">
                                        <FiCheckCircle className="info-icone" />
                                        <div>
                                            <span className="info-label">Status</span>
                                            <span className={`info-valor info-status ${corStatus(perfil.statusMorador)}`}>
                                                {perfil.statusMorador || "—"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="unidade-info-row">
                                    <div className="unidade-info-item">
                                        <FiUser className="info-icone" />
                                        <div>
                                            <span className="info-label">Tipo de Morador</span>
                                            <span className="info-valor">{perfil.tipoMorador || "—"}</span>
                                        </div>
                                    </div>

                                    <div className="unidade-info-item">
                                        <FiCalendar className="info-icone" />
                                        <div>
                                            <span className="info-label">Morador desde</span>
                                            <span className="info-valor">{formatarData(perfil.dataEntrada)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- CARD DOS DADOS PESSOAIS --- */}
                        <div className="unidade-card">
                            <div className="unidade-card-header">
                                <FiUser className="unidade-card-icone" />
                                <h3>Dados Pessoais</h3>
                            </div>

                            <div className="unidade-card-corpo">
                                <div className="unidade-dado">
                                    <FiUser className="dado-icone" />
                                    <div>
                                        <span className="dado-label">Nome</span>
                                        <span className="dado-valor">{perfil.nome || "—"}</span>
                                    </div>
                                </div>

                                <div className="unidade-dado">
                                    <FiMail className="dado-icone" />
                                    <div>
                                        <span className="dado-label">E-mail</span>
                                        <span className="dado-valor">{perfil.email || "—"}</span>
                                    </div>
                                </div>

                                <div className="unidade-dado">
                                    <FiPhone className="dado-icone" />
                                    <div>
                                        <span className="dado-label">Telefone</span>
                                        <span className="dado-valor">{formatarTelefone(perfil.telefone)}</span>
                                    </div>
                                </div>

                                <div className="unidade-dado">
                                    <FiCreditCard className="dado-icone" />
                                    <div>
                                        <span className="dado-label">CPF</span>
                                        <span className="dado-valor">{formatarCpf(perfil.cpf)}</span>
                                    </div>
                                </div>
                            </div>

                            <Link to="/atualizar-cadastro" className="btn-editar-dados">
                                <FiEdit /> Editar Dados
                            </Link>
                        </div>
                    </div>
                ) : (
                    <p className="unidade-sem-dados">Não foi possível carregar os dados da unidade.</p>
                )}
            </main>
        </div>
    );
}

export default MinhaUnidade;
