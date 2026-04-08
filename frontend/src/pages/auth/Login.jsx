import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../services/api.js";
import "../../styles/Login.css"; 

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    // --- CRIANDO O ESTADO DO TEMA ---
    const [isDarkMode, setIsDarkMode] = useState(true); 

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setErro("");

        try {
            // --- FAZ A REQUISIÇÃO DE LOGIN PARA O BACKEND ---
            const response = await api.post("/auth/login", {
                email: email.trim(),
                senha: senha.trim()
            });

            // --- SALVA O TOKEN JWT NO NAVEGADOR ---
            const token = response.data.token;
            localStorage.setItem("token", token);

            // --- BUSCA OS DADOS DO USUÁRIO LOGADO ---
            try {
                const perfil = await api.get("/perfil", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // --- SALVA O PERFIL PARA USAR EM OUTRAS TELAS ---
                localStorage.setItem("perfilUsuario", JSON.stringify(perfil.data));

                // --- REDIRECIONA BASEADO NO TIPO DE USUÁRIO SALVO NO BANCO ---
                if (perfil.data.tipoUsuario === "SINDICO") {
                    navigate("/painel-sindico");
                }

                else if (perfil.data.tipoUsuario === "MORADOR") {
                    navigate("/home");
                }

                else if (perfil.data.tipoUsuario === "PORTEIRO") {
                    navigate("/entregas");
                }

                else {
                    navigate("/home");
                }
            }

            catch (perfilError) {
                console.error("Erro ao buscar perfil:", perfilError);
                navigate("/home");
            }
        }

        catch (error) {
            console.error("Erro ao fazer login:", error);
            setErro("Falha no login: Verifique seu e-mail e senha.");
        }
    }

    // --- FUNÇÃO QUE INVERTE O TEMA ---
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
                <form className="caixa-login" onSubmit={handleLogin}>
                    <h2>Login Residencial</h2>

                    <input
                        type="email"
                        placeholder="Seu E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div style={{ position: "relative" }}>
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            placeholder="Sua Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            style={{ width: "100%", paddingRight: "45px", boxSizing: "border-box" }}
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
                                fontSize: "18px",
                                color: "inherit",
                                padding: "4px",
                            }}
                            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {mostrarSenha ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>

                    <button type="submit" className="btn-entrar">Entrar</button>

                    {erro && <p style={{ color: "#ff4d4d", textAlign: "center", marginTop: "10px" }}>{erro}</p>}

                    <div className="rodape-login">
                        <p>
                            Não possui conta?{ " " }
                            <Link to="/cadastro" style={{ color: "#2ecc71", fontWeight: "bold" }}>
                                Cadastre-se aqui
                            </Link>
                        </p>
                        <p style={{ marginTop: "8px", fontSize: "0.85rem" }}>
                            Esqueceu sua senha?{" "}
                            <Link to="/recuperar-senha" style={{ color: "#2ecc71", fontWeight: "bold" }}>
                                Clique aqui para recuperar
                            </Link>
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default Login;
