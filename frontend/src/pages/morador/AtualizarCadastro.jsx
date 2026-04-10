import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiSun, FiMoon, FiSave, FiUser, FiMail, FiPhone, FiHome, FiLayers } from "react-icons/fi";
import api from "../../services/api";
import { useToast } from "../../components/Toast";
import Loading from "../../components/Loading";
import "../../styles/Home.css";
import "../../styles/AtualizarCadastro.css";

function AtualizarCadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [numeroApto, setNumeroApto] = useState("");
    const [bloco, setBloco] = useState("");
    const [andarCalculado, setAndarCalculado] = useState("");

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

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
        }

        else {
            root.removeAttribute("dark-theme");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    // --- BUSCA OS DADOS ATUAIS DO PERFIL ---
    useEffect(() => {
        const buscarPerfil = async () => {
            try {
                const resposta = await api.get("/perfil");
                const p = resposta.data;

                setNome(p.nome || "");
                setEmail(p.email || "");
                setTelefone(formatarTelefone(p.telefone || ""));
                setNumeroApto(p.numeroApto || "");
                setBloco(p.bloco || "");
                calcularAndar(p.numeroApto || "");
            }

            catch (err) {
                console.error("Erro ao buscar perfil:", err);
                toast.erro("Erro ao carregar dados do perfil.");
            }

            finally {
                setCarregando(false);
            }
        };
        buscarPerfil();
    }, []);

    // --- MÁSCARA DE TELEFONE ---
    function formatarTelefone(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);
        return numeros
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }

    // --- CALCULA O ANDAR PELO NÚMERO DO APTO ---
    function calcularAndar(apto) {
        const numeros = apto.replace(/[^0-9]/g, "");
        if (numeros.length >= 3) {
            const andar = parseInt(numeros.substring(0, numeros.length - 2), 10);
            setAndarCalculado(andar > 0 ? `${andar}º andar` : "Térreo");
        }

        else if (numeros.length > 0) {
            setAndarCalculado("Térreo");
        }

        else {
            setAndarCalculado("");
        }
    }

    function handleNumeroApto(valor) {
        setNumeroApto(valor);
        calcularAndar(valor);
    }

    async function handleSalvar(e) {
        e.preventDefault();
        setSalvando(true);

        try {
            const resposta = await api.patch("/perfil/atualizar-cadastro", {
                nome: nome.trim(),
                email: email.trim(),
                telefone: telefone.replace(/\D/g, ""),
                numeroApto: numeroApto.trim(),
                bloco: bloco.trim().toUpperCase(),
            });

            // --- ATUALIZA O LOCALSTORAGE COM O PERFIL NOVO ---
            localStorage.setItem("perfilUsuario", JSON.stringify(resposta.data));

            toast.sucesso("Cadastro atualizado com sucesso!");
            setTimeout(() => navigate("/home"), 1200);
        }

        catch (err) {
            console.error("Erro ao salvar:", err);
            const msg = err.response?.data?.erro || "Erro ao atualizar cadastro.";
            toast.erro(msg);
        }

        finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return (
            <div className="home-container">
                <Loading mensagem="Carregando dados do perfil..." />
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* --- NAVBAR --- */}
            <nav className="navbar">
                <div className="navbar-logo">
                    <h2>Residencial Boca de Pedreiro</h2>
                </div>

                <div className="acoes-usuario">
                    <button
                        className="btn-tema"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        aria-label="Alternar Tema"
                    >
                        {isDarkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </div>
            </nav>

            {/* --- CONTEÚDO --- */}
            <main className="atualizar-conteudo">
                <div className="atualizar-header">
                    <Link to="/home" className="btn-voltar-atualizar">
                        <FiArrowLeft /> Voltar
                    </Link>
                    <h2>Atualizar Cadastro</h2>
                    <p>Atualize suas informações pessoais e do apartamento.</p>
                </div>

                <form className="atualizar-form" onSubmit={handleSalvar}>
                    {/* --- DADOS PESSOAIS --- */}
                    <div className="atualizar-secao">
                        <h3 className="atualizar-secao-titulo">
                            <FiUser /> Dados Pessoais
                        </h3>

                        <div className="atualizar-campo">
                            <label htmlFor="nome">Nome Completo</label>
                            <div className="input-com-icone">
                                <FiUser className="input-icone" />
                                <input
                                    id="nome"
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Seu nome completo"
                                    required
                                />
                            </div>
                        </div>

                        <div className="atualizar-campo-duplo">
                            <div className="atualizar-campo">
                                <label htmlFor="email">E-mail</label>
                                <div className="input-com-icone">
                                    <FiMail className="input-icone" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="atualizar-campo">
                                <label htmlFor="telefone">Telefone</label>
                                <div className="input-com-icone">
                                    <FiPhone className="input-icone" />
                                    <input
                                        id="telefone"
                                        type="text"
                                        value={telefone}
                                        onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                                        placeholder="(00) 00000-0000"
                                        maxLength={15}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- DADOS DO APARTAMENTO --- */}
                    <div className="atualizar-secao">
                        <h3 className="atualizar-secao-titulo">
                            <FiHome /> Apartamento
                        </h3>

                        <div className="atualizar-campo-triplo">
                            <div className="atualizar-campo">
                                <label htmlFor="numeroApto">Nº do Apartamento</label>
                                <div className="input-com-icone">
                                    <FiHome className="input-icone" />
                                    <input
                                        id="numeroApto"
                                        type="text"
                                        value={numeroApto}
                                        onChange={(e) => handleNumeroApto(e.target.value)}
                                        placeholder="Ex: 101, 1001"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="atualizar-campo">
                                <label htmlFor="bloco">Bloco</label>
                                <div className="input-com-icone">
                                    <FiLayers className="input-icone" />
                                    <input
                                        id="bloco"
                                        type="text"
                                        value={bloco}
                                        onChange={(e) => setBloco(e.target.value.toUpperCase())}
                                        placeholder="Ex: A, B, C"
                                        maxLength={5}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="atualizar-campo">
                                <label>Andar</label>
                                <div className="andar-calculado">
                                    {andarCalculado || "Informe o Apto"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- BOTÃO --- */}
                    <button type="submit" className="btn-salvar-cadastro" disabled={salvando}>
                        <FiSave />
                        {salvando ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </form>
            </main>
        </div>
    );
}

export default AtualizarCadastro;
