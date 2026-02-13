import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    // Função para deslogar (jogar o crachá fora)
    function handleLogout() {
        localStorage.removeItem('token'); // Apaga o token
        navigate('/'); // Manda de volta pro login
    }

    return (
        <div style={{ 
            padding: '20px', 
            fontFamily: 'sans-serif' 
        }}>
        
        <h1>Residencial Leonardo Betoneira</h1>
        <p>Você está na área restrita do sistema.</p>
        
        <button 
            onClick={handleLogout}
            style={{ 
                marginTop: '20px', 
                padding: '10px', 
                backgroundColor: '#ff4d4d', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer' 
            }}
        >
            Sair (Logout)
        </button>
        </div>
    );
}

export default Home;