import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../services/api.js";
import "../../styles/Login.css";

function AlterarSenha() {
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
    const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMsg, setTipoMsg] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const navigate = useNavigate();

    async function handleAlterar(e) {
        e.preventDefault();
        setMensagem("");

        if (novaSenha !== confirmarSenha) {
            setMensagem("As senhas não coincidem!");
            setTipoMsg("erro");
            return;
        }

        if (novaSenha.length < 6) {
            setMensagem("A nova senha deve ter no mínimo 6 caracteres.");
            setTipoMsg("erro");
            return;
        }

        if (senhaAtual === novaSenha) {
            setMensagem("A nova senha deve ser diferente da senha atual.");
            setTipoMsg("erro");
            return;
        }

        setEnviando(true);

        try {
            const response = await api.patch("/perfil/alterar-senha", {
                senhaAtual,
                novaSenha,
            });

            setMensagem(response.data.mensagem);
            setTipoMsg("ok");
            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarSenha("");

            // --- REDIRECIONA PARA O HOME ---
            setTimeout(() => navigate("/home"), 2000);
        }

        catch (error) {
            const msg =
                error.response?.data?.messages?.[0] ||
                error.response?.data?.message ||
                error.response?.data?.erro ||
                "Erro ao alterar a senha.";
            setMensagem(msg);
            setTipoMsg("erro");
        }

        finally {
            setEnviando(false);
        }
    }

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className={`tela-auth ${isDarkMode ? "tema-escuro" : "tema-claro"}`}>
            <nav className="navbar-auth">
                <h1>SGC Condomínio</h1>
                <button className="btn-tema" onClick={alternarTema} type="button">
                    {isDarkMode ? "☀️" : "🌙"}
                </button>
            </nav>

            <main className="auth-conteudo">
                <form className="caixa-login" onSubmit={handleAlterar}>
                    <h2>Alterar Minha Senha</h2>
                    <p style={{ textAlign: "center", fontSize: "0.9rem", opacity: 0.8, marginBottom: "5px" }}>
                        Informe sua senha atual e defina a nova senha.
                    </p>

                    {/* --- SENHA ATUAL --- */}
                    <div style={{ position: "relative" }}>
                        <input
                            type={mostrarSenhaAtual ? "text" : "password"}
                            placeholder="Senha atual"
                            value={senhaAtual}
                            onChange={(e) => setSenhaAtual(e.target.value)}
                            required
                            style={{ 
                                width: "100%", 
                                paddingRight: "45px", 
                                boxSizing: "border-box" 
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                            style={{
                                position: "absolute", 
                                right: "10px", 
                                top: "50%",
                                transform: "translateY(-50%)", 
                                background: "none",
                                border: "none", 
                                cursor: "pointer", 
                                color: "inherit", 
                                padding: "4px",
                            }}
                            aria-label={mostrarSenhaAtual ? "Ocultar" : "Mostrar"}
                        >
                            {mostrarSenhaAtual ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>

                    {/* --- NOVA SENHA --- */}
                    <div style={{ position: "relative" }}>
                        <input
                            type={mostrarNovaSenha ? "text" : "password"}
                            placeholder="Nova senha (mín. 6 caracteres)"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            required
                            style={{ 
                                width: "100%", 
                                paddingRight: "45px", 
                                boxSizing: "border-box" 
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                            style={{
                                position: "absolute", 
                                right: "10px", 
                                top: "50%",
                                transform: "translateY(-50%)", 
                                background: "none",
                                border: "none", 
                                cursor: "pointer", 
                                color: "inherit", 
                                padding: "4px",
                            }}
                            aria-label={mostrarNovaSenha ? "Ocultar" : "Mostrar"}
                        >
                            {mostrarNovaSenha ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>

                    {/* --- CONFIRMAR NOVA SENHA --- */}
                    <input
                        type={mostrarNovaSenha ? "text" : "password"}
                        placeholder="Confirmar nova senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                    />

                    {/* --- MENSAGEM DE SUCESSO/ERRO --- */}
                    {mensagem && (
                        <p style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: tipoMsg === "ok" ? "#2ecc71" : "#ff4d4d",
                        }}>
                            {mensagem}
                        </p>
                    )}

                    <button type="submit" className="btn-entrar" disabled={enviando}>
                        {enviando ? "Alterando..." : "Alterar Senha"}
                    </button>

                    <div className="rodape-login">
                        <p>
                            <span
                                onClick={() => navigate(-1)}
                                style={{ 
                                    color: "#2ecc71", 
                                    fontWeight: "bold", 
                                    cursor: "pointer" 
                                }}
                            >
                                ← Voltar
                            </span>
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default AlterarSenha;
