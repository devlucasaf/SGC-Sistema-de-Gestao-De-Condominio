import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Juntei as importações aqui!
import api from "../services/api";
import "../styles/Login.css"; 

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState(""); // <-- Criei o estado para guardar o erro
    
    // Criando o estado do tema 
    const [isDarkMode, setIsDarkMode] = useState(true); 

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setErro(""); // Limpa o erro de tentativas anteriores

        try {
            // Chama a sua API Java
            const response = await api.post("/auth/login", { email, senha });
            
            // Pega o token que o Java devolveu e salva
            const token = response.data.token;
            localStorage.setItem("token", token);
            
            alert("Login realizado com sucesso! 🎉");
            navigate("/home");
            
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            // Agora atualizamos a variável 'erro' para aparecer na tela
            setErro("Falha no login: Verifique seu e-mail e senha."); 
        }
    }

    // Função que inverte o tema
    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        // Aqui decidimos qual classe CSS usar dependendo do estado
        <div className={`tela-login ${isDarkMode ? "tema-escuro" : "tema-claro"}`}>
            
            {/* type="button" evita que este botão tente enviar o formulário sem querer */}
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