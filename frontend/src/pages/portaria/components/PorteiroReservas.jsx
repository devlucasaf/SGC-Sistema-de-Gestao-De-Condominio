import { FiCalendar, FiClock, FiCheck } from "react-icons/fi";

function PorteiroReservas({ reservas, formatarDataCurta }) {
    const hoje = new Date().toISOString().split("T")[0];
    const reservasHojeList = reservas.filter(r => r.dataReserva === hoje);
    const reservasFuturas = reservas.filter(r => r.dataReserva > hoje);
    const reservasPassadas = reservas.filter(r => r.dataReserva < hoje);

    function renderCardReserva(res) {
        return (
            <div key={res.id} className="porteiro-card">
                <div className="porteiro-card-info">
                    <div className="porteiro-card-icone icone-reserva">
                        <FiCalendar />
                    </div>
                    <div className="porteiro-card-dados">
                        <h4>{res.nomeAreaLazer}</h4>
                        <div className="porteiro-card-meta">
                            <span>{res.nomeMorador}</span>
                            <span>Bloco {res.bloco} — Apto {res.numeroApto}</span>
                            <span>{formatarDataCurta(res.dataReserva)}</span>
                        </div>
                    </div>
                </div>
                <div className="porteiro-card-acoes">
                    <span className={`badge-status ${
                        res.status === "CONFIRMADA" ? "badge-verde" :
                        res.status === "CANCELADA" ? "badge-vermelho" : "badge-amarelo"
                    }`}>
                        {
                            res.status === "CONFIRMADA" ? "Confirmada" :
                            res.status === "CANCELADA" ? "Cancelada" : "Pendente"
                        }
                    </span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="porteiro-resumo">
                <div className="resumo-card pendente">
                    <FiCalendar />
                    <div>
                        <span className="resumo-valor">{reservasHojeList.length}</span>
                        <span className="resumo-label">Hoje</span>
                    </div>
                </div>
                <div className="resumo-card analise">
                    <FiClock />
                    <div>
                        <span className="resumo-valor">{reservasFuturas.length}</span>
                        <span className="resumo-label">Próximas</span>
                    </div>
                </div>
                <div className="resumo-card retirado">
                    <FiCheck />
                    <div>
                        <span className="resumo-valor">{reservasPassadas.length}</span>
                        <span className="resumo-label">Concluídas</span>
                    </div>
                </div>
            </div>

            {reservasHojeList.length > 0 && (
                <>
                    <h3 className="porteiro-subtitulo destaque">Reservas de Hoje</h3>
                    <div className="porteiro-lista">
                        {reservasHojeList.map(res => renderCardReserva(res))}
                    </div>
                </>
            )}

            {reservasFuturas.length > 0 && (
                <>
                    <h3 className="porteiro-subtitulo">Próximas Reservas</h3>
                    <div className="porteiro-lista">
                        {reservasFuturas.map(res => renderCardReserva(res))}
                    </div>
                </>
            )}

            {reservasPassadas.length > 0 && (
                <>
                    <h3 className="porteiro-subtitulo">Reservas Anteriores</h3>
                    <div className="porteiro-lista">
                        {reservasPassadas.map(res => renderCardReserva(res))}
                    </div>
                </>
            )}

            {reservas.length === 0 && (
                <p className="msg-vazia">Nenhuma reserva encontrada.</p>
            )}
        </>
    );
}

export default PorteiroReservas;

