function SindicoMeuPerfil({
    meuNome, setMeuNome, 
    meuEmail,setMeuEmail,
    meuTelefone, setMeuTelefone, 
    meuNumeroApto,
    meuBloco, setMeuBloco, 
    meuAndarCalc,
    salvandoPerfil, salvarMeuPerfil,
    formatarTelefone,
    handleMeuApto
}) {
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
                        {meuAndarCalc && <span className="andar-calculado">{meuAndarCalc}</span>}
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

export default SindicoMeuPerfil;

