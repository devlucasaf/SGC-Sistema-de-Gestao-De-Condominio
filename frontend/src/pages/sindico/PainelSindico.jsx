import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../components/Toast";
import { FiSun, FiMoon } from "react-icons/fi";
import { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/PainelSindico.css";

// --- COMPONENTES DAS ABAS ---
import SindicoDashboard     from "./components/SindicoDashboard";
import SindicoMoradores     from "./components/SindicoMoradores";
import SindicoUnidades      from "./components/SindicoUnidades";
import SindicoReclamacoes   from "./components/SindicoReclamacoes";
import SindicoAvisos        from "./components/SindicoAvisos";
import SindicoDocumentos    from "./components/SindicoDocumentos";
import SindicoSolicitacoes  from "./components/SindicoSolicitacoes";
import SindicoInfracoes     from "./components/SindicoInfracoes";
import SindicoEntregas      from "./components/SindicoEntregas";
import SindicoReservas      from "./components/SindicoReservas";
import SindicoMeuPerfil     from "./components/SindicoMeuPerfil";
import SindicoMinhaUnidade  from "./components/SindicoMinhaUnidade";

registerLocale("pt-BR", ptBR);

function PainelSindico() {
    const [abaAtiva, setAbaAtiva] = useState("dashboard");
    const navigate = useNavigate();
    const toast = useToast();

    // --- DADOS ---
    const [moradores, setMoradores] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [reclamacoes, setReclamacoes] = useState([]);
    const [avisos, setAvisos] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [infracoes, setInfracoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // --- MEU PERFIL ---
    const [meuNome, setMeuNome] = useState("");
    const [meuEmail, setMeuEmail] = useState("");
    const [meuTelefone, setMeuTelefone] = useState("");
    const [meuNumeroApto, setMeuNumeroApto] = useState("");
    const [meuBloco, setMeuBloco] = useState("");
    const [meuAndarCalc, setMeuAndarCalc] = useState("");
    const [salvandoPerfil, setSalvandoPerfil] = useState(false);
    const [perfilCompleto, setPerfilCompleto] = useState(null);

    // --- ENTREGAS ---
    const [minhasEntregas, setMinhasEntregas] = useState([]);
    const [carregandoEntregas, setCarregandoEntregas] = useState(false);

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
            const [resMoradores, resUnidades, resReclamacoes, resAvisos, resDocumentos, resSolicitacoes, resInfracoes] = await Promise.all([
                api.get("/moradores").catch((err) => { console.error("Erro ao carregar moradores:", err.response?.status, err.response?.data); return { data: [] }; }),
                api.get("/unidades").catch(() => ({ data: [] })),
                api.get("/api/reclamacoes").catch(() => ({ data: { conteudo: [] } })),
                api.get("/avisos").catch(() => ({ data: [] })),
                api.get("/documentos").catch(() => ({ data: [] })),
                api.get("/api/solicitacoes").catch(() => ({ data: { conteudo: [] } })),
                api.get("/api/infracoes").catch(() => ({ data: [] })),
            ]);

            setMoradores(resMoradores.data || []);
            setUnidades(resUnidades.data || []);
            setReclamacoes(resReclamacoes.data.conteudo || resReclamacoes.data || []);
            setAvisos(resAvisos.data || []);
            setDocumentos(resDocumentos.data || []);
            setSolicitacoes(resSolicitacoes.data.conteudo || resSolicitacoes.data || []);
            setInfracoes(resInfracoes.data || []);
        } 
        
        catch (err) {
            console.error("Erro ao carregar dados:", err);
        } 
        
        finally {
            setCarregando(false);
        }
    }

    // --- LOGOUT ---
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("perfilUsuario");
        navigate("/login");
    }

    // --- MEU PERFIL ---
    async function carregarMeuPerfil() {
        try {
            const res = await api.get("/perfil");
            const p = res.data;

            setPerfilCompleto(p);
            setMeuNome(p.nome || "");
            setMeuEmail(p.email || "");
            setMeuTelefone(formatarTelefone(p.telefone || ""));
            setMeuNumeroApto(p.numeroApto || "");
            setMeuBloco(p.bloco || "");
            calcularAndarSindico(p.numeroApto || "");
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

    function calcularAndarSindico(apto) {
        const numeros = apto.replace(/[^0-9]/g, "");
        if (numeros.length >= 3) {
            const andar = parseInt(numeros.substring(0, numeros.length - 2), 10);
            setMeuAndarCalc(andar > 0 ? `${andar}º andar` : "Térreo");
        } 
        
        else if (numeros.length > 0) {
            setMeuAndarCalc("Térreo");
        } 
        
        else {
            setMeuAndarCalc("");
        }
    }

    function handleMeuApto(valor) {
        setMeuNumeroApto(valor);
        calcularAndarSindico(valor);
    }

    async function salvarMeuPerfil(e) {
        e.preventDefault();
        setSalvandoPerfil(true);
        try {
            const res = await api.patch("/perfil/atualizar-cadastro", {
                nome: meuNome.trim(),
                email: meuEmail.trim(),
                telefone: meuTelefone.replace(/\D/g, ""),
                numeroApto: meuNumeroApto.trim(),
                bloco: meuBloco.trim().toUpperCase(),
            });
            localStorage.setItem("perfilUsuario", JSON.stringify(res.data));
            toast.sucesso("Perfil atualizado com sucesso!");
        } 
        
        catch (err) {
            console.error("Erro ao salvar perfil:", err);
            toast.erro(err.response?.data?.erro || "Erro ao atualizar perfil.");
        } 
        
        finally {
            setSalvandoPerfil(false);
        }
    }

    function formatarCpf(cpf) {
        if (!cpf) {
            return "—";
        }
        const n = cpf.replace(/\D/g, "");
        return n.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    function formatarTelefoneExibir(tel) {
        if (!tel) {
            return "—";
        }
        const n = tel.replace(/\D/g, "");

        if (n.length === 11) {
            return n.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
        return tel;
    }

    function formatarDataPerfil(data) {
        if (!data) {
            return "—";
        }
        const p = data.split("-");

        if (p.length === 3) {
            return `${p[2]}/${p[1]}/${p[0]}`;
        }
        return data;
    }

    // --- ENTREGAS: CARREGAR ---
    async function carregarMinhasEntregas() {
        setCarregandoEntregas(true);
        try {
            const p = JSON.parse(localStorage.getItem("perfilUsuario") || "{}");
            if (p.idUnidade) {
                const res = await api.get(`/encomendas/unidade/${p.idUnidade}`);
                const lista = res.data.conteudo || res.data;
                setMinhasEntregas(Array.isArray(lista) ? lista : []);
            }
        } 
        
        catch (err) {
            console.error("Erro ao carregar entregas:", err);
        } 
        
        finally {
            setCarregandoEntregas(false);
        }
    }

    // --- HELPERS ---
    function formatarData(dataString) {
        if (!dataString) {
            return "—";
        }

        const d = new Date(dataString);
        return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }

    return (
        <div className="painel-sindico">
            {/* --- SIDEBAR --- */}
            <aside className="sidebar-sindico">
                <div className="sidebar-logo">
                    <h2>Residencial Boca de Pedreiro</h2>
                    <span>Painel do Síndico</span>
                </div>

                <ul className="sidebar-menu">
                    <li>
                        <button className={abaAtiva === "dashboard" ? "ativo" : ""} onClick={() => setAbaAtiva("dashboard")}>
                            Dashboard
                        </button>
                    </li>

                    <li>
                        <button className={abaAtiva === "moradores" ? "ativo" : ""} onClick={() => setAbaAtiva("moradores")}>
                            Moradores
                        </button>
                    </li>

                    <li>
                        <button className={abaAtiva === "unidades" ? "ativo" : ""} onClick={() => setAbaAtiva("unidades")}>
                            Unidades
                        </button>
                    </li>

                    <li>
                        <button className={abaAtiva === "reclamacoes" ? "ativo" : ""} onClick={() => setAbaAtiva("reclamacoes")}>
                            Reclamações
                        </button>
                    </li>

                    <li>
                        <button className={abaAtiva === "avisos" ? "ativo" : ""} onClick={() => setAbaAtiva("avisos")}>
                            Mural de Avisos
                        </button>
                    </li>

                    <li>
                        <button className={abaAtiva === "documentos" ? "ativo" : ""} onClick={() => setAbaAtiva("documentos")}>
                            Documentos
                        </button>
                    </li>

                    <li>
                        <button className={abaAtiva === "solicitacoes" ? "ativo" : ""} onClick={() => setAbaAtiva("solicitacoes")}>
                            Solicitações
                            {solicitacoes.filter(s => s.status === "PENDENTE").length > 0 && (
                                <span style={{
                                    marginLeft: "8px", 
                                    background: "#e67e22", 
                                    color: "white",
                                    borderRadius: "10px", 
                                    padding: "1px 8px", 
                                    fontSize: "0.75rem", 
                                    fontWeight: "bold"
                                }}>
                                    {solicitacoes.filter(s => s.status === "PENDENTE").length}
                                </span>
                            )}
                        </button>
                    </li>

                    <li>
                        <button className={abaAtiva === "infracoes" ? "ativo" : ""} onClick={() => setAbaAtiva("infracoes")}>
                            Multas / Advertências
                            {infracoes.filter(i => i.status === "PENDENTE" || i.status === "CONTESTADA").length > 0 && (
                                <span style={{
                                    marginLeft: "8px", 
                                    background: "#e74c3c", 
                                    color: "white",
                                    borderRadius: "10px", 
                                    padding: "1px 8px", 
                                    fontSize: "0.75rem", 
                                    fontWeight: "bold"
                                }}>
                                    {infracoes.filter(i => i.status === "PENDENTE" || i.status === "CONTESTADA").length}
                                </span>
                            )}
                        </button>
                    </li>

                    <li style={{ borderTop: "1px solid var(--border-color)", marginTop: "8px", paddingTop: "8px" }}>
                        <button className={abaAtiva === "minhas-entregas" ? "ativo" : ""} onClick={() => { setAbaAtiva("minhas-entregas"); carregarMinhasEntregas(); }}>
                            Minhas Entregas
                        </button>
                    </li>

                    <li>
                        <button className={abaAtiva === "minhas-reservas" ? "ativo" : ""} onClick={() => setAbaAtiva("minhas-reservas")}>
                            Reservas
                        </button>
                    </li>

                    <li>
                        <button className={abaAtiva === "meu-perfil" ? "ativo" : ""} onClick={() => { setAbaAtiva("meu-perfil"); carregarMeuPerfil(); }}>
                            Meu Perfil
                        </button>
                    </li>

                    <li>
                        <button className={abaAtiva === "minha-unidade" ? "ativo" : ""} onClick={() => { setAbaAtiva("minha-unidade"); carregarMeuPerfil(); }}>
                            Minha Unidade
                        </button>
                    </li>
                </ul>

                <div className="sidebar-logout">
                    <button onClick={handleLogout}>Sair</button>
                </div>
            </aside>

            {/* --- CONTEÚDO --- */}
            <div className="conteudo-sindico">
                <header className="header-sindico">
                    <h1>
                        {abaAtiva === "dashboard" && "Dashboard"}
                        {abaAtiva === "moradores" && "Moradores"}
                        {abaAtiva === "unidades" && "Unidades"}
                        {abaAtiva === "reclamacoes" && "Reclamações"}
                        {abaAtiva === "avisos" && "Mural de Avisos"}
                        {abaAtiva === "documentos" && "Documentos e Regimento"}
                        {abaAtiva === "solicitacoes" && "Solicitações dos Moradores"}
                        {abaAtiva === "infracoes" && "Multas e Advertências"}
                        {abaAtiva === "minhas-entregas" && "Minhas Entregas"}
                        {abaAtiva === "minhas-reservas" && "Reservas de Espaços"}
                        {abaAtiva === "meu-perfil" && "Meu Perfil"}
                        {abaAtiva === "minha-unidade" && "Minha Unidade"}
                    </h1>

                    <span style={{ color: "#888", fontSize: "0.85rem" }}>Olá, {perfil.nome || "Síndico"}</span>

                    <button className="btn-tema" onClick={alternarTema} aria-label="Alternar Tema">
                        {isDarkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </header>

                <div className="corpo-sindico">
                    {carregando ? (
                        <p className="msg-vazia">Carregando dados...</p>
                    ) : (
                        <>
                            {abaAtiva === "dashboard" && (
                                <SindicoDashboard
                                    moradores={moradores}
                                    unidades={unidades}
                                    reclamacoes={reclamacoes}
                                    avisos={avisos}
                                    documentos={documentos}
                                    formatarData={formatarData}
                                />
                            )}
                            {abaAtiva === "moradores" && (
                                <SindicoMoradores 
                                    moradores={moradores} 
                                />
                            )}
                            {abaAtiva === "unidades" && (
                                <SindicoUnidades
                                    unidades={unidades} 
                                    setUnidades={setUnidades}
                                    api={api} 
                                    toast={toast}
                                />
                            )}
                            {abaAtiva === "reclamacoes" && (
                                <SindicoReclamacoes
                                    reclamacoes={reclamacoes} 
                                    setReclamacoes={setReclamacoes}
                                    api={api} 
                                    toast={toast} 
                                    formatarData={formatarData}
                                />
                            )}
                            {abaAtiva === "avisos" && (
                                <SindicoAvisos
                                    avisos={avisos} 
                                    setAvisos={setAvisos}
                                    perfil={perfil} 
                                    api={api} 
                                    toast={toast}
                                    formatarData={formatarData}
                                />
                            )}
                            {abaAtiva === "documentos" && (
                                <SindicoDocumentos
                                    documentos={documentos}
                                    setDocumentos={setDocumentos}
                                    perfil={perfil}
                                    api={api}
                                    toast={toast}
                                    formatarData={formatarData}
                                />
                            )}
                            {abaAtiva === "solicitacoes" && (
                                <SindicoSolicitacoes
                                    solicitacoes={solicitacoes}
                                    setSolicitacoes={setSolicitacoes}
                                    api={api}
                                    toast={toast}
                                    formatarData={formatarData}
                                />
                            )}
                            {abaAtiva === "infracoes" && (
                                <SindicoInfracoes
                                    infracoes={infracoes}
                                    setInfracoes={setInfracoes}
                                    moradores={moradores}
                                    api={api} 
                                    toast={toast}
                                />
                            )}
                            {abaAtiva === "minhas-entregas" && (
                                <SindicoEntregas
                                    minhasEntregas={minhasEntregas}
                                    carregandoEntregas={carregandoEntregas}
                                />
                            )}
                            {abaAtiva === "minhas-reservas" && (
                                <SindicoReservas 
                                    api={api} 
                                    toast={toast} 
                                />
                            )}
                            {abaAtiva === "meu-perfil" && (
                                <SindicoMeuPerfil
                                    meuNome={meuNome}
                                    setMeuNome={setMeuNome}
                                    meuEmail={meuEmail}
                                    setMeuEmail={setMeuEmail}
                                    meuTelefone={meuTelefone}
                                    setMeuTelefone={setMeuTelefone}
                                    meuNumeroApto={meuNumeroApto}
                                    meuBloco={meuBloco}
                                    setMeuBloco={setMeuBloco}
                                    meuAndarCalc={meuAndarCalc}
                                    salvandoPerfil={salvandoPerfil}
                                    salvarMeuPerfil={salvarMeuPerfil}
                                    formatarTelefone={formatarTelefone}
                                    handleMeuApto={handleMeuApto}
                                />
                            )}
                            {abaAtiva === "minha-unidade" && (
                                <SindicoMinhaUnidade
                                    perfilCompleto={perfilCompleto}
                                    formatarCpf={formatarCpf}
                                    formatarTelefoneExibir={formatarTelefoneExibir}
                                    formatarDataPerfil={formatarDataPerfil}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PainelSindico;

