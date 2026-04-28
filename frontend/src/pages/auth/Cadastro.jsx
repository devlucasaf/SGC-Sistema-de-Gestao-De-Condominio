import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiMoon, FiSun, FiChevronDown, FiCalendar } from "react-icons/fi";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import api from '../../services/api.js';
import { useToast } from "../../components/Toast";
import DatePickerHeader from "../../components/DatePickerHeader";
import "../../styles/Login.css";
import "../../styles/Cadastro.css";

registerLocale("pt-BR", ptBR);

function Cadastro() {
    const [nome,            setNome]            =   useState("");
    const [cpf,             setCpf]             =   useState("");
    const [email,           setEmail]           =   useState("");
    const [senha,           setSenha]           =   useState("");
    const [dataNascimento,  setDataNascimento]  =   useState(null);
    const [telefone,        setTelefone]        =   useState("");
    const [tipoMorador,     setTipoMorador]     =   useState("");
    const [idUnidade,       setIdUnidade]       =   useState('');
    const [mensagem,        setMensagem]        =   useState("");
    const [mostrarSenha,    setMostrarSenha]    =   useState(false);
    const [dropdownAberto,  setDropdownAberto]  =   useState(false);
    const dropdownRef = useRef(null);

    const opcoesTipoMorador = [
        { valor: "PROPRIETARIO", label: "Proprietário"},
        { valor: "INQUILINO",    label: "Inquilino"   },
        { valor: "DEPENDENTE",   label: "Dependente"  },
    ];

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    const navigate = useNavigate();
    const toast = useToast();

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

    // --- FECHAR DROPDOWN AO CLICAR FORA ---
    useEffect(() => {
        function handleClickFora(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

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
                dataNascimento: dataNascimento
                    ? dataNascimento.toISOString().split("T")[0]
                    : "",
                telefone: telefone.replace(/\D/g, ""),
                tipoMorador,
                idUnidade: Number(idUnidade),
            };

            await api.post("/moradores", dadosMorador);

            toast.sucesso("Morador cadastrado com sucesso!", "Cadastro realizado");

            setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            console.error(error);

            // --- EXIBE OS ERROS DE VALIDAÇÃO DO BACKEND ---
            if (error.response && error.response.data) {
                const data = error.response.data;

                if (data.messages && Array.isArray(data.messages)) {
                    setMensagem(data.messages.join(" | "));
                } else if (data.message) {
                    setMensagem(data.message);
                } else {
                    setMensagem("Erro ao cadastrar morador. Verifique os dados informados.");
                }
            } else {
                setMensagem("Erro de conexão com o servidor.");
            }
        }
    }

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className="tela-auth">

            <nav className="navbar-auth">
                <h1>Residencial Boca de Pedreiro</h1>
                <button className="btn-tema" onClick={alternarTema} type="button" aria-label="Alternar Tema">
                    {isDarkMode ? <FiSun /> : <FiMoon />}
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

                    <div className="campo-duplo">
                        <input
                            type="text"
                            placeholder="CPF (Ex: 123.456.789-09)"
                            value={cpf}
                            onChange={(e) => setCpf(formatarCpf(e.target.value))}
                            maxLength={14}
                            required
                        />

                        <div className="datepicker-wrapper">
                            <DatePicker
                                selected={dataNascimento}
                                onChange={(date) => setDataNascimento(date)}
                                locale="pt-BR"
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Data de Nascimento"
                                maxDate={new Date()}
                                minDate={new Date(1920, 0, 1)}
                                className="datepicker-input"
                                calendarClassName="datepicker-calendario"
                                required
                                autoComplete="off"
                                renderCustomHeader={DatePickerHeader}
                            />
                            <FiCalendar className="datepicker-icone" />
                        </div>
                    </div>

                    <div className="campo-duplo">
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Telefone (Ex: (11) 99999-9999)"
                            value={telefone}
                            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                            maxLength={15}
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            placeholder="Senha de Acesso"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
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
                                fontSize: "18px",
                                color: "inherit",
                                padding: "4px",
                            }}
                            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {mostrarSenha ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>

                    <div className="campo-duplo">
                        <div className="custom-select-wrapper" ref={dropdownRef}>
                            <div
                                className={`custom-select-trigger ${dropdownAberto ? "aberto" : ""} ${tipoMorador ? "selecionado" : ""}`}
                                onClick={() => setDropdownAberto(!dropdownAberto)}
                            >
                                <span>
                                    {tipoMorador
                                        ? opcoesTipoMorador.find(o => o.valor === tipoMorador)?.label
                                        : "Tipo de Morador"}
                                </span>
                                <FiChevronDown className={`custom-select-arrow ${dropdownAberto ? "girar" : ""}`} />
                            </div>
                            {dropdownAberto && (
                                <ul className="custom-select-opcoes">
                                    {opcoesTipoMorador.map((opcao) => (
                                        <li
                                            key={opcao.valor}
                                            className={`custom-select-item ${tipoMorador === opcao.valor ? "ativo" : ""}`}
                                            onClick={() => {
                                                setTipoMorador(opcao.valor);
                                                setDropdownAberto(false);
                                            }}
                                        >
                                            {opcao.label}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <input
                                type="text"
                                value={tipoMorador}
                                required
                                tabIndex={-1}
                                style={{ 
                                    position: "absolute", 
                                    opacity: 0, 
                                    height: 0, 
                                    width: 0, 
                                    pointerEvents: "none" 
                                }}
                                onChange={() => {}}
                            />
                        </div>

                        <input
                            type="number"
                            placeholder="ID da Unidade (Ex: 1)"
                            value={idUnidade}
                            onChange={(e) => setIdUnidade(e.target.value)}
                            required
                            title="Digite o ID de um apartamento já cadastrado"
                        />
                    </div>

                    <button type="submit" className="btn-cadastrar">
                        Salvar Cadastro
                    </button>

                    <span
                        className="link-voltar"
                        onClick={() => navigate("/")}
                        style={{ 
                            color: "#2ecc71", 
                            fontWeight: "bold", 
                            textAlign: "center", 
                            cursor: "pointer" 
                        }}
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
