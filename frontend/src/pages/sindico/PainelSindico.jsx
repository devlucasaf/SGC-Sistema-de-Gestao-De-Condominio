import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../components/Toast";
import { FiSun, FiMoon, FiPackage, FiClock, FiUser, FiCalendar, FiXCircle } from "react-icons/fi";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/PainelSindico.css";

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
    const [carregando, setCarregando] = useState(true);

    // --- AVISO ---
    const [tituloAviso, setTituloAviso] = useState("");
    const [mensagemAviso, setMensagemAviso] = useState("");
    const [enviandoAviso, setEnviandoAviso] = useState(false);

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

    // --- RESERVAS ---
    const [areasDeLazer, setAreasDeLazer] = useState([]);
    const [historicoReservas, setHistoricoReservas] = useState([]);
    const [areaSelecionada, setAreaSelecionada] = useState(null);
    const [dataReserva, setDataReserva] = useState(null);
    const [carregandoReservas, setCarregandoReservas] = useState(false);

    // --- DOCUMENTOS ---
    const [documentos, setDocumentos] = useState([]);
    const [tituloDoc, setTituloDoc] = useState("");
    const [conteudoDoc, setConteudoDoc] = useState("");
    const [categoriaDoc, setCategoriaDoc] = useState("REGRA");
    const [enviandoDoc, setEnviandoDoc] = useState(false);
    const [editandoDoc, setEditandoDoc] = useState(null);
    const [modalConfirmDoc, setModalConfirmDoc] = useState({ aberto: false, idDoc: null });

    // --- SOLICITAÇÕES ---
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [filtroTipoSol, setFiltroTipoSol] = useState("TODOS");
    const [filtroStatusSol, setFiltroStatusSol] = useState("TODOS");

    // --- INFRAÇÕES (MULTAS E ADVERTÊNCIAS) ---
    const [infracoes, setInfracoes] = useState([]);
    const [filtroTipoInf, setFiltroTipoInf] = useState("TODOS");
    const [filtroStatusInf, setFiltroStatusInf] = useState("TODOS");
    const [tipoInfracao, setTipoInfracao] = useState("MULTA");
    const [motivoInfracao, setMotivoInfracao] = useState("");
    const [descricaoInfracao, setDescricaoInfracao] = useState("");
    const [valorInfracao, setValorInfracao] = useState("");
    const [moradorInfracao, setMoradorInfracao] = useState("");
    const [dataInfracao, setDataInfracao] = useState(null);
    const [enviandoInfracao, setEnviandoInfracao] = useState(false);
    const [mostrarFormInfracao, setMostrarFormInfracao] = useState(false);

    // --- MODAL CONFIRMAÇÃO ---
    const [modalConfirm, setModalConfirm] = useState({ aberto: false, idAviso: null });

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

    // --- UNIDADE ---
    const [blocoNovo, setBlocoNovo] = useState("");
    const [andarNovo, setAndarNovo] = useState("");
    const [aptoNovo, setAptoNovo] = useState("");

    const perfil = JSON.parse(localStorage.getItem("perfilUsuario") || "{}");

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        setCarregando(true);
        try {
            const [resMoradores, resUnidades, resReclamacoes, resAvisos, resDocumentos, resSolicitacoes, resInfracoes] = await Promise.all([
                api.get("/moradores").catch(() => ({ data: [] })),
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

    // --- AVISOS ---
    async function publicarAviso(e) {
        e.preventDefault();
        if (!tituloAviso.trim() || !mensagemAviso.trim()) {
            return;
        }
        setEnviandoAviso(true);
        
        try {
            await api.post("/avisos", {
                titulo: tituloAviso,
                mensagem: mensagemAviso,
                idSindico: perfil.id,
            });
            setTituloAviso("");
            setMensagemAviso("");
            const res = await api.get("/avisos");
            setAvisos(res.data || []);
        }

        catch (err) {
            console.error("Erro ao publicar aviso:", err);
            toast.erro("Erro ao publicar aviso.", "Falha");
        }

        finally {
            setEnviandoAviso(false);
        }
    }

    function pedirConfirmacaoDeletar(id) {
        setModalConfirm({
            aberto: true,
            idAviso: id
        });
    }

    async function confirmarDeletar() {
        const id = modalConfirm.idAviso;
        setModalConfirm({
            aberto: false,
            idAviso: null
        });

        try {
            await api.delete(`/avisos/${id}`);
            setAvisos(avisos.filter(a => a.id !== id));
        }

        catch (err) {
            console.error("Erro ao deletar aviso:", err);
            toast.erro("Erro ao deletar aviso.", "Falha");
        }
    }

    function cancelarDeletar() {
        setModalConfirm({ aberto: false, idAviso: null });
    }

    // --- RECLAMAÇÕES ---
    async function alterarStatus(id, novoStatus) {
        try {
            await api.patch(`/api/reclamacoes/${id}/status?novoStatus=${novoStatus}`);
            const res = await api.get("/api/reclamacoes");
            setReclamacoes(res.data.conteudo || res.data || []);
        }

        catch (err) {
            console.error("Erro ao atualizar status:", err);
            toast.erro("Erro ao atualizar status.", "Falha");
        }
    }

    // --- UNIDADES ---
    async function cadastrarUnidade(e) {
        e.preventDefault();
        try {
            await api.post("/unidades", {
                bloco: blocoNovo,
                andar: Number(andarNovo),
                numeroApto: aptoNovo,
            });
            setBlocoNovo(""); setAndarNovo(""); setAptoNovo("");
            const res = await api.get("/unidades");
            setUnidades(res.data || []);
        }

        catch (err) {
            console.error("Erro ao cadastrar unidade:", err);
            toast.erro("Erro ao cadastrar unidade.", "Falha");
        }
    }

    // --- LOGOUT ---
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("perfilUsuario");
        navigate("/login");
    }

    // --- BOLETOS: GERAR MENSAL ---

    // --- MEU PERFIL: CARREGAR ---
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

    // --- RESERVAS: CARREGAR ---
    async function carregarMinhasReservas() {
        setCarregandoReservas(true);
        try {
            const [resAreas, resHistorico] = await Promise.all([
                api.get("/reservas/areas-lazer").catch(() => ({ data: [] })),
                api.get("/reservas/minhas-reservas").catch(() => ({ data: [] })),
            ]);
            setAreasDeLazer(resAreas.data || []);
            setHistoricoReservas(resHistorico.data || []);
        }

        catch (err) {
            console.error("Erro ao carregar reservas:", err);
        }

        finally {
            setCarregandoReservas(false);
        }
    }

    async function confirmarReservaSindico(e) {
        e.preventDefault();
        try {
            const res = await api.post("/reservas", {
                idAreaLazer: areaSelecionada.id,
                dataReserva: dataReserva ? dataReserva.toISOString().split("T")[0] : "",
            });
            setHistoricoReservas([res.data, ...historicoReservas]);
            toast.sucesso(`Reserva do ${areaSelecionada.nome} confirmada!`, "Sucesso");
            setAreaSelecionada(null);
            setDataReserva(null);
        }

        catch (err) {
            const msg = err.response?.data?.messages?.[0] || err.response?.data?.message || "Erro ao reservar.";
            toast.erro(String(msg), "Erro");
        }
    }

    async function cancelarReservaSindico(id) {
        try {
            await api.put(`/reservas/${id}/cancelar`);
            setHistoricoReservas(historicoReservas.map(r =>
                r.id === id ? { ...r, status: "CANCELADA" } : r
            ));
            toast.sucesso("Reserva cancelada!", "Sucesso");
        }

        catch (err) {
            toast.erro("Erro ao cancelar reserva.", "Erro");
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

    const totalPendentes = reclamacoes.filter(r => r.status === "PENDENTE").length;
    const totalEmAnalise = reclamacoes.filter(r => r.status === "EM_ANALISE").length;
    const totalResolvidas = reclamacoes.filter(r => r.status === "RESOLVIDA").length;

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
                        <button 
                            className={abaAtiva === "dashboard" ? "ativo" : ""} 
                            onClick={() => setAbaAtiva("dashboard")}
                            >
                                Dashboard
                        </button>
                    </li>

                    <li>
                        <button 
                            className={abaAtiva === "moradores" ? "ativo" : ""} 
                            onClick={() => setAbaAtiva("moradores")}
                            >
                                Moradores
                        </button>
                    </li>

                    <li>
                        <button 
                            className={abaAtiva === "unidades" ? "ativo" : ""} 
                            onClick={() => setAbaAtiva("unidades")}
                            >
                                Unidades
                        </button>
                    </li>

                    <li>
                        <button 
                            className={abaAtiva === "reclamacoes" ? "ativo" : ""} 
                            onClick={() => setAbaAtiva("reclamacoes")}
                            >
                                Reclamações
                        </button>
                    </li>

                    <li>
                        <button 
                            className={abaAtiva === "avisos" ? "ativo" : ""} 
                            onClick={() => setAbaAtiva("avisos")}
                            >
                                Mural de Avisos
                        </button>
                    </li>

                    <li>
                        <button
                            className={abaAtiva === "documentos" ? "ativo" : ""}
                            onClick={() => setAbaAtiva("documentos")}
                            >
                                Documentos
                        </button>
                    </li>

                    <li>
                        <button
                            className={abaAtiva === "solicitacoes" ? "ativo" : ""}
                            onClick={() => setAbaAtiva("solicitacoes")}
                            >
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
                        <button
                            className={abaAtiva === "infracoes" ? "ativo" : ""}
                            onClick={() => setAbaAtiva("infracoes")}
                            >
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
                        <button
                            className={abaAtiva === "minhas-entregas" ? "ativo" : ""}
                            onClick={() => { setAbaAtiva("minhas-entregas"); carregarMinhasEntregas(); }}
                            >
                                Minhas Entregas
                        </button>
                    </li>

                    <li>
                        <button
                            className={abaAtiva === "minhas-reservas" ? "ativo" : ""}
                            onClick={() => { setAbaAtiva("minhas-reservas"); carregarMinhasReservas(); }}
                            >
                                Reservas
                        </button>
                    </li>

                    <li>
                        <button
                            className={abaAtiva === "meu-perfil" ? "ativo" : ""}
                            onClick={() => { setAbaAtiva("meu-perfil"); carregarMeuPerfil(); }}
                            >
                                Meu Perfil
                        </button>
                    </li>

                    <li>
                        <button
                            className={abaAtiva === "minha-unidade" ? "ativo" : ""}
                            onClick={() => { setAbaAtiva("minha-unidade"); carregarMeuPerfil(); }}
                            >
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
                            {abaAtiva === "dashboard" && renderDashboard()}
                            {abaAtiva === "moradores" && renderMoradores()}
                            {abaAtiva === "unidades" && renderUnidades()}
                            {abaAtiva === "reclamacoes" && renderReclamacoes()}
                            {abaAtiva === "avisos" && renderAvisos()}
                            {abaAtiva === "documentos" && renderDocumentos()}
                            {abaAtiva === "solicitacoes" && renderSolicitacoes()}
                            {abaAtiva === "infracoes" && renderInfracoes()}
                            {abaAtiva === "minhas-entregas" && renderMinhasEntregas()}
                            {abaAtiva === "minhas-reservas" && renderMinhasReservas()}
                            {abaAtiva === "meu-perfil" && renderMeuPerfil()}
                            {abaAtiva === "minha-unidade" && renderMinhaUnidade()}
                        </>
                    )}
                </div>
            </div>

            {/* --- MODAL DE CONFIRMAÇÃO --- */}
            {modalConfirm.aberto && (
                <div className="modal-overlay" onClick={cancelarDeletar}>
                    <div className="modal-confirm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-confirm-icone">⚠️</div>
                        <h3>Confirmar exclusão</h3>
                        <p>Tem certeza que deseja excluir este aviso? Esta ação não poderá ser desfeita.</p>
                        <div className="modal-confirm-botoes">
                            <button className="btn-cancelar" onClick={cancelarDeletar}>Cancelar</button>
                            <button className="btn-confirmar-excluir" onClick={confirmarDeletar}>Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    function renderDashboard() {
        return (
            <>
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>Total de Moradores</h3>
                        <div className="valor">{moradores.length}</div>
                    </div>

                    <div className="dashboard-card azul">
                        <h3>Unidades Cadastradas</h3>
                        <div className="valor">{unidades.length}</div>
                    </div>

                    <div className="dashboard-card amarelo">
                        <h3>Reclamações Pendentes</h3>
                        <div className="valor">{totalPendentes}</div>
                    </div>

                    <div className="dashboard-card vermelho">
                        <h3>Em Análise</h3>
                        <div className="valor">{totalEmAnalise}</div>
                    </div>

                    <div className="dashboard-card azul">
                        <h3>Documentos</h3>
                        <div className="valor">{documentos.length}</div>
                    </div>
                </div>


                <h3 style={{ color: "#2ecc71", marginBottom: "14px" }}>Últimos Avisos</h3>
                {avisos.length === 0 ? (
                    <p className="msg-vazia">Nenhum aviso publicado ainda.</p>
                ) : (
                    <div className="lista-avisos">
                        {avisos.slice(0, 3).map(a => (
                            <div className="card-aviso" key={a.id}>
                                <h4>{a.titulo}</h4>
                                <p>{a.mensagem}</p>

                                <div className="meta-aviso">
                                    <span>{formatarData(a.dataCriacao)}</span>
                                    <span>{a.nomeSindico}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }

    function renderMoradores() {
        return moradores.length === 0 ? (
            <p className="msg-vazia">Nenhum morador cadastrado.</p>
        ) : (
            <table className="tabela-sindico">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>CPF</th>
                        <th>Telefone</th>
                        <th>Unidade</th>
                        <th>Tipo</th>
                    </tr>
                </thead>

                <tbody>
                    {moradores.map(m => (
                        <tr key={m.id}>
                            <td>{m.nome}</td>
                            <td>{m.email}</td>
                            <td>{m.cpf}</td>
                            <td>{m.telefone || "—"}</td>
                            <td>{m.unidade || "—"}</td>
                            <td><span className="badge badge-verde">{m.tipoMorador}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    function renderUnidades() {
        return (
            <>
                <form className="form-aviso" onSubmit={cadastrarUnidade} style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <input
                        type="text"
                        placeholder="Bloco (Ex: A)"
                        value={blocoNovo}
                        onChange={(e) => setBlocoNovo(e.target.value)}
                        required
                        style={{ flex: 1, minWidth: "120px" }}
                    />

                    <input
                        type="number"
                        placeholder="Andar (Ex: 1)"
                        value={andarNovo}
                        onChange={(e) => setAndarNovo(e.target.value)}
                        required
                        style={{ flex: 1, minWidth: "120px" }}
                    />

                    <input
                        type="text"
                        placeholder="Nº Apto (Ex: 101)"
                        value={aptoNovo}
                        onChange={(e) => setAptoNovo(e.target.value)}
                        required
                        style={{ flex: 1, minWidth: "120px" }}
                    />
                    <button type="submit" className="btn-publicar">+ Cadastrar</button>
                </form>

                {unidades.length === 0 ? (
                    <p className="msg-vazia">Nenhuma unidade cadastrada.</p>
                ) : (
                    <table className="tabela-sindico">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Bloco</th>
                                <th>Andar</th>
                                <th>Nº Apartamento</th>
                            </tr>
                        </thead>

                        <tbody>
                            {unidades.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.bloco}</td>
                                    <td>{u.andar}</td>
                                    <td>{u.numeroApto}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </>
        );
    }

    function renderReclamacoes() {
        return reclamacoes.length === 0 ? (
            <p className="msg-vazia">Nenhuma reclamação registrada. 🎉</p>
        ) : (
            <table className="tabela-sindico">
                <thead>
                    <tr>
                        <th>Categoria</th>
                        <th>Descrição</th>
                        <th>Unidade</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {reclamacoes.map(r => (
                        <tr key={r.id}>
                            <td>
                                {r.categoria}
                            </td>

                            <td 
                                style={{ 
                                    maxWidth: "300px", 
                                    overflow: "hidden", 
                                    textOverflow: "ellipsis", 
                                    whiteSpace: "nowrap" 
                                }}>
                                {r.descricao}
                            </td>

                            <td>
                                {r.unidade || "—"}
                            </td>

                            <td>
                                <span className={`badge ${r.status === "PENDENTE" ? "badge-amarelo" : r.status === "EM_ANALISE" ? "badge-azul" : "badge-verde"}`}>
                                    {r.status.replace("_", " ")}
                                </span>
                            </td>

                            <td style={{ fontSize: "0.85rem" }}>{formatarData(r.dataCriacao)}</td>

                            <td>
                                {r.status !== "RESOLVIDA" && (
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        {r.status === "PENDENTE" && (
                                            <button onClick={() => alterarStatus(r.id, "EM_ANALISE")} className="badge badge-azul" style={{ cursor: "pointer", border: "none" }}>
                                                Analisar
                                            </button>
                                        )}
                                        <button onClick={() => alterarStatus(r.id, "RESOLVIDA")} className="badge badge-verde" style={{ cursor: "pointer", border: "none" }}>
                                            Resolver
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    function renderAvisos() {
        return (
            <>
                <form className="form-aviso" onSubmit={publicarAviso}>
                    <input
                        type="text"
                        placeholder="Título do aviso"
                        value={tituloAviso}
                        onChange={(e) => setTituloAviso(e.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Escreva a mensagem do aviso para os moradores..."
                        value={mensagemAviso}
                        onChange={(e) => setMensagemAviso(e.target.value)}
                        required
                    />

                    <button type="submit" className="btn-publicar" disabled={enviandoAviso}>
                        {enviandoAviso ? "Publicando..." : "Publicar Aviso"}
                    </button>
                </form>

                <h3 style={{ color: "#2ecc71", marginBottom: "14px" }}>Avisos Publicados</h3>
                {avisos.length === 0 ? (
                    <p className="msg-vazia">Nenhum aviso publicado ainda.</p>
                ) : (
                    <div className="lista-avisos">
                        {avisos.map(a => (
                            <div className="card-aviso" key={a.id}>
                                <h4>{a.titulo}</h4>
                                <p>{a.mensagem}</p>
                                <div className="meta-aviso">
                                    <span>{formatarData(a.dataCriacao)} — {a.nomeSindico}</span>
                                    <button className="btn-deletar-aviso" onClick={() => pedirConfirmacaoDeletar(a.id)}>
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }

    // --- DOCUMENTOS: FUNÇÕES ---
    async function salvarDocumento(e) {
        e.preventDefault();
        if (!tituloDoc.trim() || !conteudoDoc.trim()) {
            return;
        }
        setEnviandoDoc(true);

        try {
            if (editandoDoc) {
                await api.put(`/documentos/${editandoDoc}`, {
                    titulo: tituloDoc,
                    conteudo: conteudoDoc,
                    categoria: categoriaDoc,
                    idSindico: perfil.id,
                });
                toast.sucesso("Documento atualizado!", "Sucesso");
            }

            else {
                await api.post("/documentos", {
                    titulo: tituloDoc,
                    conteudo: conteudoDoc,
                    categoria: categoriaDoc,
                    idSindico: perfil.id,
                });
                toast.sucesso("Documento publicado!", "Sucesso");
            }

            setTituloDoc("");
            setConteudoDoc("");
            setCategoriaDoc("REGRA");
            setEditandoDoc(null);
            const res = await api.get("/documentos");
            setDocumentos(res.data || []);
        }

        catch (err) {
            console.error("Erro ao salvar documento:", err);
            toast.erro("Erro ao salvar documento.", "Falha");
        }

        finally {
            setEnviandoDoc(false);
        }
    }

    function iniciarEdicaoDoc(doc) {
        setTituloDoc(doc.titulo);
        setConteudoDoc(doc.conteudo);
        setCategoriaDoc(doc.categoria);
        setEditandoDoc(doc.id);
    }

    function cancelarEdicaoDoc() {
        setTituloDoc("");
        setConteudoDoc("");
        setCategoriaDoc("REGRA");
        setEditandoDoc(null);
    }

    function pedirConfirmacaoDeletarDoc(id) {
        setModalConfirmDoc({ aberto: true, idDoc: id });
    }

    async function confirmarDeletarDoc() {
        const id = modalConfirmDoc.idDoc;
        setModalConfirmDoc({ aberto: false, idDoc: null });

        try {
            await api.delete(`/documentos/${id}`);
            setDocumentos(documentos.filter(d => d.id !== id));
            toast.sucesso("Documento excluído!", "Sucesso");
        }

        catch (err) {
            console.error("Erro ao deletar documento:", err);
            toast.erro("Erro ao deletar documento.", "Falha");
        }
    }

    function cancelarDeletarDoc() {
        setModalConfirmDoc({ aberto: false, idDoc: null });
    }

    function getLabelCat(cat) {
        switch (cat) {
            case "REGRA": return "Regra";
            case "MULTA": return "Multa";
            case "REGIMENTO": return "Regimento";
            default: return cat;
        }
    }

    function renderDocumentos() {
        return (
            <>
                <form className="form-aviso" onSubmit={salvarDocumento}>
                    <input
                        type="text"
                        placeholder="Título do documento"
                        value={tituloDoc}
                        onChange={(e) => setTituloDoc(e.target.value)}
                        required
                    />

                    <select
                        value={categoriaDoc}
                        onChange={(e) => setCategoriaDoc(e.target.value)}
                        style={{
                            padding: "11px 14px",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: "var(--bg-primary)",
                            color: "var(--text-primary)",
                            fontSize: "0.9rem",
                            fontFamily: "inherit",
                        }}
                    >
                        <option value="REGRA">Regra</option>
                        <option value="REGIMENTO">Regimento</option>
                        <option value="MULTA">Multa</option>
                    </select>

                    <textarea
                        placeholder="Escreva o conteúdo do documento..."
                        value={conteudoDoc}
                        onChange={(e) => setConteudoDoc(e.target.value)}
                        required
                        style={{ minHeight: "120px" }}
                    />

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button type="submit" className="btn-publicar" disabled={enviandoDoc}>
                            {enviandoDoc ? "Salvando..." : editandoDoc ? "Atualizar Documento" : "Publicar Documento"}
                        </button>
                        {editandoDoc && (
                            <button type="button" className="btn-deletar-aviso" onClick={cancelarEdicaoDoc} style={{ padding: "10px 20px" }}>
                                Cancelar Edição
                            </button>
                        )}
                    </div>
                </form>

                <h3 style={{ color: "#2ecc71", marginBottom: "14px" }}>Documentos Publicados</h3>
                {documentos.length === 0 ? (
                    <p className="msg-vazia">Nenhum documento publicado ainda.</p>
                ) : (
                    <div className="lista-avisos">
                        {documentos.map(d => (
                            <div className="card-aviso" key={d.id}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                                    <h4 style={{ margin: 0 }}>{d.titulo}</h4>
                                    <span className={`badge ${d.categoria === "MULTA" ? "badge-vermelho" : d.categoria === "REGIMENTO" ? "badge-verde" : "badge-azul"}`}>
                                        {getLabelCat(d.categoria)}
                                    </span>
                                </div>
                                <p style={{ whiteSpace: "pre-line" }}>{d.conteudo}</p>
                                <div className="meta-aviso">
                                    <span>
                                        {d.dataAtualizacao
                                            ? `Atualizado em ${formatarData(d.dataAtualizacao)}`
                                            : formatarData(d.dataCriacao)
                                        } — {d.nomeSindico}
                                    </span>

                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <button
                                            className="badge badge-azul"
                                            style={{ cursor: "pointer", border: "none", fontSize: "0.75rem" }}
                                            onClick={() => iniciarEdicaoDoc(d)}
                                        >
                                            Editar
                                        </button>

                                        <button className="btn-deletar-aviso" onClick={() => pedirConfirmacaoDeletarDoc(d.id)}>
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal de confirmação para documentos */}
                {modalConfirmDoc.aberto && (
                    <div className="modal-overlay" onClick={cancelarDeletarDoc}>
                        <div className="modal-confirm" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-confirm-icone">⚠️</div>
                            <h3>Confirmar exclusão</h3>
                            <p>Tem certeza que deseja excluir este documento? Esta ação não poderá ser desfeita.</p>
                            <div className="modal-confirm-botoes">
                                <button className="btn-cancelar" onClick={cancelarDeletarDoc}>Cancelar</button>
                                <button className="btn-confirmar-excluir" onClick={confirmarDeletarDoc}>Excluir</button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    function renderMinhasEntregas() {
        if (carregandoEntregas) {
            return <p className="msg-vazia">Carregando entregas...</p>;
        }

        if (minhasEntregas.length === 0) {
            return <p className="msg-vazia">Nenhuma encomenda registrada para sua unidade.</p>;
        }

        return (
            <div className="lista-entregas-sindico">
                {minhasEntregas.map(e => (
                    <div key={e.id} className={`card-entrega-sindico ${e.status === "RETIRADO" ? "entrega-retirada" : ""}`}>
                        <div className="entrega-icone">
                            <FiPackage />
                        </div>

                        <div className="entrega-info">
                            <h4>{e.descricao}</h4>

                            <div className="entrega-meta">
                                <span><FiClock /> {e.dataRecebimento ? new Date(e.dataRecebimento).toLocaleDateString("pt-BR") + " — " + new Date(e.dataRecebimento).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "—"}</span>
                                <span><FiUser /> {e.nomePorteiro || "Portaria"}</span>
                            </div>
                            {e.dataRetirada && (
                                <span className="entrega-retirada-info">Retirado em {new Date(e.dataRetirada).toLocaleDateString("pt-BR")}</span>
                            )}
                        </div>
                        <span className={`badge ${e.status === "RETIRADO" ? "badge-verde" : "badge-amarelo"}`}>
                            {e.status === "RETIRADO" ? "Retirado" : "Aguardando"}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    function renderMinhasReservas() {
        if (carregandoReservas) {
            return <p className="msg-vazia">Carregando reservas...</p>;
        }

        return (
            <>
                {/* Grid de áreas de lazer */}
                <h3 style={{ color: "var(--primary-green)", marginBottom: "14px" }}>Áreas Disponíveis</h3>
                {areasDeLazer.length === 0 ? (
                    <p className="msg-vazia">Nenhuma área de lazer cadastrada.</p>
                ) : (
                    <div className="grid-areas-sindico">
                        {areasDeLazer.map(area => (
                            <div key={area.id} className="card-area-sindico">
                                <div className="area-icone"><FiCalendar /></div>
                                <h4>{area.nome}</h4>
                                <p>Máximo: <strong>{area.capacidadeMaxima} pessoas</strong></p>
                                <p>Valor: <strong>{!area.valor || area.valor === 0 ? "Gratuito" : `R$ ${area.valor.toFixed(2)}`}</strong></p>

                                <button className="btn-publicar" style={{ marginTop: "8px", width: "100%" }} onClick={() => { setAreaSelecionada(area); setDataReserva(null); }}>
                                    Escolher Data
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal de confirmação */}
                {areaSelecionada && (
                    <div className="modal-overlay" onClick={() => setAreaSelecionada(null)}>
                        <div className="modal-confirm" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "400px" }}>
                            <h3>Confirmar Reserva</h3>
                            <p>Espaço: <strong>{areaSelecionada.nome}</strong></p>

                            <form onSubmit={confirmarReservaSindico} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
                                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Escolha a data:</label>
                                <DatePicker
                                    selected={dataReserva}
                                    onChange={(date) => setDataReserva(date)}
                                    locale="pt-BR"
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Selecione a data"
                                    minDate={new Date()}
                                    className="datepicker-input"
                                    calendarClassName="datepicker-calendario"
                                    required
                                    autoComplete="off"
                                />
                                {areaSelecionada.valor > 0 && (
                                    <p style={{ fontSize: "0.8rem", color: "var(--warning-color)" }}>
                                        R$ {areaSelecionada.valor.toFixed(2)} serão cobrados no próximo boleto.
                                    </p>
                                )}

                                <div className="modal-confirm-botoes">
                                    <button type="button" className="btn-cancelar" onClick={() => setAreaSelecionada(null)}>Cancelar</button>
                                    <button type="submit" className="btn-publicar">Confirmar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Histórico */}
                <h3 style={{ color: "var(--primary-green)", margin: "28px 0 14px" }}>Histórico de Reservas</h3>
                {historicoReservas.length === 0 ? (
                    <p className="msg-vazia">Você ainda não possui reservas.</p>
                ) : (
                    <table className="tabela-sindico">
                        <thead>
                            <tr>
                                <th>Área</th>
                                <th>Data</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historicoReservas.map(r => (
                                <tr key={r.id}>
                                    <td>{r.nomeAreaLazer}</td>
                                    <td>{new Date(r.dataReserva + "T00:00:00").toLocaleDateString("pt-BR")}</td>
                                    <td>
                                        <span className={`badge ${r.status === "APROVADA" ? "badge-verde" : r.status === "CANCELADA" ? "badge-vermelho" : "badge-amarelo"}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td>
                                        {r.status === "APROVADA" && (
                                            <button className="btn-deletar-aviso" onClick={() => cancelarReservaSindico(r.id)} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <FiXCircle /> Cancelar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </>
        );
    }

    function renderMeuPerfil() {
        return (
            <div className="perfil-sindico-container">
                <form className="perfil-sindico-form" onSubmit={salvarMeuPerfil}>
                    <div className="perfil-sindico-grid">
                        <div className="perfil-campo">
                            <label>Nome completo</label>
                            <input
                                type="text"
                                value={meuNome}
                                onChange={(e) => setMeuNome(e.target.value)}
                                placeholder="Seu nome"
                                required
                            />
                        </div>

                        <div className="perfil-campo">
                            <label>E-mail</label>
                            <input
                                type="email"
                                value={meuEmail}
                                onChange={(e) => setMeuEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div className="perfil-campo">
                            <label>Telefone</label>
                            <input
                                type="text"
                                value={meuTelefone}
                                onChange={(e) => setMeuTelefone(formatarTelefone(e.target.value))}
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <div className="perfil-campo">
                            <label>Nº Apartamento</label>
                            <input
                                type="text"
                                value={meuNumeroApto}
                                onChange={(e) => handleMeuApto(e.target.value)}
                                placeholder="Ex: 101"
                            />
                            {meuAndarCalc && (
                                <span className="andar-calculado">{meuAndarCalc}</span>
                            )}
                        </div>

                        <div className="perfil-campo">
                            <label>Bloco</label>
                            <input
                                type="text"
                                value={meuBloco}
                                onChange={(e) => setMeuBloco(e.target.value.toUpperCase())}
                                placeholder="Ex: A"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-publicar"
                        disabled={salvandoPerfil}
                        style={{
                            marginTop: "16px"
                        }}
                    >
                        {salvandoPerfil ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </form>
            </div>
        );
    }

    // --- INFRAÇÕES: CRIAR ---
    async function criarInfracao(e) {
        e.preventDefault();
        if (!motivoInfracao.trim() || !moradorInfracao || !dataInfracao) {
            return;
        }
        setEnviandoInfracao(true);
        try {
            await api.post("/api/infracoes", {
                tipo: tipoInfracao,
                motivo: motivoInfracao,
                descricao: descricaoInfracao,
                valor: tipoInfracao === "MULTA" ? parseFloat(valorInfracao || "0") : 0,
                moradorId: Number(moradorInfracao),
                dataInfracao: dataInfracao.toISOString().split("T")[0],
            });
            setMotivoInfracao("");
            setDescricaoInfracao("");
            setValorInfracao("");
            setMoradorInfracao("");
            setDataInfracao(null);
            setMostrarFormInfracao(false);
            toast.sucesso("Infração registrada com sucesso!");
            const res = await api.get("/api/infracoes");
            setInfracoes(res.data || []);
        }

        catch (err) {
            console.error("Erro ao criar infração:", err);
            toast.erro("Erro ao registrar infração.");
        }

        finally {
            setEnviandoInfracao(false);
        }
    }

    async function alterarStatusInfracao(id, novoStatus) {
        try {
            await api.patch(`/api/infracoes/${id}/status?novoStatus=${novoStatus}`);
            const res = await api.get("/api/infracoes");
            setInfracoes(res.data || []);
            toast.sucesso("Status atualizado!");
        }

        catch (err) {
            toast.erro("Erro ao atualizar status.");
        }
    }

    function renderInfracoes() {
        const pendentes = infracoes.filter(i => i.status === "PENDENTE").length;
        const contestadas = infracoes.filter(i => i.status === "CONTESTADA").length;
        const pagas = infracoes.filter(i => i.status === "PAGA").length;
        const canceladas = infracoes.filter(i => i.status === "CANCELADA").length;

        const filtradas = infracoes.filter(i => {
            const passaTipo = filtroTipoInf === "TODOS" || i.tipo === filtroTipoInf;
            const passaStatus = filtroStatusInf === "TODOS" || i.status === filtroStatusInf;
            return passaTipo && passaStatus;
        });

        return (
            <>
                {/* Resumo */}
                <div className="dashboard-grid">
                    <div className="dashboard-card amarelo">
                        <h3>Pendentes</h3>
                        <div className="valor">{pendentes}</div>
                    </div>

                    <div className="dashboard-card azul">
                        <h3>Contestadas</h3>
                        <div className="valor">{contestadas}</div>
                    </div>

                    <div className="dashboard-card">
                        <h3>Pagas</h3>
                        <div className="valor">{pagas}</div>
                    </div>

                    <div className="dashboard-card vermelho">
                        <h3>Canceladas</h3>
                        <div className="valor">{canceladas}</div>
                    </div>
                </div>

                {/* Botão nova infração */}
                <button
                    onClick={() => setMostrarFormInfracao(!mostrarFormInfracao)}
                    className="btn-publicar"
                    style={{ marginBottom: "16px" }}
                >
                    {mostrarFormInfracao ? "Fechar Formulário" : "+ Nova Multa / Advertência"}
                </button>

                {/* Formulário */}
                {mostrarFormInfracao && (
                    <div style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "20px"
                    }}>
                        <h3 style={{ margin: "0 0 16px", color: "var(--text-primary)" }}>Registrar Infração</h3>
                        <form onSubmit={criarInfracao} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                                {/* Tipo */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Tipo</label>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button
                                            type="button"
                                            onClick={() => setTipoInfracao("MULTA")}
                                            style={{
                                                flex: 1,
                                                padding: "10px",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                border: tipoInfracao === "MULTA" ? "2px solid #e74c3c" : "1px solid var(--border-color)",
                                                background: tipoInfracao === "MULTA" ? "rgba(231,76,60,0.1)" : "transparent",
                                                color: tipoInfracao === "MULTA" ? "#e74c3c" : "var(--text-secondary)",
                                                fontWeight: tipoInfracao === "MULTA" ? "600" : "400"
                                            }}
                                        >
                                            Multa
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTipoInfracao("ADVERTENCIA")}
                                            style={{
                                                flex: 1, padding: "10px", borderRadius: "8px", cursor: "pointer",
                                                border: tipoInfracao === "ADVERTENCIA" ? "2px solid #f1c40f" : "1px solid var(--border-color)",
                                                background: tipoInfracao === "ADVERTENCIA" ? "rgba(241,196,15,0.1)" : "transparent",
                                                color: tipoInfracao === "ADVERTENCIA" ? "#f1c40f" : "var(--text-secondary)",
                                                fontWeight: tipoInfracao === "ADVERTENCIA" ? "600" : "400"
                                            }}
                                        >
                                            Advertência
                                        </button>
                                    </div>
                                </div>

                                {/* Morador */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Morador</label>
                                    <select
                                        value={moradorInfracao}
                                        onChange={(e) => setMoradorInfracao(e.target.value)}
                                        required
                                        style={{
                                            padding: "10px", borderRadius: "8px",
                                            border: "1px solid var(--border-color)",
                                            background: "var(--bg-input, var(--bg-card))",
                                            color: "var(--text-primary)", fontSize: "0.9rem"
                                        }}
                                    >
                                        <option value="">Selecione o morador</option>
                                        {moradores.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.nome} — {m.unidade || "Sem unidade"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Motivo */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Motivo</label>
                                    <input
                                        type="text"
                                        value={motivoInfracao}
                                        onChange={(e) => setMotivoInfracao(e.target.value)}
                                        placeholder="Ex: Barulho após 22h"
                                        required
                                        style={{
                                            padding: "10px",
                                            borderRadius: "8px",
                                            border: "1px solid var(--border-color)",
                                            background: "var(--bg-input, var(--bg-card))",
                                            color: "var(--text-primary)",
                                            fontSize: "0.9rem"
                                        }}
                                    />
                                </div>

                                {/* Data */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Data da infração</label>
                                    <DatePicker
                                        selected={dataInfracao}
                                        onChange={(date) => setDataInfracao(date)}
                                        locale="pt-BR"
                                        dateFormat="dd/MM/yyyy"
                                        maxDate={new Date()}
                                        placeholderText="Selecione a data"
                                        className="input-datepicker"
                                        required
                                    />
                                </div>

                                {/* Valor (só se MULTA) */}
                                {tipoInfracao === "MULTA" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Valor (R$)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={valorInfracao}
                                            onChange={(e) => setValorInfracao(e.target.value)}
                                            placeholder="Ex: 150.00"
                                            style={{
                                                padding: "10px", borderRadius: "8px",
                                                border: "1px solid var(--border-color)",
                                                background: "var(--bg-input, var(--bg-card))",
                                                color: "var(--text-primary)", fontSize: "0.9rem"
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Descrição */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Descrição (opcional)</label>
                                <textarea
                                    value={descricaoInfracao}
                                    onChange={(e) => setDescricaoInfracao(e.target.value)}
                                    placeholder="Detalhes sobre a infração..."
                                    rows={3}
                                    style={{
                                        padding: "10px",
                                        borderRadius: "8px",
                                        border: "1px solid var(--border-color)",
                                        background: "var(--bg-input, var(--bg-card))",
                                        color: "var(--text-primary)",
                                        fontSize: "0.9rem",
                                        resize: "vertical"
                                    }}
                                />
                            </div>

                            <button type="submit" className="btn-publicar" disabled={enviandoInfracao} style={{ alignSelf: "flex-start" }}>
                                {enviandoInfracao ? "Registrando..." : "Registrar Infração"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Filtros */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "0 0 16px" }}>
                    {["TODOS", "MULTA", "ADVERTENCIA"].map(t => (
                        <button
                            key={t}
                            onClick={() => setFiltroTipoInf(t)}
                            style={{
                                padding: "6px 14px", borderRadius: "20px",
                                border: filtroTipoInf === t ? "2px solid var(--primary-green)" : "1px solid var(--border-color)",
                                background: filtroTipoInf === t ? "rgba(46,204,113,0.12)" : "transparent",
                                color: filtroTipoInf === t ? "var(--primary-green)" : "var(--text-secondary)",
                                cursor: "pointer", fontSize: "0.85rem",
                                fontWeight: filtroTipoInf === t ? "600" : "400"
                            }}
                        >
                            {t === "TODOS" ? "Todos" : t === "MULTA" ? "Multas" : "Advertências"}
                        </button>
                    ))}

                    <span style={{ width: "1px", background: "var(--border-color)", margin: "0 4px" }} />

                    {["TODOS", "PENDENTE", "CONTESTADA", "PAGA", "CANCELADA"].map(s => (
                        <button
                            key={s}
                            onClick={() => setFiltroStatusInf(s)}
                            style={{
                                padding: "6px 14px",
                                borderRadius: "20px",
                                border: filtroStatusInf === s ? "2px solid var(--primary-green)" : "1px solid var(--border-color)",
                                background: filtroStatusInf === s ? "rgba(46,204,113,0.12)" : "transparent",
                                color: filtroStatusInf === s ? "var(--primary-green)" : "var(--text-secondary)",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                fontWeight: filtroStatusInf === s ? "600" : "400"
                            }}
                        >
                            {s === "TODOS" ? "Todos Status" :
                             s === "PENDENTE" ? "Pendente" :
                             s === "CONTESTADA" ? "Contestada" :
                             s === "PAGA" ? "Paga" : "Cancelada"}
                        </button>
                    ))}
                </div>

                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "12px" }}>
                    {filtradas.length} infração(ões) encontrada(s)
                </p>

                {/* Lista */}
                {filtradas.length === 0 ? (
                    <p className="msg-vazia">Nenhuma infração encontrada.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {filtradas
                            .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
                            .map(inf => (
                            <div key={inf.id} style={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "12px",
                                padding: "20px",
                                borderLeft: `4px solid ${inf.tipo === "MULTA" ? "#e74c3c" : "#f1c40f"}`
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                                    <div>
                                        <span style={{
                                            fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase",
                                            letterSpacing: "0.5px", color: "var(--text-muted)"
                                        }}>
                                            {inf.tipo === "MULTA" ? "MULTA" : "ADVERTÊNCIA"}
                                        </span>
                                        <h4 style={{ margin: "4px 0 0", color: "var(--text-primary)" }}>{inf.motivo}</h4>
                                    </div>
                                    <span style={{
                                        padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600",
                                        background:
                                            inf.status === "PENDENTE" ? "rgba(241,196,15,0.12)" :
                                            inf.status === "CONTESTADA" ? "rgba(52,152,219,0.12)" :
                                            inf.status === "PAGA" ? "rgba(46,204,113,0.12)" :
                                            "rgba(149,165,166,0.12)",
                                        color:
                                            inf.status === "PENDENTE" ? "#f1c40f" :
                                            inf.status === "CONTESTADA" ? "#3498db" :
                                            inf.status === "PAGA" ? "#2ecc71" :
                                            "#95a5a6"
                                    }}>
                                        {inf.status === "PENDENTE" ? "Pendente" :
                                         inf.status === "CONTESTADA" ? "Contestada" :
                                         inf.status === "PAGA" ? "Paga" : "Cancelada"}
                                    </span>
                                </div>

                                {inf.descricao && (
                                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "8px" }}>{inf.descricao}</p>
                                )}

                                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                                    <span>{inf.nomeMorador || "—"}</span>
                                    <span>{inf.unidadeMorador || "—"}</span>
                                    <span>{inf.dataInfracao ? new Date(inf.dataInfracao + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</span>
                                    {inf.tipo === "MULTA" && (
                                        <span style={{ fontWeight: "700", color: "#e74c3c" }}>
                                            R$ {(inf.valor || 0).toFixed(2).replace(".", ",")}
                                        </span>
                                    )}
                                </div>

                                {/* Botões de ação */}
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                    {inf.status !== "PAGA" && inf.tipo === "MULTA" && (
                                        <button
                                            onClick={() => alterarStatusInfracao(inf.id, "PAGA")}
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: "6px",
                                                border: "1px solid #2ecc71",
                                                background: "rgba(46,204,113,0.1)",
                                                color: "#2ecc71",
                                                cursor: "pointer",
                                                fontSize: "0.8rem",
                                                fontWeight: "500"
                                            }}
                                        >
                                            Marcar como Paga
                                        </button>
                                    )}
                                    {inf.status !== "CANCELADA" && (
                                        <button
                                            onClick={() => alterarStatusInfracao(inf.id, "CANCELADA")}
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: "6px",
                                                border: "1px solid #95a5a6",
                                                background: "rgba(149,165,166,0.1)",
                                                color: "#95a5a6",
                                                cursor: "pointer",
                                                fontSize: "0.8rem",
                                                fontWeight: "500"
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                    {inf.status === "CONTESTADA" && (
                                        <button
                                            onClick={() => alterarStatusInfracao(inf.id, "PENDENTE")}
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: "6px",
                                                border: "1px solid #f1c40f",
                                                background: "rgba(241,196,15,0.1)",
                                                color: "#f1c40f",
                                                cursor: "pointer",
                                                fontSize: "0.8rem",
                                                fontWeight: "500"
                                            }}
                                        >
                                            Recusar Contestação
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }

    // --- SOLICITAÇÕES: ALTERAR STATUS ---
    async function alterarStatusSolicitacao(id, novoStatus) {
        try {
            await api.patch(`/api/solicitacoes/${id}/status?novoStatus=${novoStatus}`);
            const res = await api.get("/api/solicitacoes");
            setSolicitacoes(res.data.conteudo || res.data || []);
            toast.sucesso("Status atualizado!", "Sucesso");
        }

        catch (err) {
            console.error("Erro ao atualizar status da solicitação:", err);
            toast.erro("Erro ao atualizar status.", "Falha");
        }
    }

    function getNomeTipoSol(tipo) {
        switch (tipo) {
            case "OBRA":
                return "Obra";
            case "MUDANCA":
                return "Mudança";
            case "ENTREGA":
                return "Entrega";
            case "PRESTADOR":
                return "Prestador";
            default:
                return tipo;
        }
    }

    function getIconeTipoSol(tipo) {
        switch (tipo) {
            case "OBRA":
                return "";
            case "MUDANCA":
                return "";
            case "ENTREGA":
                return "";
            case "PRESTADOR":
                return "";
            default:
                return "";
        }
    }

    function getCorTipoSol(tipo) {
        switch (tipo) {
            case "OBRA":
                return "#e67e22";
            case "MUDANCA":
                return "#3498db";
            case "ENTREGA":
                return "#2ecc71";
            case "PRESTADOR":
                return "#9b59b6";
            default:
                return "#888";
        }
    }

    function renderSolicitacoes() {
        const pendentes = solicitacoes.filter(s => s.status === "PENDENTE").length;
        const emAnalise = solicitacoes.filter(s => s.status === "EM_ANALISE").length;
        const aprovadas = solicitacoes.filter(s => s.status === "APROVADO").length;
        const recusadas = solicitacoes.filter(s => s.status === "RECUSADO").length;

        const filtradas = solicitacoes.filter(s => {
            const passaTipo = filtroTipoSol === "TODOS" || s.tipo === filtroTipoSol;
            const passaStatus = filtroStatusSol === "TODOS" || s.status === filtroStatusSol;
            return passaTipo && passaStatus;
        });

        return (
            <>
                {/* Resumo */}
                <div className="dashboard-grid">
                    <div className="dashboard-card amarelo">
                        <h3>Pendentes</h3>
                        <div className="valor">{pendentes}</div>
                    </div>

                    <div className="dashboard-card azul">
                        <h3>Em Análise</h3>
                        <div className="valor">{emAnalise}</div>
                    </div>

                    <div className="dashboard-card">
                        <h3>Aprovadas</h3>
                        <div className="valor">{aprovadas}</div>
                    </div>

                    <div className="dashboard-card vermelho">
                        <h3>Recusadas</h3>
                        <div className="valor">{recusadas}</div>
                    </div>
                </div>

                {/* Filtros */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "20px 0" }}>
                    {["TODOS", "OBRA", "MUDANCA", "ENTREGA", "PRESTADOR"].map(t => (
                        <button
                            key={t}
                            onClick={() => setFiltroTipoSol(t)}
                            style={{
                                padding: "6px 14px",
                                borderRadius: "20px",
                                border: filtroTipoSol === t ? "2px solid var(--primary-green)" : "1px solid var(--border-color)",
                                background: filtroTipoSol === t ? "rgba(46,204,113,0.12)" : "transparent",
                                color: filtroTipoSol === t ? "var(--primary-green)" : "var(--text-secondary)",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                fontWeight: filtroTipoSol === t ? "600" : "400",
                                transition: "all 0.2s"
                            }}
                        >
                            {t === "TODOS" ? "Todos Tipos" : `${getIconeTipoSol(t)} ${getNomeTipoSol(t)}`}
                        </button>
                    ))}

                    <span style={{ width: "1px", background: "var(--border-color)", margin: "0 4px" }} />

                    {["TODOS", "PENDENTE", "EM_ANALISE", "APROVADO", "RECUSADO"].map(s => (
                        <button
                            key={s}
                            onClick={() => setFiltroStatusSol(s)}
                            style={{
                                padding: "6px 14px",
                                borderRadius: "20px",
                                border: filtroStatusSol === s ? "2px solid var(--primary-green)" : "1px solid var(--border-color)",
                                background: filtroStatusSol === s ? "rgba(46,204,113,0.12)" : "transparent",
                                color: filtroStatusSol === s ? "var(--primary-green)" : "var(--text-secondary)",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                fontWeight: filtroStatusSol === s ? "600" : "400",
                                transition: "all 0.2s"
                            }}
                        >
                            {
                                s === "TODOS" ? "Todos Status" :
                                s === "PENDENTE" ? "Pendente" :
                                s === "EM_ANALISE" ? "Em Análise" :
                                s === "APROVADO" ? "Aprovado" : "Recusado"
                            }
                        </button>
                    ))}
                </div>

                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "12px" }}>
                    {filtradas.length} solicitação(ões) encontrada(s)
                </p>

                {/* Lista */}
                {filtradas.length === 0 ? (
                    <p className="msg-vazia">Nenhuma solicitação encontrada.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {filtradas
                            .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
                            .map(sol => (
                            <div
                                key={sol.id}
                                style={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    borderLeft: `4px solid ${getCorTipoSol(sol.tipo)}`,
                                    transition: "box-shadow 0.2s"
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        flexWrap: "wrap",
                                        gap: "10px",
                                        marginBottom: "12px"
                                    }}
                                >
                                    <div>
                                        <h4 style={{ margin: 0, color: "var(--text-primary)" }}>
                                            {getIconeTipoSol(sol.tipo)} {sol.titulo}
                                        </h4>
                                        <span style={{
                                            display: "inline-block",
                                            marginTop: "4px",
                                            padding: "2px 10px",
                                            borderRadius: "20px",
                                            fontSize: "0.72rem",
                                            fontWeight: "600",
                                            background: `${getCorTipoSol(sol.tipo)}20`,
                                            color: getCorTipoSol(sol.tipo)
                                        }}>
                                            {getNomeTipoSol(sol.tipo)}
                                        </span>
                                    </div>

                                    <span style={{
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        fontSize: "0.75rem",
                                        fontWeight: "600",
                                        background:
                                            sol.status === "PENDENTE" ? "rgba(241,196,15,0.12)" :
                                            sol.status === "EM_ANALISE" ? "rgba(52,152,219,0.12)" :
                                            sol.status === "APROVADO" ? "rgba(46,204,113,0.12)" :
                                            "rgba(231,76,60,0.12)",
                                        color:
                                            sol.status === "PENDENTE" ? "#f1c40f" :
                                            sol.status === "EM_ANALISE" ? "#3498db" :
                                            sol.status === "APROVADO" ? "#2ecc71" :
                                            "#e74c3c"
                                    }}>
                                        {
                                            sol.status === "PENDENTE" ? "Pendente" :
                                            sol.status === "EM_ANALISE" ? "Em Análise" :
                                            sol.status === "APROVADO" ? "Aprovado" : "Recusado"
                                        }
                                    </span>
                                </div>

                                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "8px" }}>
                                    {sol.descricao}
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "16px",
                                        fontSize: "0.82rem",
                                        color: "var(--text-muted)",
                                        marginBottom: "12px"
                                    }}
                                >
                                    <span>
                                        Data prevista: {sol.dataPrevista ? new Date(sol.dataPrevista + "T00:00:00").toLocaleDateString("pt-BR") : "—"}
                                    </span>

                                    <span>
                                        Morador: {sol.nomeMorador || "—"}
                                    </span>

                                    <span>
                                        {sol.apartamentoMorador || sol.unidade || "—"}
                                    </span>

                                    <span>
                                        Criada em: {sol.dataCriacao ? formatarData(sol.dataCriacao) : "—"}
                                    </span>
                                </div>

                                {/* Botões de ação */}
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                    {sol.status !== "EM_ANALISE" && (
                                        <button
                                            onClick={() => alterarStatusSolicitacao(sol.id, "EM_ANALISE")}
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: "6px",
                                                border: "1px solid #3498db",
                                                background: "rgba(52,152,219,0.1)",
                                                color: "#3498db",
                                                cursor: "pointer",
                                                fontSize: "0.8rem",
                                                fontWeight: "500"
                                            }}
                                        >
                                            Em Análise
                                        </button>
                                    )}
                                    {sol.status !== "APROVADO" && (
                                        <button
                                            onClick={() => alterarStatusSolicitacao(sol.id, "APROVADO")}
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: "6px",
                                                border: "1px solid #2ecc71",
                                                background: "rgba(46,204,113,0.1)",
                                                color: "#2ecc71",
                                                cursor: "pointer",
                                                fontSize: "0.8rem",
                                                fontWeight: "500"
                                            }}
                                        >
                                            Aprovar
                                        </button>
                                    )}
                                    {sol.status !== "RECUSADO" && (
                                        <button
                                            onClick={() => alterarStatusSolicitacao(sol.id, "RECUSADO")}
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: "6px",
                                                border: "1px solid #e74c3c",
                                                background: "rgba(231,76,60,0.1)",
                                                color: "#e74c3c",
                                                cursor: "pointer",
                                                fontSize: "0.8rem",
                                                fontWeight: "500"
                                            }}
                                        >
                                            Recusar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }

    function renderMinhaUnidade() {
        if (!perfilCompleto) {
            return <p className="msg-vazia">Carregando dados da unidade...</p>;
        }

        const p = perfilCompleto;

        return (
            <div className="unidade-sindico-container">
                {/* Card da Unidade */}
                <div className="unidade-sindico-card">
                    <div className="unidade-sindico-header">
                        <h3>Dados da Unidade</h3>
                    </div>

                    <div className="unidade-sindico-grid">
                        <div className="unidade-info-item">
                            <span className="unidade-info-label">Apartamento</span>
                            <span className="unidade-info-valor">{p.numeroApto || "—"}</span>
                        </div>

                        <div className="unidade-info-item">
                            <span className="unidade-info-label">Bloco</span>
                            <span className="unidade-info-valor">{p.bloco || "—"}</span>
                        </div>

                        <div className="unidade-info-item">
                            <span className="unidade-info-label">Andar</span>
                            <span className="unidade-info-valor">{p.andar ? `${p.andar}º andar` : "—"}</span>
                        </div>

                        <div className="unidade-info-item">
                            <span className="unidade-info-label">Tipo</span>
                            <span className="unidade-info-valor">Síndico</span>
                        </div>
                    </div>
                </div>

                {/* Card do Morador */}
                <div className="unidade-sindico-card">
                    <div className="unidade-sindico-header">
                        <h3>Dados Pessoais</h3>
                    </div>

                    <div className="unidade-sindico-grid">
                        <div className="unidade-info-item">
                            <span className="unidade-info-label">Nome</span>
                            <span className="unidade-info-valor">{p.nome || "—"}</span>
                        </div>

                        <div className="unidade-info-item">
                            <span className="unidade-info-label">E-mail</span>
                            <span className="unidade-info-valor">{p.email || "—"}</span>
                        </div>

                        <div className="unidade-info-item">
                            <span className="unidade-info-label">CPF</span>
                            <span className="unidade-info-valor">{formatarCpf(p.cpf)}</span>
                        </div>

                        <div className="unidade-info-item">
                            <span className="unidade-info-label">Telefone</span>
                            <span className="unidade-info-valor">{formatarTelefoneExibir(p.telefone)}</span>
                        </div>

                        <div className="unidade-info-item">
                            <span className="unidade-info-label">Data de Entrada</span>
                            <span className="unidade-info-valor">{formatarDataPerfil(p.dataEntrada)}</span>
                        </div>

                        <div className="unidade-info-item">
                            <span className="unidade-info-label">Status</span>
                            <span className="unidade-info-valor badge badge-verde" style={{ display: "inline-block" }}>
                                {p.statusMorador || "Ativo"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PainelSindico;

