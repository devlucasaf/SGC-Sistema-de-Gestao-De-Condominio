import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";

// --- CONTEXTO DO TOAST ---
const ToastContext = createContext(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast deve ser usado dentro de um ToastProvider");
    }
    return context;
}

// --- COMPONENTE DE UM TOAST INDIVIDUAL ---
function ToastItem({ toast, onRemove }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, toast.duracao || 4000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duracao, onRemove]);

    const icones = {
        sucesso: <FiCheckCircle size={20} />,
        erro: <FiAlertCircle size={20} />,
        aviso: <FiAlertTriangle size={20} />,
        info: <FiInfo size={20} />,
    };

    return (
        <div className={`toast-item toast-${toast.tipo}`}>
            <div className="toast-icone">
                {icones[toast.tipo] || icones.info}
            </div>

            <div className="toast-conteudo">
                {toast.titulo && <strong className="toast-titulo">{toast.titulo}</strong>}
                <p className="toast-mensagem">{toast.mensagem}</p>
            </div>

            <button className="toast-fechar" onClick={() => onRemove(toast.id)}>
                <FiX size={16} />
            </button>
        </div>
    );
}

// --- PROVIDER DO TOAST ---
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removerToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const mostrarToast = useCallback((mensagem, tipo = "info", titulo = "", duracao = 4000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, mensagem, tipo, titulo, duracao }]);
    }, []);

    const sucesso = useCallback((mensagem, titulo = "") => {
        mostrarToast(mensagem, "sucesso", titulo);
    }, [mostrarToast]);

    const erro = useCallback((mensagem, titulo = "") => {
        mostrarToast(mensagem, "erro", titulo, 6000);
    }, [mostrarToast]);

    const aviso = useCallback((mensagem, titulo = "") => {
        mostrarToast(mensagem, "aviso", titulo, 5000);
    }, [mostrarToast]);

    const info = useCallback((mensagem, titulo = "") => {
        mostrarToast(mensagem, "info", titulo);
    }, [mostrarToast]);

    return (
        <ToastContext.Provider value={{ mostrarToast, sucesso, erro, aviso, info }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removerToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

