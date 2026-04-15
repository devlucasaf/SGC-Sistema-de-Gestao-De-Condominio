function SindicoMinhaUnidade({ perfilCompleto, formatarCpf, formatarTelefoneExibir, formatarDataPerfil }) {
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

export default SindicoMinhaUnidade;

