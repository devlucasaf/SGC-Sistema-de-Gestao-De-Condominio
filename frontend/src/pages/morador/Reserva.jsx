import  { useEffect, useState }          from "react";
import  { useNavigate }                  from "react-router-dom";
import  { ptBR }                         from "date-fns/locale";
import  { useToast }                     from "../../components/Toast";
import  DatePicker, { registerLocale }   from "react-datepicker";

import  api      from  "../../services/api";
import  Loading  from  "../../components/Loading";

import "react-datepicker/dist/react-datepicker.css";
import "../../styles/Reserva.css";
import "../../styles/Cadastro.css";

import { FiSun, FiMoon, FiArrowLeft, FiCalendar, FiXCircle, FiClock } from "react-icons/fi";

registerLocale("pt-BR", ptBR);

function Reserva() {
    const [areasDeLazer       ,     setAreasDeLazer       ]         = useState([]);
    const [carregandoAreas    ,     setCarregandoAreas    ]         = useState(true);
    const [areaSelecionada    ,     setAreaSelecionada    ]         = useState(null);
    const [dataReserva        ,     setDataReserva        ]         = useState(null);
    const [horaInicio         ,     setHoraInicio         ]         = useState("");
    const [horaFim            ,     setHoraFim            ]         = useState("");
    const [historico          ,     setHistorico          ]         = useState([]);
    const [carregandoHistorico,     setCarregandoHistorico]         = useState(true);
    const [datasOcupadas      ,     setDatasOcupadas      ]         = useState([]);
    const [reservasOcupadas   ,     setReservasOcupadas   ]         = useState([]);

    const navigate  = useNavigate();
    const toast     = useToast();

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.setAttribute("dark-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.removeAttribute("dark-theme");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    // --- BUSCA AS ÁREAS DE LAZER DO BACKEND ---
    useEffect(() => {
        async function carregarAreas() {
            try {
                const response = await api.get("/reservas/areas-lazer");
                setAreasDeLazer(response.data);
            } catch (error) {
                console.error("Erro ao buscar áreas de lazer:", error);
                toast.erro("Erro ao carregar áreas de lazer.", "Erro");
            } finally {
                setCarregandoAreas(false);
            }
        }

        carregarAreas();
    }, []);

    // --- BUSCA O HISTÓRICO DE RESERVAS ---
    useEffect(() => {
        async function carregarHistorico() {
            try {
                const response = await api.get("/reservas/minhas-reservas");
                const historicoMapeado = response.data.map((r) => ({
                    id:         r.id,
                    area:       r.nomeAreaLazer,
                    data:       r.dataReserva,
                    horaInicio: r.horaInicio,
                    horaFim:    r.horaFim,
                    valor:      r.valorAreaLazer,
                    status:     r.status
                }));
                setHistorico(historicoMapeado);
            } catch (error) {
                console.error("Erro ao buscar histórico:", error);
            } finally {
                setCarregandoHistorico(false);
            }
        }

        carregarHistorico();
    }, []);

    function alternarTema() {
        setIsDarkMode(!isDarkMode);
    }

    // --- BUSCAR DATAS OCUPADAS AO SELECIONAR ÁREA ---
    async function abrirModal(area) {
        setAreaSelecionada(area);
        setDataReserva(null);
        setHoraInicio("");
        setHoraFim("");

        try {
            const res = await api.get(`/reservas/ocupadas?idAreaLazer=${area.id}`);
            setReservasOcupadas(res.data || []);

            // --- AGRUPA DATAS QUE TÊM RESERVA ---
            const datas = (res.data || []).map(r => new Date(r.dataReserva + "T00:00:00"));
            setDatasOcupadas(datas);
        } catch (err) {
            console.error("Erro ao carregar datas ocupadas:", err);
            setDatasOcupadas([]);
            setReservasOcupadas([]);
        }
    }

    function fecharModal() {
        setAreaSelecionada(null);
        setReservasOcupadas([]);
        setDatasOcupadas([]);
    }

    // --- HORÁRIOS OCUPADOS NA DATA SELECIONADA ---
    function getHorariosOcupadosNaData() {
        if (!dataReserva) return [];
        const dataStr = dataReserva.toISOString().split("T")[0];
        return reservasOcupadas.filter(r => r.dataReserva === dataStr);
    }

    async function confirmarReserva(e) {
        e.preventDefault();

        if (!horaInicio || !horaFim) {
            toast.erro("Selecione o horário de início e término.", "Erro");
            return;
        }

        if (horaFim <= horaInicio) {
            toast.erro("O horário de término deve ser após o de início.", "Erro");
            return;
        }

        const reservaRequestDTO = {
            idAreaLazer: areaSelecionada.id,
            dataReserva: dataReserva
                ? dataReserva.toISOString().split("T")[0]
                : "",
            horaInicio: horaInicio + ":00",
            horaFim: horaFim + ":00",
        };

        try {
            const response = await api.post("/reservas", reservaRequestDTO);
            const reservaSalva = response.data;

            const novaReservaHistorico = {
                id:         reservaSalva.id,
                area:       reservaSalva.nomeAreaLazer,
                data:       reservaSalva.dataReserva,
                horaInicio: reservaSalva.horaInicio,
                horaFim:    reservaSalva.horaFim,
                valor:      reservaSalva.valorAreaLazer,
                status:     reservaSalva.status
            };

            setHistorico([novaReservaHistorico, ...historico]);

            toast.sucesso(`Reserva do ${areaSelecionada.nome} confirmada!`, "Reserva realizada");
            fecharModal();
        } catch (error) {
            const mensagemErro = error.response?.data?.messages?.[0]
                || error.response?.data?.message
                || error.response?.data
                || "Erro ao realizar reserva";
            toast.erro(String(mensagemErro), "Erro na reserva");
        }
    }

    async function cancelarReserva(idReserva) {
        try {
            await api.put(`/reservas/${idReserva}/cancelar`);
            setHistorico(historico.map(item =>
                item.id === idReserva ? { ...item, status: "CANCELADA" } : item
            ));
            toast.sucesso("Reserva cancelada com sucesso!", "Cancelada");
        } catch (error) {
            const msg = error.response?.data?.messages?.[0] || "Erro ao cancelar reserva.";
            toast.erro(msg, "Erro");
        }
    }

    // --- FORMATA HORA (HH:mm:ss -> HH:mm) ---
    function formatarHora(hora) {
        if (!hora) return "";
        return hora.substring(0, 5);
    }

    return (
        <div className="entregas-container">

            <nav className="navbar">
                <div className="navbar-logo">
                    <h2>Reservar Espaços</h2>
                </div>
                
                <div className="perfil-container">
                    <button className="btn-tema" onClick={alternarTema} aria-label="Alternar Tema">
                        {isDarkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </div>
            </nav>

            <main className="entregas-conteudo">
                <div className="entregas-header">
                    <button className="btn-voltar" onClick={() => navigate("/home")}>
                        <FiArrowLeft /> Voltar para Página Inicial
                    </button>
                    <p className="subtitulo">Selecione o espaço que deseja reservar:</p>
                </div>

                {/* --- GRID DE ÁREAS --- */}
                {carregandoAreas ? (
                    <Loading mensagem="Carregando áreas de lazer..." />
                ) : areasDeLazer.length === 0 ? (
                    <p style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                        Nenhuma área de lazer cadastrada no sistema.
                    </p>
                ) : (
                    <div className="grid-areas">
                        {areasDeLazer.map((area) => (
                            <div key={area.id} className="cartao-area">
                                <div className="icone-area"><FiCalendar /></div>
                                <h3>{area.nome}</h3>
                                <p>Máximo: <strong>{area.capacidadeMaxima} pessoas</strong></p>
                                <p>Valor: <strong>{!area.valor || area.valor === 0 ? "Gratuito" : `R$ ${area.valor.toFixed(2)}`}</strong></p>
                                <button className="btn-reservar" onClick={() => abrirModal(area)}>
                                    Escolher Data e Horário
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- SEÇÃO DE HISTÓRICO --- */}
                <div className="secao-historico" style={{ marginTop: '40px' }}>
                    <h3>Histórico de Reservas</h3>
                    {carregandoHistorico ? (
                        <Loading mensagem="Carregando histórico..." />
                    ) : historico.length === 0 ? (
                        <p>Você ainda não possui reservas feitas.</p>
                    ) : (
                        <div className="tabela-container">
                            <table className="tabela-reservas">
                                <thead>
                                    <tr>
                                        <th>Área</th>
                                        <th>Data</th>
                                        <th>Horário</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {historico.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.area}</td>
                                            <td>
                                                {new Date(item.data + "T00:00:00").toLocaleDateString('pt-BR')}
                                            </td>
                                            <td>
                                                {item.horaInicio && item.horaFim
                                                    ? `${formatarHora(item.horaInicio)} - ${formatarHora(item.horaFim)}`
                                                    : "—"
                                                }
                                            </td>
                                            <td>
                                                <span className={`badge-status ${
                                                    item.status === "APROVADA" ? "status-aprovada" :
                                                    item.status === "CANCELADA" ? "status-cancelada" : "status-pendente"
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                {item.status === "APROVADA" && (
                                                    <button
                                                        className="btn-cancelar-reserva"
                                                        onClick={() => cancelarReserva(item.id)}
                                                        title="Cancelar reserva"
                                                    >
                                                        <FiXCircle /> Cancelar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {areaSelecionada && (
                <div className="overlay-modal">
                    <div className="caixa-modal fadeIn">
                        <h3>Confirmar Reserva</h3>
                        <p>Você selecionou: <strong>{areaSelecionada.nome}</strong></p>

                        <form onSubmit={confirmarReserva} className="form-modal">
                            <label>Escolha a Data:</label>

                            <div className="datepicker-wrapper" style={{ width: "100%" }}>
                                <DatePicker
                                    selected={dataReserva}
                                    onChange={(date) => setDataReserva(date)}
                                    locale="pt-BR"
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Selecione a data da reserva"
                                    minDate={new Date()}
                                    className="datepicker-input"
                                    calendarClassName="datepicker-calendario"
                                    required
                                    autoComplete="off"
                                    highlightDates={[
                                        { "data-ocupada": datasOcupadas }
                                    ]}
                                    dayClassName={(date) => {
                                        const dateStr = date.toISOString().split("T")[0];
                                        const temReserva = datasOcupadas.some(d =>
                                            d.toISOString().split("T")[0] === dateStr
                                        );
                                        return temReserva ? "data-ocupada" : undefined;
                                    }}
                                />
                                <FiCalendar className="datepicker-icone" />
                            </div>

                            {/* --- HORÁRIOS OCUPADOS NA DATA SELECIONADA --- */}
                            {dataReserva && getHorariosOcupadosNaData().length > 0 && (
                                <div style={{
                                    background: "rgba(231,76,60,0.08)",
                                    border: "1px solid rgba(231,76,60,0.25)",
                                    borderRadius: "8px",
                                    padding: "10px 14px",
                                    marginTop: "8px",
                                    fontSize: "0.82rem"
                                }}>
                                    <strong style={{ color: "#e74c3c" }}>Horários já reservados neste dia:</strong>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                                        {getHorariosOcupadosNaData().map((r, i) => (
                                            <span key={i} style={{
                                                padding: "3px 10px",
                                                borderRadius: "12px",
                                                background: "rgba(231,76,60,0.12)",
                                                color: "#e74c3c",
                                                fontSize: "0.78rem",
                                                fontWeight: "600"
                                            }}>
                                                {formatarHora(r.horaInicio)} - {formatarHora(r.horaFim)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* --- SELEÇÃO DE HORÁRIO --- */}
                            <label style={{ marginTop: "12px" }}>
                                <FiClock style={{ marginRight: "6px", verticalAlign: "middle" }} />
                                Horário:
                            </label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Início</span>
                                    <input
                                        type="time"
                                        value={horaInicio}
                                        onChange={(e) => setHoraInicio(e.target.value)}
                                        required
                                        style={{
                                            padding: "10px",
                                            borderRadius: "8px",
                                            border: "1px solid var(--border-color)",
                                            background: "var(--bg-input, var(--bg-card))",
                                            color: "var(--text-primary)",
                                            fontSize: "0.9rem"
                                        }}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Término</span>
                                    <input
                                        type="time"
                                        value={horaFim}
                                        onChange={(e) => setHoraFim(e.target.value)}
                                        required
                                        style={{
                                            padding: "10px",
                                            borderRadius: "8px",
                                            border: "1px solid var(--border-color)",
                                            background: "var(--bg-input, var(--bg-card))",
                                            color: "var(--text-primary)",
                                            fontSize: "0.9rem"
                                        }}
                                    />
                                </div>
                            </div>

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

export default Reserva;
