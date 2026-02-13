import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../style/Login.css'; // <-- Importando nosso CSS novinho!

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    
    // Criando o estado do tema (começa como escuro, você pode mudar pra false se quiser começar no claro)
    const [isDarkMode, setIsDarkMode] = useState(true); 

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setErro('');

        try {
            const response = await api.post('/auth/login', { email, senha });
            const token = response.data.token;
            localStorage.setItem('token', token);
            navigate('/home');
        } catch (error) {
            setErro('Erro ao logar. Verifique e-mail e senha.');
            console.error(error);
        }
    }

    // Função que inverte o tema
    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        // Aqui decidimos qual classe CSS usar dependendo do estado
        <div className={`tela-login ${isDarkMode ? 'tema-escuro' : 'tema-claro'}`}>
        
        <button className="btn-tema" onClick={alternarTema}>
            {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
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
            
            {erro && <p style={{ color: '#ff4d4d', textAlign: 'center' }}>{erro}</p>}
        </form>

        </div>
    );
}

export default Login;