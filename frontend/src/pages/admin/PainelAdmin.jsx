import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../components/Toast";
import { FiSun, FiMoon, FiUsers, FiShield, FiHome, FiPlus, FiTrash2, FiBarChart2 } from "react-icons/fi";
import "../../styles/PainelSindico.css";

function PainelAdmin() {
    const [abaAtiva, setAbaAtiva] = useState("dashboard");
    const navigate = useNavigate();
    const toast = useToast();

    // --- DADOS ---
    const [dashboard, setDashboard] = useState({});
    const [sindicos, setSindicos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // --- FORM CRIAR SÍNDICO ---
    const [mostrarForm, setMostrarForm] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [telefone, setTelefone] = useState("");
    const [enviando, setEnviando] = useState(false);

    // --- MODAL ---
    const [modalConfirm, setModalConfirm] = useState({ aberto: false, id: null });

    // --- TEMA ---
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) { root.setAttribute("dark-theme", "dark"); localStorage.setItem("theme", "dark"); }
        else { root.removeAttribute("dark-theme"); localStorage.setItem("theme", "light"); }
    }, [isDarkMode]);

    const perfil = JSON.parse(localStorage.getItem("perfilUsuario") || "{}");

    useEffect(() => { carregarDados(); }, []);

    async function carregarDados() {
        setCarregando(true);
        try {
            const [resDash, resSindicos, resUsuarios] = await Promise.all([
                api.get("/admin/dashboard").catch(() => ({ data: {} })),
                api.get("/admin/sindicos").catch(() => ({ data: [] })),
                api.get("/admin/usuarios").catch(() => ({ data: [] })),
            ]);
            setDashboard(resDash.data || {});
            setSindicos(resSindicos.data || []);
            setUsuarios(resUsuarios.data || []);
        } catch (err) {
            console.error("Erro ao carregar dados admin:", err);
        } finally {
            setCarregando(false);
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("perfilUsuario");
        navigate("/login");
    }

    function formatarCpf(valor) {
        const n = valor.replace(/\D/g, "").slice(0, 11);
        return n.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    async function criarSindico(e) {
        e.preventDefault();
        setEnviando(true);
        try {
            await api.post("/admin/sindicos", {
                nome, email, cpf: cpf.replace(/\D/g, ""), senha, dataNascimento, telefone: telefone.replace(/\D/g, ""),
            });
            toast.sucesso("Síndico criado com sucesso!");
            setNome(""); setEmail(""); setCpf(""); setSenha(""); setDataNascimento(""); setTelefone("");
            setMostrarForm(false);
            carregarDados();
        } catch (err) {
            toast.erro(err.response?.data?.message || "Erro ao criar síndico.");
        } finally { setEnviando(false); }
    }

    async function confirmarRemover() {
        const { id } = modalConfirm;
        setModalConfirm({ aberto: false, id: null });
        try {
            await api.delete(`/admin/sindicos/${id}`);
            toast.sucesso("Síndico removido!");
            carregarDados();
        } catch (err) {
            toast.erro("Erro ao remover síndico.");
        }
    }

    return (
        <div className="painel-sindico">
            {/* --- SIDEBAR --- */}
            <aside className="sidebar-sindico">
                <div className="sidebar-logo">
                    <h2>SGC Admin</h2>
                    <span>Super Administrador</span>
                </div>

                <ul className="sidebar-menu">
                    <li>
                        <button className={abaAtiva === "dashboard" ? "ativo" : ""} onClick={() => setAbaAtiva("dashboard")}>
                            <FiBarChart2 /> Dashboard
                        </button>
                    </li>
                    <li>
                        <button className={abaAtiva === "sindicos" ? "ativo" : ""} onClick={() => setAbaAtiva("sindicos")}>
                            <FiShield /> Síndicos
                        </button>
                    </li>
                    <li>
                        <button className={abaAtiva === "usuarios" ? "ativo" : ""} onClick={() => setAbaAtiva("usuarios")}>
                            <FiUsers /> Usuários
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
                        {abaAtiva === "dashboard" && "Dashboard Geral"}
                        {abaAtiva === "sindicos" && "Gerenciar Síndicos"}
                        {abaAtiva === "usuarios" && "Todos os Usuários"}
                    </h1>
                    <span style={{ color: "#888", fontSize: "0.85rem" }}>Olá, {perfil.nome || "Admin"}</span>
                    <button className="btn-tema" onClick={() => setIsDarkMode(!isDarkMode)} aria-label="Alternar Tema">
                        {isDarkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </header>

                <div className="corpo-sindico">
                    {carregando ? (
                        <p className="msg-vazia">Carregando...</p>
                    ) : (
                        <>
                            {/* --- DASHBOARD --- */}
                            {abaAtiva === "dashboard" && (
                                <div className="dashboard-grid">
                                    <div className="dashboard-card"><h3>Usuários</h3><div className="valor">{dashboard.totalUsuarios || 0}</div></div>
                                    <div className="dashboard-card" style={{ borderLeft: "4px solid #2ecc71" }}><h3>Moradores</h3><div className="valor">{dashboard.totalMoradores || 0}</div></div>
                                    <div className="dashboard-card" style={{ borderLeft: "4px solid #3498db" }}><h3>Síndicos</h3><div className="valor">{dashboard.totalSindicos || 0}</div></div>
                                    <div className="dashboard-card" style={{ borderLeft: "4px solid #f39c12" }}><h3>Porteiros</h3><div className="valor">{dashboard.totalPorteiros || 0}</div></div>
                                    <div className="dashboard-card" style={{ borderLeft: "4px solid #9b59b6" }}><h3>Unidades</h3><div className="valor">{dashboard.totalUnidades || 0}</div></div>
                                    <div className="dashboard-card" style={{ borderLeft: "4px solid #e74c3c" }}><h3>Reservas</h3><div className="valor">{dashboard.totalReservas || 0}</div></div>
                                    <div className="dashboard-card azul"><h3>Manutenções</h3><div className="valor">{dashboard.totalManutencoes || 0}</div></div>
                                </div>
                            )}

                            {/* --- SÍNDICOS --- */}
                            {abaAtiva === "sindicos" && (
                                <>
                                    <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-publicar" style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <FiPlus /> {mostrarForm ? "Fechar Formulário" : "Criar Novo Síndico"}
                                    </button>

                                    {mostrarForm && (
                                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                                            <h3 style={{ margin: "0 0 16px", color: "var(--text-primary)" }}>Criar Síndico</h3>
                                            <form onSubmit={criarSindico} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                                    <input type="text" placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)} required
                                                        style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-input, var(--bg-card))", color: "var(--text-primary)", fontSize: "0.9rem" }} />
                                                    <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required
                                                        style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-input, var(--bg-card))", color: "var(--text-primary)", fontSize: "0.9rem" }} />
                                                </div>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                                    <input type="text" placeholder="CPF" value={cpf} onChange={e => setCpf(formatarCpf(e.target.value))} maxLength={14} required
                                                        style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-input, var(--bg-card))", color: "var(--text-primary)", fontSize: "0.9rem" }} />
                                                    <input type="date" placeholder="Data de nascimento" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} required
                                                        style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-input, var(--bg-card))", color: "var(--text-primary)", fontSize: "0.9rem" }} />
                                                </div>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                                    <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required
                                                        style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-input, var(--bg-card))", color: "var(--text-primary)", fontSize: "0.9rem" }} />
                                                    <input type="text" placeholder="Telefone (opcional)" value={telefone} onChange={e => setTelefone(e.target.value)}
                                                        style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-input, var(--bg-card))", color: "var(--text-primary)", fontSize: "0.9rem" }} />
                                                </div>
                                                <button type="submit" className="btn-publicar" disabled={enviando} style={{ alignSelf: "flex-start" }}>
                                                    {enviando ? "Criando..." : "Criar Síndico"}
                                                </button>
                                            </form>
                                        </div>
                                    )}

                                    {sindicos.length === 0 ? (
                                        <p className="msg-vazia">Nenhum síndico cadastrado.</p>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                            {sindicos.map(s => (
                                                <div key={s.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "16px", borderLeft: "4px solid #3498db", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                                                    <div>
                                                        <h4 style={{ margin: "0 0 4px", color: "var(--text-primary)" }}>{s.nome}</h4>
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                                            <span>📧 {s.email}</span>
                                                            <span>📋 {s.cpf}</span>
                                                            <span style={{ padding: "2px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: "600", background: s.status === "ATIVO" ? "rgba(46,204,113,0.12)" : "rgba(149,165,166,0.12)", color: s.status === "ATIVO" ? "#2ecc71" : "#95a5a6" }}>
                                                                {s.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => setModalConfirm({ aberto: true, id: s.id })}
                                                        style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #e74c3c", background: "rgba(231,76,60,0.1)", color: "#e74c3c", cursor: "pointer", fontSize: "0.82rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                                                        <FiTrash2 /> Remover
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* --- USUÁRIOS --- */}
                            {abaAtiva === "usuarios" && (
                                <>
                                    <div className="dashboard-grid" style={{ marginBottom: "16px" }}>
                                        <div className="dashboard-card"><h3>Total</h3><div className="valor">{usuarios.length}</div></div>
                                    </div>
                                    {usuarios.length === 0 ? (
                                        <p className="msg-vazia">Nenhum usuário.</p>
                                    ) : (
                                        <div style={{ overflowX: "auto" }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                                                <thead>
                                                    <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                                                        <th style={{ padding: "10px", color: "var(--text-secondary)" }}>ID</th>
                                                        <th style={{ padding: "10px", color: "var(--text-secondary)" }}>Nome</th>
                                                        <th style={{ padding: "10px", color: "var(--text-secondary)" }}>E-mail</th>
                                                        <th style={{ padding: "10px", color: "var(--text-secondary)" }}>Tipo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {usuarios.map(u => (
                                                        <tr key={u.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                                            <td style={{ padding: "10px", color: "var(--text-muted)" }}>{u.id}</td>
                                                            <td style={{ padding: "10px", color: "var(--text-primary)" }}>{u.nome}</td>
                                                            <td style={{ padding: "10px", color: "var(--text-muted)" }}>{u.email}</td>
                                                            <td style={{ padding: "10px" }}>
                                                                <span style={{
                                                                    padding: "3px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: "600",
                                                                    background: u.tipoUsuario === "ADMIN" ? "rgba(155,89,182,0.12)" : u.tipoUsuario === "SINDICO" ? "rgba(52,152,219,0.12)" : u.tipoUsuario === "PORTEIRO" ? "rgba(243,156,18,0.12)" : "rgba(46,204,113,0.12)",
                                                                    color: u.tipoUsuario === "ADMIN" ? "#9b59b6" : u.tipoUsuario === "SINDICO" ? "#3498db" : u.tipoUsuario === "PORTEIRO" ? "#f39c12" : "#2ecc71"
                                                                }}>
                                                                    {u.tipoUsuario}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* --- MODAL --- */}
            {modalConfirm.aberto && (
                <div className="modal-overlay" onClick={() => setModalConfirm({ aberto: false, id: null })}>
                    <div className="modal-confirm" onClick={e => e.stopPropagation()}>
                        <div className="modal-confirm-icone">⚠️</div>
                        <h3>Remover síndico?</h3>
                        <p>Esta ação é irreversível. O usuário e seus dados de síndico serão removidos.</p>
                        <div className="modal-confirm-botoes">
                            <button className="btn-cancelar" onClick={() => setModalConfirm({ aberto: false, id: null })}>Cancelar</button>
                            <button className="btn-confirmar-excluir" onClick={confirmarRemover}>Remover</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PainelAdmin;

