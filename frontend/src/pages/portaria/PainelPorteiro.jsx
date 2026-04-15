import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../components/Toast";
import { FiSun, FiMoon, FiPackage, FiAlertCircle, FiCalendar, FiFileText, FiUser } from "react-icons/fi";
import "../../styles/PainelPorteiro.css";

// --- COMPONENTES DAS ABAS ---
import PorteiroDashboard    from "./components/PorteiroDashboard";
import PorteiroEntregas     from "./components/PorteiroEntregas";
import PorteiroReclamacoes  from "./components/PorteiroReclamacoes";
import PorteiroReservas     from "./components/PorteiroReservas";
import PorteiroSolicitacoes from "./components/PorteiroSolicitacoes";
import PorteiroMeuCadastro  from "./components/PorteiroMeuCadastro";

function PainelPorteiro() {
    const [abaAtiva, setAbaAtiva] = useState("dashboard");
    const navigate = useNavigate();
    const toast = useToast();

    // --- DADOS ---
    const [encomendas, setEncomendas] = useState([]);
    const [reclamacoes, setReclamacoes] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // --- MEU PERFIL ---
    const [meuNome, setMeuNome] = useState("");
    const [meuEmail, setMeuEmail] = useState("");
    const [meuTelefone, setMeuTelefone] = useState("");
    const [salvandoPerfil, setSalvandoPerfil] = useState(false);

    // --- TEMA ---
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

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

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    const perfil = JSON.parse(localStorage.getItem("perfilUsuario") || "{}");

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        setCarregando(true);
        try {
            const [resEncomendas, resReclamacoes, resReservas, resUnidades, resSolicitacoes] = await Promise.all([
                api.get("/encomendas").catch(() => ({ data: [] })),
                api.get("/api/reclamacoes").catch(() => ({ data: { conteudo: [] } })),
                api.get("/reservas/todas").catch(() => ({ data: [] })),
                api.get("/unidades").catch(() => ({ data: [] })),
                api.get("/api/solicitacoes").catch(() => ({ data: { conteudo: [] } })),
            ]);

            setEncomendas(resEncomendas.data || []);
            setReclamacoes(resReclamacoes.data.conteudo || resReclamacoes.data || []);
            setReservas(resReservas.data || []);
            setUnidades(resUnidades.data || []);
            setSolicitacoes(resSolicitacoes.data.conteudo || resSolicitacoes.data || []);
        }

        catch (err) {
            console.error("Erro ao carregar dados:", err);
        }

        finally {
            setCarregando(false);
        }
    }

    // --- MEU PERFIL ---
    async function carregarMeuPerfilPorteiro() {
        try {
            const res = await api.get("/perfil");
            const p = res.data;
            setMeuNome(p.nome || "");
            setMeuEmail(p.email || "");
            setMeuTelefone(formatarTelefone(p.telefone || ""));
        }

        catch (err) {
            console.error("Erro ao carregar perfil:", err);
        }
    }

    function formatarTelefone(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);
        return numeros
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }

    async function salvarPerfilPorteiro(e) {
        e.preventDefault();
        setSalvandoPerfil(true);
        try {
            const res = await api.patch("/perfil/atualizar-cadastro", {
                nome: meuNome.trim(),
                email: meuEmail.trim(),
                telefone: meuTelefone.replace(/\D/g, ""),
            });
            localStorage.setItem("perfilUsuario", JSON.stringify(res.data));
            toast.sucesso("Cadastro atualizado com sucesso!");
        }

        catch (err) {
            console.error("Erro ao salvar perfil:", err);
            toast.erro(err.response?.data?.erro || "Erro ao atualizar cadastro.");
        }

        finally {
            setSalvandoPerfil(false);
        }
    }

    // --- LOGOUT ---
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("perfilUsuario");
        navigate("/login");
    }

    // --- HELPERS ---
    function formatarData(dataString) {
        if (!dataString) {
            return "—";
        }
        const data = new Date(dataString);
        return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }

    function formatarDataCurta(dataString) {
        if (!dataString) {
            return "—";
        }
        return new Date(dataString).toLocaleDateString("pt-BR");
    }

    // --- CONTADORES ---
    const encomendasPendentes = encomendas.filter(e => e.status === "AGUARDANDO_RETIRADA").length;
    const reclamacoesPendentes = reclamacoes.filter(r => r.status === "PENDENTE").length;
    const reservasHoje = reservas.filter(r => {
        const hoje = new Date().toISOString().split("T")[0];
        return r.dataReserva === hoje;
    }).length;
    const solicitacoesPendentes = solicitacoes.filter(s => s.status === "PENDENTE").length;

    return (
        <div className="painel-porteiro">
            {/* --- SIDEBAR --- */}
            <aside className="sidebar-porteiro">
                <div className="sidebar-logo">
                    <h2>Residencial Boca de Pedreiro</h2>
                    <span>Portaria</span>
                </div>

                <ul className="sidebar-menu">
                    <li>
                        <button className={abaAtiva === "dashboard" ? "ativo" : ""} onClick={() => setAbaAtiva("dashboard")}>
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button className={abaAtiva === "entregas" ? "ativo" : ""} onClick={() => setAbaAtiva("entregas")}>
                            <FiPackage /> Entregas
                            {encomendasPendentes > 0 && <span className="badge-count">{encomendasPendentes}</span>}
                        </button>
                    </li>

                    <li>
                        <button className={abaAtiva === "reclamacoes" ? "ativo" : ""} onClick={() => setAbaAtiva("reclamacoes")}>
                            <FiAlertCircle /> Reclamações
                            {reclamacoesPendentes > 0 && <span className="badge-count">{reclamacoesPendentes}</span>}
                        </button>
                    </li>

                    <li>
                        <button className={abaAtiva === "reservas" ? "ativo" : ""} onClick={() => setAbaAtiva("reservas")}>
                            <FiCalendar /> Reservas
                            {reservasHoje > 0 && <span className="badge-count">{reservasHoje}</span>}
                        </button>
                    </li>

                    <li>
                        <button className={abaAtiva === "solicitacoes" ? "ativo" : ""} onClick={() => setAbaAtiva("solicitacoes")}>
                            <FiFileText /> Solicitações
                            {solicitacoesPendentes > 0 && <span className="badge-count">{solicitacoesPendentes}</span>}
                        </button>
                    </li>

                    <li style={{ borderTop: "1px solid var(--border-color)", marginTop: "8px", paddingTop: "8px" }}>
                        <button className={abaAtiva === "meu-cadastro" ? "ativo" : ""} onClick={() => { setAbaAtiva("meu-cadastro"); carregarMeuPerfilPorteiro(); }}>
                            <FiUser /> Meu Cadastro
                        </button>
                    </li>
                </ul>

                <div className="sidebar-logout">
                    <button onClick={handleLogout}>Sair</button>
                </div>
            </aside>

            {/* --- CONTEÚDO --- */}
            <div className="conteudo-porteiro">
                <header className="header-porteiro">
                    <h1>
                        {abaAtiva === "dashboard" && "Dashboard"}
                        {abaAtiva === "entregas" && "Entregas / Encomendas"}
                        {abaAtiva === "reclamacoes" && "Reclamações"}
                        {abaAtiva === "reservas" && "Reservas de Áreas"}
                        {abaAtiva === "solicitacoes" && "Solicitações dos Moradores"}
                        {abaAtiva === "meu-cadastro" && "Meu Cadastro"}
                    </h1>

                    <div className="header-acoes">
                        <span className="header-nome">Olá, {perfil.nome || "Porteiro"}</span>
                        <button className="btn-tema" onClick={alternarTema} aria-label="Alternar Tema">
                            {isDarkMode ? <FiSun /> : <FiMoon />}
                        </button>
                    </div>
                </header>

                <div className="corpo-porteiro">
                    {carregando ? (
                        <p className="msg-vazia">Carregando dados...</p>
                    ) : (
                        <>
                            {abaAtiva === "dashboard" && (
                                <PorteiroDashboard
                                    encomendas={encomendas}
                                    reclamacoes={reclamacoes}
                                    reservas={reservas}
                                    solicitacoes={solicitacoes}
                                    formatarData={formatarData}
                                    formatarDataCurta={formatarDataCurta}
                                    setAbaAtiva={setAbaAtiva}
                                />
                            )}
                            {abaAtiva === "entregas" && (
                                <PorteiroEntregas
                                    encomendas={encomendas}
                                    setEncomendas={setEncomendas}
                                    unidades={unidades}
                                    perfil={perfil}
                                    api={api}
                                    toast={toast}
                                    formatarData={formatarData}
                                />
                            )}
                            {abaAtiva === "reclamacoes" && (
                                <PorteiroReclamacoes
                                    reclamacoes={reclamacoes}
                                    formatarData={formatarData}
                                />
                            )}
                            {abaAtiva === "reservas" && (
                                <PorteiroReservas
                                    reservas={reservas}
                                    formatarDataCurta={formatarDataCurta}
                                />
                            )}
                            {abaAtiva === "solicitacoes" && (
                                <PorteiroSolicitacoes
                                    solicitacoes={solicitacoes}
                                    formatarData={formatarData}
                                />
                            )}
                            {abaAtiva === "meu-cadastro" && (
                                <PorteiroMeuCadastro
                                    meuNome={meuNome}
                                    setMeuNome={setMeuNome}
                                    meuEmail={meuEmail}
                                    setMeuEmail={setMeuEmail}
                                    meuTelefone={meuTelefone}
                                    setMeuTelefone={setMeuTelefone}
                                    salvandoPerfil={salvandoPerfil}
                                    salvarPerfilPorteiro={salvarPerfilPorteiro}
                                    formatarTelefone={formatarTelefone}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PainelPorteiro;
