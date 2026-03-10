import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/EntregasMorador.css";

function EntregasMorador() {
    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(true);
    const [entregas, setEntregas] = useState([]);

    useEffect(() => {
        const listaFalsa = [
            { id: 1, descricao: "Caixa pequena - Amazon", dataChegada: "09/03/2026 - 14:30", recebedor: "Porteiro João", status: "Aguardando Retirada" },
            { id: 2, descricao: "Pacote - Mercado Livre", dataChegada: "05/03/2026 - 10:15", recebedor: "Porteiro Carlos", status: "Retirado" },
            { id: 3, descricao: "Envelope - Correios", dataChegada: "01/03/2026 - 16:45", recebedor: "Porteiro João", status: "Retirado" }
        ];
        setEntregas(listaFalsa);
    }, []);

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className={`tela-entregas ${isDarkMode ? "tema-escuro" : "tema-claro"}`}>
            
            <nav className="navbar-entregas">
                <h2>Minhas Entregas</h2>
                
                <button className="btn-tema" onClick={alternarTema}>
                    {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
                </button>
            </nav>

            <div className="conteiner-entregas">
                
                <div className="cabecalho-entregas">
                    <button className="btn-voltar" onClick={() => navigate("/paginainicialmorador")}>
                        ⬅ Voltar para Página Inicial
                    </button>
                </div>

                <div className="lista-entregas">
                    {entregas.map((entrega) => (
                        <div key={entrega.id} className="cartao-entrega">
                            <div className="info-entrega">
                                <h3>📦 {entrega.descricao}</h3>
                                <p><strong>Chegou em:</strong> {entrega.dataChegada}</p>
                                <p><strong>Recebido por:</strong> {entrega.recebedor}</p>
                            </div>
                            
                            <div className="acao-entrega">
                                <span className={`etiqueta-status-entrega ${entrega.status === "Aguardando Retirada" ? "status-aguardando" : "status-retirado"}`}>
                                    {entrega.status}
                                </span>
                                
                                {entrega.status === "Aguardando Retirada" && (
                                    <p className="aviso-portaria">Disponível para retirada na portaria.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EntregasMorador;
