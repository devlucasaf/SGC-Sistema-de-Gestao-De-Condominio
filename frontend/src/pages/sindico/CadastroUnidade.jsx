import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";
import api from "../../services/api.js";
import "../../styles/CadastroUnidade.css";

function CadastroUnidade() {
    const [andar, setAndar] = useState("");
    const [bloco, setBloco] = useState("");
    const [numeroApto, setNumeroApto] = useState("");
    const [mensagem, setMensagem] = useState("");

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    const navigate = useNavigate();

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.setAttribute("dark-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.removeAttribute("dark-theme");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    async function handleCadastro(e) {
        e.preventDefault();
        setMensagem("");

        try {
            const dadosUnidade = {
                andar: Number(andar),
                bloco,
                numeroApto
            };

            await api.post("/unidades", dadosUnidade);

            alert("Unidade cadastrada com sucesso!");

            setAndar("");
            setBloco("");
            setNumeroApto("");

        } 
        
        catch (error) {
            setMensagem("Erro ao cadastrar unidade. Verifique os dados e tente novamente.");
            console.error(error);
        }
    }

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className="tela-cadastro-unidade">

            <button className="btn-tema" onClick={alternarTema} aria-label="Alternar Tema">
                {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>

            <form className="caixa-unidade" onSubmit={handleCadastro}>
                <h2>Cadastrar Unidade</h2>

                <input
                    type="number"
                    placeholder="Andar (Ex: 1)"
                    value={andar}
                    onChange={(e) => setAndar(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Bloco (Ex: A)"
                    value={bloco}
                    onChange={(e) => setBloco(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Número do Apartamento (Ex: 101)"
                    value={numeroApto}
                    onChange={(e) => setNumeroApto(e.target.value)}
                    required
                />

                <button type="submit" className="btn-salvar-unidade">
                    Salvar Unidade
                </button>

                <span
                    className="link-voltar-unidade"
                    onClick={() => navigate("/home")}
                >
                    Voltar para Home
                </span>

                {mensagem && (
                    <p style={{ color: "#ff4d4d", textAlign: "center" }}>
                        {mensagem}
                    </p>
                )}
            </form>
        </div>
    );
}

export default CadastroUnidade;
