import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import "../../styles/ReservaMorador.css";

function ReservaMorador() {
    const [areaSelecionada, setAreaSelecionada] = useState(null); 
    const [dataReserva, setDataReserva] = useState("");
    const [historico, setHistorico] = useState([]);

    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(true);

    const areasDeLazer = [
        {
            id: 1,
            nome: "Churrasqueira",
            capacidade: 50,
            valor: 80
        },
        {
            id: 2,
            nome: "Salão de Festas",
            capacidade: 100,
            valor: 120
        },
        {
            id: 3,
            nome: "Salão Gourmet",
            capacidade: 30,
            valor: 95
        },
        {
            id: 4,
            nome: "Cinema",
            capacidade: 15,
            valor: 70
        },
        {
            id: 5,
            nome: "Sauna",
            capacidade: 10,
            valor: 40
        },
        {
            id: 6,
            nome: "Hidromassagem",
            capacidade: 8,
            valor: 50
        }
    ];

    useEffect(() => {
        async function carregarHistorico() {
            try {
                const response = await api.get("/reservas/minhas-reservas");
                setHistorico(response.data);
            }

            catch (error) {
                console.error("Erro ao buscar histórico:", error);
            }
        }

        carregarHistorico();
    }, []);

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    function abrirModal(area) {
        setAreaSelecionada(area);
        setDataReserva("");
    }

    function fecharModal() {
        setAreaSelecionada(null);
    }

    function confirmarReserva(e) {
        e.preventDefault();

        const reservaRequestDTO = {
            idAreaLazer: areaSelecionada.id,
            dataReserva: dataReserva
        };

        try {
            // const response = await api.post("/reservas", reservaRequestDTO);
            const reservaSalva = response.data;

            const novaReservaHistorico = {
                id: reservaSalva.id,
                area: areaSelecionada.nome,
                data: reservaSalva.dataReserva,
                valor: areaSelecionada.valor,
                status: reservaSalva.status
            };

            setHistorico([novaReservaHistorico, ...historico]);

            alert(`Reserva do ${areaSelecionada.nome} confirmada`);
            fecharModal();
        }

        catch (error) {
            const mensagemErro = error.response ? error.response.data : "Erro ao realizar reserva";
            alert(mensagemErro);
        }
    }

    return (
        <div className={`tela-reserva ${isDarkMode ? "tema-escuro" : "tema-claro"}`}>
            
            <nav className="navbar-reserva">
                <h2>Reservar Espaços</h2>
                <button className="btn-tema-reserva" onClick={alternarTema}>
                    {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
                </button>
            </nav>

            <div className="conteiner-reserva">
                <div className="cabecalho-reserva">
                    <button className="btn-voltar" onClick={() => navigate("/paginainicialmorador")}>
                        ⬅ Voltar para Página Inicial
                    </button>
                    <p className="subtitulo">Selecione o espaço que deseja reservar:</p>
                </div>

                {/* GRID DE ÁREAS */}
                <div className="grid-areas">
                    {areasDeLazer.map((area) => (
                        <div key={area.id} className="cartao-area">
                            <div className="icone-area">{area.icone}</div>
                            <h3>{area.nome}</h3>
                            <p>Máximo: <strong>{area.capacidade} pessoas</strong></p>
                            <p>Valor: <strong>{area.valor === 0 ? "Gratuito" : `R$ ${area.valor.toFixed(2)}`}</strong></p>
                            <button className="btn-reservar" onClick={() => abrirModal(area)}>
                                Escolher Data
                            </button>
                        </div>
                    ))}
                </div>

                {/* NOVO: SEÇÃO DE HISTÓRICO */}
                <div className="secao-historico" style={{ marginTop: '40px' }}>
                    <h3>Histórico de Reservas</h3>
                    {historico.length === 0 ? (
                        <p>Você ainda não possui reservas feitas.</p>
                    ) : (
                        <div className="tabela-container">
                            <table className="tabela-reservas" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th     
                                            style={{ 
                                                padding: '10px', 
                                                borderBottom: '1px solid #ccc' 
                                            }}>
                                                Área
                                        </th>
                                        <th 
                                            style={{ 
                                                padding: '10px', 
                                                borderBottom: '1px solid #ccc' 
                                            }}>
                                                Data
                                        </th>
                                        <th 
                                            style={{ 
                                                padding: '10px', 
                                                borderBottom: '1px solid #ccc' 
                                            }}>
                                                Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historico.map((item) => (
                                        <tr key={item.id}>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{item.area}</td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                                {new Date(item.data).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                                <strong>{item.status}</strong>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {areaSelecionada && (
                <div className="overlay-modal">
                    <div className="caixa-modal fadeIn">
                        <h3>Confirmar Reserva</h3>
                        <p>Você selecionou: <strong>{areaSelecionada.icone} {areaSelecionada.nome}</strong></p>
                        
                        <form onSubmit={confirmarReserva} className="form-modal">
                            <label>Escolha a Data:</label>

                            <input 
                                type="date" 
                                required 
                                value={dataReserva}
                                onChange={(e) => setDataReserva(e.target.value)}
                            />
                            
                            {areaSelecionada.valor > 0 && (
                                <div className="aviso-cobranca">
                                    Atenção: R$ {areaSelecionada.valor.toFixed(2)} serão cobrados no próximo boleto.
                                </div>
                            )}

                            <div className="botoes-modal">
                                <button type="button" className="btn-cancelar" onClick={fecharModal}>Cancelar</button>
                                <button type="submit" className="btn-confirmar">Confirmar Reserva</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReservaMorador;
