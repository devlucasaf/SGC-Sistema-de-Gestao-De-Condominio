import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import "../../styles/Home.css";

import { FiUser, FiSettings, FiHome, FiLogOut, FiMoon, FiSun } from "react-icons/fi";

function Home() {
    const [moradores, setMoradores] = useState([]);

    const [carregando, setCarregando] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    // --- SIMULA O PERFIL ---
    //const perfilUsuario = "SINDICO"; 

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

//    useEffect(() => {
//        const buscarMoradores = async () => {
//            try {
//                // --- CHAMA A ROTA DO JOTA ---
//                const resposta = await api.get("/moradores");
//                setMoradores(resposta.data);
//            } 
//            
//            catch (error) {
//                console.error("Erro ao buscar moradores:", error);
//            } 
//            
//            finally {
//                setCarregando(false);
//            }
//        };
//
//        buscarMoradores();
//    }, []);

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
                    <li><Link to="/entregasmorador">Entrega</Link></li>
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

                                <hr className="dropdown-divisor" />

                                <Link to="/" className="dropdown-item sair">
                                    <FiLogOut className="dropdown-icon" /> Sair
                                </Link>
                            </div>
                        )}
                    </div> 
                </div> 
            </nav>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            <main className="home-conteudo">
                <div className="frame-comunicados">
                    {carregando ? (
                        <p>Buscando dados no servidor Java...</p>
                    ) : moradores.length === 0 ? (
                        <p>Nenhum morador encontrado no banco de dados.</p>
                    ) : (
                        // --- MAPEIA OS MORADORES QUE VIERAM DO BANCO DE DADOS ---
                        moradores.map((morador) => (
                            <div key={morador.id} className="cartao-aviso">
                                <div className="aviso-cabecalho">
                                    <h3>{morador.nome}</h3>
                                    <span className="aviso-data">Unidade: {morador.unidadeId}</span>
                                </div>
                                <p><strong>Email:</strong> {morador.email}</p>
                                <p><strong>CPF:</strong> {morador.cpf}</p>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;
