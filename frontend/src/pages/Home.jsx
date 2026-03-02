import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/Home.css';

function Home() {
    const [comunicados, setComunicados] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const perfilUsuario = 'SINDICO'; 

    useEffect(() => {
        setTimeout(() => {
        const dadosDoBanco = [
            { 
                id: 1, 
                titulo: 'Elevador do Bloco B', 
                data: '27/02/2026', 
                mensagem: 'Manutenção acionada.', 
                urgente: true 
            },
            { 
                id: 2, 
                titulo: 'Limpeza de Garagem', 
                data: '25/02/2026', 
                mensagem: 'Retirem os carros.', 
                urgente: false 
            }
        ];

        setComunicados(dadosDoBanco); 
        setCarregando(false);         
        }, 1000);

    }, []); 

    return (
        <div className="home-container">
            
            {/* --- NAVBAR --- */}
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
                    <h1 className="titulo-secao">Quadro de Avisos</h1>
                
                    {(perfilUsuario === 'SINDICO' || perfilUsuario === 'FUNCIONARIO') && (
                        <button className="btn-novo-aviso">+ Novo Comunicado</button>
                    )}  
                </div>
                
                <div className="frame-comunicados">
                    {carregando ? (
                        <p>Buscando comunicados recentes...</p>
                    ) : comunicados.length === 0 ? (
                        <p>Nenhum comunicado no momento.</p>
                    ) : (
                        // Se já carregou e tem dados, desenha na tela
                        comunicados.map((aviso) => (
                        <div key={aviso.id} className={`cartao-aviso ${aviso.urgente ? 'aviso-urgente' : ''}`}>
                            <div className="aviso-cabecalho">
                                <h3>{aviso.titulo}</h3>
                                <span className="aviso-data">{aviso.data}</span>
                            </div>
                            <p>{aviso.mensagem}</p>
                        </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;