import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api.js";
import Loading from "../../components/Loading";
import "../../styles/Home.css";

import { FiUser, FiSettings, FiHome, FiLogOut, FiMoon, FiSun, FiLock } from "react-icons/fi";

function Home() {
    const [avisos, setAvisos] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [menuAberto, setMenuAberto] = useState(false);

    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
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
        }

        else {
            root.removeAttribute("dark-theme");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    useEffect(() => {
        const buscarAvisos = async () => {
            try {
                const resposta = await api.get("/avisos");
                setAvisos(resposta.data);
            }

            catch (error) {
                console.error("Erro ao buscar avisos:", error);
            }

            finally {
                setCarregando(false);
            }
        };

        buscarAvisos();
    }, []);

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="navbar-logo">
                    <h2>SGC</h2>
                </div>

                <ul className="navbar-links">
                    <li><Link to="/boletomorador">Boleto</Link></li>
                    <li><Link to="/reservamorador">Reserva</Link></li>
                    <li><Link to="/entregas">Entrega</Link></li>
                    <li><Link to="/reclamacaomorador">Reclamação</Link></li>
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
            </main>
        </div>
    );
}

export default Home;
