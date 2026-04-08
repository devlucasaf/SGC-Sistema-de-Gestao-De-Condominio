import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/PainelSindico.css";

function PainelSindico() {
    const [abaAtiva, setAbaAtiva] = useState("dashboard");
    const navigate = useNavigate();

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
            const [resMoradores, resUnidades, resReclamacoes, resAvisos] = await Promise.all([
                api.get("/moradores").catch(() => ({ data: [] })),
                api.get("/unidades").catch(() => ({ data: [] })),
                api.get("/api/reclamacoes").catch(() => ({ data: { conteudo: [] } })),
                api.get("/avisos").catch(() => ({ data: [] })),
            ]);

            setMoradores(resMoradores.data || []);
            setUnidades(resUnidades.data || []);
            setReclamacoes(resReclamacoes.data.conteudo || resReclamacoes.data || []);
            setAvisos(resAvisos.data || []);
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
            alert("Erro ao publicar aviso.");
        }

        finally {
            setEnviandoAviso(false);
        }
    }

    async function deletarAviso(id) {
        if (!window.confirm("Tem certeza que deseja excluir este aviso?")) {
            return;
        }

        try {
            await api.delete(`/avisos/${id}`);
            setAvisos(avisos.filter(a => a.id !== id));
        }

        catch (err) {
            console.error("Erro ao deletar aviso:", err);
            alert("Erro ao deletar aviso.");
        }
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
            alert("Erro ao atualizar status.");
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
            alert("Erro ao cadastrar unidade.");
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
                    <h2>SGC Condomínio</h2>
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
                            className={abaAtiva === "senha" ? "ativo" : ""} 
                            onClick={() => setAbaAtiva("senha")}
                            >
                                Redefinir Senhas
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
                        {abaAtiva === "senha" && "Redefinir Senhas"}
                    </h1>
                    <span style={{ color: "#888", fontSize: "0.85rem" }}>Olá, {perfil.nome || "Síndico"}</span>
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
                            {abaAtiva === "senha" && renderSenha()}
                        </>
                    )}
                </div>
            </div>
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
                        {enviandoAviso ? "Publicando..." : "📢 Publicar Aviso"}
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
                                    <button className="btn-deletar-aviso" onClick={() => deletarAviso(a.id)}>
                                        🗑 Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }

    function renderSenha() {
        return <RedefinirSenhaInline />;
    }
}

function RedefinirSenhaInline() {
    const [email, setEmail] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [msg, setMsg] = useState("");
    const [tipoMsg, setTipoMsg] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function handleRedefinir(e) {
        e.preventDefault();
        setMsg("");
        if (novaSenha !== confirmar) { 
            setMsg("As senhas não coincidem!"); 
            setTipoMsg("erro"); 
            return; 
        }

        if (novaSenha.length < 6) { 
            setMsg("Mínimo de 6 caracteres."); 
            setTipoMsg("erro"); 
            return; 
        }

        setEnviando(true);
        try {
            const res = await api.patch("/admin/usuarios/redefinir-senha", { email, novaSenha });
            setMsg(res.data.mensagem); setTipoMsg("ok");
            setEmail(""); setNovaSenha(""); setConfirmar("");
        } 
        
        catch (err) {
            setMsg(err.response?.data?.messages?.[0] || "Erro ao redefinir senha."); setTipoMsg("erro");
        } 
        
        finally {
            setEnviando(false);
        }
    }

    return (
        <form className="form-aviso" onSubmit={handleRedefinir} style={{ maxWidth: "500px" }}>
            <h3 style={{ margin: 0, color: "#2ecc71" }}>Redefinir Senha de Usuário</h3>
            <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>Informe o e-mail do morador/porteiro e defina uma nova senha.</p>
            
            <input 
                type="email" 
                placeholder="E-mail do usuário" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
            />
            <input 
                type="password" 
                placeholder="Nova senha (mín. 6 caracteres)" 
                value={novaSenha} 
                onChange={e => setNovaSenha(e.target.value)} 
                required 
            />
            <input 
                type="password" 
                placeholder="Confirmar nova senha" 
                value={confirmar} 
                onChange={e => setConfirmar(e.target.value)} 
                required 
            />

            {msg && (
                <p style={{
                    padding: "10px", 
                    borderRadius: "8px", 
                    fontWeight: "bold", 
                    textAlign: "center",
                    backgroundColor: tipoMsg === "ok" ? "rgba(46,204,113,0.15)" : "rgba(231,76,60,0.15)",
                    color: tipoMsg === "ok" ? "#2ecc71" : "#e74c3c"
                }}>{msg}</p>
            )}

            <button type="submit" className="btn-publicar" disabled={enviando}>
                {enviando ? "Redefinindo..." : "Redefinir Senha"}
            </button>
        </form>
    );
}

export default PainelSindico;

