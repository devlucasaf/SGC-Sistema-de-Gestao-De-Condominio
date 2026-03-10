import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import "../../styles/PaginaInicialMorador.css";

function PaginaInicialMorador() {
    const [moradores, setMoradores] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // --- SIMULA O PERFIL ---
    const perfilUsuario = "SINDICO"; 

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

                <div className="navbar-perfil">
                    <Link to="/" className="btn-sair">Sair</Link>
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

export default PaginaInicialMorador;