import { useState } from "react";
import { FiCalendar, FiXCircle } from "react-icons/fi";
import DatePicker from "react-datepicker";

function SindicoReservas({ api, toast }) {
    const [areasDeLazer      , setAreasDeLazer      ] = useState([]);
    const [historicoReservas , setHistoricoReservas ] = useState([]);
    const [areaSelecionada   , setAreaSelecionada   ] = useState(null);
    const [dataReserva       , setDataReserva       ] = useState(null);
    const [carregandoReservas, setCarregandoReservas] = useState(true);
    const [jaCarregou        , setJaCarregou        ] = useState(false);

    // --- CARREGA DADOS NA PRIMEIRA RENDERIZAÇÃO ---
    if (!jaCarregou) {
        setJaCarregou(true);
        (async () => {
            setCarregandoReservas(true);
            try {
                const [resAreas, resHistorico] = await Promise.all([
                    api.get("/reservas/areas-lazer").catch(()     => ({ data: [] })),
                    api.get("/reservas/minhas-reservas").catch(() => ({ data: [] })),
                ]);
                setAreasDeLazer(resAreas.data || []);
                setHistoricoReservas(resHistorico.data || []);
            } catch (err) {
                console.error("Erro ao carregar reservas:", err);
            } finally {
                setCarregandoReservas(false);
            }
        })();
    }

    async function confirmarReservaSindico(e) {
        e.preventDefault();
        try {
            const res = await api.post("/reservas", {
                idAreaLazer: areaSelecionada.id,
                dataReserva: dataReserva ? dataReserva.toISOString().split("T")[0] : "",
            });
            setHistoricoReservas([res.data, ...historicoReservas]);
            toast.sucesso(`Reserva do ${areaSelecionada.nome} confirmada!`, "Sucesso");
            setAreaSelecionada(null);
            setDataReserva(null);
        } catch (err) {
            const msg = err.response?.data?.messages?.[0] || err.response?.data?.message || "Erro ao reservar.";
            toast.erro(String(msg), "Erro");
        }
    }

    async function cancelarReservaSindico(id) {
        try {
            await api.put(`/reservas/${id}/cancelar`);
            setHistoricoReservas(historicoReservas.map(r => r.id === id ? { ...r, status: "CANCELADA" } : r));
            toast.sucesso("Reserva cancelada!", "Sucesso");
        } catch (err) {
            toast.erro("Erro ao cancelar reserva.", "Erro");
        }
    }

    if (carregandoReservas) {
        return <p className="msg-vazia">Carregando reservas...</p>;
    }

    return (
        <>
            <h3 style={{ color: "var(--primary-green)", marginBottom: "14px" }}>Áreas Disponíveis</h3>
            {areasDeLazer.length === 0 ? (
                <p className="msg-vazia">Nenhuma área de lazer cadastrada.</p>
            ) : (
                <div className="grid-areas-sindico">
                    {areasDeLazer.map(area => (
                        <div key={area.id} className="card-area-sindico">
                            <div className="area-icone"><FiCalendar /></div>
                            <h4>{area.nome}</h4>
                            <p>Máximo: <strong>{area.capacidadeMaxima} pessoas</strong></p>
                            <p>Valor: <strong>{!area.valor || area.valor === 0 ? "Gratuito" : `R$ ${area.valor.toFixed(2)}`}</strong></p>
                            <button className="btn-publicar" style={{ marginTop: "8px", width: "100%" }} onClick={() => { setAreaSelecionada(area); setDataReserva(null); }}>
                                Escolher Data
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODAL DE CONFIRMAÇÃO --- */}
            {areaSelecionada && (
                <div className="modal-overlay" onClick={() => setAreaSelecionada(null)}>
                    <div className="modal-confirm" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "400px" }}>
                        <h3>Confirmar Reserva</h3>
                        <p>Espaço: <strong>{areaSelecionada.nome}</strong></p>
                        <form onSubmit={confirmarReservaSindico} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
                            <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Escolha a data:</label>
                            <DatePicker
                                selected={dataReserva}
                                onChange={(date) => setDataReserva(date)}
                                locale="pt-BR"
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Selecione a data"
                                minDate={new Date()}
                                className="datepicker-input"
                                calendarClassName="datepicker-calendario"
                                required
                                autoComplete="off"
                            />
                            {areaSelecionada.valor > 0 && (
                                <p style={{ fontSize: "0.8rem", color: "var(--warning-color)" }}>
                                    R$ {areaSelecionada.valor.toFixed(2)} serão cobrados no próximo boleto.
                                </p>
                            )}

                            <div className="modal-confirm-botoes">
                                <button type="button" className="btn-cancelar" onClick={() => setAreaSelecionada(null)}>Cancelar</button>
                                <button type="submit" className="btn-publicar">Confirmar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- HISTÓRICO --- */}
            <h3 style={{ color: "var(--primary-green)", margin: "28px 0 14px" }}>Histórico de Reservas</h3>
            {historicoReservas.length === 0 ? (
                <p className="msg-vazia">Você ainda não possui reservas.</p>
            ) : (
                <table className="tabela-sindico">
                    <thead>
                        <tr>
                            <th>
                                Área
                            </th>

                            <th>
                                Data
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {historicoReservas.map(r => (
                            <tr key={r.id}>
                                <td>
                                    {r.nomeAreaLazer}
                                </td>

                                <td>
                                    {new Date(r.dataReserva + "T00:00:00").toLocaleDateString("pt-BR")}
                                </td>

                                <td>
                                    <span className={`badge ${r.status === "APROVADA" ? "badge-verde" : r.status === "CANCELADA" ? "badge-vermelho" : "badge-amarelo"}`}>
                                        {r.status}
                                    </span>
                                </td>

                                <td>
                                    {r.status === "APROVADA" && (
                                        <button className="btn-deletar-aviso" onClick={() => cancelarReservaSindico(r.id)} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                            <FiXCircle /> Cancelar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}

export default SindicoReservas;

