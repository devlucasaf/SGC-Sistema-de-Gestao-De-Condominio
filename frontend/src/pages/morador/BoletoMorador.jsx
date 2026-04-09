import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../components/Toast";
import Loading from "../../components/Loading";
import "../../styles/BoletoMorador.css";

import { FiSun, FiMoon, FiArrowLeft, FiDollarSign, FiCalendar, FiCopy, FiCheckCircle, FiClock } from "react-icons/fi";

function BoletoMorador() {
    const navigate = useNavigate();
    const toast = useToast();

    const [carregando, setCarregando] = useState(true);
    const [boletos, setBoletos] = useState([]);

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
                        status: b.status === "PAGO" ? "Pago" : "Pendente",
                        urlBoleto: b.urlBoleto
                    }));
                    setBoletos(boletosMapeados);
                }
            } 
            
            catch (error) {
                console.error("Erro ao buscar boletos:", error);
            } 
            
            finally {
                setCarregando(false);
            }
        }
        buscarBoletosDoMorador();
    }, []);

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    function copiarPix() {
        navigator.clipboard.writeText("00020126580014br.gov.bcb.pix0136sgc-condominio@pix.com.br5204000053039865802BR5925SGC CONDOMINIO6009SAO PAULO62070503***6304ABCD");
        toast.sucesso("Código PIX copiado para a área de transferência!", "Copiado");
    }

    return (
        <div className="entregas-container">
            <nav className="navbar">
                <div className="navbar-logo">
                    <h2>Boletos</h2>
                </div>
                <div className="perfil-container">
                    <button className="btn-tema" onClick={alternarTema} aria-label="Alternar Tema">
                        {isDarkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </div>
            </nav>

            <main className="entregas-conteudo">
                <div className="entregas-header">
                    <button className="btn-voltar" onClick={() => navigate("/home")}>
                        <FiArrowLeft /> Voltar para Página Inicial
                    </button>
                </div>

                {carregando ? (
                    <Loading mensagem="Buscando boletos..." />
                ) : boletos.length === 0 ? (
                    <p style={{ textAlign: "center", padding: "40px" }}>Nenhum boleto encontrado.</p>
                ) : (
                    <div className="entregas-lista">
                        {boletos.map((boleto) => (
                            <div key={boleto.id} className="card entregas-card">
                                <div className="card-header entregas-card-header">
                                    <h3 className="card-title">
                                        <FiDollarSign className="card-icon" /> Referência: {boleto.mes}
                                    </h3>

                                    <span className={`badge ${boleto.status === "Pago" ? "badge-success" : "badge-warning"}`}>
                                        {boleto.status === "Pago" ? <FiCheckCircle /> : <FiClock />} {boleto.status}
                                    </span>
                                </div>

                                <div className="card-body">
                                    <p><FiCalendar /> <strong>Vencimento:</strong> {boleto.vencimento}</p>
                                    <p><FiDollarSign /> <strong>Valor:</strong> {boleto.valor}</p>
                                    {boleto.status === "Pendente" && (
                                        <button className="btn-pagar" onClick={copiarPix}>
                                            <FiCopy /> Copiar Pix
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default BoletoMorador;
