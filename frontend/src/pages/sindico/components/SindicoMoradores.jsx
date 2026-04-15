function SindicoMoradores({ moradores }) {
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

export default SindicoMoradores;

