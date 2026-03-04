import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Certifique-se de que o caminho está correto
import '../style/Home.css';

function Home() {
    const [moradores, setMoradores] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // Simulando o perfil por enquanto, ou você pode buscar do localStorage
    const perfilUsuario = 'SINDICO'; 

    useEffect(() => {
        const buscarMoradores = async () => {
            try {
                // Chama a rota do seu Java
                const resposta = await api.get("/moradores");
                setMoradores(resposta.data);
            } catch (error) {
                console.error("Erro ao buscar moradores:", error);
            } finally {
                setCarregando(false);
            }
        };

        buscarMoradores();
    }, []);

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="navbar-logo">
                    <h2>SGC</h2>
                </div>

                <ul className="navbar-links">
                    <li><Link to="/boleto">Boleto</Link></li>
                    <li><Link to="/reserva">Reserva</Link></li>
                    <li><Link to="/entrega">Entrega</Link></li>
                    <li><Link to="/reclamacao">Reclamação</Link></li>
                </ul>

                <div className="navbar-perfil">
                    <Link to="/" className="btn-sair">Sair</Link>
                </div>
            </nav>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            <main className="home-conteudo">
                
                <div className="cabecalho-secao">
                    <h1 className="titulo-secao">Moradores Cadastrados</h1>
                
                    {(perfilUsuario === 'SINDICO' || perfilUsuario === 'FUNCIONARIO') && (
                        <button className="btn-novo-aviso">+ Novo Morador</button>
                    )}  
                </div>
                
                <div className="frame-comunicados">
                    {carregando ? (
                        <p>Buscando dados no servidor Java...</p>
                    ) : moradores.length === 0 ? (
                        <p>Nenhum morador encontrado no banco de dados.</p>
                    ) : (
                        // Mapeando os moradores que vieram do banco
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