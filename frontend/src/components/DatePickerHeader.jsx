import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getMonth, getYear } from "date-fns";
import "../styles/DatePickerHeader.css";

// --- MESES EM PORTUGUÊS ---
const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];

// --- GERA ARRAY DE ANOS ---
function gerarAnos(minAno = 1920, maxAno = new Date().getFullYear() + 5) {
    const arr = [];
    for (let i = maxAno; i >= minAno; i--) {
        arr.push(i);
    }
    return arr;
}

// --- COMPONENTE CUSTOM HEADER PARA DATEPICKER ---
function DatePickerHeader({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    minAno = 1920,
    maxAno,
}) {
    const [mesAberto, setMesAberto] = useState(false);
    const [anoAberto, setAnoAberto] = useState(false);
    const mesRef = useRef(null);
    const anoRef = useRef(null);

    const anos = gerarAnos(minAno, maxAno || new Date().getFullYear() + 5);

    // --- FECHAR AO CLICAR FORA ---
    useEffect(() => {
        function handleClickFora(e) {
            if (mesRef.current && !mesRef.current.contains(e.target)) {
                setMesAberto(false);
            }

            if (anoRef.current && !anoRef.current.contains(e.target)) {
                setAnoAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    return (
        <div className="dp-custom-header">
            <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="dp-nav-btn">
                <FiChevronLeft />
            </button>

            <div className="dp-selects">
                {/* --- DROPDOWN MÊS --- */}
                <div className="dp-dropdown-wrapper" ref={mesRef}>
                    <div
                        className={`dp-dropdown-trigger ${mesAberto ? "aberto" : ""}`}
                        onClick={() => { setMesAberto(!mesAberto); setAnoAberto(false); }}
                    >
                        <span>{meses[getMonth(date)]}</span>
                        <FiChevronDown className={`dp-dropdown-arrow ${mesAberto ? "girar" : ""}`} />
                    </div>
                    {mesAberto && (
                        <ul className="dp-dropdown-opcoes">
                            {meses.map((mes, i) => (
                                <li
                                    key={mes}
                                    className={`dp-dropdown-item ${getMonth(date) === i ? "ativo" : ""}`}
                                    onClick={() => { changeMonth(i); setMesAberto(false); }}
                                >
                                    {mes}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* --- DROPDOWN ANO --- */}
                <div className="dp-dropdown-wrapper" ref={anoRef}>
                    <div
                        className={`dp-dropdown-trigger ${anoAberto ? "aberto" : ""}`}
                        onClick={() => { setAnoAberto(!anoAberto); setMesAberto(false); }}
                    >
                        <span>{getYear(date)}</span>
                        <FiChevronDown className={`dp-dropdown-arrow ${anoAberto ? "girar" : ""}`} />
                    </div>
                    {anoAberto && (
                        <ul className="dp-dropdown-opcoes dp-dropdown-anos">
                            {anos.map(ano => (
                                <li
                                    key={ano}
                                    className={`dp-dropdown-item ${getYear(date) === ano ? "ativo" : ""}`}
                                    onClick={() => { changeYear(ano); setAnoAberto(false); }}
                                >
                                    {ano}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="dp-nav-btn">
                <FiChevronRight />
            </button>
        </div>
    );
}

export default DatePickerHeader;

