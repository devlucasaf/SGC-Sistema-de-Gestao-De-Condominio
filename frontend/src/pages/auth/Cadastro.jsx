import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from '../../services/api.js';
import "../../styles/Login.css";
import "../../styles/Cadastro.css";

function Cadastro() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [telefone, setTelefone] = useState("");
    const [tipoMorador, setTipoMorador] = useState("");
    const [idUnidade, setIdUnidade] = useState('');
    const [mensagem, setMensagem] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(true);

    const navigate = useNavigate();

    // --- MÁSCARA DE CPF ---
    function formatarCpf(valor) {
        return valor
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    // --- MÁSCARA DE TELEFONE ---
    function formatarTelefone(valor) {
        return valor
            .replace(/\D/g, "")
            .slice(0, 11)
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }

    async function handleCadastro(e) {
        e.preventDefault();
        setMensagem("");

        try {
            const dadosMorador = {
                nome,
                cpf: cpf.replace(/\D/g, ""),
                email,
                senha,
                dataNascimento,
                telefone: telefone.replace(/\D/g, ""),
                tipoMorador,
                idUnidade: Number(idUnidade),
            };

            await api.post("/moradores", dadosMorador);

            alert("Morador cadastrado com sucesso!");
            
            navigate("/login");
        } 
        
        catch (error) {
            console.error(error);

            // --- EXIBE OS ERROS DE VALIDAÇÃO DO BACKEND ---
            if (error.response && error.response.data) {
                const data = error.response.data;

                if (data.messages && Array.isArray(data.messages)) {
                    setMensagem(data.messages.join(" | "));
                }

                else if (data.message) {
                    setMensagem(data.message);
                }

                else {
                    setMensagem("Erro ao cadastrar morador. Verifique os dados informados.");
                }
            }

            else {
                setMensagem("Erro de conexão com o servidor.");
            }
        }
    }

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className={`tela-auth ${isDarkMode ? 'tema-escuro' : 'tema-claro'}`}>

            <nav className="navbar-auth">
                <h1>SGC Condomínio</h1>
                <button className="btn-tema" onClick={alternarTema} type="button">
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </nav>

            <main className="auth-conteudo">
                <form className="caixa-cadastro" onSubmit={handleCadastro}>
                    <h2>Cadastrar Morador</h2>

                    <input
                        type="text"
                        placeholder="Nome Completo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />

                    <div style={{ display: "flex", gap: "10px" }}>
                        <input
                            type="text"
                            placeholder="CPF (Ex: 123.456.789-09)"
                            value={cpf}
                            onChange={(e) => setCpf(formatarCpf(e.target.value))}
                            maxLength={14}
                            required
                            style={{ width: "50%" }}
                        />

                        <input
                            type="date"
                            title="Data de Nascimento"
                            value={dataNascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}
                            required
                            style={{
                                width: "50%",
                                color: dataNascimento ? "inherit" : "#888",
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: "50%" }}
                        />

                        <input
                            type="text"
                            placeholder="Telefone (Ex: (11) 99999-9999)"
                            value={telefone}
                            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                            maxLength={15}
                            style={{ width: "50%" }}
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            placeholder="Senha de Acesso"
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

                    <div style={{ display: "flex", gap: "10px" }}>
                        <select
                            value={tipoMorador}
                            onChange={(e) => setTipoMorador(e.target.value)}
                            required
                            style={{
                                width: "50%",
                                padding: "12px",
                                borderRadius: "6px",
                                border: "1px solid #888",
                                backgroundColor: "transparent",
                                color: "inherit",
                                fontSize: "16px",
                            }}
                        >
                            <option value="" disabled style={{ color: "black" }}>
                                Tipo de Morador
                            </option>
                            <option value="PROPRIETARIO" style={{ color: "black" }}>
                                Proprietário
                            </option>
                            <option value="INQUILINO" style={{ color: "black" }}>
                                Inquilino
                            </option>
                            <option value="DEPENDENTE" style={{ color: "black" }}>
                                Dependente
                            </option>
                        </select>

                        <input
                            type="number"
                            placeholder="ID da Unidade (Ex: 1)"
                            value={idUnidade}
                            onChange={(e) => setIdUnidade(e.target.value)}
                            required
                            style={{ width: "50%" }}
                            title="Digite o ID de um apartamento já cadastrado"
                        />
                    </div>

                    <button type="submit" className="btn-cadastrar">
                        Salvar Cadastro
                    </button>

                    <span
                        className="link-voltar"
                        onClick={() => navigate("/")}
                        style={{ color: "#2ecc71", fontWeight: "bold", textAlign: "center", cursor: "pointer" }}
                    >
                        Voltar para o Login
                    </span>

                    {mensagem && (
                        <p style={{ color: "#ff4d4d", textAlign: "center" }}>
                            {mensagem}
                        </p>
                    )}
                </form>
            </main>
        </div>
    );
}

export default Cadastro;
