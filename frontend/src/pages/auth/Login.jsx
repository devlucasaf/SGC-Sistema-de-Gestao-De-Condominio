import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import api from "../../services/api.js";
import "../../styles/Login.css"; 

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    
    // --- CRIANDO O ESTADO DO TEMA ---
    const [isDarkMode, setIsDarkMode] = useState(true); 

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setErro("");

        try {
            // --- FAZ A REQUISIÇÃO DE LOGIN PARA O BACKEND ---
            const response = await api.post("/auth/login", { email, senha });

            // --- SALVA O TOKEN JWT NO NAVEGADOR ---
            const token = response.data.token;
            localStorage.setItem("token", token);

            // --- BUSCA OS DADOS DO USUÁRIO LOGADO ---
            const perfil = await api.get("/perfil", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // --- SALVA O PERFIL PARA USAR EM OUTRAS TELAS ---
            localStorage.setItem("perfilUsuario", JSON.stringify(perfil.data));

            alert("Login realizado com sucesso!");

            // --- REDIRECIONA BASEADO NO TIPO DE USUÁRIO SALVO NO BANCO ---
            if (perfil.data.tipoUsuario === "SINDICO") {
                navigate("/gerenciarreclamacoes");
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
        <div className={`tela-login ${isDarkMode ? "tema-escuro" : "tema-claro"}`}>
            <button className="btn-tema" onClick={alternarTema} type="button">
                {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
            </button>

            <form className="caixa-login" onSubmit={handleLogin}>
                <h2>Login Residencial</h2>
                
                <input 
                    type="email" 
                    placeholder="Seu E-mail" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                
                <input 
                    type="password" 
                    placeholder="Sua Senha" 
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />
                
                <button type="submit" className="btn-entrar">Entrar</button>
                
                {/* Se a variável 'erro' tiver texto, esse parágrafo aparece */}
                {erro && <p style={{ color: "#ff4d4d", textAlign: "center", marginTop: "10px" }}>{erro}</p>}

                <div className="rodape-login">
                    <p>
                        Não possui conta?{ " " }
                        <Link to="/cadastro" style={{ color: "#2ecc71", fontWeight: "bold", textAlign: "center" }}>
                            Cadastre-se aqui
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Login;
