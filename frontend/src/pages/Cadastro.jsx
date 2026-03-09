import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import "../styles/Cadastro.css";

function Cadastro() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [telefone, setTelefone] = useState("");
    const [tipoMorador, setTipoMorador] = useState("");
    const [unidadeId, setUnidadeId] = useState('');
    const [mensagem, setMensagem] = useState("");

    const [isDarkMode, setIsDarkMode] = useState(true);

    const navigate = useNavigate();

    async function handleCadastro(e) {
        e.preventDefault();
        setMensagem();

        try {
            const dadosMorador = {
                nome,
                cpf,
                email,
                senha,
                dataNascimento,
                telefone,
                tipoMorador,
                unidadeId: Number(unidadeId),
            };

            await api.post("/moradores", dadosMorador);

            alert("Morador cadastrado com sucesso!");
            
            navigate("/home");
        } catch (error) {
            setMensagem(
                "Erro ao cadastrar morador. Verifique se a unidade existe e os dados informados"
            );
            console.error(error);
        }
    }

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className={`tela-login ${isDarkMode ? 'tema-escuro' : 'tema-claro'}`}>
            
            <button className="btn-tema" onClick={alternarTema}>
                {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
            </button>

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
                        placeholder="CPF (Apenas números)"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
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
                        placeholder="Telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        style={{ width: "50%" }}
                    />
                </div>

                <input
                    type="password"
                    placeholder="Senha de Acesso"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />

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
                        value={unidadeId}
                        onChange={(e) => setUnidadeId(e.target.value)}
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
                    style={{ color: "#2ecc71", fontWeight: "bold", textAlign: "center" }}
                >
                    Voltar para o Login
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

export default Cadastro;
