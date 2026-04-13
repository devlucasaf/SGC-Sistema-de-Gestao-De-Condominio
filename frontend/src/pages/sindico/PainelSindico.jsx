import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../components/Toast";
import { FiSun, FiMoon } from "react-icons/fi";
import "../../styles/PainelSindico.css";

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

    // --- DOCUMENTOS ---
    const [documentos, setDocumentos] = useState([]);
    const [tituloDoc, setTituloDoc] = useState("");
    const [conteudoDoc, setConteudoDoc] = useState("");
    const [categoriaDoc, setCategoriaDoc] = useState("REGRA");
    const [enviandoDoc, setEnviandoDoc] = useState(false);
    const [editandoDoc, setEditandoDoc] = useState(null);
    const [modalConfirmDoc, setModalConfirmDoc] = useState({ aberto: false, idDoc: null });

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
            const [resMoradores, resUnidades, resReclamacoes, resAvisos, resDocumentos] = await Promise.all([
                api.get("/moradores").catch(() => ({ data: [] })),
                api.get("/unidades").catch(() => ({ data: [] })),
                api.get("/api/reclamacoes").catch(() => ({ data: { conteudo: [] } })),
                api.get("/avisos").catch(() => ({ data: [] })),
                api.get("/documentos").catch(() => ({ data: [] })),
            ]);

            setMoradores(resMoradores.data || []);
            setUnidades(resUnidades.data || []);
            setReclamacoes(resReclamacoes.data.conteudo || resReclamacoes.data || []);
            setAvisos(resAvisos.data || []);
            setDocumentos(resDocumentos.data || []);
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

                    <li style={{ borderTop: "1px solid var(--border-color)", marginTop: "8px", paddingTop: "8px" }}>
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

                    <button type="submit" className="btn-publicar" disabled={salvandoPerfil} style={{ marginTop: "16px" }}>
                        {salvandoPerfil ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </form>
            </div>
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

