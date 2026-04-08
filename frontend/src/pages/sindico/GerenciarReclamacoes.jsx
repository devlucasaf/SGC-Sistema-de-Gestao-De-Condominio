import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; 
import "../../styles/GerenciarReclamacoes.css"; 

function GerenciarReclamacoes() {
    const [reclamacoes, setReclamacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    
    const navigate = useNavigate();

    async function buscarReclamacoes() {
        try {
            const response = await api.get("/api/reclamacoes");
            setReclamacoes(response.data.conteudo || []);
        }

        catch (error) {
            console.error("Erro ao buscar reclamações:", error);
            setErro("Não foi possível carregar as reclamações. Verifique a ligação ao servidor.");
        }

        finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarReclamacoes();
    }, []);

    async function alterarStatus(id, novoStatus) {
        try {
            await api.patch(`/api/reclamacoes/${id}/status?novoStatus=${novoStatus}`);
            alert(`Status atualizado para ${novoStatus.replace("_", " ")}!`);
            buscarReclamacoes();
        } 
        
        catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Erro ao atualizar o status da reclamação.");
        }
    }

    const totalPendentes = reclamacoes.filter(r => r.status === "PENDENTE").length;
    const totalEmAnalise = reclamacoes.filter(r => r.status === "EM_ANALISE").length;
    const totalResolvidas = reclamacoes.filter(r => r.status === "RESOLVIDA").length;

    const formatarData = (dataString) => {
        if (!dataString) {
            return "Data não informada";
        }
        
        const data = new Date(dataString);
        return data.toLocaleDateString("pt-PT") + " às " + data.toLocaleTimeString("pt-PT", { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="tela-gerenciar-reclamacoes">
            <nav className="navbar-sindico">
                <h2>Gerenciamento de Reclamações</h2>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn-voltar-sindico" onClick={() => navigate("/redefinir-senha")}>
                        Redefinir Senha
                    </button>
                    
                    <button className="btn-voltar-sindico" onClick={() => navigate("/home")}>
                        ⬅ Voltar para Home
                    </button>
                </div>
            </nav>

            <div className="conteudo-reclamacoes">
                
                {/* --- PAINEL DE RESUMO --- */}
                <div className="painel-resumo">
                    <div className="cartao-resumo pendente">
                        <h3>Pendentes</h3>
                        <p>{totalPendentes}</p>
                    </div>

                    <div className="cartao-resumo analise">
                        <h3>Em Análise</h3>
                        <p>{totalEmAnalise}</p>
                    </div>

                    <div className="cartao-resumo resolvida">
                        <h3>Resolvidas</h3>
                        <p>{totalResolvidas}</p>
                    </div>
                </div>

                {/* --- LISTA DE RECLAMAÇÕES --- */}
                <div className="lista-reclamacoes">
                    <h3>Todas as Reclamações</h3>
                    
                    {carregando && <p className="mensagem-aviso">Buscando reclamações no servidor...</p>}
                    {erro && <p className="mensagem-erro">{erro}</p>}
                    
                    {!carregando && reclamacoes.length === 0 && !erro && (
                        <p className="mensagem-aviso">Nenhuma reclamação registada até ao momento! 🎉</p>
                    )}

                    {!carregando && reclamacoes.length > 0 && (
                        <div className="grid-reclamacoes">
                            {reclamacoes.map((reclamacao) => (
                                <div key={reclamacao.id} className="cartao-reclamacao">
                                    <div className="cabecalho-reclamacao">
                                        <span className="categoria-tag">{reclamacao.categoria}</span>
                                        <span className={`status-badge status-${reclamacao.status.toLowerCase()}`}>
                                            {reclamacao.status.replace("_", " ")}
                                        </span>
                                    </div>
                                    
                                    <p className="descricao-texto">"{reclamacao.descricao}"</p>
                                    
                                    <div className="rodape-reclamacao">
                                        <p><strong>Unidade/Bloco:</strong> {reclamacao.unidade || "Não informado"}</p>
                                        <p><strong>Tipo:</strong> {reclamacao.tipo}</p>
                                        <p className="data-reclamacao">Registado em: {formatarData(reclamacao.dataCriacao)}</p>

                                        {reclamacao.status !== "RESOLVIDA" && (
                                            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                                                {reclamacao.status === "PENDENTE" && (
                                                    <button
                                                        className="btn-status-analise"
                                                        onClick={() => alterarStatus(reclamacao.id, "EM_ANALISE")}
                                                        style={{ 
                                                            padding: "6px 12px", 
                                                            borderRadius: "6px", 
                                                            border: "none", 
                                                            cursor: "pointer", 
                                                            backgroundColor: "#f39c12", 
                                                            color: "white", 
                                                            fontWeight: "bold" 
                                                        }}
                                                    >
                                                        Mover para Análise
                                                    </button>
                                                )}
                                                <button
                                                    className="btn-status-resolvida"
                                                    onClick={() => alterarStatus(reclamacao.id, "RESOLVIDA")}
                                                    style={{ 
                                                        padding: "6px 12px", 
                                                        borderRadius: "6px", 
                                                        border: "none", 
                                                        cursor: "pointer", 
                                                        backgroundColor: "#2ecc71", 
                                                        color: "white", 
                                                        fontWeight: "bold" 
                                                    }}
                                                >
                                                    Marcar como Resolvida
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GerenciarReclamacoes;