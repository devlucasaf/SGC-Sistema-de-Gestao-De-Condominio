import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ReservaMorador.css";

function ReservaMorador() {
    const [areaSelecionada, setAreaSelecionada] = useState(null); 
    const [dataReserva, setDataReserva] = useState("");

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

        console.log("Reserva confirmada:", { area: areaSelecionada.nome, data: dataReserva });

        let mensagem = `Reserva do ${areaSelecionada.nome} para o dia ${dataReserva} confirmada!`;

        if (areaSelecionada.valor > 0) {
            mensagem += `\nO valor de R$ ${areaSelecionada.valor.toFixed(2)} será incluído no seu próximo boleto.`;
        }

        alert(mensagem);
        fecharModal();
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
