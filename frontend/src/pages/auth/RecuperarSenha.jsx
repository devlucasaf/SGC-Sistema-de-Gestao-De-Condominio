import  { useState, useEffect }                          from "react";
import  { useNavigate, Link }                            from "react-router-dom";
import  { FiEye, FiEyeOff, FiMoon, FiSun, FiCalendar }   from "react-icons/fi";
import  DatePicker, { registerLocale }                   from "react-datepicker";
import  { ptBR }                                         from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../services/api.js";
import DatePickerHeader from "../../components/DatePickerHeader";
import "../../styles/Login.css";
import "../../styles/Cadastro.css";

registerLocale("pt-BR", ptBR);

function RecuperarSenha() {
    const [etapa         ,           setEtapa]   =  useState(1); 
    const [email         ,           setEmail]   =  useState("");
    const [cpf           ,             setCpf]   =  useState("");
    const [dataNascimento,  setDataNascimento]   =  useState(null);
    const [novaSenha     ,       setNovaSenha]   =  useState("");
    const [confirmarSenha,  setConfirmarSenha]   =  useState("");
    const [mostrarSenha  ,    setMostrarSenha]   =  useState(false);
    const [erro          ,            setErro]   =  useState("");
    const [sucesso       ,         setSucesso]   =  useState("");
    const [enviando      ,        setEnviando]   =  useState(false);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });
    const navigate = useNavigate();

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

    // --- MÁSCARA DE CPF ---
    function formatarCPF(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);
        return numeros
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    function avancarEtapa(e) {
        e.preventDefault();
        setErro("");

        if (!email || !cpf || !dataNascimento) {
            setErro("Preencha todos os campos.");
            return;
        }

        const cpfLimpo = cpf.replace(/\D/g, "");
        if (cpfLimpo.length !== 11) {
            setErro("CPF deve ter 11 dígitos.");
            return;
        }

        setEtapa(2);
    }

    async function handleRecuperar(e) {
        e.preventDefault();
        setErro("");
        setSucesso("");

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem!");
            return;
        }

        if (novaSenha.length < 6) {
            setErro("A nova senha deve ter no mínimo 6 caracteres.");
            return;
        }

        setEnviando(true);

        try {
            const response = await api.post("/auth/recuperar-senha", {
                email,
                cpf: cpf.replace(/\D/g, ""),
                dataNascimento: dataNascimento
                    ? dataNascimento.toISOString().split("T")[0]
                    : "",
                novaSenha
            });

            setSucesso(response.data.mensagem);
            setErro("");

            // --- REDIRECIONA PARA O LOGIN ---
            setTimeout(() => navigate("/login"), 3000);
        } catch (error) {
            const msg = error.response?.data?.erros?.[0]
                || error.response?.data?.message
                || "Dados inválidos. Verifique as informações e tente novamente.";
            setErro(msg);
        } finally {
            setEnviando(false);
        }
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
                {etapa === 1 ? (
                    <form className="caixa-login" onSubmit={avancarEtapa}>
                        <h2>Recuperar Senha</h2>
                        <p style={{ textAlign: "center", fontSize: "0.9rem", opacity: 0.8, marginBottom: "10px" }}>
                            Confirme sua identidade para redefinir a senha.
                        </p>

                        <input
                            type="email"
                            placeholder="Seu E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Seu CPF (000.000.000-00)"
                            value={cpf}
                            onChange={(e) => setCpf(formatarCPF(e.target.value))}
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
                                renderCustomHeader={DatePickerHeader}
                                required
                                autoComplete="off"
                            />
                            <FiCalendar className="datepicker-icone" />
                        </div>

                        <button type="submit" className="btn-entrar">
                            Verificar Identidade
                        </button>

                        {erro && <p style={{ color: "#ff4d4d", textAlign: "center", marginTop: "10px" }}>{erro}</p>}

                        <div className="rodape-login">
                            <p>
                                Lembrou a senha?{" "}
                                <Link to="/login" style={{ color: "#2ecc71", fontWeight: "bold" }}>
                                    Voltar ao Login
                                </Link>
                            </p>
                        </div>
                    </form>
                ) : (
                    <form className="caixa-login" onSubmit={handleRecuperar}>
                        <h2>Nova Senha</h2>
                        <p style={{ textAlign: "center", fontSize: "0.9rem", opacity: 0.8, marginBottom: "10px" }}>
                            Identidade confirmada! Defina sua nova senha.
                        </p>

                        <div style={{ position: "relative" }}>
                            <input
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Nova Senha (mín. 6 caracteres)"
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
                                    fontSize: "18px",
                                    color: "inherit",
                                    padding: "4px",
                                }}
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {mostrarSenha ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>

                        <input
                            type={mostrarSenha ? "text" : "password"}
                            placeholder="Confirmar Nova Senha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            required
                        />

                        <button type="submit" className="btn-entrar" disabled={enviando}>
                            {enviando ? "Redefinindo..." : "Redefinir Senha"}
                        </button>

                        {erro && <p style={{ color: "#ff4d4d", textAlign: "center", marginTop: "10px" }}>{erro}</p>}
                        {sucesso && <p style={{ color: "#2ecc71", textAlign: "center", marginTop: "10px", fontWeight: "bold" }}>{sucesso}</p>}

                        <div className="rodape-login">
                            <p>
                                <button
                                    type="button"
                                    onClick={() => { setEtapa(1); setErro(""); setSucesso(""); }}
                                    style={{ 
                                        background: "none", 
                                        border: "none", 
                                        color: "#2ecc71", 
                                        fontWeight: "bold", 
                                        cursor: "pointer", 
                                        fontSize: "inherit" 
                                    }}
                                >
                                    ← Voltar para verificação
                                </button>
                            </p>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}

export default RecuperarSenha;

