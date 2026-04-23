import { useState } from "react";

function SindicoUnidades({ unidades, setUnidades, api, toast }) {
    const [blocoNovo, setBlocoNovo] = useState("");
    const [andarNovo, setAndarNovo] = useState("");
    const [aptoNovo , setAptoNovo ] = useState("");

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
        } catch (err) {
            console.error("Erro ao cadastrar unidade:", err);
            toast.erro("Erro ao cadastrar unidade.", "Falha");
        }
    }

    return (
        <>
            <form className="form-aviso" onSubmit={cadastrarUnidade} style={{ flexDirection: "row", flexWrap: "wrap" }}>
                <input
                    type="text"
                    placeholder="Bloco (Ex: A)"
                    value={blocoNovo}
                    onChange={(e) => setBlocoNovo(e.target.value)}
                    required
                    style={{ 
                        flex: 1, 
                        minWidth: "120px"
                    }}
                />
                <input
                    type="number"
                    placeholder="Andar (Ex: 1)"
                    value={andarNovo}
                    onChange={(e) => setAndarNovo(e.target.value)}
                    required
                    style={{ 
                        flex: 1, 
                        minWidth: "120px" 
                    }}
                />
                <input
                    type="text"
                    placeholder="Nº Apto (Ex: 101)"
                    value={aptoNovo}
                    onChange={(e) => setAptoNovo(e.target.value)}
                    required
                    style={{ 
                        flex: 1, 
                        minWidth: "120px" 
                    }}
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

export default SindicoUnidades;

