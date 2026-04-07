import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/BoletoMorador.css";

function BoletoMorador() {
    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(true);
    const [carregando, setCarregando] = useState(true);
    const [boletos, setBoletos] = useState([]);

    useEffect(() => {
        async function buscarBoletosDoMorador() {
            try {
                const perfil = JSON.parse(localStorage.getItem("perfilUsuario"));
                if (perfil && perfil.id) {
                    const response = await api.get(`/boletos/morador/${perfil.id}`);
                    const boletosMapeados = (response.data || []).map((b) => ({
                        id: b.id,
                        mes: b.descricao || "Condomínio",
                        vencimento: b.dataVencimento
                            ? new Date(b.dataVencimento).toLocaleDateString("pt-BR")
                            : "Sem data",
                        valor: b.valor
                            ? `R$ ${Number(b.valor).toFixed(2).replace(".", ",")}`
                            : "R$ 0,00",
                        status: b.status === "PAGO" ? "Pago" : "Pendente"
                    }));
                    setBoletos(boletosMapeados);
                }
            } catch (error) {
                console.error("Erro ao buscar boletos:", error);
            } finally {
                setCarregando(false);
            }
        }
        buscarBoletosDoMorador();
    }, []);

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className={`tela-boleto ${isDarkMode ? "tema-escuro" : "tema-claro"}`}>
            
            <nav className="navbar-boletos">
                <h2>Boletos</h2>
                
                <button className="btn-tema" onClick={alternarTema}>
                    {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
                </button>
            </nav>

            <div className="conteiner-boletos">
                
                <div className="cabecalho-boletos">
                    <button className="btn-voltar" onClick={() => navigate("/home")}>
                        ⬅ Voltar para a Página Inicial
                    </button>
                </div>

                {carregando ? (
                    <p style={{ textAlign: "center" }}>Buscando boletos...</p>
                ) : boletos.length === 0 ? (
                    <p style={{ textAlign: "center" }}>Nenhum boleto encontrado.</p>
                ) : (
                    <div className="lista-boletos">
                        {boletos.map((boleto) => (
                            <div key={boleto.id} className="cartao-boleto">
                                <div className="info-boleto">
                                    <h3>Referência: {boleto.mes}</h3>
                                    <p><strong>Vencimento:</strong> {boleto.vencimento}</p>
                                    <p><strong>Valor:</strong> {boleto.valor}</p>
                                </div>
                                
                                <div className="acao-boleto">
                                    <span className={`etiqueta-status ${boleto.status === "Pago" ? "status-pago" : "status-pendente"}`}>
                                        {boleto.status}
                                    </span>
                                    
                                    {boleto.status === "Pendente" && (
                                        <button className="btn-pagar" onClick={() => alert("Código PIX copiado!")}>
                                            Copiar Pix
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BoletoMorador;
