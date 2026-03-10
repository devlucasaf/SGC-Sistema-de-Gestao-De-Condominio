import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ReclamacaoMorador.css";

function ReclamacaoMorador() {
    const [tipo, setTipo] = useState("");
    const [ categoria, setCategoria] = useState("");
    const [descricao, setDescricao] = useState("");
    const [unidade, setUnidade] = useState("");

    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(true);

    const categoriasCondominio = [
        "Elevador",
        "Churrasqueira suja",
        "Infestação de insetos/pragas",
        "Problemas de iluminação",
        "Falta de água",
        "Academia",
        "Salão de festas",
        "Piscina",
        "Playground",
        "Outros"
    ];

    const categoriasMorador = [
        "Barulho excessivo",
        "Animais de estimação",
        "Arrastar móveis",
        "Festas",
        "Estacionou na vaga de outro morador",
        "Lixo deixado na área comum",
        "Jogando água da varanda",
        "Outros"
    ];

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    async function enviarReclamacao(e) {
        e.preventDefault();

        const novaReclamacao = {
            tipo,
            categoria,
            descricao,
            unidade: tipo === "morador" ? unidade : null
        };

        try {
            await api.post("/reclamacoes", novaReclamacao);
            alert("Reclamação registrada com sucesso!");

            setTipo("");
            setCategoria("");
            setDescricao("");
            setUnidade("");
        }

        catch (error) {
            alert("Erro ao enviar a reclamação. Por favor, tente novamente.");
        }
    }

    return (
        <div className={`tela-reclamacao ${isDarkMode ? "tema-escuro" : "tema-claro"}`}>
            
            <nav className="navbar-reclamacao">
                <h2>Ouvidoria / Reclamações</h2>
                <button className="btn-tema" onClick={alternarTema}>
                    {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
                </button>
            </nav>

            <div className="conteiner-reclamacao">
                <div className="cabecalho-reclamacao">
                    <button className="btn-voltar" onClick={() => navigate("/paginainicialmorador")}>
                        ⬅ Voltar para Página Inicial
                    </button>
                </div>

                <div className="cartao-formulario">
                    <h3>Registrar Nova Reclamação</h3>
                    <p>Selecione abaixo sobre o que você deseja relatar.</p>

                    <form onSubmit={enviarReclamacao} className="form-reclamacao">
                        
                        {/* 1. Escolha do Tipo */}
                        <div className="grupo-botoes-tipo">
                            <button 
                                type="button" 
                                className={`btn-tipo ${tipo === "condominio" ? "ativo" : ""}`}
                                onClick={() => { setTipo("condominio"); setCategoria(""); }}
                            >
                                🏢 Problema no Condomínio
                            </button>
                            <button 
                                type="button" 
                                className={`btn-tipo ${tipo === "morador" ? "ativo" : ""}`}
                                onClick={() => { setTipo("morador"); setCategoria(""); }}
                            >
                                🗣️ Problema com Morador
                            </button>
                        </div>

                        {/* 2. Formulário Dinâmico (Só aparece depois de escolher o tipo) */}
                        {tipo && (
                            <div className="campos-dinamicos fadeIn">
                                
                                <div className="campo-form">
                                    <label>Categoria da Reclamação:</label>
                                    <select 
                                        value={categoria} 
                                        onChange={(e) => setCategoria(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Selecione um motivo --</option>
                                        {tipo === "condominio" 
                                            ? categoriasCondominio.map((cat) => 
                                                <option 
                                                    key={cat} 
                                                    value={cat}>{cat}
                                                    </option>
                                                )
                                            : categoriasMorador.map((cat) => <option key={cat} value={cat}>{cat}</option>)
                                        }
                                    </select>
                                </div>

                                {/* Campo extra se for sobre outro morador */}
                                {tipo === "morador" && (
                                    <div className="campo-form">
                                        <label>Qual é a Unidade/Bloco do Infrator? (Opcional)</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: Bloco B, Apto 402" 
                                            value={unidade}
                                            onChange={(e) => setUnidade(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="campo-form">
                                    <label>Descreva os detalhes:</label>
                                    <textarea 
                                        rows="4" 
                                        placeholder="Conte o que aconteceu..." 
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn-enviar-reclamacao">
                                    Enviar Reclamação
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ReclamacaoMorador;