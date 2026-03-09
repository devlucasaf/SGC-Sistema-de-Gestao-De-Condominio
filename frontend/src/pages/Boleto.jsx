import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Boleto.css";

function Boleto() {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [carregando, setCarregando] = useState(false);
    
    /*
    useEffect(() => {
        async function buscarBoletosDoMorador() {
            setCarregando(true);

            try {
                const response = await api.get("/boletos/meus-boletos");

                setBoletos(response.data);
            }
            
            catch(error) {
                console.error("Erro ao buscar boletos:", error);
                alert("Não foi possível carregar seus boletos.");
            }
            
            finally {
                setCarregando(false);
            }
        }

        buscarBoletosDoMorador();
    }, []);
    */
    
    // Apagar depois até o backend de gerar boletos estar pronto

    useEffect(() => {
        const listaFalsa = [
            { 
                id: 1, 
                mes: "Janeiro/2026", 
                vencimento: "10/01/2026", 
                valor: "R$ 450,00", 
                status: "Pago" 
            },
            { 
                id: 2, 
                mes: "Fevereiro/2026", 
                vencimento: "10/02/2026", 
                valor: "R$ 450,00", 
                status: "Pago"
            },
            { 
                id: 3, 
                mes: "Março/2026", 
                vencimento: "10/03/2026", 
                valor: "R$ 450,00", 
                status: "Pendente" 
            },
            { 
                id: 4, 
                mes: "Abril/2026", 
                vencimento: "10/04/2026", 
                valor: "R$ 450,00",
                status: "Pendente" 
            }
        ];
        setBoletos(listaFalsa);
    }, []);

    function alterarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className={`tela-boleto ${isDarkMode ? "tema-escuro" : "tema-claro"}`}>
            
            <button className="btn-tema" onClick={alternarTema}>
                {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
            </button>

            <div className="conteiner-boletos">
                <div className="cabecalho-boletos">
                    <h2>Meus Boletos</h2>


                    <button className="btn-voltar" onClick={() => navigate("/home")}>
                        Voltar para Home
                    </button>
                </div>

                {carregando ? (
                    <p style={{ textAlign: "center" }}>Buscando boletos...</p>
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

export default Boleto;