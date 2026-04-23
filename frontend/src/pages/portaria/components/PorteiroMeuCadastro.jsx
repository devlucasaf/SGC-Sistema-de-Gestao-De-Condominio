import { FiUser } from "react-icons/fi";

function PorteiroMeuCadastro({
    meuNome, 
    setMeuNome,
    meuEmail, 
    setMeuEmail,
    meuTelefone, 
    setMeuTelefone,
    salvandoPerfil, 
    salvarPerfilPorteiro,
    formatarTelefone
}) {
    return (
        <div className="porteiro-form-card">
            <h3><FiUser /> Atualizar Meu Cadastro</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "16px" }}>
                Atualize seus dados pessoais abaixo.
            </p>

            <form className="porteiro-form" onSubmit={salvarPerfilPorteiro} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                            Nome completo
                        </label>
                        <input
                            type="text"
                            value={meuNome}
                            onChange={(e) => setMeuNome(e.target.value)}
                            placeholder="Seu nome"
                            required
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid var(--border-color)",
                                background: "var(--bg-input, var(--bg-card))",
                                color: "var(--text-primary)",
                                fontSize: "0.9rem"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                            E-mail
                        </label>
                        <input
                            type="email"
                            value={meuEmail}
                            onChange={(e) => setMeuEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid var(--border-color)",
                                background: "var(--bg-input, var(--bg-card))",
                                color: "var(--text-primary)",
                                fontSize: "0.9rem"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                            Telefone
                        </label>
                        <input
                            type="text"
                            value={meuTelefone}
                            onChange={(e) => setMeuTelefone(formatarTelefone(e.target.value))}
                            placeholder="(00) 00000-0000"
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid var(--border-color)",
                                background: "var(--bg-input, var(--bg-card))",
                                color: "var(--text-primary)",
                                fontSize: "0.9rem"
                            }}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-registrar"
                    disabled={salvandoPerfil}
                    style={{
                        alignSelf: "flex-start",
                        marginTop: "8px"
                    }}
                >
                    {salvandoPerfil ? "Salvando..." : "Salvar Alterações"}
                </button>
            </form>
        </div>
    );
}

export default PorteiroMeuCadastro;

