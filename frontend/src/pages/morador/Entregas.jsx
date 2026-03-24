import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Entregas.css";

import { FiSun, FiMoon, FiPackage, FiClock, FiUser, FiArrowLeft } from "react-icons/fi";

function Entregas() {
    const navigate = useNavigate();

    const [entregas, setEntregas] = useState([]);

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
        const listaFalsa = [
            {
                id: 1,
                descricao: "Caixa pequena - Amazon",
                dataChegada: "09/03/2026 - 14:30",
                recebedor: "Porteiro João",
                status: "Aguardando Retirada"
            },
            {
                id: 2,
                descricao: "Pacote - Mercado Livre",
                dataChegada: "05/03/2026 - 10:15",
                recebedor: "Porteiro Carlos",
                status: "Retirado"
            },
            {
                id: 3,
                descricao: "Envelope - Correios",
                dataChegada: "01/03/2026 - 16:45",
                recebedor: "Porteiro João",
                status: "Retirado"
            }
        ];
        setEntregas(listaFalsa);
    }, []);

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className="entregas-container">
            <nav className="navbar">
                <div className="navbar-logo">
                    <h2>Entregas</h2>
                </div>

                <div className="perfil-container">
                    <button
                        className="btn-tema"
                        onClick={alternarTema}
                        aria-label="Alternar Tema"
                    >
                        {isDarkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </div>
            </nav>

            <main className="entregas-conteudo">
                <div className="entregas-header">
                    <button 
                        className="btn-voltar"
                        onClick={() => navigate("/home")}
                    >
                        <FiArrowLeft /> Voltar para Página Inicial
                    </button>
                </div>

                <div className="entregas-lista">
                    {entregas.map((entrega) => (
                        <div key={entrega.id} className="card entregas-card">
                            <div className="card-header entregas-card-header">
                                <h3 className="card-title">
                                    <FiPackage className="card-icon" /> {entrega.descricao}
                                </h3>
                                
                                <span className={`badge ${entrega.status === "Aguardando Retirada" ? "badge-warning" : "badge-secondary"}`}>
                                    {entrega.status}
                                </span>
                            </div>
                            <div className="card-body">
                                <p><FiClock /> <strong>Chegou em:</strong> {entrega.dataChegada}</p>
                                <p><FiUser /> <strong>Recebido por:</strong> {entrega.recebedor}</p>
                                {entrega.status === "Aguardando Retirada" && (
                                    <p className="aviso-retirada">📦 Disponível para retirada na portaria.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Entregas;