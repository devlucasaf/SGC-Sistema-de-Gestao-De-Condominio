import { useState, useEffect }  from "react";
import { useNavigate }          from "react-router-dom";
import api from "../../services/api";
import "../../styles/Reclamacao.css";

import { FiSun, FiMoon, FiArrowLeft, FiLock, FiMail, FiEye, FiEyeOff } from "react-icons/fi";

function RedefinirSenha() {
    const [email         , setEmail         ] = useState("");
    const [novaSenha     , setNovaSenha     ] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenha  , setMostrarSenha  ] = useState(false);
    const [enviando      , setEnviando      ] = useState(false);
    const [mensagem      , setMensagem      ] = useState("");
    const [tipoMensagem  , setTipoMensagem  ] = useState(""); 

    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

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

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    async function handleRedefinir(e) {
        e.preventDefault();
        setMensagem("");

        if (novaSenha !== confirmarSenha) {
            setMensagem("As senhas não coincidem!");
            setTipoMensagem("erro");
            return;
        }

        if (novaSenha.length < 6) {
            setMensagem("A nova senha deve ter no mínimo 6 caracteres.");
            setTipoMensagem("erro");
            return;
        }

        setEnviando(true);

        try {
            const response = await api.patch("/admin/usuarios/redefinir-senha", {
                email,
                novaSenha
            });

            setMensagem(response.data.mensagem);
            setTipoMensagem("sucesso");
            setEmail("");
            setNovaSenha("");
            setConfirmarSenha("");
        } catch (error) {
            const msg = error.response?.data?.erros?.[0]
                || error.response?.data?.mensagem
                || "Erro ao redefinir senha. Verifique o e-mail informado.";
            setMensagem(msg);
            setTipoMensagem("erro");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="entregas-container">
            <nav className="navbar">
                <div className="navbar-logo">
                    <h2><FiLock style={{ marginRight: "8px" }} /> Redefinir Senha</h2>
                </div>

                <div className="perfil-container">
                    <button className="btn-tema" onClick={alternarTema} aria-label="Alternar Tema">
                        {isDarkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </div>
            </nav>

            <main className="entregas-conteudo">
                <div className="entregas-header">
                    <button className="btn-voltar" onClick={() => navigate("/gerenciarreclamacoes")}>
                        <FiArrowLeft /> Voltar ao Painel do Síndico
                    </button>
                </div>

                <div className="cartao-formulario">
                    <h3>Redefinir Senha de Usuário</h3>
                    <p>Informe o e-mail do morador ou porteiro e defina uma nova senha.</p>

                    <form onSubmit={handleRedefinir} className="form-reclamacao">
                        <div className="campos-dinamicos fadeIn">
                            <div className="campo-form">
                                <label><FiMail style={{ marginRight: "6px" }} />E-mail do Usuário:</label>
                                <input
                                    type="email"
                                    placeholder="Ex: morador@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="campo-form">
                                <label><FiLock style={{ marginRight: "6px" }} />Nova Senha:</label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type={mostrarSenha ? "text" : "password"}
                                        placeholder="Mínimo 6 caracteres"
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
                                        onClick={() => setMostrarSenha(!mostrarSenha)}
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
                                        aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                    >
                                        {mostrarSenha ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="campo-form">
                                <label><FiLock style={{ marginRight: "6px" }} />Confirmar Nova Senha:</label>
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Repita a nova senha"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    required
                                />
                            </div>

                            {mensagem && (
                                <p style={{
                                    textAlign: "center",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    fontWeight: "bold",
                                    backgroundColor: tipoMensagem === "sucesso"
                                        ? "rgba(46, 204, 113, 0.15)"
                                        : "rgba(231, 76, 60, 0.15)",
                                    color: tipoMensagem === "sucesso" ? "#2ecc71" : "#e74c3c"
                                }}>
                                    {mensagem}
                                </p>
                            )}

                            <button type="submit" className="btn-enviar-reclamacao" disabled={enviando}>
                                <FiLock /> {enviando ? "Redefinindo..." : "Redefinir Senha"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default RedefinirSenha;
